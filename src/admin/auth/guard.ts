import { AuthorizationError, authorize, type Actor } from "../rbac/engine";
import type { PermissionKey } from "../rbac/permissions";
import type { Scope } from "../rbac/roles";
import { recordAudit } from "../audit/record";
import type { CurrentActorResult } from "./actions";

export interface AuthorizedSession {
  user: CurrentActorResult["user"];
  actor: Actor;
  permissions: CurrentActorResult["permissions"];
}

/**
 * Server-side gate for every admin mutation:
 * 1. resolve the current session,
 * 2. fail if there is no logged-in user,
 * 3. `authorize` the requested permission against the actor + scope,
 * 4. record a `denied` audit entry when authorization fails.
 *
 * Call this inside each mutation's handler (never trust the client).
 */
export async function authorizeActor(
  permission: PermissionKey,
  scope?: Scope,
): Promise<AuthorizedSession> {
  const { getCurrentActor } = await import("./actions");
  const session = await getCurrentActor();
  if (!session) {
    throw new AuthorizationError("auth_required", {
      actorUserId: undefined,
      permission,
      scope,
    });
  }
  try {
    authorize(session.actor, permission, scope);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      await recordAudit({
        actorUserId: session.user.id,
        action: "authorization.denied",
        targetType: "permission",
        targetId: permission,
        scope: scope ?? null,
        outcome: "denied",
        reason: error.reason,
      });
    }
    throw error;
  }
  return {
    user: session.user,
    actor: session.actor,
    permissions: session.permissions,
  };
}

export function isAuthorizationError(error: unknown): error is AuthorizationError {
  return error instanceof AuthorizationError;
}
