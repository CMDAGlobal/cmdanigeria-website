import { getClient } from "@/sanity/client";
import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
  isSanityConfigured,
} from "@/sanity/config";
import { query } from "../db/client";
import { getCurrentActor } from "../auth/actions";
import { isAuthorizationError } from "../auth/guard";
import { AuthorizationError } from "../rbac/engine";
import type { PermissionKey } from "../rbac/permissions";
import type { CurrentActorResult } from "../auth/actions";
import { grantsFromRoles, visibleToGrants, buildScopeMeta } from "./scope";
import { getOrgOptions } from "./org";
import { assignableScopeOptions } from "./forms";
import {
  CONTENT_QUERIES,
  DOCUMENT_COUNT_QUERY,
  MEDIA_QUERY,
  MY_CHAPTER_QUERY,
  PAGE_SECTIONS_QUERY,
} from "./queries";
import { MODULE_MUTATIONS, parseModuleConfig } from "./validate";
import type { ModuleMutationConfig } from "./validate";
import {
  announcementStats,
  chapterStats,
  eventStats,
  mapAnnouncements,
  mapChapters,
  mapChapterMembership,
  mapEvents,
  mapNews,
  mapOutreaches,
  mapPages,
  mapPublications,
  mapRegions,
  newsStats,
  outreachStats,
  pageStats,
  publicationStats,
  regionStats,
  type RawContentRow,
} from "./mappers";
import type {
  ContentDocInput,
  ContentDocPayload,
  ContentItem,
  ContentModuleKey,
  ContentModulePayload,
  ContentScopeOptionsPayload,
  ContentStat,
  MediaAsset,
  MediaPayload,
  MyChapterPayload,
  PageSectionRow,
  PageSectionsPayload,
  ScopeGrant,
  SettingsPayload,
} from "./types";
import { emptyScopeMeta, emptyScopeOptions } from "./types";

export type { ContentModuleKey, ContentModulePayload, MediaAsset, MediaPayload, SettingsPayload };

const MODULE_CONFIG: Record<
  ContentModuleKey,
  {
    permission: PermissionKey;
    map: (rows: RawContentRow[]) => ContentItem[];
    stats: (items: ContentItem[]) => ContentStat[];
  }
> = {
  chapters: { permission: "chapters.read", map: mapChapters, stats: chapterStats },
  regions: { permission: "regions.read", map: mapRegions, stats: regionStats },
  events: { permission: "events.read", map: mapEvents, stats: eventStats },
  news: { permission: "news.read", map: mapNews, stats: newsStats },
  publications: {
    permission: "publications.read",
    map: mapPublications,
    stats: publicationStats,
  },
  announcements: {
    permission: "announcements.read",
    map: mapAnnouncements,
    stats: announcementStats,
  },
  outreaches: { permission: "outreaches.read", map: mapOutreaches, stats: outreachStats },
  pages: { permission: "pages.read", map: mapPages, stats: pageStats },
};

const MEDIA_BUCKETS: { key: string; label: string }[] = [
  { key: "chapters", label: "Chapter" },
  { key: "regions", label: "Region" },
  { key: "events", label: "Event" },
  { key: "announcements", label: "Announcement" },
  { key: "news", label: "News item" },
  { key: "publications", label: "Publication" },
  { key: "outreaches", label: "Outreach" },
  { key: "pages", label: "Page" },
];

const DOCUMENT_LABELS: Record<string, string> = {
  person: "People",
  region: "Regions",
  zone: "Zones",
  chapter: "Chapters",
  event: "Events",
  announcement: "Announcements",
  activity: "Activities",
  post: "News items",
  prescription: "Publications",
  outreach: "Outreach campaigns",
  page: "Pages",
};

async function requireActor(): Promise<CurrentActorResult> {
  const session = await getCurrentActor();
  if (!session) {
    throw new AuthorizationError("auth_required", {
      actorUserId: undefined,
      permission: "users.read",
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

function emptyPayload(module: ContentModuleKey): ContentModulePayload {
  return { module, configured: false, total: 0, stats: [], items: [] };
}

export async function getContentModule(module: ContentModuleKey): Promise<ContentModulePayload> {
  const config = MODULE_CONFIG[module];
  if (!config) return emptyPayload(module);

  const session = await requireActor();
  assertPermission(session, config.permission);

  const client = getClient();
  if (!client) return emptyPayload(module);

  let rows: RawContentRow[];
  try {
    const fetched = await client.fetch<RawContentRow[] | null>(CONTENT_QUERIES[module]);
    rows = Array.isArray(fetched) ? fetched : [];
  } catch {
    return emptyPayload(module);
  }

  const grants: ScopeGrant[] = grantsFromRoles(session.roles);
  const items = config
    .map(rows)
    .filter((item) => visibleToGrants(item.scope, grants))
    .sort((a, b) => a.title.localeCompare(b.title));

  return {
    module,
    configured: true,
    total: items.length,
    stats: config.stats(items),
    items,
  };
}

/**
 * The acting chapter admin's own chapter: display name, arm and the
 * statistics rows they type in the dashboard. The slug comes from the
 * actor's own grant, so the row returned is always their chapter.
 */
export async function getMyChapter(): Promise<MyChapterPayload> {
  const empty: MyChapterPayload = {
    ok: false,
    slug: null,
    name: null,
    arm: null,
    membership: [],
  };
  try {
    const session = await requireActor();
    assertPermission(session, "chapters.read");
    const grant = grantsFromRoles(session.roles).find((entry) => entry.chapterSlug);
    if (!grant?.chapterSlug) return empty;

    const client = getClient();
    if (!client) return empty;

    const row = await client.fetch<{
      slug?: unknown;
      name?: unknown;
      arm?: unknown;
      membership?: unknown;
    } | null>(MY_CHAPTER_QUERY, { slug: grant.chapterSlug });
    if (!row || typeof row.slug !== "string" || !row.slug) return empty;

    return {
      ok: true,
      slug: row.slug,
      name: typeof row.name === "string" && row.name.trim() ? row.name.trim() : null,
      arm: typeof row.arm === "string" && row.arm ? row.arm : (grant.arm ?? null),
      membership: mapChapterMembership(row.membership),
    };
  } catch (error) {
    if (isAuthorizationError(error)) return empty;
    console.error("[admin:content] getMyChapter failed", error);
    return empty;
  }
}

interface RawAssetRef {
  id?: unknown;
  url?: unknown;
}

interface RawGalleryEntry {
  caption?: unknown;
  alt?: unknown;
  asset?: RawAssetRef | null;
}

interface RawMediaDoc {
  owner?: unknown;
  ownerId?: unknown;
  arm?: unknown;
  region?: unknown;
  regions?: unknown;
  zone?: unknown;
  zones?: unknown;
  chapters?: unknown;
  cover?: RawAssetRef | null;
  gallery?: RawGalleryEntry[];
}

function assetId(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function assetUrl(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function getMediaLibrary(): Promise<MediaPayload> {
  const session = await requireActor();
  assertPermission(session, "media.read");

  const client = getClient();
  if (!client) return { configured: false, total: 0, stats: [], assets: [] };

  let raw: Record<string, RawMediaDoc[]> | null;
  try {
    raw = await client.fetch<Record<string, RawMediaDoc[]> | null>(MEDIA_QUERY);
  } catch {
    return { configured: false, total: 0, stats: [], assets: [] };
  }
  if (!raw) return { configured: true, total: 0, stats: [], assets: [] };

  const grants: ScopeGrant[] = grantsFromRoles(session.roles);
  const assets: MediaAsset[] = [];

  for (const bucket of MEDIA_BUCKETS) {
    const bucketRows = raw[bucket.key];
    const docs = Array.isArray(bucketRows) ? bucketRows : [];
    for (const doc of docs) {
      const meta = buildScopeMeta({
        arm: doc.arm,
        regions: doc.regions ?? doc.region,
        zones: doc.zones ?? doc.zone,
        chapters: doc.chapters,
      });
      if (!visibleToGrants(meta, grants)) continue;

      const owner = typeof doc.owner === "string" ? doc.owner : "Untitled";
      const ownerId = assetId(doc.ownerId);

      const cover = doc.cover as RawAssetRef | null | undefined;
      if (cover && assetId(cover.id) && assetUrl(cover.url)) {
        assets.push({
          id: `${assetId(cover.id)}:cover`,
          url: assetUrl(cover.url),
          alt: `${owner} cover image`,
          caption: null,
          owner,
          ownerId,
          ownerType: bucket.label,
          field: "Cover",
        });
      }

      const gallery = Array.isArray(doc.gallery) ? doc.gallery : [];
      for (const [index, entry] of gallery.entries()) {
        const ref = entry?.asset;
        if (!ref || !assetId(ref.id) || !assetUrl(ref.url)) continue;
        const caption = typeof entry.caption === "string" ? entry.caption : null;
        const alt = typeof entry.alt === "string" ? entry.alt : null;
        assets.push({
          id: `${assetId(ref.id)}:${bucket.key}:${index}`,
          url: assetUrl(ref.url),
          alt,
          caption,
          owner,
          ownerId,
          ownerType: bucket.label,
          field: "Gallery",
        });
      }
    }
  }

  assets.sort((a, b) => a.owner.localeCompare(b.owner) || a.field.localeCompare(b.field));

  return {
    configured: true,
    total: assets.length,
    stats: [
      { label: "Assets in use", value: assets.length },
      { label: "Cover images", value: assets.filter((asset) => asset.field === "Cover").length },
      {
        label: "Gallery images",
        value: assets.filter((asset) => asset.field === "Gallery").length,
      },
    ],
    assets,
  };
}

export async function getAdminSettings(): Promise<SettingsPayload> {
  const session = await requireActor();
  assertPermission(session, "settings.read");

  const [roleCount] = await query<{ c: number }>("select count(*)::int as c from admin_roles");
  const [permissionCount] = await query<{ c: number }>(
    "select count(*)::int as c from admin_permissions",
  );
  const [userCount] = await query<{ c: number }>("select count(*)::int as c from admin_users");

  const documentCounts: SettingsPayload["documentCounts"] = [];
  const client = getClient();
  if (client) {
    try {
      const counts = await client.fetch<Record<string, number> | null>(DOCUMENT_COUNT_QUERY);
      for (const [type, label] of Object.entries(DOCUMENT_LABELS)) {
        documentCounts.push({ type, label, count: Number(counts?.[type] ?? 0) });
      }
    } catch {
      documentCounts.push({ type: "unavailable", label: "Content store", count: 0 });
    }
  }

  return {
    sanity: {
      configured: isSanityConfigured(),
      projectId: sanityProjectId() ?? null,
      dataset: sanityDataset(),
      apiVersion: sanityApiVersion(),
    },
    governance: {
      rolesCount: roleCount?.c ?? 0,
      permissionsCount: permissionCount?.c ?? 0,
      usersCount: userCount?.c ?? 0,
    },
    documentCounts,
  };
}

const SCOPE_REF_KEYS = ["regions", "zones", "chapters"] as const;

const READ_MESSAGES: Record<string, string> = {
  auth_required: "Your session has expired. Please sign in again.",
  permission_not_granted: "You do not have permission to view this content.",
  invalid_module: "Unknown content module.",
  content_not_found: "That item no longer exists.",
  no_content_client: "The content store is not configured for this environment.",
};

function readErrorMessage(reason: string): string {
  return READ_MESSAGES[reason] ?? "Something went wrong. Please try again.";
}

/** Single-doc projection covering every field the module allowlist may edit. */
function docDetailQuery(config: ModuleMutationConfig): string {
  const parts: string[] = [];
  const seen = new Set<string>();
  const add = (expr: string, key: string): void => {
    if (seen.has(key)) return;
    seen.add(key);
    parts.push(expr);
  };
  const assetFields = config.assetFields ?? {};
  for (const key of config.allowed) {
    if (key === "slug") {
      add(`"slug": slug.current`, key);
    } else if ((SCOPE_REF_KEYS as readonly string[]).includes(key)) {
      add(`"${key}": ${key}[]->slug.current`, key);
    } else if (key in assetFields) {
      // Asset fields are stored as references — the form edits a bare asset id.
      add(`"${key}": ${key}{ "assetId": asset._ref, "url": asset->url, alt }`, key);
    } else {
      add(key, key);
    }
  }
  add(`"title": title`, "title");
  add(`"name": name`, "name");
  return `*[_type == $type && _id == $id && !(_id in path("drafts.**"))][0]{ _id, ${parts.join(", ")} }`;
}

/**
 * Loads one editable document for the dashboard form: allowlisted fields
 * (scope arrays and arm excluded — reported through `scope` instead), the
 * derived scope meta, and a visibility check mirroring the module list so a
 * scoped actor cannot read items outside their grants by id.
 */
export async function getContentDoc(input: ContentDocInput): Promise<ContentDocPayload> {
  const empty: ContentDocPayload = { ok: false, title: null, fields: {}, scope: emptyScopeMeta() };
  try {
    const config = parseModuleConfig(input?.module);
    if (!config) return { ...empty, error: readErrorMessage("invalid_module") };

    const id = typeof input?.id === "string" ? input.id.trim() : "";
    if (!id || id.length > 64) return { ...empty, error: readErrorMessage("content_not_found") };

    const session = await requireActor();
    const moduleKey = input.module as ContentModuleKey;
    assertPermission(session, MODULE_CONFIG[moduleKey].permission);

    const client = getClient();
    if (!client) return { ...empty, error: readErrorMessage("no_content_client") };

    const doc = await client.fetch<Record<string, unknown> | null>(docDetailQuery(config), {
      type: config.type,
      id,
    });
    if (!doc || typeof doc["_id"] !== "string") {
      return { ...empty, error: readErrorMessage("content_not_found") };
    }

    const fields: Record<string, unknown> = {};
    const assets: ContentDocPayload["assets"] = {};
    const assetFields = config.assetFields ?? {};
    for (const key of config.allowed) {
      if (key === "arm" || (SCOPE_REF_KEYS as readonly string[]).includes(key)) continue;
      const raw = doc[key];
      if (raw === undefined) continue;
      if (key in assetFields) {
        // Collapse `{asset:{_ref}}` into the bare asset id the form edits, and
        // hand the preview back separately so the dialog can show it.
        const ref = raw as { assetId?: unknown; url?: unknown; alt?: unknown } | null;
        const id = typeof ref?.assetId === "string" ? ref.assetId : "";
        if (!id) continue;
        fields[key] = id;
        assets[key] = {
          id,
          url: typeof ref?.url === "string" ? ref.url : null,
          name: typeof ref?.alt === "string" && ref.alt ? ref.alt : null,
        };
        const altKey = config.altFields?.[key];
        if (altKey && typeof ref?.alt === "string") fields[altKey] = ref.alt;
        continue;
      }
      fields[key] = raw;
    }

    const scope = buildScopeMeta({
      arm: doc["arm"],
      regions: doc["regions"],
      zones: doc["zones"],
      chapters: doc["chapters"],
    });
    if (config.selfUnit) {
      // A chapter or region document is itself the unit it is scoped to.
      const slug = typeof fields["slug"] === "string" && fields["slug"] ? fields["slug"] : null;
      if (config.type === "region") {
        scope.arm = "global";
        scope.regions = slug ? [slug] : [];
      } else {
        scope.chapters = slug ? [slug] : [];
      }
    }

    const grants: ScopeGrant[] = grantsFromRoles(session.roles);
    if (!visibleToGrants(scope, grants)) {
      return { ...empty, error: readErrorMessage("content_not_found") };
    }

    const rawTitle = doc[config.titleField];
    const title = typeof rawTitle === "string" && rawTitle.trim() ? rawTitle.trim() : null;
    return { ok: true, id: doc["_id"], title, fields, scope, assets };
  } catch (error) {
    if (isAuthorizationError(error)) {
      return { ...empty, error: readErrorMessage(error.reason) };
    }
    console.error("[admin:content] getContentDoc failed", error);
    return { ...empty, error: readErrorMessage("unexpected_error") };
  }
}

/**
 * One page's section list, for the dashboard's order/visibility editor. Only
 * order and `visible` are exposed - section content stays in Studio - and the
 * same actor, permission and grant checks as `getContentDoc` apply.
 */
export async function getPageSections(input: ContentDocInput): Promise<PageSectionsPayload> {
  const empty: PageSectionsPayload = { ok: false, sections: [] };
  try {
    const config = parseModuleConfig("pages");
    if (!config) return { ...empty, error: readErrorMessage("invalid_module") };

    const id = typeof input?.id === "string" ? input.id.trim() : "";
    if (!id || id.length > 64) return { ...empty, error: readErrorMessage("content_not_found") };

    const session = await requireActor();
    assertPermission(session, MODULE_CONFIG.pages.permission);

    const client = getClient();
    if (!client) return { ...empty, error: readErrorMessage("no_content_client") };

    const doc = await client.fetch<Record<string, unknown> | null>(PAGE_SECTIONS_QUERY, {
      type: config.type,
      id,
    });
    if (!doc || typeof doc["_id"] !== "string") {
      return { ...empty, error: readErrorMessage("content_not_found") };
    }

    const scope = buildScopeMeta({
      arm: doc["arm"],
      regions: doc["regions"],
      zones: doc["zones"],
      chapters: doc["chapters"],
    });
    const grants: ScopeGrant[] = grantsFromRoles(session.roles);
    if (!visibleToGrants(scope, grants)) {
      return { ...empty, error: readErrorMessage("content_not_found") };
    }

    const rows = Array.isArray(doc["sections"]) ? (doc["sections"] as PageSectionRow[]) : [];
    const sections: PageSectionRow[] = [];
    for (const row of rows) {
      if (!row || typeof row !== "object") continue;
      const key = typeof row.key === "string" ? row.key : "";
      if (!key) continue;
      const type = typeof row.type === "string" ? row.type : "";
      sections.push({
        key,
        type,
        label: typeof row.label === "string" && row.label.trim() ? row.label : type,
        visible: row.visible !== false,
      });
    }
    return { ok: true, sections };
  } catch (error) {
    if (isAuthorizationError(error)) {
      return { ...empty, error: readErrorMessage(error.reason) };
    }
    console.error("[admin:content] getPageSections failed", error);
    return { ...empty, error: readErrorMessage("unexpected_error") };
  }
}

/**
 * Organisation units the current actor may tag content with — grant-filtered
 * (system grants get everything, arm grants their arm, region grants their
 * region, chapter grants only their chapter). Requires any content write
 * permission so read-only visitors never load it.
 */
export async function getContentScopeOptions(): Promise<ContentScopeOptionsPayload> {
  try {
    const session = await requireActor();
    const writePermissions = Object.values(MODULE_MUTATIONS).map(
      (config) => config.writePermission,
    );
    if (!session.permissions.some((permission) => writePermissions.includes(permission))) {
      throw new AuthorizationError("permission_not_granted", {
        actorUserId: session.user.id,
        permission: writePermissions[0] ?? "events.write",
      });
    }

    const org = await getOrgOptions();
    const assignable = assignableScopeOptions(grantsFromRoles(session.roles), org);
    return {
      ok: true,
      arms: assignable.arms,
      chapters: assignable.chapters,
      zones: assignable.zones,
      regions: assignable.regions,
    };
  } catch (error) {
    if (isAuthorizationError(error)) {
      return { ...emptyScopeOptions(), error: readErrorMessage(error.reason) };
    }
    console.error("[admin:content] getContentScopeOptions failed", error);
    return { ...emptyScopeOptions(), error: readErrorMessage("unexpected_error") };
  }
}
