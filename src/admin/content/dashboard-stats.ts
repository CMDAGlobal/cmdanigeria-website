import { publicationKey } from "./mappers";
import { buildScopeMeta, visibleToGrants } from "./scope";
import type { ContentScopeMeta, DashboardContentStats, ScopeGrant } from "./types";

/** Lean rows projected by DASHBOARD_STATS_QUERY — scope fields plus media counts. */
export interface DashboardStatsDoc {
  arm?: unknown;
  slug?: unknown;
  publication?: unknown;
  draft?: unknown;
  startDate?: unknown;
  region?: unknown;
  zone?: unknown;
  regions?: unknown;
  zones?: unknown;
  chapters?: unknown;
  chapterRef?: unknown;
  hasCover?: unknown;
  galleryCount?: unknown;
}

export interface DashboardStatsInput {
  pages: DashboardStatsDoc[];
  events: DashboardStatsDoc[];
  chapters: DashboardStatsDoc[];
  regions: DashboardStatsDoc[];
  posts: DashboardStatsDoc[];
  prescriptions: DashboardStatsDoc[];
  announcements: DashboardStatsDoc[];
  outreaches: DashboardStatsDoc[];
  leadership: DashboardStatsDoc[];
}

function docMeta(
  doc: DashboardStatsDoc,
  unit: "chapter" | "region" | "person" | "refs",
): ContentScopeMeta {
  if (unit === "chapter") {
    return buildScopeMeta({
      arm: doc.arm,
      regions: doc.region,
      zones: doc.zone,
      chapters: doc.slug,
    });
  }
  if (unit === "region") {
    return buildScopeMeta({ arm: "global", regions: doc.slug });
  }
  if (unit === "person") {
    return buildScopeMeta({
      arm: doc.arm,
      regions: doc.region,
      zones: doc.zone,
      chapters: doc.chapterRef,
    });
  }
  return buildScopeMeta({
    arm: doc.arm,
    regions: doc.regions,
    zones: doc.zones,
    chapters: doc.chapters,
  });
}

function visibleDocs(
  docs: DashboardStatsDoc[],
  unit: "chapter" | "region" | "person" | "refs",
  grants: ScopeGrant[],
): DashboardStatsDoc[] {
  return docs.filter((doc) => visibleToGrants(docMeta(doc, unit), grants));
}

function docAssetCount(doc: DashboardStatsDoc): number {
  let count = doc.hasCover === true ? 1 : 0;
  if (typeof doc.galleryCount === "number" && Number.isFinite(doc.galleryCount)) {
    count += doc.galleryCount;
  }
  return count;
}

function asList(value: unknown): DashboardStatsDoc[] {
  return Array.isArray(value) ? (value as DashboardStatsDoc[]) : [];
}

/**
 * Scope-filtered overview counts. Every bucket is reduced through the same
 * visibleToGrants gate the content modules use, so an arm/region/chapter
 * admin only ever sees numbers for units they cover.
 */
export function buildDashboardContentStats(
  raw: DashboardStatsInput | null | undefined,
  grants: ScopeGrant[],
  now: number,
): DashboardContentStats {
  const empty: DashboardContentStats = {
    pages: { total: 0, published: 0, draft: 0 },
    events: { upcoming: 0, past: 0, draft: 0 },
    studentChapters: 0,
    doctorChapters: 0,
    regions: 0,
    posts: 0,
    newsletters: 0,
    mediaFiles: 0,
  };
  if (!raw) return empty;

  const pages = visibleDocs(asList(raw.pages), "refs", grants);
  let pagesPublished = 0;
  let pagesDraft = 0;
  for (const doc of pages) {
    const key = publicationKey(doc);
    if (key === "draft") pagesDraft += 1;
    else if (key === "published") pagesPublished += 1;
  }

  const events = visibleDocs(asList(raw.events), "refs", grants);
  let eventsUpcoming = 0;
  let eventsPast = 0;
  let eventsDraft = 0;
  for (const doc of events) {
    if (publicationKey(doc) === "draft") {
      eventsDraft += 1;
      continue;
    }
    const start = typeof doc.startDate === "string" ? Date.parse(doc.startDate) : Number.NaN;
    if (!Number.isNaN(start) && start >= now) eventsUpcoming += 1;
    else eventsPast += 1;
  }

  const chapters = visibleDocs(asList(raw.chapters), "chapter", grants);
  const regions = visibleDocs(asList(raw.regions), "region", grants);

  let mediaFiles = 0;
  for (const doc of chapters) mediaFiles += docAssetCount(doc);
  for (const doc of regions) mediaFiles += docAssetCount(doc);
  for (const doc of pages) mediaFiles += docAssetCount(doc);
  for (const doc of events) mediaFiles += docAssetCount(doc);
  for (const doc of visibleDocs(asList(raw.posts), "refs", grants))
    mediaFiles += docAssetCount(doc);
  for (const doc of visibleDocs(asList(raw.prescriptions), "refs", grants))
    mediaFiles += docAssetCount(doc);
  for (const doc of visibleDocs(asList(raw.announcements), "refs", grants))
    mediaFiles += docAssetCount(doc);
  for (const doc of visibleDocs(asList(raw.outreaches), "refs", grants))
    mediaFiles += docAssetCount(doc);
  for (const doc of visibleDocs(asList(raw.leadership), "person", grants))
    mediaFiles += docAssetCount(doc);

  return {
    pages: { total: pages.length, published: pagesPublished, draft: pagesDraft },
    events: { upcoming: eventsUpcoming, past: eventsPast, draft: eventsDraft },
    studentChapters: chapters.filter((doc) => doc.arm === "students").length,
    doctorChapters: chapters.filter((doc) => doc.arm === "doctors").length,
    regions: regions.length,
    posts: visibleDocs(asList(raw.posts), "refs", grants).length,
    newsletters: visibleDocs(asList(raw.prescriptions), "refs", grants).length,
    mediaFiles,
  };
}

/** Permission mask: null out any bucket the actor may not read. */
export function maskDashboardContentStats(
  stats: DashboardContentStats,
  permissions: readonly string[],
): DashboardContentStats {
  return {
    pages: permissions.includes("pages.read") ? stats.pages : null,
    events: permissions.includes("events.read") ? stats.events : null,
    studentChapters: permissions.includes("chapters.read") ? stats.studentChapters : null,
    doctorChapters: permissions.includes("chapters.read") ? stats.doctorChapters : null,
    regions: permissions.includes("regions.read") ? stats.regions : null,
    posts: permissions.includes("news.read") ? stats.posts : null,
    newsletters: permissions.includes("publications.read") ? stats.newsletters : null,
    mediaFiles: permissions.includes("media.read") ? stats.mediaFiles : null,
  };
}
