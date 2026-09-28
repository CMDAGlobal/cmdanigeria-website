import { getClient } from "@/sanity/client";

export interface OrgChapterOption {
  slug: string;
  name: string;
  arm: string;
}

export interface OrgRegionOption {
  slug: string;
  name: string;
}

export interface OrgOptions {
  chapters: OrgChapterOption[];
  regions: OrgRegionOption[];
}

const ORG_QUERY = `{
  "chapters": *[_type == "chapter" && !(_id in path("drafts.**"))] | order(name asc) {
    "slug": slug.current,
    name,
    arm
  },
  "regions": *[_type == "region" && !(_id in path("drafts.**"))] | order(name asc) {
    "slug": slug.current,
    name
  }
}`;

/**
 * Chapters and regions as organisational units — used to populate scope
 * pickers when granting chapter/region roles and to reject grants that
 * point at units which no longer exist.
 */
export async function getOrgOptions(): Promise<OrgOptions> {
  const client = getClient();
  if (!client) return { chapters: [], regions: [] };
  const raw = (await client.fetch<unknown>(ORG_QUERY)) as {
    chapters?: unknown;
    regions?: unknown;
  } | null;
  return {
    chapters: toChapters(raw?.chapters),
    regions: toRegions(raw?.regions),
  };
}

function toChapters(value: unknown): OrgChapterOption[] {
  if (!Array.isArray(value)) return [];
  const options: OrgChapterOption[] = [];
  for (const row of value) {
    if (!row || typeof row !== "object") continue;
    const record = row as Record<string, unknown>;
    const slug = typeof record["slug"] === "string" ? record["slug"] : "";
    const name = typeof record["name"] === "string" ? record["name"] : "";
    const arm = typeof record["arm"] === "string" ? record["arm"] : "";
    if (slug && name && arm) options.push({ slug, name, arm });
  }
  return options;
}

function toRegions(value: unknown): OrgRegionOption[] {
  if (!Array.isArray(value)) return [];
  const options: OrgRegionOption[] = [];
  for (const row of value) {
    if (!row || typeof row !== "object") continue;
    const record = row as Record<string, unknown>;
    const slug = typeof record["slug"] === "string" ? record["slug"] : "";
    const name = typeof record["name"] === "string" ? record["name"] : "";
    if (slug && name) options.push({ slug, name });
  }
  return options;
}
