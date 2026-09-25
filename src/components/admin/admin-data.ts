"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAdminOverviewAction,
  listAdminUsersAction,
  listAuditLogsAction,
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
