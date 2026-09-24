import { query } from "../db/client";
import type { Actor, RoleScopePair } from "../rbac/engine";
import { ROLE_DEFINITIONS, isRoleKey, isArmKey } from "../rbac/roles";
import type { Scope } from "../rbac/roles";

export interface AdminUserRecord {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
}

interface RoleAssignmentRow {
  role_key: string;
  arm: string | null;
  region_slug: string | null;
  chapter_slug: string | null;
}

export async function getUserById(userId: string): Promise<AdminUserRecord | null> {
  const rows = await query<{
    id: string;
    email: string;
    name: string;
    is_active: boolean;
  }>(`select id, email, name, is_active from admin_users where id = $1 limit 1`, [userId]);
  const row = rows[0];
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    isActive: row.is_active,
  };
}

export async function getRoleAssignments(userId: string): Promise<RoleScopePair[]> {
  const rows = await query<RoleAssignmentRow>(
    `select r.key as role_key, ur.arm, ur.region_slug, ur.chapter_slug
     from admin_user_roles ur
     join admin_roles r on r.id = ur.role_id
     where ur.user_id = $1`,
    [userId],
  );
  const pairs: RoleScopePair[] = [];
  for (const row of rows) {
    if (!isRoleKey(row.role_key)) continue;
    const scope = rowScope(row);
    pairs.push({ roleKey: row.role_key, scope });
  }
  return pairs;
}

function rowScope(row: RoleAssignmentRow): Scope {
  const scope: Scope = {};
  if (row.arm && isArmKey(row.arm)) scope.arm = row.arm;
  if (row.region_slug) scope.regionSlug = row.region_slug;
  if (row.chapter_slug) scope.chapterSlug = row.chapter_slug;
  return scope;
}

export function buildActor(userId: string, roles: RoleScopePair[]): Actor {
  return { userId, roles };
}

/** Sanity-check that the role key matches a known definition. */
export function isKnownRole(roleKey: string): boolean {
  return isRoleKey(roleKey) && ROLE_DEFINITIONS[roleKey] !== undefined;
}
