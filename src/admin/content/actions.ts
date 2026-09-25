import { getClient } from "@/sanity/client";
import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
  isSanityConfigured,
} from "@/sanity/config";
import { query } from "../db/client";
import { getCurrentActor } from "../auth/actions";
import { AuthorizationError } from "../rbac/engine";
import type { PermissionKey } from "../rbac/permissions";
import type { CurrentActorResult } from "../auth/actions";
import { grantsFromRoles, visibleToGrants, buildScopeMeta } from "./scope";
import { CONTENT_QUERIES, DOCUMENT_COUNT_QUERY, MEDIA_QUERY } from "./queries";
import {
  announcementStats,
  chapterStats,
  eventStats,
  mapAnnouncements,
  mapChapters,
  mapEvents,
  mapNews,
  mapOutreaches,
  mapPages,
  newsStats,
  outreachStats,
  pageStats,
  type RawContentRow,
} from "./mappers";
import type {
  ContentItem,
  ContentModuleKey,
  ContentModulePayload,
  ContentStat,
  MediaAsset,
  MediaPayload,
  ScopeGrant,
  SettingsPayload,
} from "./types";

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
  events: { permission: "events.read", map: mapEvents, stats: eventStats },
  news: { permission: "news.read", map: mapNews, stats: newsStats },
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
  { key: "events", label: "Event" },
  { key: "announcements", label: "Announcement" },
  { key: "news", label: "News item" },
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
