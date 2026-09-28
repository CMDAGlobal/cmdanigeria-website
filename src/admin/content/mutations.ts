import { getWriteClient, type SanityClient } from "@/sanity/client";
import { getCurrentActor } from "../auth/actions";
import { authorizeActor, isAuthorizationError } from "../auth/guard";
import { recordAudit } from "../audit/record";
import { AuthorizationError } from "../rbac/engine";
import type { Scope } from "../rbac/roles";
import type { PermissionKey } from "../rbac/permissions";
import { buildScopeMeta, strArray } from "./scope";
import { actorCoversDoc, deriveWriteScope, type CoverOrg } from "./cover";
import { getOrgOptions } from "./org";
import {
  ContentInputError,
  assertSlug,
  effectiveCreateScope,
  normalizeScopeInput,
  parseModuleConfig,
  slugify,
  validateCreatePublication,
  validateFields,
  validatePublicationTransition,
  type ModuleMutationConfig,
} from "./validate";
import type {
  ContentDocInput,
  ContentMutationResult,
  ContentScopeMeta,
  CreateContentInput,
  SetPublicationInput,
  UpdateContentInput,
} from "./types";

/** Thrown for document-level failures that are not field-validation issues. */
class ContentMutationError extends Error {
  readonly reason: string;

  constructor(reason: string) {
    super(reason);
    this.name = "ContentMutationError";
    this.reason = reason;
  }
}

const CONTENT_MESSAGES: Record<string, string> = {
  auth_required: "Your session has expired. Please sign in again.",
  permission_not_granted: "You do not have permission to change this content.",
  scope_outside_role: "That item is outside your scope.",
  coverage_denied: "That item is outside your scope.",
  invalid_module: "Unknown content module.",
  invalid_input: "Check the details and try again.",
  content_not_found: "That item no longer exists.",
  slug_taken: "Another item already uses that web address.",
  no_write_client: "The content store is not configured for dashboard writes.",
  publication_unsupported: "Publication status is not managed for this item type.",
};

function messageFor(reason: string): string {
  return CONTENT_MESSAGES[reason] ?? "Something went wrong. Please try again.";
}

function isContentError(error: unknown): error is ContentInputError | ContentMutationError {
  return error instanceof ContentInputError || error instanceof ContentMutationError;
}

function authError(permission: PermissionKey): AuthorizationError {
  return new AuthorizationError("auth_required", {
    actorUserId: undefined,
    permission,
  });
}

/** Minimal session shape the failure handler needs (only records the user). */
type SessionLike = { user: { id: string } } | null;

async function failContent(
  session: SessionLike,
  config: ModuleMutationConfig,
  action: string,
  targetId: string | null,
  scope: Scope | null,
  error: unknown,
): Promise<ContentMutationResult> {
  // AuthorizationError is already audited by authorizeActor.
  if (isAuthorizationError(error)) return { ok: false, error: messageFor(error.reason) };
  if (isContentError(error)) {
    if (session) {
      await recordAudit({
        actorUserId: session.user.id,
        action,
        targetType: config.type,
        targetId,
        scope,
        outcome: error.reason === "coverage_denied" ? "denied" : "error",
        reason: error.reason,
      });
    }
    return { ok: false, error: messageFor(error.reason) };
  }
  console.error(`[admin:content] ${action} failed`, error);
  if (session) {
    await recordAudit({
      actorUserId: session.user.id,
      action,
      targetType: config.type,
      targetId,
      scope,
      outcome: "error",
      reason: "unexpected_error",
    });
  }
  return { ok: false, error: messageFor("unexpected_error") };
}

function requireClient(): SanityClient {
  const client = getWriteClient();
  if (!client) throw new ContentMutationError("no_write_client");
  return client;
}

function assertId(value: unknown): string {
  if (typeof value !== "string" || !value.trim() || value.length > 64) {
    throw new ContentMutationError("content_not_found");
  }
  return value.trim();
}

async function loadCoverOrg(): Promise<CoverOrg> {
  const org = await getOrgOptions();
  return {
    chapterArms: new Map(org.chapters.map((entry) => [entry.slug, entry.arm])),
    zoneArms: new Map(org.zones.map((entry) => [entry.slug, entry.arm])),
    regionSlugs: new Set(org.regions.map((entry) => entry.slug)),
  };
}

/** Internal data-integrity check — independent of who is asking. */
function assertUnitsConsistent(meta: ContentScopeMeta, org: CoverOrg, selfSlug?: string): void {
  if (meta.regions.length > 0 && meta.arm !== "global") {
    throw new ContentInputError("invalid_input");
  }
  if (meta.regions.some((slug) => !org.regionSlugs.has(slug))) {
    throw new ContentInputError("invalid_input");
  }
  if (meta.zones.some((slug) => org.zoneArms.get(slug) !== meta.arm)) {
    throw new ContentInputError("invalid_input");
  }
  if (meta.chapters.some((slug) => slug !== selfSlug && org.chapterArms.get(slug) !== meta.arm)) {
    throw new ContentInputError("invalid_input");
  }
}

interface LoadedDoc {
  id: string;
  slug: string | null;
  meta: ContentScopeMeta;
}

const DOC_QUERY = `*[_type == $type && _id == $id][0]{
  _id,
  "slug": slug.current,
  arm,
  "regions": regions[]->slug.current,
  "zones": zones[]->slug.current,
  "chapters": chapters[]->slug.current
}`;

async function loadDoc(
  client: SanityClient,
  config: ModuleMutationConfig,
  rawId: unknown,
): Promise<LoadedDoc> {
  const id = assertId(rawId);
  const doc = await client.fetch<{
    _id?: unknown;
    slug?: unknown;
    arm?: unknown;
    regions?: unknown;
    zones?: unknown;
    chapters?: unknown;
  } | null>(DOC_QUERY, { type: config.type, id });
  if (!doc || typeof doc._id !== "string") {
    throw new ContentMutationError("content_not_found");
  }
  const slug = typeof doc.slug === "string" && doc.slug ? doc.slug : null;
  const meta = buildScopeMeta({
    arm: doc.arm,
    regions: doc.regions,
    zones: doc.zones,
    chapters: doc.chapters,
  });
  if (config.type === "chapter") {
    // A chapter document is itself the unit it is scoped to.
    meta.chapters = slug ? [slug] : [];
  }
  return { id: doc._id, slug, meta };
}

async function resolveUnitRefs(
  client: SanityClient,
  type: "chapter" | "zone" | "region",
  slugs: string[],
): Promise<Map<string, string>> {
  const refs = new Map<string, string>();
  if (slugs.length === 0) return refs;
  const rows = await client.fetch<{ _id: unknown; slug: unknown }[]>(
    `*[_type == $type && slug.current in $slugs]{ _id, "slug": slug.current }`,
    { type, slugs },
  );
  for (const row of rows) {
    if (typeof row._id === "string" && typeof row.slug === "string") {
      refs.set(row.slug, row._id);
    }
  }
  for (const slug of slugs) {
    if (!refs.has(slug)) throw new ContentInputError("invalid_input");
  }
  return refs;
}

function toRef(id: string): { _type: "reference"; _ref: string } {
  return { _type: "reference", _ref: id };
}

async function slugTaken(
  client: SanityClient,
  type: string,
  slug: string,
  excludeId: string | null,
): Promise<boolean> {
  const count = await client.fetch<number>(
    `count(*[_type == $type && slug.current == $slug && !(_id in path("drafts.**")) && _id != $excludeId])`,
    { type, slug, excludeId: excludeId ?? "" },
  );
  return count > 0;
}

function normalizePublicationUnsupported(config: ModuleMutationConfig, publication: unknown): void {
  if (
    !config.publication &&
    publication !== undefined &&
    publication !== null &&
    publication !== ""
  ) {
    throw new ContentMutationError("publication_unsupported");
  }
}

export async function createContent(input: CreateContentInput): Promise<ContentMutationResult> {
  const config = parseModuleConfig(input?.module);
  if (!config) return { ok: false, error: messageFor("invalid_module") };
  const action = `${config.auditPrefix}.create`;
  let session: SessionLike = null;
  let scope: Scope | null = null;

  try {
    session = await getCurrentActor();
    if (!session) throw authError(config.writePermission);

    normalizePublicationUnsupported(config, input?.publication);
    const fields = validateFields(config, input?.fields, { partial: false });
    const scopeInput = normalizeScopeInput(input?.scope);
    const publication = config.publication ? validateCreatePublication(input?.publication) : null;

    const rawTitle = fields[config.titleField];
    const title = typeof rawTitle === "string" ? rawTitle.trim() : "";
    if (!title) throw new ContentInputError("invalid_input");
    const slug =
      typeof fields["slug"] === "string" && fields["slug"]
        ? assertSlug(fields["slug"])
        : slugify(title);
    if (!slug) throw new ContentInputError("invalid_input");

    let meta = effectiveCreateScope(scopeInput, fields);
    const selfSlug = config.type === "chapter" ? slug : undefined;
    if (config.type === "chapter") meta = { ...meta, chapters: [slug] };

    const client = requireClient();
    const org = await loadCoverOrg();
    assertUnitsConsistent(meta, org, selfSlug);

    // Chapters never store unit refs (the document is its own unit), and the
    // new chapter cannot be resolved before it exists.
    let chapterRefs = new Map<string, string>();
    let zoneRefs = new Map<string, string>();
    let regionRefs = new Map<string, string>();
    if (config.type !== "chapter") {
      chapterRefs = await resolveUnitRefs(client, "chapter", meta.chapters);
      zoneRefs = await resolveUnitRefs(client, "zone", meta.zones);
      regionRefs = await resolveUnitRefs(client, "region", meta.regions);
    }

    scope = deriveWriteScope(meta);
    const authorized = await authorizeActor(config.writePermission, scope);
    session = authorized;

    if (!actorCoversDoc(authorized.actor, meta, org, selfSlug)) {
      throw new ContentMutationError("coverage_denied");
    }
    if (await slugTaken(client, config.type, slug, null)) {
      throw new ContentMutationError("slug_taken");
    }

    const payload = { _type: config.type, ...fields } as {
      _type: string;
    } & Record<string, unknown>;
    delete payload["regions"];
    delete payload["zones"];
    delete payload["chapters"];
    payload["slug"] = { _type: "slug", current: slug };
    payload["arm"] = meta.arm;
    if (config.type !== "chapter") {
      payload["regions"] = meta.regions.map((value) => toRef(regionRefs.get(value) as string));
      payload["zones"] = meta.zones.map((value) => toRef(zoneRefs.get(value) as string));
      payload["chapters"] = meta.chapters.map((value) => toRef(chapterRefs.get(value) as string));
    }
    if (config.publication) {
      payload["publication"] = publication;
      payload["publishAt"] = null;
    }

    const created = await client.create(payload);
    const id = typeof created._id === "string" ? created._id : "";

    await recordAudit({
      actorUserId: authorized.user.id,
      action,
      targetType: config.type,
      targetId: id || null,
      scope,
      outcome: "success",
    });
    return { ok: true, id };
  } catch (error) {
    return failContent(session, config, action, null, scope, error);
  }
}

export async function updateContent(input: UpdateContentInput): Promise<ContentMutationResult> {
  const config = parseModuleConfig(input?.module);
  if (!config) return { ok: false, error: messageFor("invalid_module") };
  const action = `${config.auditPrefix}.update`;
  let session: SessionLike = null;
  let scope: Scope | null = null;
  let targetId: string | null = null;

  try {
    session = await getCurrentActor();
    if (!session) throw authError(config.writePermission);

    const client = requireClient();
    const current = await loadDoc(client, config, input?.id);
    targetId = current.id;

    const fields = validateFields(config, input?.fields, { partial: true });
    const scopeKeys = ["arm", "regions", "zones", "chapters"];
    const touchesScope = scopeKeys.some((key) => key in fields);

    let meta = current.meta;
    const selfSlug =
      config.type === "chapter"
        ? typeof fields["slug"] === "string" && fields["slug"]
          ? fields["slug"]
          : (current.slug ?? undefined)
        : undefined;
    if (config.type === "chapter") {
      meta = { ...meta, chapters: selfSlug ? [selfSlug] : [] };
      if ("arm" in fields) {
        const armValue = fields["arm"];
        meta = { ...meta, arm: typeof armValue === "string" ? armValue : null };
      }
    } else if (touchesScope) {
      meta = {
        arm: "arm" in fields ? ((fields["arm"] as string | null) ?? null) : current.meta.arm,
        regions: "regions" in fields ? strArray(fields["regions"]) : current.meta.regions,
        zones: "zones" in fields ? strArray(fields["zones"]) : current.meta.zones,
        chapters: "chapters" in fields ? strArray(fields["chapters"]) : current.meta.chapters,
      };
    }

    const org = await loadCoverOrg();
    if (config.type !== "chapter" && touchesScope) assertUnitsConsistent(meta, org);

    let chapterRefs = new Map<string, string>();
    let zoneRefs = new Map<string, string>();
    let regionRefs = new Map<string, string>();
    if (config.type !== "chapter" && touchesScope) {
      if ("chapters" in fields)
        chapterRefs = await resolveUnitRefs(client, "chapter", meta.chapters);
      if ("zones" in fields) zoneRefs = await resolveUnitRefs(client, "zone", meta.zones);
      if ("regions" in fields) regionRefs = await resolveUnitRefs(client, "region", meta.regions);
    }

    scope = deriveWriteScope(meta);
    const authorized = await authorizeActor(config.writePermission, scope);
    session = authorized;

    if (!actorCoversDoc(authorized.actor, meta, org, selfSlug)) {
      throw new ContentMutationError("coverage_denied");
    }

    const set: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (key === "slug") {
        const nextSlug = value as string;
        if (
          nextSlug !== current.slug &&
          (await slugTaken(client, config.type, nextSlug, current.id))
        ) {
          throw new ContentMutationError("slug_taken");
        }
        set["slug"] = { _type: "slug", current: nextSlug };
        continue;
      }
      if (key === "arm") {
        set["arm"] = meta.arm;
        continue;
      }
      if (key === "regions") {
        set["regions"] = meta.regions.map((entry) => toRef(regionRefs.get(entry) as string));
        continue;
      }
      if (key === "zones") {
        set["zones"] = meta.zones.map((entry) => toRef(zoneRefs.get(entry) as string));
        continue;
      }
      if (key === "chapters") {
        set["chapters"] = meta.chapters.map((entry) => toRef(chapterRefs.get(entry) as string));
        continue;
      }
      set[key] = value;
    }
    if (Object.keys(set).length === 0) {
      return { ok: true, id: current.id };
    }

    await client.patch(current.id, { set }).commit();

    await recordAudit({
      actorUserId: authorized.user.id,
      action,
      targetType: config.type,
      targetId: current.id,
      scope,
      outcome: "success",
    });
    return { ok: true, id: current.id };
  } catch (error) {
    return failContent(session, config, action, targetId, scope, error);
  }
}

export async function deleteContent(input: ContentDocInput): Promise<ContentMutationResult> {
  const config = parseModuleConfig(input?.module);
  if (!config) return { ok: false, error: messageFor("invalid_module") };
  const action = `${config.auditPrefix}.delete`;
  let session: SessionLike = null;
  let scope: Scope | null = null;
  let targetId: string | null = null;

  try {
    session = await getCurrentActor();
    if (!session) throw authError(config.deletePermission);

    const client = requireClient();
    const current = await loadDoc(client, config, input?.id);
    targetId = current.id;

    scope = deriveWriteScope(current.meta);
    const authorized = await authorizeActor(config.deletePermission, scope);
    session = authorized;

    const org = await loadCoverOrg();
    const selfSlug = config.type === "chapter" ? (current.slug ?? undefined) : undefined;
    if (!actorCoversDoc(authorized.actor, current.meta, org, selfSlug)) {
      throw new ContentMutationError("coverage_denied");
    }

    await client.delete(current.id);

    await recordAudit({
      actorUserId: authorized.user.id,
      action,
      targetType: config.type,
      targetId: current.id,
      scope,
      outcome: "success",
    });
    return { ok: true, id: current.id };
  } catch (error) {
    return failContent(session, config, action, targetId, scope, error);
  }
}

export async function setPublicationStatus(
  input: SetPublicationInput,
): Promise<ContentMutationResult> {
  const config = parseModuleConfig(input?.module);
  if (!config) return { ok: false, error: messageFor("invalid_module") };
  const action = `${config.auditPrefix}.update`;
  let session: SessionLike = null;
  let scope: Scope | null = null;
  let targetId: string | null = null;

  try {
    session = await getCurrentActor();
    if (!session) throw authError(config.writePermission);
    if (!config.publication) throw new ContentMutationError("publication_unsupported");

    const transition = validatePublicationTransition(input?.publication, input?.publishAt);

    const client = requireClient();
    const current = await loadDoc(client, config, input?.id);
    targetId = current.id;

    scope = deriveWriteScope(current.meta);
    const authorized = await authorizeActor(config.writePermission, scope);
    session = authorized;

    const org = await loadCoverOrg();
    if (!actorCoversDoc(authorized.actor, current.meta, org)) {
      throw new ContentMutationError("coverage_denied");
    }

    await client
      .patch(current.id, {
        set: { publication: transition.publication, publishAt: transition.publishAt },
      })
      .commit();

    await recordAudit({
      actorUserId: authorized.user.id,
      action,
      targetType: config.type,
      targetId: current.id,
      scope,
      outcome: "success",
      reason: `publication:${transition.publication}`,
    });
    return { ok: true, id: current.id };
  } catch (error) {
    return failContent(session, config, action, targetId, scope, error);
  }
}
