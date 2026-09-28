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

export function buildScopeMeta(input: {
  arm?: unknown;
  regions?: unknown;
  zones?: unknown;
  chapters?: unknown;
}): ContentScopeMeta {
  return {
    arm: typeof input.arm === "string" && input.arm.length > 0 ? input.arm : null,
    regions: strArray(input.regions),
    zones: strArray(input.zones),
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
  // Arm gate: a scoped grant only sees its own arm. Regions (Global Network)
  // and zones (Students/Doctors) are disjoint hierarchies, so neither ever
  // crosses into the other arm's grants.
  if (grant.arm && meta.arm && meta.arm !== grant.arm) return false;

  // "Untargeted" means the document belongs to the arm as a whole rather than
  // to some specific unit inside it.
  const untargeted =
    meta.chapters.length === 0 && meta.zones.length === 0 && meta.regions.length === 0;

  if (grant.chapterSlug) {
    if (meta.chapters.includes(grant.chapterSlug)) return true;
    // Arm-wide content is visible to every chapter in that arm. Content scoped
    // to another unit fails closed: a chapter admin must not reach another
    // chapter, a zone, or a region by any path.
    return untargeted;
  }

  if (grant.regionSlug) {
    if (meta.regions.includes(grant.regionSlug)) return true;
    return untargeted;
  }

  // Arm-only grant: the arm gate above already did the work.
  return true;
}

export function visibleToGrants(meta: ContentScopeMeta, grants: ScopeGrant[]): boolean {
  if (!grants.length) return false;
  return grants.some((grant) => isSystemGrant(grant) || grantSees(meta, grant));
}
