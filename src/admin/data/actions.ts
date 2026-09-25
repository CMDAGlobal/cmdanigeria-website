import { query } from "../db/client";
import { getCurrentActor } from "../auth/actions";
import { AuthorizationError, isSystemScope, scopeContains, type Actor } from "../rbac/engine";
import type { ArmKey, Scope } from "../rbac/roles";
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

async function scopedUserRows(actor: Actor): Promise<UserRoleRow[]> {
  if (isSystemScope(actor.roles[0]?.scope ?? {})) {
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
    if (isSystemScope(actor.roles[0]?.scope ?? {})) return true;
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

  const visibleUserIds = isSystemScope(session.actor.roles[0]?.scope ?? {})
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
