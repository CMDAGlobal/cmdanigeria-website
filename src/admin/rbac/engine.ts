import type { PermissionKey } from "./permissions.ts";
import { PERMISSION_KEYS } from "./permissions.ts";
import { ROLE_DEFINITIONS, type RoleKey, type Scope } from "./roles.ts";

export interface RoleScopePair {
  roleKey: RoleKey;
  scope: Scope;
}

export interface Actor {
  userId: string;
  roles: RoleScopePair[];
}

export interface AuthorizationContext {
  actorUserId?: string | undefined;
  permission: PermissionKey;
  scope?: Scope | undefined;
  [key: string]: unknown;
}

export class AuthorizationError extends Error {
  readonly reason: string;
  readonly ctx: AuthorizationContext;

  constructor(reason: string, ctx: AuthorizationContext) {
    super(reason);
    this.name = "AuthorizationError";
    this.reason = reason;
    this.ctx = ctx;
  }
}

/**
 * True when `outer`'s scope contains `inner` — every dimension set on `outer`
 * must equal that dimension of `inner`. A system scope (nothing set) contains
 * everything; an arm scope contains any region/chapter inside that arm.
 */
export function scopeContains(outer: Scope, inner: Scope): boolean {
  if (outer.arm !== undefined && outer.arm !== inner.arm) return false;
  if (outer.regionSlug !== undefined && outer.regionSlug !== inner.regionSlug) {
    return false;
  }
  if (outer.chapterSlug !== undefined && outer.chapterSlug !== inner.chapterSlug) {
    return false;
  }
  return true;
}

export function grantsPermission(roleKey: RoleKey, permission: PermissionKey): boolean {
  return ROLE_DEFINITIONS[roleKey].permissions.includes(permission);
}

/**
 * The set of permissions granted by at least one of the actor's roles,
 * regardless of scope. Scope is enforced separately via `can`/`authorize`.
 */
export function effectivePermissions(roles: RoleScopePair[]): PermissionKey[] {
  const granted = new Set<PermissionKey>();
  for (const pair of roles) {
    for (const permission of ROLE_DEFINITIONS[pair.roleKey].permissions) {
      granted.add(permission);
    }
  }
  return PERMISSION_KEYS.filter((permission) => granted.has(permission));
}

export function isSystemScope(scope: Scope): boolean {
  return (
    scope.arm === undefined && scope.regionSlug === undefined && scope.chapterSlug === undefined
  );
}

/**
 * `true` when the actor holds `permission` and (if a scope is supplied) at
 * least one of their role assignments covers that scope. A scope-less check
 * is a system-wide operation and therefore only succeeds for roles whose
 * assignment scope is system-wide (e.g. Super Admin).
 */
export function can(actor: Actor, permission: PermissionKey, scope?: Scope): boolean {
  for (const pair of actor.roles) {
    if (!grantsPermission(pair.roleKey, permission)) continue;
    if (scope === undefined) {
      if (isSystemScope(pair.scope)) return true;
      continue;
    }
    if (scopeContains(pair.scope, scope)) return true;
  }
  return false;
}

/**
 * Whether any of the actor's roles grants `permission`, ignoring scope.
 * Used to distinguish "permission not granted" from "granted but out of scope".
 */
export function hasAnyGrant(actor: Actor, permission: PermissionKey): boolean {
  return actor.roles.some((pair) => grantsPermission(pair.roleKey, permission));
}

/**
 * Same as `can` but throws an `AuthorizationError` when denied, so server
 * functions fail loudly and the audit log can record the attempt.
 */
export function authorize(actor: Actor, permission: PermissionKey, scope?: Scope): void {
  if (can(actor, permission, scope)) return;
  const reason = hasAnyGrant(actor, permission) ? "scope_outside_role" : "permission_not_granted";
  throw new AuthorizationError(reason, {
    actorUserId: actor.userId,
    permission,
    scope,
  });
}
