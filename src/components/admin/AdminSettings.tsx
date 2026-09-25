"use client";

import { useMemo } from "react";
import { AlertTriangle, CheckCircle2, Database, ExternalLink, Settings2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminSettings } from "./admin-content";
import { hasPermission, useAdminSession } from "./admin-session";
import { NoAccess } from "./NoAccess";

function StatusRow({
  label,
  ok,
  detail,
}: {
  label: string;
  ok: boolean;
  detail?: string | undefined;
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">{label}</TableCell>
      <TableCell>
        {detail ? (
          <span className="font-mono text-xs text-muted-foreground">{detail}</span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        {ok ? (
          <Badge variant="secondary" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Connected
          </Badge>
        ) : (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Not configured
          </Badge>
        )}
      </TableCell>
    </TableRow>
  );
}

export function AdminSettings() {
  const session = useAdminSession();
  const query = useAdminSettings();

  const hasDocuments = useMemo(() => (query.data?.documentCounts.length ?? 0) > 0, [query.data]);

  if (!hasPermission(session.data, "settings.read")) {
    return <NoAccess icon={Settings2} permission="settings.read" />;
  }

  const sanity = query.data?.sanity;
  const governance = query.data?.governance;
  const documentTotal =
    query.data?.documentCounts.reduce((sum, entry) => sum + entry.count, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Settings</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Environment, content store and governance configuration for this deployment.
          </p>
        </div>
        <Button variant="outline" asChild className="shrink-0">
          <a href="/studio" target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" />
            Open in Studio
          </a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            Connections
          </CardTitle>
          <CardDescription>Read-only diagnostics for this environment.</CardDescription>
        </CardHeader>
        <CardContent>
          {query.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : query.isError ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Could not load settings.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Detail</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <StatusRow
                  label="Content store (Sanity)"
                  ok={Boolean(sanity?.configured)}
                  detail={
                    sanity?.configured
                      ? `${sanity.projectId} / ${sanity.dataset} (API ${sanity.apiVersion})`
                      : "SANITY_PROJECT_ID"
                  }
                />
                <StatusRow
                  label="Governance database (Postgres)"
                  ok
                  detail={
                    governance
                      ? `${governance.usersCount} users · ${governance.rolesCount} roles · ${governance.permissionsCount} permissions`
                      : undefined
                  }
                />
                <StatusRow
                  label="Embedded Studio"
                  ok={Boolean(sanity?.configured)}
                  detail="/studio"
                />
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content inventory</CardTitle>
          <CardDescription>
            {documentTotal > 0
              ? `${documentTotal.toLocaleString("en-GB")} documents currently in the dataset.`
              : "Document counts per content type."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {query.isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full" />
              ))}
            </div>
          ) : hasDocuments ? (
            <div className="grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2 lg:grid-cols-5">
              {query.data?.documentCounts.map((entry) => (
                <div key={entry.type} className="bg-background px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {entry.label}
                  </p>
                  <p className="mt-0.5 font-display text-xl font-bold tabular-nums tracking-tight">
                    {entry.count.toLocaleString("en-GB")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No content store is connected, so document counts are unavailable.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Editing content</CardTitle>
          <CardDescription>How changes are made across this deployment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Public page content is edited in the embedded Sanity Studio at{" "}
            <code className="text-primary">/studio</code>. The admin console provides read-only,
            role-scoped views of that content so you can see exactly what is published without
            opening the editor.
          </p>
          <p>
            Roles, permissions and administrator accounts are managed here in the console, backed by
            the governance database. Every permission change and sign-in is written to the audit
            log.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
