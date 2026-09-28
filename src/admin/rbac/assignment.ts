import {
  AuthorizationError,
  isSystemScope,
  scopeContains,
  type Actor,
  type AuthorizationContext,
} from "./engine.ts";
import { ROLE_KEYS, ROLE_RANK, validateScopeForRole, type RoleKey, type Scope } from "./roles.ts";

function bestRank(actor: Actor): number {
  let rank = 0;
  for (const pair of actor.roles) {
    rank = Math.max(rank, ROLE_RANK[pair.roleKey]);
  }
  return rank;
}

/**
 * Role keys this actor may grant at *some* scope. Used to populate the
 * role picker; the authoritative check is `canAssignRole` per grant.
 */
export function assignableRoleKeys(actor: Actor): RoleKey[] {
  const top = bestRank(actor);
  return ROLE_KEYS.filter((key) => {
    if (ROLE_RANK[key] < top) return true;
    return actor.roles.some((pair) => pair.roleKey === key);
  });
}

/**
 * Whether the actor may grant `roleKey` at `scope`:
 *  1. the scope must sit inside one of the actor's own grants, and
 *  2. strictly-more-privileged roles are blocked, unless the actor already
 *     holds that exact role at a covering scope (a super admin can mint
 *     super admins; an arm admin cannot).
 */
export function canAssignRole(actor: Actor, roleKey: RoleKey, scope: Scope): boolean {
  const inScope = actor.roles.some((pair) => scopeContains(pair.scope, scope));
  if (!inScope) return false;
  if (ROLE_RANK[roleKey] < bestRank(actor)) return true;
  return actor.roles.some((pair) => pair.roleKey === roleKey && scopeContains(pair.scope, scope));
}

export function assertCanAssignRole(actor: Actor, roleKey: RoleKey, scope: Scope): void {
  if (canAssignRole(actor, roleKey, scope)) return;
  const inScope = actor.roles.some((pair) => scopeContains(pair.scope, scope));
  throw new AuthorizationError(inScope ? "role_assignment_denied" : "scope_outside_role", {
    actorUserId: actor.userId,
    permission: "users.assign_roles",
    scope,
    roleKey,
  });
}

/**
 * Structural validation plus existence-independent shape rules for a grant.
 * Throws `AuthorizationError("invalid_scope")` when the scope shape does not
 * match what the role requires (e.g. a chapter admin without a chapter).
 */
export function assertValidScopeForRole(actor: Actor, roleKey: RoleKey, scope: Scope): void {
  const result = validateScopeForRole(roleKey, scope);
  if (result.ok) return;
  throw new AuthorizationError("invalid_scope", {
    actorUserId: actor.userId,
    permission: "users.assign_roles",
    scope,
    roleKey,
    reason: result.reason,
  });
}

/**
 * A mutation targets an existing user only when every one of that user's
 * current grants sits inside the actor's own grants. Users with no grants at
 * all are only reachable by system-wide actors (they are invisible to scoped
 * lists as well).
 */
export function assertTargetInScope(actor: Actor, targetGrants: Scope[]): void {
  if (actor.roles.some((pair) => isSystemScope(pair.scope))) return;
  const denied: AuthorizationContext = {
    actorUserId: actor.userId,
    permission: "users.write",
    scope: targetGrants[0],
  };
  if (!targetGrants.length) throw new AuthorizationError("scope_outside_role", denied);
  for (const grant of targetGrants) {
    if (!actor.roles.some((pair) => scopeContains(pair.scope, grant))) {
      throw new AuthorizationError("scope_outside_role", { ...denied, scope: grant });
    }
  }
}
