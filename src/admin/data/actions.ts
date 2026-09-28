import { query } from "../db/client";
import { getCurrentActor } from "../auth/actions";
import { hashPassword } from "../auth/password";
import { PASSWORD_MIN_LENGTH } from "../auth/constants";
import { recordAudit } from "../audit/record";
import { AuthorizationError, isSystemScope, scopeContains, type Actor } from "../rbac/engine";
import {
  ARM_KEYS,
  ROLE_DEFINITIONS,
  isRoleKey,
  type ArmKey,
  type RoleKey,
  type Scope,
} from "../rbac/roles";
import {
  assertCanAssignRole,
  assertTargetInScope,
  assertValidScopeForRole,
  assignableRoleKeys,
  canAssignRole,
} from "../rbac/assignment";
import { getOrgOptions } from "../content/org";
import type { PermissionKey } from "../rbac/permissions";
import type { CurrentActorResult } from "../auth/actions";

export interface AdminUserItem {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  roles: { key: string; name: string; scope: Scope }[];
}

export interface AuditEntryItem {
  id: string;
  createdAt: string;
  action: string;
  outcome: string;
  actorEmail: string | null;
  actorName: string | null;
  targetType: string | null;
  targetId: string | null;
  scope: Scope | null;
  reason: string | null;
  ipAddress: string | null;
}

export interface OverviewResult {
  usersCount: number | null;
  rolesCount: number;
  permissionsCount: number;
  auditTodayCount: number | null;
  recentAudit: AuditEntryItem[];
  roles: { key: string; name: string; scope: Record<string, string | undefined> }[];
}

interface UserRoleRow {
  user_id: string;
  arm: string | null;
  region_slug: string | null;
  chapter_slug: string | null;
}

interface UserRow {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  created_at: string;
  role_key: string | null;
  role_name: string | null;
  arm: string | null;
  region_slug: string | null;
  chapter_slug: string | null;
}

interface AuditRow {
  id: string;
  created_at: string;
  action: string;
  outcome: string;
  actor_email: string | null;
  actor_name: string | null;
  target_type: string | null;
  target_id: string | null;
  scope_arm: string | null;
  scope_region: string | null;
  scope_chapter: string | null;
  reason: string | null;
  ip_address: string | null;
}

function toScope(arm?: string, regionSlug?: string, chapterSlug?: string): Scope {
  const scope: Scope = {};
  if (arm) scope.arm = arm as ArmKey;
  if (regionSlug) scope.regionSlug = regionSlug;
  if (chapterSlug) scope.chapterSlug = chapterSlug;
  return scope;
}

async function requireActor(): Promise<CurrentActorResult> {
  const session = await getCurrentActor();
  if (!session) {
    throw new AuthorizationError("auth_required", {
      actorUserId: undefined,
      permission: "users.read",
    });
  }
  return session;
}

function assertPermission(session: CurrentActorResult, permission: PermissionKey): void {
  if (!session.permissions.includes(permission)) {
    throw new AuthorizationError("permission_not_granted", {
      actorUserId: session.user.id,
      permission,
    });
  }
}

function scopeContainsInner(actor: Actor, target: Scope): boolean {
  return actor.roles.some((pair) => scopeContains(pair.scope, target));
}

function hasSystemGrant(actor: Actor): boolean {
  return actor.roles.some((pair) => isSystemScope(pair.scope));
}

async function scopedUserRows(actor: Actor): Promise<UserRoleRow[]> {
  if (hasSystemGrant(actor)) {
    const rows = await query<{ user_id: string }>('select id as "user_id" from admin_users');
    return rows.map((row) => ({
      user_id: row.user_id,
      arm: null,
      region_slug: null,
      chapter_slug: null,
    }));
  }
  const rows = await query<UserRoleRow>(
    `select ur.user_id, ur.arm, ur.region_slug, ur.chapter_slug
     from admin_user_roles ur
     order by ur.user_id`,
  );
  return rows.filter((row) =>
    scopeContainsInner(
      actor,
      toScope(row.arm ?? undefined, row.region_slug ?? undefined, row.chapter_slug ?? undefined),
    ),
  );
}

async function scopedUserCount(actor: Actor): Promise<number> {
  const visible = await scopedUserRows(actor);
  return new Set(visible.map((row) => row.user_id)).size;
}

async function todayAuditRows(actor: Actor, limit: number): Promise<AuditRow[]> {
  const raw = await query<AuditRow>(
    `select a.id, a.created_at, a.action, a.outcome,
            u.email as actor_email, u.name as actor_name,
            a.target_type, a.target_id,
            a.scope_arm, a.scope_region, a.scope_chapter,
            a.reason, a.ip_address
     from admin_audit_logs a
     left join admin_users u on u.id = a.actor_user_id
     order by a.created_at desc
     limit $1`,
    [limit * 8],
  );
  return raw.filter((row) => {
    if (hasSystemGrant(actor)) return true;
    return scopeContainsInner(
      actor,
      toScope(
        row.scope_arm ?? undefined,
        row.scope_region ?? undefined,
        row.scope_chapter ?? undefined,
      ),
    );
  });
}

function mapAuditEntry(row: AuditRow): AuditEntryItem {
  return {
    id: row.id,
    createdAt: row.created_at,
    action: row.action,
    outcome: row.outcome,
    actorEmail: row.actor_email,
    actorName: row.actor_name,
    targetType: row.target_type,
    targetId: row.target_id,
    scope:
      row.scope_arm || row.scope_region || row.scope_chapter
        ? toScope(
            row.scope_arm ?? undefined,
            row.scope_region ?? undefined,
            row.scope_chapter ?? undefined,
          )
        : null,
    reason: row.reason,
    ipAddress: row.ip_address,
  };
}

export async function getOverview(): Promise<OverviewResult> {
  const session = await requireActor();
  const canViewAudit = session.permissions.includes("audit_logs.view");
  const canViewUsers = session.permissions.includes("users.read");

  const [roleCountRow] = await query<{ c: number }>("select count(*)::int as c from admin_roles");
  const [permissionCountRow] = await query<{ c: number }>(
    "select count(*)::int as c from admin_permissions",
  );

  const recentAudit = canViewAudit
    ? (await todayAuditRows(session.actor, 6)).slice(0, 6).map(mapAuditEntry)
    : [];
  const auditTodayCount = canViewAudit
    ? ((
        await query<{ c: number }>(
          "select count(*)::int as c from admin_audit_logs where created_at >= date_trunc('day', now())",
        )
      )[0]?.c ?? 0)
    : null;

  return {
    usersCount: canViewUsers ? await scopedUserCount(session.actor) : null,
    rolesCount: roleCountRow?.c ?? 0,
    permissionsCount: permissionCountRow?.c ?? 0,
    auditTodayCount,
    recentAudit,
    roles: session.roles.map((role) => ({ key: role.key, name: role.name, scope: role.scope })),
  };
}

export async function listAdminUsers(): Promise<AdminUserItem[]> {
  const session = await requireActor();
  assertPermission(session, "users.read");

  const rows = await query<UserRow>(
    `select u.id, u.email, u.name, u.is_active, u.created_at,
            r.key as role_key, r.name as role_name,
            ur.arm, ur.region_slug, ur.chapter_slug
     from admin_users u
     left join admin_user_roles ur on ur.user_id = u.id
     left join admin_roles r on r.id = ur.role_id
     order by u.created_at desc`,
  );

  const visibleUserIds = hasSystemGrant(session.actor)
    ? null
    : new Set((await scopedUserRows(session.actor)).map((row) => row.user_id));

  const grouped = new Map<string, AdminUserItem>();
  for (const row of rows) {
    if (visibleUserIds && !visibleUserIds.has(row.id)) continue;
    let item = grouped.get(row.id);
    if (!item) {
      item = {
        id: row.id,
        email: row.email,
        name: row.name,
        isActive: row.is_active,
        createdAt: row.created_at,
        roles: [],
      };
      grouped.set(row.id, item);
    }
    if (row.role_key && row.role_name) {
      item.roles.push({
        key: row.role_key,
        name: row.role_name,
        scope: toScope(
          row.arm ?? undefined,
          row.region_slug ?? undefined,
          row.chapter_slug ?? undefined,
        ),
      });
    }
  }
  return [...grouped.values()];
}

export async function listAuditEntries(limit = 50): Promise<AuditEntryItem[]> {
  const session = await requireActor();
  assertPermission(session, "audit_logs.view");
  const rows = await todayAuditRows(session.actor, limit);
  return rows.slice(0, limit).map(mapAuditEntry);
}

// ---------------------------------------------------------------------------
// User & role mutations — every path is permission-checked, scope-checked and
// written to the audit log (§29: authorization lives on the backend, not the UI).
// ---------------------------------------------------------------------------

export interface MutationResult {
  ok: boolean;
  error?: string;
}

/** Untrusted wire shape — normalized/validated before use. */
export interface ScopeInput {
  arm?: string;
  regionSlug?: string;
  chapterSlug?: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  roleKey: string;
  scope: ScopeInput;
}

export interface RoleScopeInput {
  userId: string;
  roleKey: string;
  scope: ScopeInput;
}

export interface UserManagementOptions {
  assignableRoles: { key: RoleKey; name: string; description: string }[];
  assignableArms: ArmKey[];
  chapters: { slug: string; name: string; arm: string }[];
  regions: { slug: string; name: string }[];
}

const MUTATION_MESSAGES: Record<string, string> = {
  auth_required: "Your session has expired. Please sign in again.",
  permission_not_granted: "You do not have permission to manage administrators.",
  scope_outside_role: "That account is outside your scope.",
  role_assignment_denied: "You are not allowed to grant that role.",
  invalid_scope: "Choose a valid scope for the selected role.",
  invalid_input: "Check the details and try again.",
  weak_password: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
  unknown_role: "That role is not configured. Run the admin migration first.",
  user_not_found: "That administrator account was not found.",
  last_super_admin: "At least one active Super Admin account is required.",
  self_deactivate: "You cannot deactivate your own account.",
};

function messageFor(reason: string): string {
  return MUTATION_MESSAGES[reason] ?? "You are not allowed to perform that action.";
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "23505"
  );
}

async function failMutation(
  session: CurrentActorResult,
  action: string,
  scope: Scope | null,
  targetId: string | null,
  error: unknown,
): Promise<MutationResult> {
  if (error instanceof AuthorizationError) {
    await recordAudit({
      actorUserId: session.user.id,
      action,
      targetType: "admin_user",
      targetId,
      scope,
      outcome: "denied",
      reason: error.reason,
    });
    return { ok: false, error: messageFor(error.reason) };
  }
  console.error(`[admin:users] ${action} failed`, error);
  await recordAudit({
    actorUserId: session.user.id,
    action,
    targetType: "admin_user",
    targetId,
    scope,
    outcome: "error",
    reason: "unexpected_error",
  });
  return { ok: false, error: "Something went wrong. Please try again." };
}

function normalizeScope(input: unknown): Scope {
  const scope: Scope = {};
  if (input && typeof input === "object") {
    const raw = input as Record<string, unknown>;
    if (typeof raw["arm"] === "string" && raw["arm"]) scope.arm = raw["arm"] as ArmKey;
    if (typeof raw["regionSlug"] === "string" && raw["regionSlug"].trim()) {
      scope.regionSlug = raw["regionSlug"].trim();
    }
    if (typeof raw["chapterSlug"] === "string" && raw["chapterSlug"].trim()) {
      scope.chapterSlug = raw["chapterSlug"].trim();
    }
  }
  return scope;
}

function parseRoleKey(value: unknown, actorUserId: string): RoleKey {
  if (typeof value === "string" && isRoleKey(value)) return value;
  throw new AuthorizationError("unknown_role", {
    actorUserId,
    permission: "users.assign_roles",
  });
}

function requireUserId(value: unknown, actorUserId: string): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  throw new AuthorizationError("invalid_input", {
    actorUserId,
    permission: "users.write",
  });
}

/** Reject grants that point at chapters/regions which no longer exist. */
async function assertScopeUnitsExist(scope: Scope): Promise<void> {
  if (!scope.chapterSlug && !scope.regionSlug) return;
  const org = await getOrgOptions();
  if (scope.chapterSlug && !org.chapters.some((chapter) => chapter.slug === scope.chapterSlug)) {
    throw new AuthorizationError("invalid_scope", {
      permission: "users.assign_roles",
      scope,
      reason: "chapter_not_found",
    });
  }
  if (scope.regionSlug && !org.regions.some((region) => region.slug === scope.regionSlug)) {
    throw new AuthorizationError("invalid_scope", {
      permission: "users.assign_roles",
      scope,
      reason: "region_not_found",
    });
  }
}

async function requireRoleRow(roleKey: RoleKey, actorUserId: string): Promise<string> {
  const rows = await query<{ id: string }>("select id from admin_roles where key = $1", [roleKey]);
  const id = rows[0]?.id;
  if (!id) {
    throw new AuthorizationError("unknown_role", {
      actorUserId,
      permission: "users.assign_roles",
    });
  }
  return id;
}

interface TargetInfo {
  grants: Scope[];
}

async function loadTargetGrants(userId: string, actorUserId: string): Promise<TargetInfo> {
  const users = await query<{ id: string }>("select id from admin_users where id = $1", [userId]);
  if (!users[0]) {
    throw new AuthorizationError("user_not_found", {
      actorUserId,
      permission: "users.write",
    });
  }
  const rows = await query<UserRoleRow>(
    `select ur.user_id, ur.arm, ur.region_slug, ur.chapter_slug
     from admin_user_roles ur
     where ur.user_id = $1`,
    [userId],
  );
  return {
    grants: rows.map((row) =>
      toScope(row.arm ?? undefined, row.region_slug ?? undefined, row.chapter_slug ?? undefined),
    ),
  };
}

async function holdsRole(userId: string, roleKey: RoleKey): Promise<boolean> {
  const rows = await query<{ c: number }>(
    `select count(*)::int as c
     from admin_user_roles ur
     join admin_roles r on r.id = ur.role_id
     where ur.user_id = $1 and r.key = $2`,
    [userId, roleKey],
  );
  return (rows[0]?.c ?? 0) > 0;
}

/** Guard against locking everyone out of the last active Super Admin. */
async function assertNotLastSuperAdmin(targetUserId: string, actorUserId: string): Promise<void> {
  const rows = await query<{ c: number }>(
    `select count(distinct u.id)::int as c
     from admin_users u
     join admin_user_roles ur on ur.user_id = u.id
     join admin_roles r on r.id = ur.role_id
     where r.key = 'super_admin' and u.is_active and u.id <> $1`,
    [targetUserId],
  );
  if ((rows[0]?.c ?? 0) === 0) {
    throw new AuthorizationError("last_super_admin", {
      actorUserId,
      permission: "users.write",
    });
  }
}

export async function createAdminUser(input: CreateUserInput): Promise<MutationResult> {
  const session = await requireActor();
  const scope = normalizeScope(input?.scope);
  let targetId: string | null = null;
  try {
    assertPermission(session, "users.write");
    assertPermission(session, "users.assign_roles");
    const roleKey = parseRoleKey(input?.roleKey, session.user.id);
    assertValidScopeForRole(session.actor, roleKey, scope);
    assertCanAssignRole(session.actor, roleKey, scope);
    await assertScopeUnitsExist(scope);

    const name = typeof input?.name === "string" ? input.name.trim() : "";
    const email = typeof input?.email === "string" ? input.email.trim().toLowerCase() : "";
    const password = typeof input?.password === "string" ? input.password : "";
    if (!name || name.length > 255) {
      throw new AuthorizationError("invalid_input", {
        actorUserId: session.user.id,
        permission: "users.write",
      });
    }
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AuthorizationError("invalid_input", {
        actorUserId: session.user.id,
        permission: "users.write",
      });
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      throw new AuthorizationError("weak_password", {
        actorUserId: session.user.id,
        permission: "users.write",
      });
    }

    const passwordHash = await hashPassword(password);
    const roleId = await requireRoleRow(roleKey, session.user.id);
    const rows = await query<{ user_id: string }>(
      `with new_user as (
         insert into admin_users (email, name, password_hash, is_active)
         values ($1, $2, $3, true)
         returning id
       )
       insert into admin_user_roles (user_id, role_id, arm, region_slug, chapter_slug)
       select u.id, $4, $5, $6, $7
       from new_user u
       returning user_id as "user_id"`,
      [
        email,
        name,
        passwordHash,
        roleId,
        scope.arm ?? null,
        scope.regionSlug ?? null,
        scope.chapterSlug ?? null,
      ],
    );
    targetId = rows[0]?.user_id ?? null;
    if (!targetId) {
      throw new AuthorizationError("unknown_role", {
        actorUserId: session.user.id,
        permission: "users.assign_roles",
      });
    }

    await recordAudit({
      actorUserId: session.user.id,
      action: "user.create",
      targetType: "admin_user",
      targetId,
      scope,
      outcome: "success",
    });
    return { ok: true };
  } catch (error) {
    if (isUniqueViolation(error)) {
      await recordAudit({
        actorUserId: session.user.id,
        action: "user.create",
        targetType: "admin_user",
        scope,
        outcome: "denied",
        reason: "duplicate_email",
      });
      return { ok: false, error: "An administrator with that email already exists." };
    }
    return failMutation(session, "user.create", scope, targetId, error);
  }
}

export async function assignRole(input: RoleScopeInput): Promise<MutationResult> {
  const session = await requireActor();
  const scope = normalizeScope(input?.scope);
  const userId = typeof input?.userId === "string" ? input.userId.trim() : "";
  try {
    assertPermission(session, "users.assign_roles");
    const actorUserId = session.user.id;
    const roleKey = parseRoleKey(input?.roleKey, actorUserId);
    if (!userId) {
      throw new AuthorizationError("invalid_input", {
        actorUserId,
        permission: "users.assign_roles",
      });
    }
    assertValidScopeForRole(session.actor, roleKey, scope);
    assertCanAssignRole(session.actor, roleKey, scope);
    await assertScopeUnitsExist(scope);
    const target = await loadTargetGrants(userId, actorUserId);
    assertTargetInScope(session.actor, target.grants);
    const roleId = await requireRoleRow(roleKey, actorUserId);

    const inserted = await query<{ user_id: string }>(
      `insert into admin_user_roles (user_id, role_id, arm, region_slug, chapter_slug)
       values ($1, $2, $3, $4, $5)
       on conflict (user_id, role_id, arm, region_slug, chapter_slug) do nothing
       returning user_id as "user_id"`,
      [userId, roleId, scope.arm ?? null, scope.regionSlug ?? null, scope.chapterSlug ?? null],
    );
    if (!inserted.length) {
      return { ok: false, error: "That role is already assigned." };
    }

    await recordAudit({
      actorUserId,
      action: "user.role_grant",
      targetType: "admin_user",
      targetId: userId,
      scope,
      outcome: "success",
    });
    return { ok: true };
  } catch (error) {
    return failMutation(session, "user.role_grant", scope, userId || null, error);
  }
}

export async function revokeRole(input: RoleScopeInput): Promise<MutationResult> {
  const session = await requireActor();
  const scope = normalizeScope(input?.scope);
  const userId = typeof input?.userId === "string" ? input.userId.trim() : "";
  try {
    assertPermission(session, "users.assign_roles");
    const actorUserId = session.user.id;
    const roleKey = parseRoleKey(input?.roleKey, actorUserId);
    if (!userId) {
      throw new AuthorizationError("invalid_input", {
        actorUserId,
        permission: "users.assign_roles",
      });
    }
    const target = await loadTargetGrants(userId, actorUserId);
    assertTargetInScope(session.actor, target.grants);
    if (roleKey === "super_admin" && (await holdsRole(userId, roleKey))) {
      await assertNotLastSuperAdmin(userId, actorUserId);
    }
    const roleId = await requireRoleRow(roleKey, actorUserId);

    const deleted = await query<{ user_id: string }>(
      `delete from admin_user_roles
       where user_id = $1
         and role_id = $2
         and arm is not distinct from $3
         and region_slug is not distinct from $4
         and chapter_slug is not distinct from $5
       returning user_id as "user_id"`,
      [userId, roleId, scope.arm ?? null, scope.regionSlug ?? null, scope.chapterSlug ?? null],
    );
    if (!deleted.length) {
      return { ok: false, error: "That role assignment was not found." };
    }

    await recordAudit({
      actorUserId,
      action: "user.role_revoke",
      targetType: "admin_user",
      targetId: userId,
      scope,
      outcome: "success",
    });
    return { ok: true };
  } catch (error) {
    return failMutation(session, "user.role_revoke", scope, userId || null, error);
  }
}

export async function setUserActive(input: {
  userId: string;
  isActive: boolean;
}): Promise<MutationResult> {
  const session = await requireActor();
  const userId = typeof input?.userId === "string" ? input.userId.trim() : "";
  const isActive = input?.isActive === true;
  const action = isActive ? "user.update" : "user.deactivate";
  try {
    assertPermission(session, "users.delete");
    const actorUserId = session.user.id;
    if (!userId) {
      throw new AuthorizationError("invalid_input", {
        actorUserId,
        permission: "users.delete",
      });
    }
    if (userId === session.user.id && !isActive) {
      throw new AuthorizationError("self_deactivate", {
        actorUserId,
        permission: "users.delete",
      });
    }
    const target = await loadTargetGrants(userId, actorUserId);
    assertTargetInScope(session.actor, target.grants);
    if (!isActive && (await holdsRole(userId, "super_admin"))) {
      await assertNotLastSuperAdmin(userId, actorUserId);
    }

    await query("update admin_users set is_active = $2 where id = $1", [userId, isActive]);
    await recordAudit({
      actorUserId,
      action,
      targetType: "admin_user",
      targetId: userId,
      scope: target.grants[0] ?? null,
      outcome: "success",
      reason: isActive ? "activated" : "deactivated",
    });
    return { ok: true };
  } catch (error) {
    return failMutation(session, action, null, userId || null, error);
  }
}

/**
 * Everything the "new administrator" form and role pickers need, pre-filtered
 * to what this actor may actually grant.
 */
export async function getUserManagementOptions(): Promise<UserManagementOptions> {
  const session = await requireActor();
  assertPermission(session, "users.assign_roles");
  const actor = session.actor;
  const org = await getOrgOptions();
  return {
    assignableRoles: assignableRoleKeys(actor).map((key) => ({
      key,
      name: ROLE_DEFINITIONS[key].name,
      description: ROLE_DEFINITIONS[key].description,
    })),
    assignableArms: ARM_KEYS.filter(
      (arm) =>
        canAssignRole(actor, "arm_admin", { arm }) ||
        canAssignRole(actor, "content_editor", { arm }),
    ),
    chapters: org.chapters.filter((chapter) =>
      canAssignRole(actor, "chapter_admin", {
        arm: chapter.arm as ArmKey,
        chapterSlug: chapter.slug,
      }),
    ),
    regions: org.regions.filter((region) =>
      canAssignRole(actor, "region_admin", { arm: "global", regionSlug: region.slug }),
    ),
  };
}
