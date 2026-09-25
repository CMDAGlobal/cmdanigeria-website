import { buildScopeMeta } from "./scope";
import type { ContentItem, ContentStat, ContentStatus, StatusTone } from "./types";

export interface RawContentRow {
  id?: unknown;
  title?: unknown;
  slug?: unknown;
  arm?: unknown;
  institution?: unknown;
  location?: unknown;
  date?: unknown;
  region?: unknown;
  zone?: unknown;
  regions?: unknown;
  zones?: unknown;
  chapters?: unknown;
  type?: unknown;
  startDate?: unknown;
  venue?: unknown;
  mode?: unknown;
  category?: unknown;
  publishedAt?: unknown;
  pinned?: unknown;
  kind?: unknown;
  tags?: unknown;
  draft?: unknown;
  featured?: unknown;
  status?: unknown;
  startsAt?: unknown;
  partner?: unknown;
  section?: unknown;
}

export const ARM_LABELS: Record<string, string> = {
  global: "Global Network",
  students: "Students' Arm",
  doctors: "Doctors' Arm",
};

export function armLabel(arm: string | null): string {
  if (!arm) return "Unassigned";
  return ARM_LABELS[arm] ?? arm;
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function isoDate(value: unknown): string | null {
  if (typeof value !== "string" || !value.length) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : value;
}

function status(label: string, tone: StatusTone): ContentStatus {
  return { label, tone };
}

function armCount(items: ContentItem[], arm: string): number {
  return items.filter((item) => item.arm === arm).length;
}

function countBy(items: ContentItem[], predicate: (item: ContentItem) => boolean): number {
  return items.filter(predicate).length;
}

export function mapChapters(rows: RawContentRow[]): ContentItem[] {
  return rows.map((row) => {
    const title = text(row.title) ?? "Untitled chapter";
    return {
      id: String(row.id ?? ""),
      title,
      slug: text(row.slug),
      arm: text(row.arm),
      subtitle: text(row.institution) ?? text(row.location),
      date: isoDate(row.date),
      status: null,
      draft: false,
      scope: buildScopeMeta({
        arm: row.arm,
        regions: row.region,
        zones: row.zone,
      }),
    };
  });
}

export function mapEvents(rows: RawContentRow[]): ContentItem[] {
  const now = Date.now();
  return rows.map((row) => {
    const start = isoDate(row.startDate);
    const upcoming = start ? new Date(start).getTime() >= now : false;
    return {
      id: String(row.id ?? ""),
      title: text(row.title) ?? "Untitled event",
      slug: text(row.slug),
      arm: text(row.arm),
      subtitle: text(row.venue) ?? text(row.location),
      date: start,
      status: status(upcoming ? "Upcoming" : "Past", upcoming ? "default" : "outline"),
      draft: false,
      scope: buildScopeMeta({
        arm: row.arm,
        regions: row.regions,
        zones: row.zones,
        chapters: row.chapters,
      }),
    };
  });
}

export function mapAnnouncements(rows: RawContentRow[]): ContentItem[] {
  return rows.map((row) => ({
    id: String(row.id ?? ""),
    title: text(row.title) ?? "Untitled announcement",
    slug: text(row.slug),
    arm: text(row.arm),
    subtitle: text(row.category),
    date: isoDate(row.publishedAt),
    status: row.pinned === true ? status("Pinned", "default") : status("Published", "secondary"),
    draft: false,
    scope: buildScopeMeta({
      arm: row.arm,
      regions: row.regions,
      zones: row.zones,
      chapters: row.chapters,
    }),
  }));
}

const NEWS_KIND_LABELS: Record<string, string> = {
  article: "Article",
  press_release: "Press release",
  statement: "Statement",
  coverage: "Media coverage",
  video: "Video",
};

export function mapNews(rows: RawContentRow[]): ContentItem[] {
  return rows.map((row) => {
    const draft = row.draft === true;
    const kind = text(row.kind) ?? "article";
    return {
      id: String(row.id ?? ""),
      title: text(row.title) ?? "Untitled item",
      slug: text(row.slug),
      arm: text(row.arm),
      subtitle: text(row.category),
      date: isoDate(row.publishedAt),
      status: draft
        ? status("Draft", "destructive")
        : status(NEWS_KIND_LABELS[kind] ?? kind, row.featured === true ? "default" : "secondary"),
      draft,
      scope: buildScopeMeta({
        arm: row.arm,
        regions: row.regions,
        zones: row.zones,
        chapters: row.chapters,
      }),
    };
  });
}

const OUTREACH_STATUS: Record<string, { label: string; tone: StatusTone }> = {
  planned: { label: "Planned", tone: "outline" },
  active: { label: "Active", tone: "default" },
  completed: { label: "Completed", tone: "secondary" },
  cancelled: { label: "Cancelled", tone: "destructive" },
};

const OUTREACH_FALLBACK: { label: string; tone: StatusTone } = {
  label: "Planned",
  tone: "outline",
};

export function mapOutreaches(rows: RawContentRow[]): ContentItem[] {
  return rows.map((row) => {
    const key = text(row.status) ?? "planned";
    const mapped = OUTREACH_STATUS[key] ?? OUTREACH_FALLBACK;
    return {
      id: String(row.id ?? ""),
      title: text(row.title) ?? "Untitled campaign",
      slug: text(row.slug),
      arm: text(row.arm),
      subtitle: text(row.partner) ?? text(row.location),
      date: isoDate(row.startsAt),
      status: status(mapped.label, mapped.tone),
      draft: false,
      scope: buildScopeMeta({
        arm: row.arm,
        regions: row.regions,
        zones: row.zones,
        chapters: row.chapters,
      }),
    };
  });
}

const PAGE_SECTION_LABELS: Record<string, string> = {
  general: "General",
  about: "About",
  membership: "Membership",
  governance: "Governance",
  newsroom: "Newsroom",
  media: "Media centre",
  contact: "Contact",
};

export function mapPages(rows: RawContentRow[]): ContentItem[] {
  return rows.map((row) => {
    const draft = row.draft === true;
    const section = text(row.section) ?? "general";
    return {
      id: String(row.id ?? ""),
      title: text(row.title) ?? "Untitled page",
      slug: text(row.slug),
      arm: text(row.arm),
      subtitle: row.slug ? `/${row.slug}` : null,
      date: null,
      status: draft
        ? status("Draft", "destructive")
        : status(PAGE_SECTION_LABELS[section] ?? section, "secondary"),
      draft,
      scope: buildScopeMeta({
        arm: row.arm,
        regions: row.regions,
        zones: row.zones,
        chapters: row.chapters,
      }),
    };
  });
}

export function chapterStats(items: ContentItem[]): ContentStat[] {
  return [
    { label: "Total chapters", value: items.length },
    { label: "Students' arm", value: armCount(items, "students") },
    { label: "Doctors' arm", value: armCount(items, "doctors") },
    { label: "Global network", value: armCount(items, "global") },
  ];
}

export function eventStats(items: ContentItem[]): ContentStat[] {
  const upcoming = countBy(items, (item) => item.status?.label === "Upcoming");
  return [
    { label: "Total events", value: items.length },
    { label: "Upcoming", value: upcoming },
    { label: "Past", value: items.length - upcoming },
  ];
}

export function announcementStats(items: ContentItem[]): ContentStat[] {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recent = countBy(items, (item) =>
    item.date ? new Date(item.date).getTime() >= cutoff : false,
  );
  return [
    { label: "Total", value: items.length },
    { label: "Pinned", value: countBy(items, (item) => item.status?.label === "Pinned") },
    { label: "Last 30 days", value: recent },
  ];
}

export function newsStats(items: ContentItem[]): ContentStat[] {
  return [
    { label: "Total items", value: items.length },
    { label: "Published", value: countBy(items, (item) => !item.draft) },
    { label: "Drafts", value: countBy(items, (item) => item.draft) },
    { label: "Featured", value: items.filter((item) => item.status?.tone === "default").length },
  ];
}

export function outreachStats(items: ContentItem[]): ContentStat[] {
  const byLabel = (label: string) => countBy(items, (item) => item.status?.label === label);
  return [
    { label: "Total campaigns", value: items.length },
    { label: "Active", value: byLabel("Active") },
    { label: "Planned", value: byLabel("Planned") },
    { label: "Completed", value: byLabel("Completed") },
  ];
}

export function pageStats(items: ContentItem[]): ContentStat[] {
  return [
    { label: "Total pages", value: items.length },
    { label: "Published", value: countBy(items, (item) => !item.draft) },
    { label: "Drafts", value: countBy(items, (item) => item.draft) },
  ];
}
