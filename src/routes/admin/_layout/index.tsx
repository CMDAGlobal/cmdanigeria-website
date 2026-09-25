"use client";

import { Link, createFileRoute } from "@tanstack/react-router";
import { Users, ScrollText, ShieldCheck, Activity, ArrowRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminSession, scopeLabel } from "@/components/admin/admin-session";
import { useAdminOverview } from "@/components/admin/admin-data";

export const Route = createFileRoute("/admin/_layout/")({
  component: AdminDashboardPage,
  head: () => ({
    meta: [{ title: "Dashboard · Admin · CMDA Nigeria" }],
  }),
});

function StatCard({
  label,
  value,
  hint,
  icon,
  loading,
}: {
  label: string;
  value?: number | null | undefined;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  loading: boolean;
}) {
  const Icon = icon;
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground">{label}</CardTitle>
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <p className="font-display text-3xl font-bold tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : "—"}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function AuditTable() {
  const { data, isLoading, isError } = useAdminOverview();
  const entries = data?.recentAudit ?? [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (isError || data?.recentAudit === undefined) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        You don’t have permission to view audit logs.
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        No audit activity recorded yet.
      </div>
    );
  }

  return (
    <div className="divide-y">
      {entries.map((entry) => (
        <div key={entry.id} className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-primary">
                {entry.action}
              </code>
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {entry.actorName ?? entry.actorEmail ?? "System"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Badge
              variant={
                entry.outcome === "success"
                  ? "secondary"
                  : entry.outcome === "denied"
                    ? "destructive"
                    : "outline"
              }
              className="capitalize"
            >
              {entry.outcome}
            </Badge>
            <span className="hidden text-xs tabular-nums text-muted-foreground sm:inline">
              {new Date(entry.createdAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminDashboardPage() {
  const session = useAdminSession();
  const overview = useAdminOverview();
  const canViewUsers = session.data?.permissions.includes("users.read") === true;
  const canViewAudit = session.data?.permissions.includes("audit_logs.view") === true;
  const firstName = session.data?.user?.name?.split(/\s+/)[0] ?? "Admin";

  return (
    <div className="space-y-8">
      <div>
        <Badge variant="secondary" className="mb-3">
          {session.data?.roles.some((role) => Object.keys(role.scope).length > 0)
            ? session.data.roles
                .filter((role) => Object.keys(role.scope).length > 0)
                .map((role) => scopeLabel(role.scope))
                .join(" · ")
            : "System-wide access"}
        </Badge>
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back, {firstName}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Here’s an overview of the CMDA Nigeria administration platform.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Administrators"
          value={overview.data?.usersCount}
          hint="Users with admin access"
          icon={Users}
          loading={canViewUsers && overview.isLoading}
        />
        <StatCard
          label="Roles"
          value={overview.data?.rolesCount}
          hint="Configured RBAC roles"
          icon={ShieldCheck}
          loading={overview.isLoading}
        />
        <StatCard
          label="Permissions"
          value={overview.data?.permissionsCount}
          hint="Available grantable permissions"
          icon={Activity}
          loading={overview.isLoading}
        />
        <StatCard
          label="Audit events today"
          value={overview.data?.auditTodayCount}
          hint="Recorded system activity"
          icon={ScrollText}
          loading={canViewAudit && overview.isLoading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>Latest events from the audit log.</CardDescription>
            </div>
            {canViewAudit && (
              <Link
                to="/admin/audit"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </CardHeader>
          <CardContent>
            <AuditTable />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Frequently used administration tasks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {canViewUsers && (
                <Link
                  to="/admin/users"
                  className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
                >
                  Manage administrators
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              )}
              {canViewAudit && (
                <Link
                  to="/admin/audit"
                  className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
                >
                  Review audit log
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              )}
              <Link
                to="/"
                className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                Open public site
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-sm font-semibold text-primary">Your access</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                You hold {session.data?.roles.length ?? 0} role
                {(session.data?.roles.length ?? 0) === 1 ? "" : "s"} and a subset of the platform’s
                permissions. Content management modules are seeded and ready to build out.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
