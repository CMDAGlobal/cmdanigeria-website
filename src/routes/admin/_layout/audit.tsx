"use client";

import { createFileRoute } from "@tanstack/react-router";
import { ScrollText } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuditLogs } from "@/components/admin/admin-data";
import { useAdminSession } from "@/components/admin/admin-session";

export const Route = createFileRoute("/admin/_layout/audit")({
  component: AdminAuditPage,
  head: () => ({
    meta: [{ title: "Audit Log · Admin · CMDA Nigeria" }],
  }),
});

function outcomeVariant(outcome: string): "secondary" | "destructive" | "outline" {
  if (outcome === "success") return "secondary";
  if (outcome === "denied") return "destructive";
  return "outline";
}

function AdminAuditPage() {
  const session = useAdminSession();
  const { data, isLoading, isError } = useAuditLogs();

  const canViewAudit = session.data?.permissions.includes("audit_logs.view") === true;

  if (!canViewAudit) {
    return (
      <div className="rounded-lg border border-dashed bg-background/60 p-12 text-center">
        <ScrollText className="mx-auto h-8 w-8 text-muted-foreground" />
        <h2 className="mt-4 font-display text-xl font-bold tracking-tight">No access</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          You don’t hold the <code className="text-primary">audit_logs.view</code> permission.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">Audit log</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Every sign-in and privileged action across the admin platform, newest first.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent events</CardTitle>
          <CardDescription>Last 50 recorded events, scoped to your role.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Could not load the audit log.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead className="text-right">Outcome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data ?? []).map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-primary">
                        {entry.action}
                      </code>
                    </TableCell>
                    <TableCell className="text-sm">
                      {entry.actorName ?? entry.actorEmail ?? "System"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {entry.targetType ? (
                        <span>
                          {entry.targetType}
                          {entry.targetId ? ` · ${entry.targetId}` : ""}
                        </span>
                      ) : (
                        <span>—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={outcomeVariant(entry.outcome)} className="capitalize">
                        {entry.outcome}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
