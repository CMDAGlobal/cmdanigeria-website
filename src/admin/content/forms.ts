import { ARM_KEYS } from "../rbac/roles";
import type { ContentModuleKey, ScopeGrant } from "./types";
import { MODULE_MUTATIONS } from "./validate";

export type FormFieldKind =
  | "text"
  | "textarea"
  | "rich"
  | "datetime"
  | "date"
  | "url"
  | "select"
  | "boolean"
  | "number"
  | "tags"
  | "image"
  | "file"
  | "note"
  /** Nested object edited as one labelled input per column (contact details). */
  | "object"
  /** Repeating rows of columns, each row one entry (resources). */
  | "list";

export interface FormFieldOption {
  value: string;
  title: string;
}

export interface FormFieldColumn {
  name: string;
  label: string;
  /** Input type for this column. Defaults to a single-line text input. */
  kind?: "text" | "url" | "select";
  placeholder?: string;
  options?: FormFieldOption[];
}

export interface FormField {
  name: string;
  label: string;
  kind: FormFieldKind;
  /** Filled in by `formFieldsFor` from the server-enforced required list. */
  required?: boolean;
  options?: FormFieldOption[];
  rows?: number;
  placeholder?: string;
  help?: string;
  /** Read-only hint — rendered as text, never submitted. */
  note?: string;
  /** Columns for `object` and `list` fields. */
  columns?: FormFieldColumn[];
  /** Button label for `list` fields. */
  addLabel?: string;
}

const SLUG_HELP = "Lowercase letters, numbers and dashes. Generated from the title when blank.";
const RICH_HELP =
  "Plain paragraphs — one per line. Bold, links and headings stay editable in Studio.";
const FILE_HELP =
  "Optional. For downloadable issues such as the Wholeness Journal abstracts. Most issues are read on the site instead.";
const ISSUE_NUMBER_HELP = "Shown as “#65” in the archive.";
const URL_HELP = "Optional. Only if the issue lives somewhere else.";
const BODY_NOTE =
  "The full issue is written in Sanity Studio so headings, links, quotes and inline photos keep their formatting. Edit the body there; edit the issue details here.";

const EVENT_TYPES: FormFieldOption[] = [
  { value: "conference", title: "Conference" },
  { value: "fellowship", title: "Fellowship" },
  { value: "prayer", title: "Prayer" },
  { value: "training", title: "Training" },
  { value: "outreach", title: "Outreach / mission" },
  { value: "retreat", title: "Retreat" },
  { value: "webinar", title: "Webinar" },
  { value: "meeting", title: "Meeting" },
  { value: "other", title: "Other" },
];

const EVENT_MODES: FormFieldOption[] = [
  { value: "inperson", title: "In-person" },
  { value: "virtual", title: "Virtual" },
  { value: "hybrid", title: "Hybrid" },
];

const NEWS_KINDS: FormFieldOption[] = [
  { value: "article", title: "Article" },
  { value: "press_release", title: "Press release" },
  { value: "statement", title: "Public statement" },
  { value: "coverage", title: "Media coverage" },
  { value: "video", title: "Video" },
];

const PUBLICATION_KINDS: FormFieldOption[] = [
  { value: "prescription", title: "Prescription (newsletter)" },
  { value: "newsletter", title: "Newsletter" },
  { value: "journal", title: "Journal / report" },
  { value: "book", title: "Book" },
];

const OUTREACH_STATUSES: FormFieldOption[] = [
  { value: "planned", title: "Planned" },
  { value: "active", title: "Active" },
  { value: "completed", title: "Completed" },
  { value: "cancelled", title: "Cancelled" },
];

const PAGE_SECTIONS: FormFieldOption[] = [
  { value: "general", title: "General" },
  { value: "about", title: "About" },
  { value: "membership", title: "Membership" },
  { value: "governance", title: "Governance" },
  { value: "newsroom", title: "Newsroom" },
  { value: "media", title: "Media centre" },
  { value: "contact", title: "Contact" },
];

const RESOURCE_KINDS: FormFieldOption[] = [
  { value: "document", title: "Document" },
  { value: "form", title: "Form" },
  { value: "video", title: "Video" },
  { value: "tool", title: "Tool" },
  { value: "other", title: "Other" },
];

const CONTACT_COLUMNS: FormFieldColumn[] = [
  { name: "email", label: "Email", kind: "text", placeholder: "hello@cmda.org" },
  { name: "phone", label: "Phone", kind: "text" },
  { name: "address", label: "Address", kind: "text" },
];

const SOCIAL_COLUMNS: FormFieldColumn[] = [
  { name: "instagram", label: "Instagram", kind: "url", placeholder: "https://" },
  { name: "x", label: "X", kind: "url", placeholder: "https://" },
  { name: "facebook", label: "Facebook", kind: "url", placeholder: "https://" },
  { name: "whatsapp", label: "WhatsApp", kind: "url", placeholder: "https://" },
];

const RESOURCE_COLUMNS: FormFieldColumn[] = [
  { name: "title", label: "Title", kind: "text", placeholder: "Membership form" },
  { name: "kind", label: "Type", kind: "select", options: RESOURCE_KINDS },
  { name: "url", label: "Link", kind: "url", placeholder: "https://" },
  { name: "description", label: "Description", kind: "text" },
];

const ACTIVE_HELP =
  "Turn off to hide this unit from the public site — its content stays in the CMS.";
const LIST_HELP =
  "One entry per row. Bold, links and headings in longer prose stay editable in Studio.";
const RESOURCE_MAX = 50;

/**
 * Curated dashboard fields per module — always a subset of the server-side
 * `MODULE_MUTATIONS` allowlist (enforced by `forms.test.ts`). The arm field is
 * intentionally absent: it is edited through the scope section.
 */
export const MODULE_FORM_FIELDS: Record<ContentModuleKey, FormField[]> = {
  chapters: [
    { name: "name", label: "Chapter name", kind: "text", placeholder: "e.g. CMDA LUTH Chapter" },
    {
      name: "slug",
      label: "Slug",
      kind: "text",
      placeholder: "cmda-luth-chapter",
      help: SLUG_HELP,
    },
    { name: "institution", label: "Institution / school", kind: "text" },
    { name: "location", label: "Location (city/state)", kind: "text" },
    { name: "country", label: "Country", kind: "text" },
    { name: "establishedAt", label: "Established", kind: "date" },
    { name: "order", label: "Display order", kind: "number", help: "Lower numbers appear first." },
    { name: "description", label: "Description", kind: "rich", rows: 5, help: RICH_HELP },
    { name: "mission", label: "Mission / objectives", kind: "textarea", rows: 3 },
    { name: "history", label: "History", kind: "rich", rows: 6, help: RICH_HELP },
    { name: "contactInfo", label: "Contact details", kind: "object", columns: CONTACT_COLUMNS },
    { name: "socialLinks", label: "Social links", kind: "object", columns: SOCIAL_COLUMNS },
    {
      name: "resources",
      label: "Resources",
      kind: "list",
      addLabel: "Add resource",
      columns: RESOURCE_COLUMNS,
      help: LIST_HELP,
    },
    { name: "active", label: "Chapter is active", kind: "boolean", help: ACTIVE_HELP },
  ],
  regions: [
    { name: "name", label: "Region name", kind: "text", placeholder: "e.g. West Africa" },
    {
      name: "slug",
      label: "Slug",
      kind: "text",
      placeholder: "west-africa",
      help: SLUG_HELP,
    },
    { name: "eyebrow", label: "Hero eyebrow", kind: "text" },
    { name: "tagline", label: "Hero title", kind: "text" },
    { name: "intro", label: "Hero intro", kind: "textarea", rows: 3 },
    { name: "countries", label: "Countries covered", kind: "tags", placeholder: "Nigeria, Ghana" },
    { name: "overview", label: "Overview", kind: "rich", rows: 5, help: RICH_HELP },
    { name: "mission", label: "Mission", kind: "textarea", rows: 3 },
    { name: "focus", label: "Focus areas", kind: "tags", placeholder: "training, mentorship" },
    { name: "order", label: "Display order", kind: "number", help: "Lower numbers appear first." },
    { name: "history", label: "History", kind: "rich", rows: 6, help: RICH_HELP },
    { name: "contactInfo", label: "Contact details", kind: "object", columns: CONTACT_COLUMNS },
    { name: "socialLinks", label: "Social links", kind: "object", columns: SOCIAL_COLUMNS },
    {
      name: "resources",
      label: "Resources",
      kind: "list",
      addLabel: "Add resource",
      columns: RESOURCE_COLUMNS,
      help: LIST_HELP,
    },
    { name: "active", label: "Region is active", kind: "boolean", help: ACTIVE_HELP },
  ],
  events: [
    { name: "title", label: "Event title", kind: "text" },
    { name: "slug", label: "Slug", kind: "text", help: SLUG_HELP },
    { name: "type", label: "Event type", kind: "select", options: EVENT_TYPES },
    { name: "startDate", label: "Start date & time", kind: "datetime" },
    { name: "endDate", label: "End date & time", kind: "datetime" },
    { name: "mode", label: "Mode", kind: "select", options: EVENT_MODES },
    { name: "venue", label: "Venue", kind: "text" },
    { name: "location", label: "Location (city/state/country)", kind: "text" },
    { name: "registrationUrl", label: "Registration link", kind: "url", placeholder: "https://" },
    { name: "report", label: "Event report / recap", kind: "textarea", rows: 4 },
    { name: "description", label: "Description", kind: "rich", rows: 6, help: RICH_HELP },
  ],
  announcements: [
    { name: "title", label: "Title", kind: "text" },
    { name: "slug", label: "Slug", kind: "text", help: SLUG_HELP },
    { name: "category", label: "Category", kind: "text", placeholder: "e.g. circular" },
    { name: "publishedAt", label: "Published date & time", kind: "datetime" },
    { name: "link", label: "External link", kind: "url", placeholder: "https://" },
    {
      name: "pinned",
      label: "Pin to top",
      kind: "boolean",
      help: "Pinned notices stay at the top.",
    },
    { name: "body", label: "Body", kind: "rich", rows: 7, help: RICH_HELP },
  ],
  news: [
    { name: "title", label: "Headline", kind: "text" },
    { name: "slug", label: "Slug", kind: "text", help: SLUG_HELP },
    { name: "kind", label: "Item type", kind: "select", options: NEWS_KINDS },
    { name: "category", label: "Category", kind: "text" },
    { name: "publishedAt", label: "Published date & time", kind: "datetime" },
    { name: "featured", label: "Feature on homepage", kind: "boolean" },
    { name: "tags", label: "Tags", kind: "tags", placeholder: "news, health, nigeria" },
    { name: "excerpt", label: "Excerpt", kind: "textarea", rows: 3 },
    { name: "link", label: "External link", kind: "url", placeholder: "https://" },
    { name: "body", label: "Body", kind: "rich", rows: 7, help: RICH_HELP },
  ],
  publications: [
    { name: "title", label: "Issue title", kind: "text", placeholder: "Prescription — March 2026" },
    { name: "slug", label: "Slug", kind: "text", help: SLUG_HELP },
    { name: "kind", label: "Publication type", kind: "select", options: PUBLICATION_KINDS },
    { name: "issueNumber", label: "Issue number", kind: "number", help: ISSUE_NUMBER_HELP },
    { name: "issueDate", label: "Issue date", kind: "date" },
    { name: "author", label: "Author", kind: "text", placeholder: "CMDA Nigeria" },
    { name: "summary", label: "Summary", kind: "textarea", rows: 3 },
    { name: "bodyNote", label: "Issue body", kind: "note", note: BODY_NOTE },
    { name: "coverImage", label: "Cover image", kind: "image" },
    { name: "coverAlt", label: "Cover alt text", kind: "text" },
    { name: "url", label: "Reading link", kind: "url", placeholder: "https://", help: URL_HELP },
    { name: "file", label: "Issue file", kind: "file", help: FILE_HELP },
  ],
  outreaches: [
    { name: "title", label: "Campaign title", kind: "text" },
    { name: "slug", label: "Slug", kind: "text", help: SLUG_HELP },
    { name: "status", label: "Status", kind: "select", options: OUTREACH_STATUSES },
    { name: "startsAt", label: "Start date & time", kind: "datetime" },
    { name: "endsAt", label: "End date & time", kind: "datetime" },
    { name: "location", label: "Location (city/state/country)", kind: "text" },
    { name: "partner", label: "Partner organisation", kind: "text" },
    { name: "contact", label: "Contact person", kind: "text" },
    { name: "goal", label: "Goal", kind: "text" },
    {
      name: "registrationUrl",
      label: "Registration / donate link",
      kind: "url",
      placeholder: "https://",
    },
    { name: "summary", label: "Summary", kind: "textarea", rows: 3 },
    { name: "report", label: "Outcome report", kind: "textarea", rows: 3 },
    { name: "body", label: "Body", kind: "rich", rows: 6, help: RICH_HELP },
  ],
  pages: [
    { name: "title", label: "Page title", kind: "text" },
    { name: "slug", label: "Path", kind: "text", placeholder: "about-us", help: SLUG_HELP },
    { name: "section", label: "Section", kind: "select", options: PAGE_SECTIONS },
    { name: "summary", label: "Summary", kind: "textarea", rows: 3 },
    { name: "seoTitle", label: "SEO title", kind: "text" },
    { name: "seoDescription", label: "SEO description", kind: "textarea", rows: 2 },
    { name: "body", label: "Body", kind: "rich", rows: 7, help: RICH_HELP },
  ],
};

/** Defaults pre-filled on create — mirrors each schema's initialValue. */
export const FORM_DEFAULTS: Record<string, string | boolean> = {
  type: "other",
  mode: "inperson",
  kind: "article",
  status: "planned",
  section: "general",
  pinned: false,
  featured: false,
  order: "0",
  // Units created before the flag existed never stored it, and stay live.
  active: true,
};

/** Form fields for a module with `required` derived from server validation. */
export function formFieldsFor(module: ContentModuleKey): FormField[] {
  const required = new Set(MODULE_MUTATIONS[module].required);
  return MODULE_FORM_FIELDS[module].map((field) =>
    required.has(field.name) ? { ...field, required: true } : field,
  );
}

/** Titles Sanity Studio shows for each section type; unknown types fall back. */
const PAGE_SECTION_TYPE_TITLES: Record<string, string> = {
  heroSection: "Hero",
  richTextSection: "Text",
  imageTextSection: "Image + text",
  statsSection: "Statistics",
  gallerySection: "Gallery",
  videoSection: "Video",
  ctaSection: "Call to action",
};

export function pageSectionTypeLabel(type: string): string {
  return PAGE_SECTION_TYPE_TITLES[type] ?? type;
}

/* --------------------------- value conversions --------------------------- */

interface PortableBlock {
  _type?: unknown;
  children?: unknown;
}

/** Portable Text → plain text (one paragraph per line). */
export function flattenPortableText(value: unknown): string {
  if (!Array.isArray(value)) return "";
  const lines: string[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const block = entry as PortableBlock;
    if (block._type !== "block" || !Array.isArray(block.children)) continue;
    let text = "";
    for (const child of block.children) {
      if (child && typeof child === "object") {
        const childText = (child as { text?: unknown }).text;
        if (typeof childText === "string") text += childText;
      }
    }
    lines.push(text);
  }
  while (lines.length > 0 && !lines[lines.length - 1]) lines.pop();
  return lines.join("\n");
}

/** Plain text → Portable Text blocks (one block per non-empty line). */
export function textToBlocks(text: string): { _type: "block" }[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", text: line, marks: [] }],
    }));
}

/** ISO string → `datetime-local` input value in the browser's local time. */
export function isoToLocalInput(iso: unknown): string {
  if (typeof iso !== "string" || !iso) return "";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";
  const pad = (value: number): string => String(value).padStart(2, "0");
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}T${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;
}

/** `datetime-local` value → ISO string, or null when unparseable. */
export function localInputToIso(value: string): string | null {
  if (!value.trim()) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

export function tagsToText(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return value.filter((entry): entry is string => typeof entry === "string").join(", ");
}

export function textToTags(value: string): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const entry of value.split(",")) {
    const tag = entry.trim();
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    tags.push(tag);
  }
  return tags;
}

/* ---------------------- nested object / list conversions ----------------- */

/** Reads one column-shaped row out of an untrusted stored value. */
function structRow(columns: FormFieldColumn[], raw: unknown): Record<string, string> {
  const source =
    raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const row: Record<string, string> = {};
  for (const column of columns) {
    const value = source[column.name];
    row[column.name] =
      typeof value === "string"
        ? value
        : value === null || value === undefined
          ? ""
          : String(value);
  }
  return row;
}

/**
 * Nested `object` fields are kept in `values` as JSON so the ordinary
 * string comparison used for change detection still applies.
 */
export function objectToJson(columns: FormFieldColumn[], raw: unknown): string {
  return JSON.stringify(structRow(columns, raw));
}

/** Same for `list` fields, whose value is an array of column-shaped rows. */
export function rowsToJson(columns: FormFieldColumn[], raw: unknown): string {
  const rows = Array.isArray(raw) ? raw : [];
  return JSON.stringify(rows.map((entry) => structRow(columns, entry)));
}

function parseJson(json: string): unknown {
  try {
    return JSON.parse(json) as unknown;
  } catch {
    return null;
  }
}

/** Form JSON → the stored object shape, with every column present (blank if unset). */
export function jsonToObject(columns: FormFieldColumn[], json: string): Record<string, string> {
  return structRow(columns, parseJson(json));
}

/** Form JSON → every row, blank ones included — the renderer needs them kept. */
export function jsonToRows(
  columns: FormFieldColumn[],
  json: string,
): Array<Record<string, string>> {
  const parsed = parseJson(json);
  if (!Array.isArray(parsed)) return [];
  return parsed.map((entry) => structRow(columns, entry));
}

/** Drops rows where every column is blank. */
export function compactRows(rows: Array<Record<string, string>>): Array<Record<string, string>> {
  return rows.filter((row) => Object.values(row).some((value) => value.trim() !== ""));
}

/** True when every column of a nested object field is blank. */
export function isBlankObject(record: Record<string, string>): boolean {
  return Object.values(record).every((value) => value.trim() === "");
}

/* ------------------------- scope option filtering ------------------------ */

export interface ScopeUnitOption {
  slug: string;
  title: string;
  arm?: string;
}

export interface ScopeOrgInput {
  chapters: { slug: string; name: string; arm: string }[];
  regions: { slug: string; name: string }[];
  zones: { slug: string; name: string; arm: string }[];
}

export interface AssignableScopeOptions {
  arms: string[];
  chapters: ScopeUnitOption[];
  zones: ScopeUnitOption[];
  regions: ScopeUnitOption[];
}

/**
 * Organisation units this actor may tag content with — the pickable inverse of
 * the write-cover rules in `cover.ts`. System grants get everything; an arm
 * grant gets its own arm; a chapter grant only its chapter; a region grant only
 * its region (and no chapter/zone tags at all).
 */
export function assignableScopeOptions(
  grants: ScopeGrant[],
  org: ScopeOrgInput,
): AssignableScopeOptions {
  const system = grants.some((grant) => !grant.arm && !grant.regionSlug && !grant.chapterSlug);

  const arms = new Set<string>();
  const chapters = new Map<string, ScopeUnitOption>();
  const zones = new Map<string, ScopeUnitOption>();
  const regions = new Map<string, ScopeUnitOption>();

  if (system) {
    for (const arm of ARM_KEYS) arms.add(arm);
    for (const entry of org.chapters)
      chapters.set(entry.slug, { slug: entry.slug, title: entry.name, arm: entry.arm });
    for (const entry of org.zones)
      zones.set(entry.slug, { slug: entry.slug, title: entry.name, arm: entry.arm });
    for (const entry of org.regions)
      regions.set(entry.slug, { slug: entry.slug, title: entry.name });
    return {
      arms: ARM_KEYS.filter((arm) => arms.has(arm)),
      chapters: [...chapters.values()],
      zones: [...zones.values()],
      regions: [...regions.values()],
    };
  }

  for (const grant of grants) {
    if (grant.arm) arms.add(grant.arm);

    if (grant.chapterSlug) {
      const known = org.chapters.find((entry) => entry.slug === grant.chapterSlug);
      const arm = known?.arm ?? grant.arm;
      chapters.set(grant.chapterSlug, {
        slug: grant.chapterSlug,
        title: known?.name ?? grant.chapterSlug,
        ...(arm ? { arm } : {}),
      });
      continue;
    }

    if (grant.regionSlug) {
      const known = org.regions.find((entry) => entry.slug === grant.regionSlug);
      regions.set(grant.regionSlug, {
        slug: grant.regionSlug,
        title: known?.name ?? grant.regionSlug,
      });
      continue;
    }

    if (grant.arm) {
      if (grant.arm === "global") {
        for (const entry of org.regions)
          regions.set(entry.slug, { slug: entry.slug, title: entry.name });
      } else {
        for (const entry of org.chapters) {
          if (entry.arm === grant.arm)
            chapters.set(entry.slug, { slug: entry.slug, title: entry.name, arm: entry.arm });
        }
        for (const entry of org.zones) {
          if (entry.arm === grant.arm)
            zones.set(entry.slug, { slug: entry.slug, title: entry.name, arm: entry.arm });
        }
      }
    }
  }

  return {
    arms: ARM_KEYS.filter((arm) => arms.has(arm)),
    chapters: [...chapters.values()].sort((a, b) => a.title.localeCompare(b.title)),
    zones: [...zones.values()].sort((a, b) => a.title.localeCompare(b.title)),
    regions: [...regions.values()].sort((a, b) => a.title.localeCompare(b.title)),
  };
}
