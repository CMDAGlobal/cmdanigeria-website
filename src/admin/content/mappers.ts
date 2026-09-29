import { buildScopeMeta } from "./scope";
import type { ContentItem, ContentStat, ContentStatus, StatusTone } from "./types";

export interface RawContentRow {
  id?: unknown;
  title?: unknown;
  slug?: unknown;
  arm?: unknown;
  institution?: unknown;
  countries?: unknown;
  intro?: unknown;
  issueDate?: unknown;
  issueNumber?: unknown;
  author?: unknown;
  summary?: unknown;
  url?: unknown;
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
  publication?: unknown;
  publishAt?: unknown;
}

export type PublicationKey = "draft" | "published" | "scheduled" | "archived";

const PUBLICATION_META: Record<PublicationKey, { label: string; tone: StatusTone }> = {
  draft: { label: "Draft", tone: "destructive" },
  published: { label: "Published", tone: "secondary" },
  scheduled: { label: "Scheduled", tone: "default" },
  archived: { label: "Archived", tone: "outline" },
};

export function publicationKey(row: Pick<RawContentRow, "publication" | "draft">): PublicationKey {
  const value = text(row.publication);
  if (value === "draft" || value === "published" || value === "scheduled" || value === "archived") {
    return value;
  }
  return row.draft === true ? "draft" : "published";
}

function publicationStatus(row: Pick<RawContentRow, "publication" | "draft">): ContentStatus {
  const meta = PUBLICATION_META[publicationKey(row)];
  return status(meta.label, meta.tone);
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

export function mapRegions(rows: RawContentRow[]): ContentItem[] {
  return rows.map((row) => {
    const slug = text(row.slug);
    const countries = Array.isArray(row.countries)
      ? row.countries.filter((entry): entry is string => typeof entry === "string")
      : [];
    return {
      id: String(row.id ?? ""),
      title: text(row.title) ?? "Untitled region",
      slug,
      arm: "global",
      subtitle: countries.length > 0 ? countries.join(", ") : text(row.intro),
      date: null,
      status: null,
      draft: false,
      // A region document is its own unit, exactly like a chapter document.
      scope: buildScopeMeta({ arm: "global", regions: slug }),
    };
  });
}

export function mapEvents(rows: RawContentRow[]): ContentItem[] {
  return rows.map((row) => {
    const start = isoDate(row.startDate);
    return {
      id: String(row.id ?? ""),
      title: text(row.title) ?? "Untitled event",
      slug: text(row.slug),
      arm: text(row.arm),
      subtitle: text(row.venue) ?? text(row.location),
      date: start,
      status: publicationStatus(row),
      draft: publicationKey(row) === "draft",
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
    status: publicationStatus(row),
    detail: row.pinned === true ? "Pinned" : null,
    draft: publicationKey(row) === "draft",
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

export function kindLabel(kind: string): string {
  return NEWS_KIND_LABELS[kind] ?? kind;
}

export function mapNews(rows: RawContentRow[]): ContentItem[] {
  return rows.map((row) => {
    const kind = text(row.kind) ?? "article";
    const category = text(row.category);
    return {
      id: String(row.id ?? ""),
      title: text(row.title) ?? "Untitled item",
      slug: text(row.slug),
      arm: text(row.arm),
      subtitle: category ? `${kindLabel(kind)} · ${category}` : kindLabel(kind),
      date: isoDate(row.publishedAt),
      status: publicationStatus(row),
      detail: row.featured === true ? "Featured" : null,
      kind,
      draft: publicationKey(row) === "draft",
      scope: buildScopeMeta({
        arm: row.arm,
        regions: row.regions,
        zones: row.zones,
        chapters: row.chapters,
      }),
    };
  });
}

const PUBLICATION_KIND_LABELS: Record<string, string> = {
  prescription: "Prescription",
  newsletter: "Newsletter",
  journal: "Journal",
  book: "Book",
};

export function publicationKindLabel(kind: string): string {
  return PUBLICATION_KIND_LABELS[kind] ?? kind;
}

export function mapPublications(rows: RawContentRow[]): ContentItem[] {
  return rows.map((row) => {
    const kind = text(row.kind) ?? "prescription";
    const issueNumber = typeof row.issueNumber === "number" ? row.issueNumber : null;
    const author = text(row.author);
    const details = [issueNumber ? `#${issueNumber}` : null, author].filter(Boolean);
    return {
      id: String(row.id ?? ""),
      title: (text(row.title) ?? "Untitled issue") + (issueNumber ? ` #${issueNumber}` : ""),
      slug: text(row.slug),
      arm: text(row.arm),
      subtitle: publicationKindLabel(kind),
      date: isoDate(row.issueDate),
      status: publicationStatus(row),
      detail: details.length > 0 ? details.join(" · ") : text(row.url) ? "Has reading link" : null,
      kind,
      draft: publicationKey(row) === "draft",
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
    const partner = text(row.partner) ?? text(row.location);
    return {
      id: String(row.id ?? ""),
      title: text(row.title) ?? "Untitled campaign",
      slug: text(row.slug),
      arm: text(row.arm),
      subtitle: partner ? `${mapped.label} · ${partner}` : mapped.label,
      date: isoDate(row.startsAt),
      status: publicationStatus(row),
      detail: mapped.label,
      draft: publicationKey(row) === "draft",
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
    const section = text(row.section) ?? "general";
    return {
      id: String(row.id ?? ""),
      title: text(row.title) ?? "Untitled page",
      slug: text(row.slug),
      arm: text(row.arm),
      subtitle: row.slug ? `/${row.slug}` : null,
      date: null,
      status: publicationStatus(row),
      detail: PAGE_SECTION_LABELS[section] ?? section,
      draft: publicationKey(row) === "draft",
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

export function regionStats(items: ContentItem[]): ContentStat[] {
  return [
    { label: "Total regions", value: items.length },
    { label: "With country coverage", value: countBy(items, (item) => Boolean(item.subtitle)) },
  ];
}

export function eventStats(items: ContentItem[]): ContentStat[] {
  const cutoff = Date.now();
  const upcoming = countBy(items, (item) =>
    item.date ? new Date(item.date).getTime() >= cutoff : false,
  );
  return [
    { label: "Total events", value: items.length },
    { label: "Upcoming", value: upcoming },
    { label: "Past", value: items.length - upcoming },
    { label: "Published", value: countBy(items, (item) => item.status?.label === "Published") },
  ];
}

export function announcementStats(items: ContentItem[]): ContentStat[] {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recent = countBy(items, (item) =>
    item.date ? new Date(item.date).getTime() >= cutoff : false,
  );
  return [
    { label: "Total", value: items.length },
    { label: "Pinned", value: countBy(items, (item) => item.detail === "Pinned") },
    { label: "Last 30 days", value: recent },
    { label: "Published", value: countBy(items, (item) => item.status?.label === "Published") },
  ];
}

export function newsStats(items: ContentItem[]): ContentStat[] {
  return [
    { label: "Total items", value: items.length },
    { label: "Published", value: countBy(items, (item) => item.status?.label === "Published") },
    { label: "Drafts", value: countBy(items, (item) => item.status?.label === "Draft") },
    { label: "Featured", value: countBy(items, (item) => item.detail === "Featured") },
  ];
}

export function publicationStats(items: ContentItem[]): ContentStat[] {
  return [
    { label: "Total issues", value: items.length },
    { label: "Published", value: countBy(items, (item) => item.status?.label === "Published") },
    { label: "Drafts", value: countBy(items, (item) => item.status?.label === "Draft") },
    {
      label: "With reading link",
      value: countBy(items, (item) => item.detail === "Has reading link"),
    },
  ];
}

export function outreachStats(items: ContentItem[]): ContentStat[] {
  const byDetail = (label: string) => countBy(items, (item) => item.detail === label);
  return [
    { label: "Total campaigns", value: items.length },
    { label: "Active", value: byDetail("Active") },
    { label: "Planned", value: byDetail("Planned") },
    { label: "Completed", value: byDetail("Completed") },
  ];
}

export function pageStats(items: ContentItem[]): ContentStat[] {
  return [
    { label: "Total pages", value: items.length },
    { label: "Published", value: countBy(items, (item) => item.status?.label === "Published") },
    { label: "Drafts", value: countBy(items, (item) => item.status?.label === "Draft") },
  ];
}
