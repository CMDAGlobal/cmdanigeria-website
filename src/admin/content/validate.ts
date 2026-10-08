import { ARM_KEYS, type ArmKey } from "../rbac/roles";
import type { PermissionKey } from "../rbac/permissions";
import { strArray } from "./scope";
import type { ContentModuleKey, ContentScopeInput, ContentScopeMeta } from "./types";

export const CONTENT_PUBLICATION_STATUSES = [
  "draft",
  "published",
  "scheduled",
  "archived",
] as const;
export type ContentPublicationStatus = (typeof CONTENT_PUBLICATION_STATUSES)[number];

export interface ModuleMutationConfig {
  type: string;
  writePermission: PermissionKey;
  deletePermission: PermissionKey;
  auditPrefix: string;
  titleField: "title" | "name";
  /** Fields a create must supply (non-empty). */
  required: string[];
  /** Top-level fields the dashboard may write — anything else is rejected. */
  allowed: string[];
  /** Whether the document type participates in publication lifecycle. */
  publication: boolean;
  /**
   * The document *is* the organisation unit it is scoped to (a chapter, a
   * region). Its scope is derived from its own slug instead of stored refs, and
   * `arm` is never written for types whose schema has no arm field.
   */
  selfUnit?: boolean;
  /**
   * Sanity asset fields the dashboard may set, mapped to the asset kind. The
   * form submits a bare asset `_id`; it is normalized here into the
   * `{_type, asset:{_ref}}` shape Sanity stores.
   */
  assetFields?: Record<string, AssetKind>;
  /** Alt-text companion of an image asset field, keyed by that field. */
  altFields?: Record<string, string>;
  /**
   * Nested plain-object fields (contact details, social links) and the sub-keys
   * the dashboard may write. Anything outside the whitelist is rejected.
   */
  objectFields?: Record<string, readonly string[]>;
  /** Arrays of plain objects (resources), whitelisted the same way. */
  arrayFields?: Record<string, readonly string[]>;
}

export type AssetKind = "image" | "file";

/**
 * Sanity asset document ids. Images carry their pixel dimensions
 * (`image-<hash>-<w>x<h>-<ext>`); files do not (`file-<hash>-<ext>`).
 */
const IMAGE_ASSET_ID = /^image-[a-zA-Z0-9]+-\d+x\d+-[a-zA-Z0-9]+$/;
const FILE_ASSET_ID = /^file-[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/;

/**
 * Turns a submitted asset `_id` into the value Sanity stores for that field.
 * `""`/null clears the field; anything that is not a well-formed asset id of
 * the expected kind is rejected.
 */
export function normalizeAssetField(
  value: unknown,
  kind: AssetKind,
  alt?: unknown,
): Record<string, unknown> | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") throw new ContentInputError("invalid_input");
  const id = value.trim();
  const pattern = kind === "image" ? IMAGE_ASSET_ID : FILE_ASSET_ID;
  if (id.length > 200 || !pattern.test(id)) throw new ContentInputError("invalid_input");
  const asset: Record<string, unknown> = { _type: kind, asset: { _type: "reference", _ref: id } };
  const altText = typeof alt === "string" ? alt.trim() : "";
  if (altText) {
    if (altText.length > MAX_STRING_CHARS) throw new ContentInputError("invalid_input");
    asset["alt"] = altText;
  }
  return asset;
}

const SCOPE_FIELDS = ["regions", "zones", "chapters"] as const;

const ARM_FIELDS = ["arm"] as const;

export const MODULE_MUTATIONS: Record<ContentModuleKey, ModuleMutationConfig> = {
  chapters: {
    type: "chapter",
    writePermission: "chapters.write",
    deletePermission: "chapters.delete",
    auditPrefix: "chapter",
    titleField: "name",
    required: ["name"],
    allowed: [
      "name",
      "slug",
      "arm",
      "institution",
      "location",
      "country",
      "establishedAt",
      "order",
      "description",
      "mission",
      "history",
      "contactInfo",
      "socialLinks",
      "resources",
      "active",
      "membership",
    ],
    objectFields: {
      contactInfo: ["email", "phone", "address"],
      socialLinks: ["instagram", "x", "facebook", "whatsapp"],
    },
    arrayFields: {
      resources: ["title", "description", "url", "kind"],
      membership: ["value", "label"],
    },
    // Chapters are organisation units — their visibility is their publication.
    publication: false,
    selfUnit: true,
  },
  regions: {
    type: "region",
    writePermission: "regions.write",
    deletePermission: "regions.delete",
    auditPrefix: "region",
    titleField: "name",
    required: ["name"],
    allowed: [
      "name",
      "slug",
      "eyebrow",
      "tagline",
      "intro",
      "countries",
      "overview",
      "mission",
      "history",
      "contactInfo",
      "socialLinks",
      "resources",
      "active",
      "focus",
      "order",
    ],
    objectFields: {
      contactInfo: ["email", "phone", "address"],
      socialLinks: ["instagram", "x", "facebook", "whatsapp"],
    },
    arrayFields: { resources: ["title", "description", "url", "kind"] },
    // Regions are organisation units — the public region page is always live.
    publication: false,
    selfUnit: true,
  },
  events: {
    type: "event",
    writePermission: "events.write",
    deletePermission: "events.delete",
    auditPrefix: "event",
    titleField: "title",
    required: ["title", "startDate"],
    allowed: [
      "title",
      "slug",
      "arm",
      "type",
      "startDate",
      "endDate",
      "venue",
      "location",
      "mode",
      "registrationUrl",
      "report",
      "description",
      ...SCOPE_FIELDS,
    ],
    publication: true,
  },
  announcements: {
    type: "announcement",
    writePermission: "announcements.write",
    deletePermission: "announcements.delete",
    auditPrefix: "announcement",
    titleField: "title",
    required: ["title", "publishedAt", "body"],
    allowed: [
      "title",
      "slug",
      "arm",
      "category",
      "publishedAt",
      "pinned",
      "link",
      "body",
      ...SCOPE_FIELDS,
    ],
    publication: true,
  },
  news: {
    type: "post",
    writePermission: "news.write",
    deletePermission: "news.delete",
    auditPrefix: "news",
    titleField: "title",
    required: ["title", "publishedAt", "kind"],
    allowed: [
      "title",
      "slug",
      "arm",
      "kind",
      "category",
      "tags",
      "publishedAt",
      "featured",
      "excerpt",
      "link",
      "body",
      ...SCOPE_FIELDS,
    ],
    publication: true,
  },
  publications: {
    type: "prescription",
    writePermission: "publications.write",
    deletePermission: "publications.delete",
    auditPrefix: "publication",
    titleField: "title",
    required: ["title", "issueDate", "kind"],
    // `body` is deliberately absent: the issue is written in Studio, so the
    // dashboard can never flatten its headings, links or inline images.
    allowed: [
      "title",
      "slug",
      "arm",
      "kind",
      "issueNumber",
      "issueDate",
      "author",
      "summary",
      "url",
      "coverImage",
      "coverAlt",
      "file",
      ...SCOPE_FIELDS,
    ],
    assetFields: { coverImage: "image", file: "file" },
    altFields: { coverImage: "coverAlt" },
    publication: true,
  },
  outreaches: {
    type: "outreach",
    writePermission: "outreaches.write",
    deletePermission: "outreaches.delete",
    auditPrefix: "outreach",
    titleField: "title",
    required: ["title"],
    allowed: [
      "title",
      "slug",
      "arm",
      "status",
      "startsAt",
      "endsAt",
      "location",
      "partner",
      "contact",
      "goal",
      "summary",
      "body",
      "registrationUrl",
      "report",
      ...SCOPE_FIELDS,
    ],
    publication: true,
  },
  pages: {
    type: "page",
    writePermission: "pages.write",
    deletePermission: "pages.delete",
    auditPrefix: "page",
    titleField: "title",
    required: ["title"],
    allowed: [
      "title",
      "slug",
      "arm",
      "section",
      "summary",
      "body",
      "seoTitle",
      "seoDescription",
      ...SCOPE_FIELDS,
    ],
    publication: true,
  },
};

export class ContentInputError extends Error {
  readonly reason: string;

  constructor(reason: string) {
    super(reason);
    this.name = "ContentInputError";
    this.reason = reason;
  }
}

export function parseModuleConfig(value: unknown): ModuleMutationConfig | null {
  if (typeof value === "string" && value in MODULE_MUTATIONS) {
    return MODULE_MUTATIONS[value as ContentModuleKey];
  }
  return null;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_FIELD_CHARS = 50_000;
const MAX_STRING_CHARS = 100_000;
const MAX_LIST_ITEMS = 50;

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function assertSlug(value: string): string {
  const slug = value.trim().toLowerCase();
  if (!SLUG_PATTERN.test(slug) || slug.length > 120) {
    throw new ContentInputError("invalid_input");
  }
  return slug;
}

export function normalizeArm(value: unknown): ArmKey | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "string" && (ARM_KEYS as readonly string[]).includes(value)) {
    return value as ArmKey;
  }
  throw new ContentInputError("invalid_input");
}

function assertScalar(value: unknown): void {
  if (typeof value === "string" && value.length > MAX_STRING_CHARS) {
    throw new ContentInputError("invalid_input");
  }
  if (typeof value === "number" && !Number.isFinite(value)) {
    throw new ContentInputError("invalid_input");
  }
}

function assertValueShape(value: unknown): void {
  if (value === null) return;
  if (typeof value === "string" || typeof value === "boolean" || typeof value === "number") {
    assertScalar(value);
    return;
  }
  if (Array.isArray(value)) {
    if (value.length > MAX_FIELD_CHARS) throw new ContentInputError("invalid_input");
    const allStrings = value.every((entry) => typeof entry === "string");
    const allObjects = value.every(
      (entry) => entry !== null && typeof entry === "object" && !Array.isArray(entry),
    );
    if (!allStrings && !allObjects) throw new ContentInputError("invalid_input");
    if (allStrings && value.some((entry) => (entry as string).length > MAX_STRING_CHARS)) {
      throw new ContentInputError("invalid_input");
    }
    return;
  }
  throw new ContentInputError("invalid_input");
}

/**
 * Checks one row of a nested object against its column whitelist: unknown keys
 * are rejected rather than silently dropped, and every column is present so a
 * patched value always replaces the stored object in full.
 */
function normalizeStructRow(value: unknown, keys: readonly string[]): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ContentInputError("invalid_input");
  }
  const input = value as Record<string, unknown>;
  const output: Record<string, string> = {};
  for (const key of Object.keys(input)) {
    if (!keys.includes(key)) throw new ContentInputError("invalid_input");
    const entry = input[key];
    if (entry === null || entry === undefined || entry === "") {
      output[key] = "";
      continue;
    }
    if (typeof entry !== "string" || entry.length > MAX_STRING_CHARS) {
      throw new ContentInputError("invalid_input");
    }
    output[key] = entry;
  }
  for (const key of keys) {
    if (!(key in output)) output[key] = "";
  }
  return output;
}

/** `null`/empty clears the field; anything malformed is rejected. */
function normalizeStructObject(
  value: unknown,
  keys: readonly string[],
): Record<string, string> | null {
  if (value === null || value === undefined || value === "") return null;
  return normalizeStructRow(value, keys);
}

function normalizeStructArray(
  value: unknown,
  keys: readonly string[],
): Array<Record<string, string>> {
  if (value === null || value === undefined || value === "") return [];
  if (!Array.isArray(value) || value.length > MAX_LIST_ITEMS) {
    throw new ContentInputError("invalid_input");
  }
  return value.map((entry) => normalizeStructRow(entry, keys));
}

/**
 * Validates an untrusted field map against the module allowlist and required
 * fields. Returns a copy containing only allowed keys. Scope arrays come back
 * as normalized string slug arrays; the arm field as an ArmKey or null.
 */
export function validateFields(
  config: ModuleMutationConfig,
  fields: unknown,
  options: { partial: boolean },
): Record<string, unknown> {
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    throw new ContentInputError("invalid_input");
  }
  const input = fields as Record<string, unknown>;
  const output: Record<string, unknown> = {};

  const altFields = config.altFields ?? {};
  const isAltField = (key: string): boolean => Object.values(altFields).includes(key);
  const objectFields = config.objectFields ?? {};
  const arrayFields = config.arrayFields ?? {};

  for (const key of Object.keys(input)) {
    if (!config.allowed.includes(key)) throw new ContentInputError("invalid_input");
    // Scope arrays are slug lists — normalized (non-strings dropped) below.
    if ((SCOPE_FIELDS as readonly string[]).includes(key)) continue;
    // Asset fields accept a bare asset id, validated by `normalizeAssetField`.
    if (config.assetFields && key in config.assetFields) continue;
    // Nested objects and row arrays are checked against their column whitelist.
    if (key in objectFields || key in arrayFields) continue;
    // Alt text is written with its image, after the image resolves.
    if (isAltField(key)) continue;
    assertValueShape(input[key]);
  }

  if (!options.partial) {
    for (const key of config.required) {
      const value = input[key];
      const empty =
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0);
      if (empty) throw new ContentInputError("invalid_input");
    }
  } else {
    for (const key of config.required) {
      if (!(key in input)) continue;
      const value = input[key];
      if (
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0)
      ) {
        throw new ContentInputError("invalid_input");
      }
    }
  }

  for (const key of Object.keys(input)) {
    if (isAltField(key)) continue;
    const value = input[key];
    const assetKind = config.assetFields?.[key];
    if (assetKind) {
      // Alt text rides along with the image so the form needs no nested object.
      const altKey = altFields[key];
      output[key] = normalizeAssetField(value, assetKind, altKey ? input[altKey] : undefined);
      continue;
    }
    if (key in objectFields) {
      output[key] = normalizeStructObject(value, objectFields[key] ?? []);
      continue;
    }
    if (key in arrayFields) {
      output[key] = normalizeStructArray(value, arrayFields[key] ?? []);
      continue;
    }
    if ((ARM_FIELDS as readonly string[]).includes(key)) {
      output[key] = normalizeArm(value);
    } else if ((SCOPE_FIELDS as readonly string[]).includes(key)) {
      output[key] = strArray(value).map((slug) => {
        if (slug.length > 120) throw new ContentInputError("invalid_input");
        return slug;
      });
    } else if (key === "slug") {
      if (value === null || value === "") continue;
      if (typeof value !== "string") throw new ContentInputError("invalid_input");
      output[key] = assertSlug(value);
    } else if (key === "issueNumber") {
      // Issue numbers are whole, positive counts — "65", never "65.5" or "-3".
      if (value === null || value === "") continue;
      const parsed = typeof value === "number" ? value : Number(String(value).trim());
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 10_000) {
        throw new ContentInputError("invalid_input");
      }
      output[key] = parsed;
    } else {
      output[key] = value;
    }
  }

  // Alt text is written with its image, and cleared with it.
  for (const [assetField, altKey] of Object.entries(altFields)) {
    if (!(assetField in input)) continue;
    const alt = typeof input[altKey] === "string" ? (input[altKey] as string).trim() : "";
    output[altKey] = alt || null;
  }

  return output;
}

/** Validates create-time publication — only draft/published are creatable. */
export function validateCreatePublication(value: unknown): ContentPublicationStatus {
  if (value === undefined || value === null || value === "") return "draft";
  if (value === "draft" || value === "published") return value;
  throw new ContentInputError("invalid_input");
}

/** Validates any publication transition, including scheduled → needs publishAt. */
export function validatePublicationTransition(
  publication: unknown,
  publishAt: unknown,
): { publication: ContentPublicationStatus; publishAt: string | null } {
  if (
    typeof publication !== "string" ||
    !(CONTENT_PUBLICATION_STATUSES as readonly string[]).includes(publication)
  ) {
    throw new ContentInputError("invalid_input");
  }
  const status = publication as ContentPublicationStatus;
  if (status === "scheduled") {
    if (typeof publishAt !== "string" || Number.isNaN(Date.parse(publishAt))) {
      throw new ContentInputError("invalid_input");
    }
    return { publication: status, publishAt: new Date(publishAt).toISOString() };
  }
  return { publication: status, publishAt: null };
}

/** Upper bound on a page's sections, mirroring the other list limits. */
export const MAX_PAGE_SECTIONS = 100;

export interface SectionOrderResult {
  sections: Record<string, unknown>[];
  changed: boolean;
}

/**
 * Applies the dashboard's order + visibility list to a page's stored sections.
 * Sections are matched by their Sanity `_key`, so only order and `visible` can
 * change: each section's content is spread from the stored object, and an
 * invented, duplicate, missing or dropped key fails closed as invalid_input.
 */
export function applySectionOrder(storedValue: unknown, incoming: unknown): SectionOrderResult {
  const stored = Array.isArray(storedValue) ? storedValue : [];
  if (!Array.isArray(incoming) || incoming.length > MAX_PAGE_SECTIONS) {
    throw new ContentInputError("invalid_input");
  }
  const byKey = new Map<string, Record<string, unknown>>();
  for (const entry of stored) {
    if (entry === null || typeof entry !== "object" || Array.isArray(entry)) {
      throw new ContentInputError("invalid_input");
    }
    const record = entry as Record<string, unknown>;
    const key = typeof record["_key"] === "string" ? record["_key"] : "";
    if (!key || byKey.has(key)) throw new ContentInputError("invalid_input");
    byKey.set(key, record);
  }
  if (incoming.length !== byKey.size) throw new ContentInputError("invalid_input");

  const seen = new Set<string>();
  const sections: Record<string, unknown>[] = [];
  for (const raw of incoming) {
    if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
      throw new ContentInputError("invalid_input");
    }
    const entry = raw as Record<string, unknown>;
    const key = typeof entry["key"] === "string" ? entry["key"] : "";
    const visible = entry["visible"];
    if (!key || typeof visible !== "boolean" || seen.has(key)) {
      throw new ContentInputError("invalid_input");
    }
    const source = byKey.get(key);
    if (!source) throw new ContentInputError("invalid_input");
    seen.add(key);
    sections.push({ ...source, visible });
  }

  const wasVisible = (record: Record<string, unknown>) => record["visible"] !== false;
  let changed = stored.length !== sections.length;
  for (let index = 0; !changed && index < stored.length; index += 1) {
    const previous = stored[index] as Record<string, unknown> | undefined;
    const next = sections[index];
    changed =
      !previous ||
      !next ||
      previous["_key"] !== next["_key"] ||
      wasVisible(previous) !== wasVisible(next);
  }
  return { sections, changed };
}

/** Normalizes the untrusted create/update scope input. */
export function normalizeScopeInput(raw: unknown): {
  arm: ArmKey | null;
  regions: string[];
  zones: string[];
  chapters: string[];
} {
  if (raw === null || raw === undefined) {
    return { arm: null, regions: [], zones: [], chapters: [] };
  }
  if (typeof raw !== "object" || Array.isArray(raw)) throw new ContentInputError("invalid_input");
  const record = raw as Record<string, unknown>;
  return {
    arm: normalizeArm(record["arm"] ?? null),
    regions: strArray(record["regions"]),
    zones: strArray(record["zones"]),
    chapters: strArray(record["chapters"]),
  };
}

/**
 * Builds the effective scope meta for a create: arm defaults to "global"
 * (mirroring the schema's initialValue), scope arrays are slug lists.
 */
export function effectiveCreateScope(
  scopeInput: ContentScopeInput,
  fields: Record<string, unknown>,
): ContentScopeMeta {
  const arm =
    normalizeArm(scopeInput.arm ?? null) ??
    normalizeArm("arm" in fields ? fields["arm"] : null) ??
    "global";
  return {
    arm,
    regions: strArray(scopeInput.regions),
    zones: strArray(scopeInput.zones),
    chapters: strArray(scopeInput.chapters),
  };
}
