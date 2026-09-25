"use client";

import { Navigate, Outlet, createFileRoute } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";

import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminSession } from "@/components/admin/admin-session";

export const Route = createFileRoute("/admin/_layout")({
  component: AdminShellRoute,
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
});

function AdminShellRoute() {
  const session = useAdminSession();

  if (session.isLoading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-primary-deep text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
            <ShieldCheck className="h-6 w-6 text-gold" />
          </div>
          <div>
            <p className="font-display text-lg font-bold tracking-tight">CMDA Nigeria</p>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
              Admin Console
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/70">
          <Loader2 className="h-4 w-4 animate-spin text-gold" />
          Checking session…
        </div>
      </div>
    );
  }

  if (!session.data?.user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminShell session={session.data}>
      <Outlet />
    </AdminShell>
  );
}
