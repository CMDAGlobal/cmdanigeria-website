"use client";

import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Building2, CalendarDays, FileText, Globe, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminSession, scopeLabel } from "@/components/admin/admin-session";
import { isChapterDashboard, isRegionDashboard } from "@/components/admin/nav-items";
import { useAdminOverview } from "@/components/admin/admin-data";
import { useDashboardStats, useMyChapter } from "@/components/admin/admin-content";
import { describeAuditEntry } from "@/admin/audit/describe";

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
  value?: number | string | null | undefined;
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
            {value === null || value === undefined || value === ""
              ? "—"
              : typeof value === "number"
                ? value.toLocaleString()
                : value}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

interface GroupStat {
  label: string;
  value: number | null | undefined;
}

function StatGroupCard({
  title,
  icon,
  stats,
  loading,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  stats: GroupStat[];
  loading: boolean;
}) {
  const Icon = icon;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">{stat.label}</span>
            {loading ? (
              <Skeleton className="h-5 w-10" />
            ) : (
              <span className="font-display text-lg font-bold tabular-nums">
                {stat.value === null || stat.value === undefined
                  ? "—"
                  : stat.value.toLocaleString()}
              </span>
            )}
          </div>
        ))}
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
              {describeAuditEntry(entry.action, entry.scope)}
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {entry.actorName ?? entry.actorEmail ?? "System"}
              {" · "}
              <code className="rounded bg-muted px-1 py-0.5 text-[10px] text-primary">
                {entry.action}
              </code>
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

function titleCaseSlug(slug: string): string {
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function AdminDashboardPage() {
  const session = useAdminSession();
  const overview = useAdminOverview();
  const chapterOnly = isChapterDashboard(session.data);
  const regionOnly = !chapterOnly && isRegionDashboard(session.data);
  const chapter = useMyChapter(chapterOnly);
  const stats = useDashboardStats(!chapterOnly);
  const canViewUsers = session.data?.permissions.includes("users.read") === true;
  const canViewAudit = session.data?.permissions.includes("audit_logs.view") === true;
  const firstName = session.data?.user?.name?.split(/\s+/)[0] ?? "Admin";
  const roles = session.data?.roles ?? [];
  const scopeBadge = roles.some((role) => Object.keys(role.scope).length > 0)
    ? roles
        .filter((role) => Object.keys(role.scope).length > 0)
        .map((role) => scopeLabel(role.scope))
        .join(" · ")
    : "System-wide access";

  if (chapterOnly) {
    const membership = chapter.data?.membership ?? [];
    const statRows = membership.length ? membership : [{ label: "Chapter members", value: "" }];
    const chapterLinks: Array<{ to: string; label: string }> = [
      {
        to: "/admin/my-chapter",
        label: "Manage your chapter",
      },
      { to: "/admin/leadership", label: "Our leaders" },
      { to: "/admin/events", label: "Events and Activities" },
      { to: "/admin/news", label: "News" },
      { to: "/admin/announcements", label: "Announcements" },
      { to: "/admin/outreaches", label: "Outreaches" },
      { to: "/admin/newsletter", label: "Newsletter" },
      { to: "/admin/media", label: "Media Library" },
      { to: "/", label: "Open public site" },
    ];
    const publicChapterHref = chapter.data?.slug ? `/chapters/${chapter.data.slug}` : null;

    return (
      <div className="space-y-8">
        <div>
          <Badge variant="secondary" className="mb-3">
            {scopeBadge}
          </Badge>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {chapter.data?.name ? `Welcome to ${chapter.data.name}` : `Welcome back, ${firstName}`}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Your chapter workspace — manage its content, events and outreach from here.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statRows.map((row, index) => (
            <StatCard
              key={`${row.label}-${index}`}
              label={row.label}
              value={row.value}
              hint={
                membership.length
                  ? "From your chapter statistics"
                  : "Add statistics from Manage your chapter"
              }
              icon={Building2}
              loading={chapter.isLoading}
            />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Your chapter</CardTitle>
              <CardDescription>
                Jump into your chapter’s content. Everything you create here is scoped to your
                chapter.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              {chapterLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
                >
                  {link.label}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
              {publicChapterHref ? (
                <a
                  href={publicChapterHref}
                  className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
                >
                  View your public page
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </a>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-sm font-semibold text-primary">Your access</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                You hold {roles.length} role{roles.length === 1 ? "" : "s"} as a chapter
                administrator. Your dashboard, modules and content are limited to your chapter.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (regionOnly) {
    const regionSlug = roles.find((role) => role.key === "region_admin")?.scope.regionSlug;
    const regionName = regionSlug ? titleCaseSlug(regionSlug) : "your region";
    const regionLinks: Array<{ to: string; label: string }> = [
      { to: "/admin/global-network", label: "Your region" },
      { to: "/admin/leadership", label: "Regional leaders" },
      { to: "/admin/events", label: "Events and Activities" },
      { to: "/admin/news", label: "News" },
      { to: "/admin/announcements", label: "Announcements" },
      { to: "/admin/outreaches", label: "Outreaches" },
      { to: "/admin/newsletter", label: "Newsletter" },
      { to: "/admin/media", label: "Media Library" },
      { to: "/", label: "Open public site" },
    ];

    const regionContent = stats.data?.content;
    const regionUsers = stats.data?.users;

    return (
      <div className="space-y-8">
        <div>
          <Badge variant="secondary" className="mb-3">
            {scopeBadge}
          </Badge>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {regionSlug ? `Welcome, ${regionName} Region` : `Welcome back, ${firstName}`}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Your regional workspace — manage chapters, events and content for {regionName} from
            here.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatGroupCard
            title="Content"
            icon={FileText}
            loading={stats.isLoading}
            stats={[
              { label: "Blog posts", value: regionContent?.posts },
              { label: "Newsletters", value: regionContent?.newsletters },
              { label: "Media files", value: regionContent?.mediaFiles },
            ]}
          />
          <StatGroupCard
            title="Events"
            icon={CalendarDays}
            loading={stats.isLoading}
            stats={[
              { label: "Upcoming", value: regionContent?.events?.upcoming },
              { label: "Past", value: regionContent?.events?.past },
              { label: "Draft", value: regionContent?.events?.draft },
            ]}
          />
          <StatGroupCard
            title="Publishing"
            icon={Globe}
            loading={stats.isLoading}
            stats={[
              { label: "Published pages", value: regionContent?.pages?.published },
              { label: "Draft pages", value: regionContent?.pages?.draft },
            ]}
          />
          <StatGroupCard
            title="Users"
            icon={Users}
            loading={stats.isLoading && canViewUsers}
            stats={[
              { label: "Total admins", value: canViewUsers ? regionUsers?.total : null },
              { label: "Region admins", value: canViewUsers ? regionUsers?.regionAdmins : null },
              {
                label: "Chapter admins",
                value: canViewUsers ? regionUsers?.chapterAdmins : null,
              },
            ]}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Your region</CardTitle>
              <CardDescription>
                Jump into {regionName}’s content. Everything you create here is scoped to your
                region.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              {regionLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
                >
                  {link.label}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-sm font-semibold text-primary">Your access</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                You hold {roles.length} role{roles.length === 1 ? "" : "s"} as a regional
                administrator. Your dashboard, modules and content are limited to {regionName}{" "}
                Region.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const content = stats.data?.content;
  const users = stats.data?.users;
  const statsLoading = stats.isLoading;
  const auditToday = stats.data?.auditTodayCount;

  return (
    <div className="space-y-8">
      <div>
        <Badge variant="secondary" className="mb-3">
          {scopeBadge}
        </Badge>
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back, {firstName}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Here’s an overview of the CMDA Nigeria administration platform.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatGroupCard
          title="Website"
          icon={Globe}
          loading={statsLoading}
          stats={[
            { label: "Total pages", value: content?.pages?.total },
            { label: "Published", value: content?.pages?.published },
            { label: "Draft", value: content?.pages?.draft },
          ]}
        />
        <StatGroupCard
          title="Events"
          icon={CalendarDays}
          loading={statsLoading}
          stats={[
            { label: "Upcoming", value: content?.events?.upcoming },
            { label: "Past", value: content?.events?.past },
            { label: "Draft", value: content?.events?.draft },
          ]}
        />
        <StatGroupCard
          title="Organization"
          icon={Building2}
          loading={statsLoading}
          stats={[
            { label: "Student chapters", value: content?.studentChapters },
            { label: "Doctor chapters", value: content?.doctorChapters },
            { label: "Regions", value: content?.regions },
          ]}
        />
        <StatGroupCard
          title="Content"
          icon={FileText}
          loading={statsLoading}
          stats={[
            { label: "Blog posts", value: content?.posts },
            { label: "Newsletters", value: content?.newsletters },
            { label: "Media files", value: content?.mediaFiles },
          ]}
        />
        <StatGroupCard
          title="Users"
          icon={Users}
          loading={statsLoading && canViewUsers}
          stats={[
            { label: "Total admins", value: canViewUsers ? users?.total : null },
            { label: "Chapter admins", value: canViewUsers ? users?.chapterAdmins : null },
            { label: "Region admins", value: canViewUsers ? users?.regionAdmins : null },
          ]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>
                Latest events from the audit log
                {canViewAudit && typeof auditToday === "number"
                  ? ` · ${auditToday.toLocaleString()} today`
                  : ""}
                .
              </CardDescription>
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
