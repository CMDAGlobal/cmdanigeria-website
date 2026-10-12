import type { QueryOptions } from "@sanity/client";
import { getClient, getWriteClient } from "@/sanity/client";
import { getCurrentActor, type CurrentActorResult } from "../auth/actions";
import { recordAudit } from "../audit/record";
import { AuthorizationError } from "../rbac/engine";
import type { PermissionKey } from "../rbac/permissions";
import { parseModuleConfig, type AssetKind } from "./validate";
import { parseAssetId } from "./asset-id";
import { validateUpload } from "./asset-validate";
import { changedTopLevelKeys, swapAssetRef } from "./asset-relink";
import type {
  AssetListEntry,
  AssetListPayload,
  AssetMutationResult,
  ContentModuleKey,
  DeleteAssetInput,
  LibraryAssetsInput,
  ReplaceAssetInput,
  UploadAssetInput,
  UploadAssetResult,
} from "./types";

export { parseAssetId };

const PICKER_LIMIT = 40;
const LIBRARY_LIMIT = 200;

const REFERENCES_QUERY = `count(*[references($id)])`;

const REFERENCING_DOCS_QUERY = `*[_type != "sanity.imageAsset" && _type != "sanity.fileAsset" && references($id)]`;

const ASSET_QUERY = `*[_type == $type] | order(_createdAt desc)[0...$limit]{
  _id, originalFilename, mimeType, size, url, _createdAt
}`;

const LIBRARY_QUERY = `*[_type in ["sanity.imageAsset", "sanity.fileAsset"]
    && (!defined($search) || $search == "" || lower(originalFilename) contains lower($search))]
  | order(_createdAt desc)[0...$limit]{
  _id, originalFilename, mimeType, size, url, _createdAt
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
  _createdAt?: unknown;
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

function toListEntry(row: AssetRow, kind?: AssetKind): AssetListEntry | null {
  if (typeof row?._id !== "string" || typeof row?.url !== "string") return null;
  const inferred: AssetKind = row._id.startsWith("file-") ? "file" : "image";
  return {
    id: row._id,
    url: row.url,
    name: typeof row.originalFilename === "string" ? row.originalFilename : row._id,
    mimeType: typeof row.mimeType === "string" ? row.mimeType : null,
    size: typeof row.size === "number" ? row.size : null,
    createdAt: typeof row._createdAt === "string" ? row._createdAt : null,
    kind: kind ?? inferred,
  };
}

/**
 * Recent assets of one kind (or both when `kind` is "all"), newest first.
 * `search` filters by filename substring. Requires `media.read`.
 */
export async function listSanityAssets(
  kind: AssetKind | "all",
  search?: string,
  limit?: number,
): Promise<AssetListPayload> {
  const session = await requireActor();
  assertPermission(session, "media.read");

  const client = getClient();
  if (!client) return { configured: false, kind, assets: [], total: 0 };

  const term = typeof search === "string" ? search.trim().slice(0, 120) : "";
  const capped =
    typeof limit === "number" && limit > 0 ? Math.min(limit, LIBRARY_LIMIT) : PICKER_LIMIT;

  let rows: AssetRow[] | null = null;
  try {
    if (kind === "all") {
      rows = await client.fetch<AssetRow[] | null>(
        LIBRARY_QUERY,
        { search: term, limit: capped },
        { perspective: ASSET_PERSPECTIVE },
      );
    } else {
      rows = await client.fetch<AssetRow[] | null>(
        ASSET_QUERY,
        { type: assetType(kind), limit: capped },
        { perspective: ASSET_PERSPECTIVE },
      );
    }
  } catch {
    return { configured: true, kind, assets: [], total: 0 };
  }

  const assets = (rows ?? [])
    .map((row) => toListEntry(row, kind === "all" ? undefined : kind))
    .filter((entry): entry is AssetListEntry => entry !== null);

  return { configured: true, kind, assets, total: assets.length };
}

/** Full library browse: every image and document, searchable by filename. */
export async function listLibraryAssets(input: LibraryAssetsInput): Promise<AssetListPayload> {
  const kind: AssetKind | "all" =
    input?.kind === "image" || input?.kind === "file" ? input.kind : "all";
  return listSanityAssets(kind, input?.search, LIBRARY_LIMIT);
}

/**
 * Uploads one image or document to Sanity and returns its asset id, which the
 * content form stores as a reference. Requires `media.write`; when a target
 * module is given, also that module's write permission, so an actor can only
 * attach media to a module it may edit. Library-level uploads (no module)
 * still require `media.write`.
 */
export async function uploadSanityAsset(input: UploadAssetInput): Promise<UploadAssetResult> {
  const fail = (error: string): UploadAssetResult => ({ ok: false, error });

  const session = await requireActor();
  assertPermission(session, "media.write");

  const module = typeof input?.module === "string" && input.module ? input.module : "";
  if (module) {
    const config = parseModuleConfig(module as ContentModuleKey);
    if (!config) return fail("That content type cannot be reached.");
    assertPermission(session, config.writePermission);
  }

  const kind: AssetKind = input?.kind === "file" ? "file" : "image";
  const checked = validateUpload(kind, input?.filename, input?.contentType, input?.base64);
  if (!checked.ok) return fail(checked.error);

  const client = getWriteClient();
  if (!client) return fail("The content store is not configured for uploads.");

  try {
    const asset = await client.assets.upload(kind, checked.bytes, {
      filename: checked.filename,
      contentType: checked.contentType,
    });
    if (!asset?._id) return fail("The upload did not return an asset.");
    await recordAudit({
      actorUserId: session.user.id,
      action: "media.upload",
      targetType: assetType(kind),
      targetId: asset._id,
      outcome: "success",
      reason: module ? `module:${module}` : "library",
    });
    return {
      ok: true,
      id: asset._id,
      url: typeof asset.url === "string" ? asset.url : null,
      kind,
      name: checked.filename,
    };
  } catch (error) {
    console.error("[admin] asset upload failed", error);
    return fail("The upload failed. Please try again.");
  }
}

/**
 * Replaces an asset by uploading a new file, repointing every document that
 * referenced the old asset at the new one, then deleting the old asset. The
 * public site therefore keeps working without editors having to re-attach the
 * image on each page. Requires `media.write`.
 */
export async function replaceSanityAsset(input: ReplaceAssetInput): Promise<UploadAssetResult> {
  const fail = (error: string): UploadAssetResult => ({ ok: false, error });

  const session = await requireActor();
  assertPermission(session, "media.write");

  const oldId = parseAssetId(input?.id);
  if (!oldId) return fail("That file could not be found.");

  const kind: AssetKind = input?.kind === "file" ? "file" : "image";
  if (
    (kind === "image" && !oldId.startsWith("image-")) ||
    (kind === "file" && !oldId.startsWith("file-"))
  ) {
    return fail("That file could not be found.");
  }

  const checked = validateUpload(kind, input?.filename, input?.contentType, input?.base64);
  if (!checked.ok) return fail(checked.error);

  const client = getWriteClient();
  if (!client) return fail("The content store is not configured for uploads.");

  try {
    // 1. Upload the new binary as a fresh asset.
    const uploaded = await client.assets.upload(kind, checked.bytes, {
      filename: checked.filename,
      contentType: checked.contentType,
    });
    if (!uploaded?._id) return fail("The replace did not return an asset.");
    const newId = uploaded._id;

    // 2. Repoint every document that used the old asset.
    const docs = await client.fetch<Array<Record<string, unknown>> | null>(REFERENCING_DOCS_QUERY, {
      id: oldId,
    });
    const referencing = Array.isArray(docs) ? docs : [];
    if (referencing.length > 0) {
      const txn = client.transaction();
      for (const doc of referencing) {
        const rawId = doc["_id"];
        if (typeof rawId !== "string" || !rawId) continue;
        const updated = swapAssetRef(doc, oldId, newId);
        const changes: Record<string, unknown> = {};
        for (const key of changedTopLevelKeys(doc, updated)) {
          changes[key] = updated[key];
        }
        if (Object.keys(changes).length > 0) txn.patch(rawId, { set: changes });
      }
      await txn.commit();
    }

    // 3. Drop the old asset now that nothing references it.
    try {
      await client.delete(oldId);
    } catch (error) {
      // Non-fatal: the old binary lingers but every reference already points
      // at the new asset, so the site is correct either way.
      console.error("[admin] old asset delete after replace failed", error);
    }

    await recordAudit({
      actorUserId: session.user.id,
      action: "media.update",
      targetType: assetType(kind),
      targetId: oldId,
      outcome: "success",
      reason: `replace:${newId}:${referencing.length}`,
    });
    return {
      ok: true,
      id: newId,
      url: typeof uploaded.url === "string" ? uploaded.url : null,
      kind,
      name: checked.filename,
    };
  } catch (error) {
    console.error("[admin] asset replace failed", error);
    return fail("The replace failed. Please try again.");
  }
}

/**
 * Deletes one asset. Refuses while any document still references it, so the
 * public site never ends up with broken images. Requires `media.delete`.
 */
export async function deleteSanityAsset(input: DeleteAssetInput): Promise<AssetMutationResult> {
  const fail = (error: string): AssetMutationResult => ({ ok: false, error });

  const session = await requireActor();
  assertPermission(session, "media.delete");

  const id = parseAssetId(input?.id);
  if (!id) return fail("That file could not be found.");

  const client = getWriteClient();
  if (!client) return fail("The content store is not configured for deletes.");

  try {
    // References live on documents, not on asset docs — query the default
    // (raw) perspective so `references()` sees the whole corpus.
    const reader = getClient() ?? client;
    const used = await reader.fetch<number | null>(REFERENCES_QUERY, { id });
    if (typeof used === "number" && used > 0) {
      return fail(
        used === 1
          ? "This file is still used by 1 item. Remove it there first."
          : `This file is still used by ${used} items. Remove it there first.`,
      );
    }

    await client.delete(id);
    await recordAudit({
      actorUserId: session.user.id,
      action: "media.delete",
      targetType: id.startsWith("file-") ? "sanity.fileAsset" : "sanity.imageAsset",
      targetId: id,
      outcome: "success",
    });
    return { ok: true, id };
  } catch (error) {
    console.error("[admin] asset delete failed", error);
    return fail("The delete failed. The file may have already been removed.");
  }
}
