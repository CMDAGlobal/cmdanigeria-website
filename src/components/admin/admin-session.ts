"use client";

import { useQuery } from "@tanstack/react-query";
import { meAction } from "@/admin/auth/server";
import type { PermissionKey } from "@/admin/rbac/permissions";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export interface AdminRoleScope {
  key: string;
  name: string;
  scope: { arm?: string; regionSlug?: string; chapterSlug?: string };
}

export interface AdminSession {
  user: AdminUser | null;
  permissions: string[];
  roles: AdminRoleScope[];
}

export const adminSessionQueryKey = ["admin-session"] as const;

export function useAdminSession() {
  return useQuery<AdminSession>({
    queryKey: adminSessionQueryKey,
    queryFn: () => meAction(),
    staleTime: 30_000,
    retry: false,
  });
}

export function hasPermission(
  session: AdminSession | undefined,
  permission: PermissionKey,
): boolean {
  if (!session?.permissions.length) return false;
  return session.permissions.includes(permission);
}

export function scopeLabel(scope: {
  arm?: string;
  regionSlug?: string;
  chapterSlug?: string;
}): string {
  const parts: string[] = [];
  if (scope.arm) parts.push(`Arm: ${scope.arm}`);
  if (scope.regionSlug) parts.push(`Region: ${scope.regionSlug}`);
  if (scope.chapterSlug) parts.push(`Chapter: ${scope.chapterSlug}`);
  return parts.length ? parts.join(" · ") : "System-wide";
}

export function scopeHasScope(scope: {
  arm?: string;
  regionSlug?: string;
  chapterSlug?: string;
}): boolean {
  return Boolean(scope.arm || scope.regionSlug || scope.chapterSlug);
}
