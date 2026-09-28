import { createServerFn } from "@tanstack/react-start";

export interface AdminRoleSummary {
  key: string;
  name: string;
  scope: { arm?: string; regionSlug?: string; chapterSlug?: string };
}

export interface AdminUserSummary {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  roles: AdminRoleSummary[];
}

export interface AuditEntrySummary {
  id: string;
  createdAt: string;
  action: string;
  outcome: string;
  actorEmail: string | null;
  actorName: string | null;
  targetType: string | null;
  targetId: string | null;
  scope: { arm?: string; regionSlug?: string; chapterSlug?: string } | null;
  reason: string | null;
  ipAddress: string | null;
}

export interface AdminOverview {
  usersCount: number | null;
  rolesCount: number;
  permissionsCount: number;
  auditTodayCount: number | null;
  recentAudit: AuditEntrySummary[];
  roles: AdminRoleSummary[];
}

export const getAdminOverviewAction = createServerFn({ method: "GET", strict: false }).handler(
  async (): Promise<AdminOverview> => {
    const { getOverview } = await import("./actions");
    return getOverview();
  },
);

export const listAdminUsersAction = createServerFn({ method: "GET", strict: false }).handler(
  async (): Promise<AdminUserSummary[]> => {
    const { listAdminUsers } = await import("./actions");
    return listAdminUsers();
  },
);

export const listAuditLogsAction = createServerFn({ method: "GET", strict: false }).handler(
  async (): Promise<AuditEntrySummary[]> => {
    const { listAuditEntries } = await import("./actions");
    return listAuditEntries(50);
  },
);

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  roleKey: string;
  scope: { arm?: string; regionSlug?: string; chapterSlug?: string };
}

export interface RoleScopeRequest {
  userId: string;
  roleKey: string;
  scope: { arm?: string; regionSlug?: string; chapterSlug?: string };
}

export interface MutationSummary {
  ok: boolean;
  error?: string;
}

export interface UserManagementOptionsSummary {
  assignableRoles: { key: string; name: string; description: string }[];
  assignableArms: string[];
  chapters: { slug: string; name: string; arm: string }[];
  regions: { slug: string; name: string }[];
}

export const getUserManagementOptionsAction = createServerFn({
  method: "GET",
  strict: false,
}).handler(async (): Promise<UserManagementOptionsSummary | null> => {
  const { getUserManagementOptions } = await import("./actions");
  try {
    return await getUserManagementOptions();
  } catch {
    return null;
  }
});

export const createAdminUserAction = createServerFn({ method: "POST", strict: false })
  .validator((input: CreateUserRequest) => input)
  .handler(async ({ data }): Promise<MutationSummary> => {
    const { createAdminUser } = await import("./actions");
    return createAdminUser(data);
  });

export const assignRoleAction = createServerFn({ method: "POST", strict: false })
  .validator((input: RoleScopeRequest) => input)
  .handler(async ({ data }): Promise<MutationSummary> => {
    const { assignRole } = await import("./actions");
    return assignRole(data);
  });

export const revokeRoleAction = createServerFn({ method: "POST", strict: false })
  .validator((input: RoleScopeRequest) => input)
  .handler(async ({ data }): Promise<MutationSummary> => {
    const { revokeRole } = await import("./actions");
    return revokeRole(data);
  });

export const setUserActiveAction = createServerFn({ method: "POST", strict: false })
  .validator((input: { userId: string; isActive: boolean }) => input)
  .handler(async ({ data }): Promise<MutationSummary> => {
    const { setUserActive } = await import("./actions");
    return setUserActive(data);
  });
