import { PERMISSION_KEYS, type PermissionKey } from "./permissions.ts";

export const ARM_KEYS = ["global", "students", "doctors"] as const;
export type ArmKey = (typeof ARM_KEYS)[number];

export const ROLE_KEYS = ["super_admin", "arm_admin", "chapter_admin", "content_editor"] as const;
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
  "leaders.read",
  "leaders.write",
  "leaders.delete",
  "events.read",
  "events.write",
  "events.delete",
  "news.read",
  "news.write",
  "news.delete",
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
  "leaders.read",
  "leaders.write",
  "events.read",
  "events.write",
  "news.read",
  "news.write",
  "news.delete",
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
