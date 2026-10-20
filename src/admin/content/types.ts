export type ContentModuleKey =
  | "chapters"
  | "regions"
  | "events"
  | "news"
  | "publications"
  | "announcements"
  | "outreaches"
  | "pages"
  | "leadership";

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
  /** Scheduled go-live time, when the item has one. */
  publishAt?: string | null;
  /** Last recorded "send" time (publications only — record-only stub). */
  lastSentAt?: string | null;
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

export interface DashboardContentStats {
  pages: { total: number; published: number; draft: number } | null;
  events: { upcoming: number; past: number; draft: number } | null;
  studentChapters: number | null;
  doctorChapters: number | null;
  regions: number | null;
  posts: number | null;
  newsletters: number | null;
  mediaFiles: number | null;
}

export interface DashboardUserStats {
  total: number | null;
  chapterAdmins: number | null;
  regionAdmins: number | null;
  armAdmins: number | null;
  superAdmins: number | null;
}

export interface DashboardStatsPayload {
  configured: boolean;
  content: DashboardContentStats;
  users: DashboardUserStats;
  rolesCount: number;
  auditTodayCount: number | null;
}

export interface MyChapterStat {
  label: string;
  value: string;
}

export interface MyChapterContact {
  email: string | null;
  phone: string | null;
  address: string | null;
}

export interface MyChapterSocial {
  instagram: string | null;
  x: string | null;
  facebook: string | null;
  whatsapp: string | null;
}

export interface MyChapterCounts {
  leaders: number;
  events: number;
  news: number;
  announcements: number;
  gallery: number;
  resources: number;
}

export interface MyChapterPayload {
  ok: boolean;
  id: string | null;
  slug: string | null;
  name: string | null;
  arm: string | null;
  institution: string | null;
  location: string | null;
  country: string | null;
  mission: string | null;
  hasDescription: boolean;
  hasHistory: boolean;
  hasLogo: boolean;
  logoUrl: string | null;
  membership: MyChapterStat[];
  contactInfo: MyChapterContact | null;
  socialLinks: MyChapterSocial | null;
  counts: MyChapterCounts;
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
  /** Required when creating a new section (not already stored). */
  type?: string;
  /**
   * Partial or full field map for the section (eyebrow, heading, body text,
   * type-specific fields). Omitted entries keep their stored content.
   */
  fields?: Record<string, unknown>;
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
  createdAt: string | null;
  kind: "image" | "file";
}

export interface AssetListPayload {
  configured: boolean;
  kind: "image" | "file" | "all";
  assets: AssetListEntry[];
  total: number;
}

export interface LibraryAssetsInput {
  kind?: "image" | "file" | "all";
  search?: string;
}

export interface UploadAssetInput {
  /** Target module; omit for library-level uploads (still requires media.write). */
  module?: string;
  kind: "image" | "file";
  filename: string;
  contentType: string;
  /** Raw file bytes, base64-encoded by the browser. */
  base64: string;
}

export interface ReplaceAssetInput {
  id: string;
  kind: "image" | "file";
  filename: string;
  contentType: string;
  base64: string;
}

export interface DeleteAssetInput {
  id: string;
}

export interface AssetMutationResult {
  ok: boolean;
  error?: string;
  id?: string;
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
