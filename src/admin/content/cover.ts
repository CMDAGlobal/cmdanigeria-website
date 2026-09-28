import { ARM_KEYS, type ArmKey, type Scope } from "../rbac/roles";
import type { Actor } from "../rbac/engine";
import { isSystemGrant } from "./scope";
import type { ContentScopeMeta, ScopeGrant } from "./types";

/**
 * Organisation-unit lookup used to decide whether a write is allowed:
 * slug → arm for chapters and zones, plus the set of known region slugs.
 * Unknown units fail closed.
 */
export interface CoverOrg {
  chapterArms: Map<string, string>;
  zoneArms: Map<string, string>;
  regionSlugs: Set<string>;
}

export const EMPTY_COVER_ORG: CoverOrg = {
  chapterArms: new Map(),
  zoneArms: new Map(),
  regionSlugs: new Set(),
};

/**
 * Whether `grant` may mutate a document with this scope.
 *
 * Stricter than the read gate (`visibleToGrants`): reads let a chapter admin
 * see arm-wide content, but writes are fail-closed —
 * - the document's arm must equal the grant's arm (null arm ⇒ system only),
 * - a chapter grant may only touch a document tagged to exactly its chapter,
 * - a region grant may only touch a document tagged to exactly its region,
 * - every unit tag must exist and live inside the grant's arm,
 * - `selfSlug` exempts a document's own slug from org lookup (used while
 *   creating it, before it exists in the organisation index).
 */
export function grantCoversDoc(
  grant: ScopeGrant,
  doc: ContentScopeMeta,
  org: CoverOrg,
  selfSlug?: string,
): boolean {
  if (isSystemGrant(grant)) return true;

  if (grant.arm) {
    if (doc.arm !== grant.arm) return false;
    // Region tags only ever appear on Global Network content.
    if (doc.regions.length > 0 && grant.arm !== "global") return false;
    if (doc.regions.some((slug) => !org.regionSlugs.has(slug))) return false;
    if (doc.zones.some((slug) => org.zoneArms.get(slug) !== grant.arm)) return false;
    if (doc.chapters.some((slug) => slug !== selfSlug && org.chapterArms.get(slug) !== grant.arm)) {
      return false;
    }
  }

  if (grant.chapterSlug) {
    return (
      doc.regions.length === 0 &&
      doc.zones.length === 0 &&
      doc.chapters.length === 1 &&
      doc.chapters[0] === grant.chapterSlug
    );
  }

  if (grant.regionSlug) {
    return (
      doc.chapters.length === 0 &&
      doc.zones.length === 0 &&
      doc.regions.length === 1 &&
      doc.regions[0] === grant.regionSlug
    );
  }

  return true;
}

/** True when at least one of the actor's grants covers the document. */
export function actorCoversDoc(
  actor: Actor,
  doc: ContentScopeMeta,
  org: CoverOrg,
  selfSlug?: string,
): boolean {
  return actor.roles.some((pair) => grantCoversDoc(pair.scope, doc, org, selfSlug));
}

/**
 * The narrowest RBAC scope describing a document — passed to `authorizeActor`
 * so the scope-containment rules run against the document's own targeting.
 * Documents with no arm (legacy data) derive the system scope and are
 * therefore reserved for system-wide grants.
 */
export function deriveWriteScope(doc: ContentScopeMeta): Scope {
  const scope: Scope = {};
  if (doc.arm && (ARM_KEYS as readonly string[]).includes(doc.arm)) {
    scope.arm = doc.arm as ArmKey;
  } else if (doc.arm) {
    // Unknown arm value: only a system-wide grant can act on it.
    return {};
  }
  if (doc.chapters.length === 1 && doc.regions.length === 0 && doc.zones.length === 0) {
    const chapter = doc.chapters[0];
    if (chapter) scope.chapterSlug = chapter;
  } else if (doc.regions.length === 1 && doc.chapters.length === 0 && doc.zones.length === 0) {
    const region = doc.regions[0];
    if (region) scope.regionSlug = region;
  }
  return scope;
}
