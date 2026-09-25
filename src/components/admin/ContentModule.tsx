"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { armLabel } from "@/admin/content/mappers";
import type { ContentItem, ContentModuleKey } from "@/admin/content/types";
import type { PermissionKey } from "@/admin/rbac/permissions";
import { useContentModule } from "./admin-content";
import { hasPermission, useAdminSession } from "./admin-session";
import { NoAccess } from "./NoAccess";

export interface ContentModuleProps {
  module: ContentModuleKey;
  studioType: string;
  title: string;
  description: string;
  icon: LucideIcon;
  permission: PermissionKey;
  dateHeading?: string | null;
  searchPlaceholder: string;
  emptyMessage: string;
  listHeading: string;
}

const MAX_ROWS = 200;

function formatDate(value: string | null): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function studioUrl(studioType: string, id: string): string {
  return `/studio/intent/edit/id=${encodeURIComponent(id)}&type=${encodeURIComponent(studioType)}`;
}

function matches(item: ContentItem, term: string): boolean {
  if (!term) return true;
  return (
    item.title.toLowerCase().includes(term) ||
    (item.subtitle ?? "").toLowerCase().includes(term) ||
    (item.slug ?? "").toLowerCase().includes(term)
  );
}

export function ContentModule({
  module,
  studioType,
  title,
  description,
  icon: Icon,
  permission,
  dateHeading = null,
  searchPlaceholder,
  emptyMessage,
  listHeading,
}: ContentModuleProps) {
  const session = useAdminSession();
  const query = useContentModule(module);
  const [search, setSearch] = useState("");
  const [arm, setArm] = useState("all");
  const [status, setStatus] = useState("all");

  const allItems = useMemo(() => query.data?.items ?? [], [query.data]);

  const armOptions = useMemo(() => {
    const set = new Set<string>();
    for (const item of allItems) set.add(item.arm ?? "global");
    return [...set].sort();
  }, [allItems]);

  const statusOptions = useMemo(() => {
    const set = new Set<string>();
    for (const item of allItems) {
      if (item.status) set.add(item.status.label);
    }
    return [...set].sort();
  }, [allItems]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return allItems
      .filter((item) => {
        if (arm !== "all" && (item.arm ?? "global") !== arm) return false;
        if (status !== "all" && (item.status?.label ?? "") !== status) return false;
        return matches(item, term);
      })
      .slice(0, MAX_ROWS);
  }, [allItems, search, arm, status]);

  if (!hasPermission(session.data, permission)) {
    return <NoAccess icon={Icon} permission={permission} />;
  }

  const configured = query.data?.configured !== false;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        </div>
        <Button variant="outline" asChild className="shrink-0">
          <a href={`/studio/${studioType}`} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" />
            Open in Studio
          </a>
        </Button>
      </div>

      {query.data?.stats.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {query.data.stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-1 font-display text-2xl font-bold tabular-nums tracking-tight">
                  {stat.value.toLocaleString("en-GB")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{listHeading}</CardTitle>
          <CardDescription>
            {configured
              ? "Read-only view scoped to your role. Edit content in the Studio."
              : "The content store is not configured for this environment."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9"
                aria-label={searchPlaceholder}
              />
            </div>
            {armOptions.length > 1 ? (
              <Select value={arm} onValueChange={setArm}>
                <SelectTrigger className="sm:w-48" aria-label="Filter by arm">
                  <SelectValue placeholder="All arms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All arms</SelectItem>
                  {armOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {armLabel(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
            {statusOptions.length > 1 ? (
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="sm:w-44" aria-label="Filter by status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
          </div>

          {query.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : query.isError ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Could not load {title.toLowerCase()}.
            </div>
          ) : !configured ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Set <code className="text-primary">SANITY_PROJECT_ID</code> to connect the content
              store.
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              {allItems.length === 0 ? emptyMessage : "No items match the current filters."}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Arm</TableHead>
                    {statusOptions.length > 0 ? <TableHead>Status</TableHead> : null}
                    {dateHeading ? (
                      <TableHead className="hidden sm:table-cell">{dateHeading}</TableHead>
                    ) : null}
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                        {item.subtitle ? (
                          <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="whitespace-nowrap">
                          {armLabel(item.arm)}
                        </Badge>
                      </TableCell>
                      {statusOptions.length > 0 ? (
                        <TableCell>
                          {item.status ? (
                            <Badge variant={item.status.tone} className="whitespace-nowrap">
                              {item.status.label}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      ) : null}
                      {dateHeading ? (
                        <TableCell className="hidden text-xs tabular-nums text-muted-foreground sm:table-cell">
                          {formatDate(item.date)}
                        </TableCell>
                      ) : null}
                      <TableCell>
                        <a
                          href={studioUrl(studioType, item.id)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground transition-colors hover:text-primary"
                          aria-label={`Edit ${item.title} in Studio`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {allItems.length > visible.length ? (
                <p className="text-xs text-muted-foreground">
                  Showing {visible.length} of {allItems.length} items.
                </p>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
