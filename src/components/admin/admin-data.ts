"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignRoleAction,
  createAdminUserAction,
  getAdminOverviewAction,
  getUserManagementOptionsAction,
  listAdminUsersAction,
  listAuditLogsAction,
  revokeRoleAction,
  setUserActiveAction,
  type CreateUserRequest,
  type RoleScopeRequest,
  type UserManagementOptionsSummary,
} from "@/admin/data/server";

export function useAdminOverview() {
  return useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => getAdminOverviewAction(),
    staleTime: 15_000,
    retry: false,
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: () => listAdminUsersAction(),
    staleTime: 15_000,
    retry: false,
  });
}

export function useAuditLogs() {
  return useQuery({
    queryKey: ["admin-audit-logs"],
    queryFn: () => listAuditLogsAction(),
    staleTime: 15_000,
    retry: false,
  });
}

export function useUserManagementOptions() {
  return useQuery<UserManagementOptionsSummary | null>({
    queryKey: ["admin-user-options"],
    queryFn: () => getUserManagementOptionsAction(),
    staleTime: 60_000,
    retry: false,
  });
}

function useInvalidateUserQueries() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-session"] });
  };
}

export function useCreateAdminUser() {
  const invalidate = useInvalidateUserQueries();
  return useMutation({
    mutationFn: (input: CreateUserRequest) => createAdminUserAction({ data: input }),
    onSuccess: invalidate,
  });
}

export function useAssignRole() {
  const invalidate = useInvalidateUserQueries();
  return useMutation({
    mutationFn: (input: RoleScopeRequest) => assignRoleAction({ data: input }),
    onSuccess: invalidate,
  });
}

export function useRevokeRole() {
  const invalidate = useInvalidateUserQueries();
  return useMutation({
    mutationFn: (input: RoleScopeRequest) => revokeRoleAction({ data: input }),
    onSuccess: invalidate,
  });
}

export function useSetUserActive() {
  const invalidate = useInvalidateUserQueries();
  return useMutation({
    mutationFn: (input: { userId: string; isActive: boolean }) =>
      setUserActiveAction({ data: input }),
    onSuccess: invalidate,
  });
}
