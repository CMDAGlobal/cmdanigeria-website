import { isSystemScope, scopeContains, type Actor } from "../rbac/engine";
import { isArmKey, type Scope } from "../rbac/roles";

/**
 * Scope tag stored on an asset document (`cmdaScope`) at upload time. Assets
 * uploaded before the gate existed have no tag and are treated as legacy
 * global media: visible to everyone who can read media, but only system-scope
 * actors may replace or delete them.
 */
export interface AssetScopeTag {
  arm?: string;
  regionSlug?: string;
  chapterSlug?: string;
}

/**
 * Narrowest scope shared by every role assignment — the truthful tag for an
 * upload. A system-wide role tags the asset as global; roles that disagree on
 * a dimension drop that dimension (wider tag), never invent a narrower one.
 */
export function assetUploadScope(scopes: Scope[]): AssetScopeTag {
  if (scopes.length === 0) return {};
  if (scopes.some((scope) => isSystemScope(scope))) return {};

  const first = scopes[0] as Scope;
  const tag: AssetScopeTag = {};
  if (first.arm !== undefined && scopes.every((scope) => scope.arm === first.arm)) {
    tag.arm = first.arm;
  }
  if (
    first.regionSlug !== undefined &&
    scopes.every((scope) => scope.regionSlug === first.regionSlug)
  ) {
    tag.regionSlug = first.regionSlug;
  }
  if (
    first.chapterSlug !== undefined &&
    scopes.every((scope) => scope.chapterSlug === first.chapterSlug)
  ) {
    tag.chapterSlug = first.chapterSlug;
  }
  return tag;
}

/** True when the tag carries no dimension — a global (or legacy) asset. */
export function isGlobalAssetTag(tag: AssetScopeTag | null | undefined): boolean {
  return !tag || (!tag.arm && !tag.regionSlug && !tag.chapterSlug);
}

function tagAsScope(tag: AssetScopeTag): Scope {
  const scope: Scope = {};
  if (tag.arm && isArmKey(tag.arm)) scope.arm = tag.arm;
  if (tag.regionSlug) scope.regionSlug = tag.regionSlug;
  if (tag.chapterSlug) scope.chapterSlug = tag.chapterSlug;
  return scope;
}

/**
 * Access overlap: every dimension where the tag and the role scope are both
 * set must agree. A chapter admin therefore sees their chapter's assets, the
 * arm-wide assets of their arm, and global media — but never a sibling
 * chapter's or another arm's media.
 */
function scopesOverlap(roleScope: Scope, tag: AssetScopeTag): boolean {
  if (roleScope.arm !== undefined && tag.arm !== undefined && roleScope.arm !== tag.arm) {
    return false;
  }
  if (
    roleScope.regionSlug !== undefined &&
    tag.regionSlug !== undefined &&
    roleScope.regionSlug !== tag.regionSlug
  ) {
    return false;
  }
  if (
    roleScope.chapterSlug !== undefined &&
    tag.chapterSlug !== undefined &&
    roleScope.chapterSlug !== tag.chapterSlug
  ) {
    return false;
  }
  return true;
}

/**
 * Listing visibility: system actors see everything; global/untagged assets
 * are visible to every media reader; scoped assets to any actor whose role
 * scopes overlap the tag (so a chapter sees its arm's shared media).
 */
export function canAccessAsset(actor: Actor, tag: AssetScopeTag | null | undefined): boolean {
  if (actor.roles.some((pair) => isSystemScope(pair.scope))) return true;
  if (isGlobalAssetTag(tag)) return true;
  return actor.roles.some((pair) => scopesOverlap(pair.scope, tag as AssetScopeTag));
}

/**
 * Replace/delete gate: system actors only for global/untagged (legacy)
 * assets, so a chapter admin cannot swap or remove shared org media. Scoped
 * assets are mutable by actors whose roles cover the tag.
 */
export function canMutateAsset(actor: Actor, tag: AssetScopeTag | null | undefined): boolean {
  if (actor.roles.some((pair) => isSystemScope(pair.scope))) return true;
  if (isGlobalAssetTag(tag)) return false;
  const scope = tagAsScope(tag as AssetScopeTag);
  return actor.roles.some((pair) => scopeContains(pair.scope, scope));
}
