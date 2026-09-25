import type { ContentScopeMeta, ScopeGrant } from "./types";

function asArray<T>(value: T | T[] | null | undefined): T[] {
  if (value === null || value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

export function strArray(value: unknown): string[] {
  return asArray(value as string | string[] | null | undefined).filter(
    (entry): entry is string => typeof entry === "string" && entry.length > 0,
  );
}

export function zoneRefs(value: unknown): ContentScopeMeta["zones"] {
  return asArray(value as unknown).flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const record = entry as { slug?: unknown; region?: unknown };
    return [
      {
        slug: typeof record.slug === "string" ? record.slug : null,
        region: typeof record.region === "string" ? record.region : null,
      },
    ];
  });
}

export function buildScopeMeta(input: {
  arm?: unknown;
  regions?: unknown;
  zones?: unknown;
  chapters?: unknown;
}): ContentScopeMeta {
  return {
    arm: typeof input.arm === "string" && input.arm.length > 0 ? input.arm : null,
    regions: strArray(input.regions),
    zones: zoneRefs(input.zones),
    chapters: strArray(input.chapters),
  };
}

export function grantsFromRoles(
  roles: { scope: { arm?: string; regionSlug?: string; chapterSlug?: string } }[],
): ScopeGrant[] {
  return roles.map((role) => {
    const grant: ScopeGrant = {};
    if (role.scope.arm) grant.arm = role.scope.arm;
    if (role.scope.regionSlug) grant.regionSlug = role.scope.regionSlug;
    if (role.scope.chapterSlug) grant.chapterSlug = role.scope.chapterSlug;
    return grant;
  });
}

export function isSystemGrant(grant: ScopeGrant): boolean {
  return !grant.arm && !grant.regionSlug && !grant.chapterSlug;
}

function grantSees(meta: ContentScopeMeta, grant: ScopeGrant): boolean {
  if (grant.arm && meta.arm && meta.arm !== "global" && meta.arm !== grant.arm) return false;

  const regionSet = new Set(meta.regions);
  for (const zone of meta.zones) {
    if (zone.region) regionSet.add(zone.region);
  }
  const chapterSpecific = meta.chapters.length > 0;
  const zoneSpecific = meta.zones.length > 0;

  if (grant.chapterSlug) {
    if (chapterSpecific && !meta.chapters.includes(grant.chapterSlug)) return false;
    if (zoneSpecific && !meta.chapters.includes(grant.chapterSlug)) {
      const zoneInRegion = meta.zones.some(
        (zone) => !zone.region || zone.region === grant.regionSlug,
      );
      if (!zoneInRegion) return false;
    }
    if (!zoneSpecific && !chapterSpecific && regionSet.size > 0) {
      if (grant.regionSlug && !regionSet.has(grant.regionSlug)) return false;
    }
    return true;
  }

  if (grant.regionSlug) {
    if (chapterSpecific) return false;
    if (regionSet.size > 0 && !regionSet.has(grant.regionSlug)) return false;
    return true;
  }

  return true;
}

export function visibleToGrants(meta: ContentScopeMeta, grants: ScopeGrant[]): boolean {
  if (!grants.length) return false;
  return grants.some((grant) => isSystemGrant(grant) || grantSees(meta, grant));
}
