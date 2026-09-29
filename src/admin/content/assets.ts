import type { QueryOptions } from "@sanity/client";
import { getClient } from "@/sanity/client";
import { getCurrentActor } from "../auth/actions";
import { AuthorizationError } from "../rbac/engine";
import type { PermissionKey } from "../rbac/permissions";
import type { CurrentActorResult } from "../auth/actions";
import { parseModuleConfig } from "./validate";
import type { AssetKind } from "./validate";
import type {
  AssetListEntry,
  AssetListPayload,
  ContentModuleKey,
  UploadAssetInput,
  UploadAssetResult,
} from "./types";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_LIST = 40;

const IMAGE_MIME = /^image\/(png|jpeg|jpg|webp|gif|avif)$/;
const FILE_MIME =
  /^(application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/;

const ASSET_QUERY = `*[_type == $type] | order(_createdAt desc)[0...$limit]{
  _id, originalFilename, mimeType, size, url
}`;

/**
 * Assets live outside the document corpus, so they need the assets
 * perspective. It is valid at runtime but missing from the client's union.
 */
const ASSET_PERSPECTIVE = "sanityAssets" as NonNullable<QueryOptions["perspective"]>;

/** Shape of a projected Sanity asset document before it becomes a list entry. */
interface AssetRow {
  _id?: unknown;
  originalFilename?: unknown;
  mimeType?: unknown;
  size?: unknown;
  url?: unknown;
}

async function requireActor(): Promise<CurrentActorResult> {
  const session = await getCurrentActor();
  if (!session) {
    throw new AuthorizationError("auth_required", {
      actorUserId: undefined,
      permission: "media.read",
    });
  }
  return session;
}

function assertPermission(session: CurrentActorResult, permission: PermissionKey): void {
  if (!session.permissions.includes(permission)) {
    throw new AuthorizationError("permission_not_granted", {
      actorUserId: session.user.id,
      permission,
    });
  }
}

function assetType(kind: AssetKind): "sanity.imageAsset" | "sanity.fileAsset" {
  return kind === "image" ? "sanity.imageAsset" : "sanity.fileAsset";
}

/**
 * Recent assets of one kind, newest first, for the editor's media picker.
 * Requires `media.read`; the dataset is the project's own Sanity dataset, so
 * the same permission that governs the Media Library governs uploads.
 */
export async function listSanityAssets(kind: AssetKind): Promise<AssetListPayload> {
  const session = await requireActor();
  assertPermission(session, "media.read");

  const client = getClient();
  if (!client) return { configured: false, kind, assets: [] };

  let rows: AssetRow[] | null = null;
  try {
    rows = await client.fetch<AssetRow[] | null>(
      ASSET_QUERY,
      { type: assetType(kind), limit: MAX_LIST },
      { perspective: ASSET_PERSPECTIVE },
    );
  } catch {
    return { configured: true, kind, assets: [] };
  }

  const assets = (rows ?? [])
    .filter((row) => typeof row?._id === "string" && typeof row?.url === "string")
    .map((row) => ({
      id: row._id as string,
      url: row.url as string,
      name: typeof row.originalFilename === "string" ? row.originalFilename : (row._id as string),
      mimeType: typeof row.mimeType === "string" ? row.mimeType : null,
      size: typeof row.size === "number" ? row.size : null,
    }));

  return { configured: true, kind, assets };
}

/**
 * Uploads one image or document to Sanity and returns its asset id, which the
 * content form stores as a reference. Requires `media.write` plus the target
 * module's write permission, so an actor can only attach media to a module it
 * may edit.
 */
export async function uploadSanityAsset(input: UploadAssetInput): Promise<UploadAssetResult> {
  const fail = (error: string): UploadAssetResult => ({ ok: false, error });

  const session = await requireActor();
  assertPermission(session, "media.write");

  const module = typeof input?.module === "string" ? input.module : "";
  const config = parseModuleConfig(module as ContentModuleKey);
  if (!config) return fail("That content type cannot be reached.");
  assertPermission(session, config.writePermission);

  const kind: AssetKind = input?.kind === "file" ? "file" : "image";
  const contentType = typeof input?.contentType === "string" ? input.contentType : "";
  const filename = typeof input?.filename === "string" ? input.filename.trim() : "";
  const base64 = typeof input?.base64 === "string" ? input.base64 : "";

  if (!filename || filename.length > 200) return fail("That file name cannot be used.");
  if (!base64) return fail("No file data was received.");
  const pattern = kind === "image" ? IMAGE_MIME : FILE_MIME;
  if (!pattern.test(contentType.toLowerCase())) {
    return fail(
      kind === "image"
        ? "Choose a PNG, JPEG, WebP, GIF or AVIF image."
        : "Choose a PDF or Word document.",
    );
  }

  let bytes: Buffer;
  try {
    bytes = Buffer.from(base64, "base64");
  } catch {
    return fail("That file could not be read.");
  }
  if (bytes.byteLength === 0) return fail("That file is empty.");
  if (bytes.byteLength > MAX_UPLOAD_BYTES) return fail("Files must be 8 MB or smaller.");

  const client = getClient();
  if (!client) return fail("The content store is not configured.");

  try {
    const asset =
      kind === "image"
        ? await client.assets.upload("image", bytes, { filename, contentType })
        : await client.assets.upload("file", bytes, { filename, contentType });
    if (!asset?._id) return fail("The upload did not return an asset.");
    return {
      ok: true,
      id: asset._id,
      url: typeof asset.url === "string" ? asset.url : null,
      kind,
      name: filename,
    };
  } catch (error) {
    console.error("[admin] asset upload failed", error);
    return fail("The upload failed. Please try again.");
  }
}
