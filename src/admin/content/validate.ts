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
      "membership",
    ],
    // Chapters are organisation units — their visibility is their publication.
    publication: false,
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

  for (const key of Object.keys(input)) {
    if (!config.allowed.includes(key)) throw new ContentInputError("invalid_input");
    // Scope arrays are slug lists — normalized (non-strings dropped) below.
    if ((SCOPE_FIELDS as readonly string[]).includes(key)) continue;
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
    const value = input[key];
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
    } else {
      output[key] = value;
    }
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
