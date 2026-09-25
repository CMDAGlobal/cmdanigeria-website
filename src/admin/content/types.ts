export type ContentModuleKey =
  "chapters" | "events" | "news" | "announcements" | "outreaches" | "pages";

export type StatusTone = "default" | "secondary" | "outline" | "destructive";

export interface ContentStatus {
  label: string;
  tone: StatusTone;
}

export interface ContentZoneRef {
  slug: string | null;
  region: string | null;
}

export interface ContentScopeMeta {
  arm: string | null;
  regions: string[];
  zones: ContentZoneRef[];
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

export function emptyScopeMeta(): ContentScopeMeta {
  return { arm: null, regions: [], zones: [], chapters: [] };
}
