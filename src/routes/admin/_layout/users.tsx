"use client";

import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";

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
import { useAdminUsers } from "@/components/admin/admin-data";
import { useAdminSession, scopeLabel } from "@/components/admin/admin-session";

export const Route = createFileRoute("/admin/_layout/users")({
  component: AdminUsersPage,
  head: () => ({
    meta: [{ title: "Administrators · Admin · CMDA Nigeria" }],
  }),
});

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function AdminUsersPage() {
  const session = useAdminSession();
  const { data, isLoading, isError } = useAdminUsers();

  const canViewUsers = session.data?.permissions.includes("users.read") === true;

  if (!canViewUsers) {
    return (
      <div className="rounded-lg border border-dashed bg-background/60 p-12 text-center">
        <Users className="mx-auto h-8 w-8 text-muted-foreground" />
        <h2 className="mt-4 font-display text-xl font-bold tracking-tight">No access</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          You don’t hold the <code className="text-primary">users.read</code> permission.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">Administrators</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Accounts that can sign in to the CMDA Nigeria admin console.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin accounts</CardTitle>
          <CardDescription>Role assignments and current status.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Could not load administrator accounts.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Administrator</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data ?? []).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {initials(user.name || user.email)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {user.name || "—"}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.roles.length ? (
                        <div className="flex flex-wrap gap-1.5">
                          {user.roles.map((role, index) => (
                            <span
                              key={`${role.key}-${index}`}
                              title={
                                Object.keys(role.scope).length
                                  ? scopeLabel(role.scope)
                                  : "System-wide"
                              }
                              className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"
                            >
                              {role.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No roles</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.isActive ? "secondary" : "destructive"}
                        className={user.isActive ? "" : "text-destructive-foreground"}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs tabular-nums text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
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
