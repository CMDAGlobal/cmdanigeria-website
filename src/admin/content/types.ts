export type ContentModuleKey =
  | "chapters"
  | "regions"
  | "events"
  | "news"
  | "publications"
  | "announcements"
  | "outreaches"
  | "pages";

export type StatusTone = "default" | "secondary" | "outline" | "destructive";

export interface ContentStatus {
  label: string;
  tone: StatusTone;
}

export interface ContentScopeMeta {
  arm: string | null;
  regions: string[];
  zones: string[];
  chapters: string[];
}

export interface ContentItem {
  id: string;
  title: string;
  slug: string | null;
  arm: string | null;
  subtitle: string | null;
  date: string | null;
  status: ContentStatus | null;
  /** Secondary signal (pinned/featured/campaign state) used by stats. */
  detail?: string | null;
  /** Document kind where the type has one (news). */
  kind?: string | null;
  draft: boolean;
  scope: ContentScopeMeta;
}

export interface ContentStat {
  label: string;
  value: number;
  hint?: string;
}

export interface ContentModulePayload {
  module: ContentModuleKey;
  configured: boolean;
  total: number;
  stats: ContentStat[];
  items: ContentItem[];
}

export interface MediaAsset {
  id: string;
  url: string;
  alt: string | null;
  caption: string | null;
  owner: string;
  ownerId: string;
  ownerType: string;
  field: string;
}

export interface MediaPayload {
  configured: boolean;
  total: number;
  stats: ContentStat[];
  assets: MediaAsset[];
}

export interface SettingsPayload {
  sanity: {
    configured: boolean;
    projectId: string | null;
    dataset: string | null;
    apiVersion: string | null;
  };
  governance: {
    rolesCount: number;
    permissionsCount: number;
    usersCount: number;
  };
  documentCounts: { type: string; label: string; count: number }[];
}

export interface ScopeGrant {
  arm?: string;
  regionSlug?: string;
  chapterSlug?: string;
}

/** Untrusted wire shape for content mutations — normalized server-side. */
export interface ContentScopeInput {
  arm?: string | null;
  regions?: string[];
  zones?: string[];
  chapters?: string[];
}

export interface CreateContentInput {
  module: string;
  fields: Record<string, unknown>;
  scope: ContentScopeInput;
  publication?: string;
}

export interface UpdateContentInput {
  module: string;
  id: string;
  fields: Record<string, unknown>;
}

export interface ContentDocInput {
  module: string;
  id: string;
}

export interface SetPublicationInput {
  module: string;
  id: string;
  publication: string;
  publishAt?: string | null;
}

export interface ContentMutationResult {
  ok: boolean;
  error?: string;
  id?: string;
}

/** One row of a page's `sections` array as the dashboard needs to show it. */
export interface PageSectionRow {
  key: string;
  type: string;
  label: string;
  visible: boolean;
}

export interface PageSectionsPayload {
  ok: boolean;
  sections: PageSectionRow[];
  error?: string;
}

/** Wire shape for reordering/hiding: match a stored section by its `_key`. */
export interface PageSectionOrder {
  key: string;
  visible: boolean;
}

export interface SetPageSectionsInput {
  id: string;
  sections: PageSectionOrder[];
}

/** Untrusted wire shape for content mutations — normalized server-side. */
export interface ContentDocPayload {
  ok: boolean;
  error?: string;
  id?: string;
  title: string | null;
  fields: Record<string, unknown>;
  scope: ContentScopeMeta;
  /** Asset field → preview metadata, so the editor can show what is attached. */
  assets?: Record<string, ContentDocAsset>;
}

export interface ContentDocAsset {
  id: string;
  url: string | null;
  name: string | null;
}

export interface AssetListEntry {
  id: string;
  url: string;
  name: string;
  mimeType: string | null;
  size: number | null;
}

export interface AssetListPayload {
  configured: boolean;
  kind: "image" | "file";
  assets: AssetListEntry[];
}

export interface UploadAssetInput {
  module: string;
  kind: "image" | "file";
  filename: string;
  contentType: string;
  /** Raw file bytes, base64-encoded by the browser. */
  base64: string;
}

export interface UploadAssetResult {
  ok: boolean;
  error?: string;
  id?: string;
  url?: string | null;
  kind?: "image" | "file";
  name?: string;
}

export interface ScopeUnitOptionPayload {
  slug: string;
  title: string;
  arm?: string;
}

export interface ContentScopeOptionsPayload {
  ok: boolean;
  error?: string;
  arms: string[];
  chapters: ScopeUnitOptionPayload[];
  zones: ScopeUnitOptionPayload[];
  regions: ScopeUnitOptionPayload[];
}

export function emptyScopeOptions(): ContentScopeOptionsPayload {
  return { ok: false, arms: [], chapters: [], zones: [], regions: [] };
}

export function emptyScopeMeta(): ContentScopeMeta {
  return { arm: null, regions: [], zones: [], chapters: [] };
}
