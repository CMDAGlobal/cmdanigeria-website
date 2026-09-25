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
