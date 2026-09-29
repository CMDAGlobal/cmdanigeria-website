import { PERMISSION_KEYS, type PermissionKey } from "./permissions.ts";

export const ARM_KEYS = ["global", "students", "doctors"] as const;
export type ArmKey = (typeof ARM_KEYS)[number];

export const ROLE_KEYS = [
  "super_admin",
  "arm_admin",
  "chapter_admin",
  "region_admin",
  "content_editor",
] as const;
export type RoleKey = (typeof ROLE_KEYS)[number];

export type ScopeLevel = "system" | "arm" | "region" | "chapter";

export interface Scope {
  arm?: ArmKey;
  regionSlug?: string;
  chapterSlug?: string;
}

export const SYSTEM_SCOPE: Scope = {};

export interface RoleDefinition {
  key: RoleKey;
  name: string;
  description: string;
  /** Narrowest level of organisation this role is ever scoped to. */
  scopeLevel: ScopeLevel;
  permissions: PermissionKey[];
}

const armAdminPermissions: PermissionKey[] = [
  "users.read",
  "users.write",
  "users.assign_roles",
  "chapters.read",
  "chapters.write",
  "chapters.delete",
  "regions.read",
  "regions.write",
  "regions.delete",
  "leaders.read",
  "leaders.write",
  "leaders.delete",
  "events.read",
  "events.write",
  "events.delete",
  "news.read",
  "news.write",
  "news.delete",
  "publications.read",
  "publications.write",
  "publications.delete",
  "announcements.read",
  "announcements.write",
  "announcements.delete",
  "outreaches.read",
  "outreaches.write",
  "outreaches.delete",
  "statistics.read",
  "statistics.write",
  "media.read",
  "media.write",
  "media.delete",
  "pages.read",
  "pages.write",
  "pages.delete",
  "settings.read",
  "audit_logs.view",
];

const chapterAdminPermissions: PermissionKey[] = [
  "users.read",
  "chapters.read",
  "chapters.write",
  "leaders.read",
  "leaders.write",
  "leaders.delete",
  "events.read",
  "events.write",
  "events.delete",
  "news.read",
  "news.write",
  "news.delete",
  "publications.read",
  "publications.write",
  "publications.delete",
  "announcements.read",
  "announcements.write",
  "announcements.delete",
  "outreaches.read",
  "outreaches.write",
  "outreaches.delete",
  "statistics.read",
  "media.read",
  "media.write",
  "media.delete",
  "pages.read",
];

const regionAdminPermissions: PermissionKey[] = [
  "users.read",
  "regions.read",
  "regions.write",
  "leaders.read",
  "leaders.write",
  "leaders.delete",
  "events.read",
  "events.write",
  "events.delete",
  "news.read",
  "news.write",
  "news.delete",
  "publications.read",
  "publications.write",
  "publications.delete",
  "announcements.read",
  "announcements.write",
  "announcements.delete",
  "outreaches.read",
  "outreaches.write",
  "outreaches.delete",
  "statistics.read",
  "media.read",
  "media.write",
  "media.delete",
  "pages.read",
];

const contentEditorPermissions: PermissionKey[] = [
  "chapters.read",
  "regions.read",
  "leaders.read",
  "leaders.write",
  "events.read",
  "events.write",
  "news.read",
  "news.write",
  "news.delete",
  "publications.read",
  "publications.write",
  "publications.delete",
  "announcements.read",
  "announcements.write",
  "announcements.delete",
  "outreaches.read",
  "outreaches.write",
  "statistics.read",
  "media.read",
  "media.write",
  "media.delete",
  "pages.read",
];

export const ROLE_DEFINITIONS: Record<RoleKey, RoleDefinition> = {
  super_admin: {
    key: "super_admin",
    name: "Super Admin",
    description: "Unrestricted access to every permission across all arms, regions and chapters.",
    scopeLevel: "system",
    permissions: [...PERMISSION_KEYS],
  },
  arm_admin: {
    key: "arm_admin",
    name: "Arm Admin",
    description: "Manages users and content within one arm (Doctors, Students or Global).",
    scopeLevel: "arm",
    permissions: armAdminPermissions,
  },
  chapter_admin: {
    key: "chapter_admin",
    name: "Chapter Admin",
    description: "Manages a single chapter: its leaders, events, news and announcements.",
    scopeLevel: "chapter",
    permissions: chapterAdminPermissions,
  },
  region_admin: {
    key: "region_admin",
    name: "Region Admin",
    description: "Manages a single region: its leaders, events, news and announcements.",
    scopeLevel: "region",
    permissions: regionAdminPermissions,
  },
  content_editor: {
    key: "content_editor",
    name: "Content Editor",
    description: "Creates and edits website content but cannot manage users, roles or settings.",
    scopeLevel: "chapter",
    permissions: contentEditorPermissions,
  },
};

export function isRoleKey(value: string): value is RoleKey {
  return (ROLE_KEYS as readonly string[]).includes(value);
}

export function isArmKey(value: string): value is ArmKey {
  return (ARM_KEYS as readonly string[]).includes(value);
}

/**
 * Privilege ordering used when deciding who may assign which role. A role
 * with a lower rank may only be granted by someone who outranks it (or holds
 * the same role at a covering scope) — never upwards.
 */
export const ROLE_RANK: Record<RoleKey, number> = {
  content_editor: 1,
  chapter_admin: 2,
  region_admin: 2,
  arm_admin: 3,
  super_admin: 4,
};

export interface ScopeValidation {
  ok: boolean;
  reason?: string;
}

/**
 * Structural rules for a role's assignment scope — what shape a grant must
 * have to be valid for that role, independent of who is making the grant.
 */
export function validateScopeForRole(roleKey: RoleKey, scope: Scope): ScopeValidation {
  if (scope.arm !== undefined && !isArmKey(scope.arm)) {
    return { ok: false, reason: "invalid_arm" };
  }
  switch (roleKey) {
    case "super_admin":
      return scope.arm || scope.regionSlug || scope.chapterSlug
        ? { ok: false, reason: "scope_must_be_system" }
        : { ok: true };
    case "arm_admin":
      if (!scope.arm) return { ok: false, reason: "arm_required" };
      if (scope.regionSlug || scope.chapterSlug) return { ok: false, reason: "arm_scope_only" };
      return { ok: true };
    case "chapter_admin":
      if (!scope.arm) return { ok: false, reason: "arm_required" };
      if (!scope.chapterSlug) return { ok: false, reason: "chapter_required" };
      if (scope.regionSlug) return { ok: false, reason: "chapter_scope_only" };
      return { ok: true };
    case "region_admin":
      if (scope.arm !== "global") return { ok: false, reason: "global_arm_required" };
      if (!scope.regionSlug) return { ok: false, reason: "region_required" };
      if (scope.chapterSlug) return { ok: false, reason: "region_scope_only" };
      return { ok: true };
    case "content_editor":
      if (!scope.arm) return { ok: false, reason: "arm_required" };
      return { ok: true };
  }
}
