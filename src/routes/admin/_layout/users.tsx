"use client";

import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, Users, X } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  useAdminUsers,
  useAssignRole,
  useCreateAdminUser,
  useRevokeRole,
  useSetUserActive,
  useUserManagementOptions,
} from "@/components/admin/admin-data";
import { useAdminSession, scopeLabel } from "@/components/admin/admin-session";
import type { AdminUserSummary } from "@/admin/data/server";

export const Route = createFileRoute("/admin/_layout/users")({
  component: AdminUsersPage,
  head: () => ({
    meta: [{ title: "Administrators · Admin · CMDA Nigeria" }],
  }),
});

const ARM_OPTIONS: { value: string; label: string }[] = [
  { value: "global", label: "Global" },
  { value: "students", label: "Students" },
  { value: "doctors", label: "Doctors" },
];

interface ScopeRequirement {
  needsArm: boolean;
  needsChapter: boolean;
  needsRegion: boolean;
  systemWide: boolean;
}

function scopeRequirement(roleKey: string | undefined): ScopeRequirement {
  switch (roleKey) {
    case "super_admin":
      return { needsArm: false, needsChapter: false, needsRegion: false, systemWide: true };
    case "arm_admin":
    case "content_editor":
      return { needsArm: true, needsChapter: false, needsRegion: false, systemWide: false };
    case "chapter_admin":
      return { needsArm: true, needsChapter: true, needsRegion: false, systemWide: false };
    case "region_admin":
      return { needsArm: false, needsChapter: false, needsRegion: true, systemWide: false };
    default:
      return { needsArm: false, needsChapter: false, needsRegion: false, systemWide: false };
  }
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type DialogState =
  | { open: false }
  | { open: true; mode: "create" }
  | { open: true; mode: "grant"; target: AdminUserSummary };

function AdminUsersPage() {
  const session = useAdminSession();
  const { data, isLoading, isError } = useAdminUsers();
  const options = useUserManagementOptions();
  const createMutation = useCreateAdminUser();
  const grantMutation = useAssignRole();
  const revokeMutation = useRevokeRole();
  const toggleMutation = useSetUserActive();

  const [dialog, setDialog] = useState<DialogState>({ open: false });
  const [seq, setSeq] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleKey, setRoleKey] = useState<string | undefined>(undefined);
  const [arm, setArm] = useState<string | undefined>(undefined);
  const [chapterSlug, setChapterSlug] = useState<string | undefined>(undefined);
  const [regionSlug, setRegionSlug] = useState<string | undefined>(undefined);

  const canViewUsers = session.data?.permissions.includes("users.read") === true;
  const canAssignRoles = session.data?.permissions.includes("users.assign_roles") === true;
  const canDeactivate = session.data?.permissions.includes("users.delete") === true;
  const assignableRoles = options.data?.assignableRoles ?? [];
  const assignableArms = options.data?.assignableArms ?? [];

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

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setRoleKey(undefined);
    setArm(undefined);
    setChapterSlug(undefined);
    setRegionSlug(undefined);
    setFormError(null);
  }

  function openCreate() {
    resetForm();
    setSeq((value) => value + 1);
    setDialog({ open: true, mode: "create" });
  }

  function openGrant(target: AdminUserSummary) {
    resetForm();
    setSeq((value) => value + 1);
    setDialog({ open: true, mode: "grant", target });
  }

  function closeDialog() {
    setDialog({ open: false });
    setFormError(null);
    createMutation.reset();
    grantMutation.reset();
  }

  function changeRole(value: string) {
    setRoleKey(value);
    setArm(undefined);
    setChapterSlug(undefined);
    setRegionSlug(undefined);
    setFormError(null);
  }

  function changeArm(value: string) {
    setArm(value);
    setChapterSlug(undefined);
    setFormError(null);
  }

  function buildScope(): { arm?: string; regionSlug?: string; chapterSlug?: string } {
    const requirement = scopeRequirement(roleKey);
    const scope: { arm?: string; regionSlug?: string; chapterSlug?: string } = {};
    if (roleKey === "region_admin") {
      scope.arm = "global";
      if (regionSlug) scope.regionSlug = regionSlug;
      return scope;
    }
    if (requirement.needsArm && arm) scope.arm = arm;
    if (requirement.needsChapter && chapterSlug) scope.chapterSlug = chapterSlug;
    return scope;
  }

  function validateForm(mode: "create" | "grant"): string | null {
    if (!roleKey) return "Choose a role.";
    const requirement = scopeRequirement(roleKey);
    if (requirement.systemWide) return null;
    if (requirement.needsArm && !arm) return "Choose an arm.";
    if (requirement.needsChapter && !chapterSlug) return "Choose a chapter.";
    if (requirement.needsRegion && !regionSlug) return "Choose a region.";
    if (mode === "create") {
      if (!name.trim()) return "Enter the administrator’s name.";
      if (!email.trim()) return "Enter an email address.";
      if (password.length < 8) return "Password must be at least 8 characters.";
    }
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!dialog.open) return;
    const error = validateForm(dialog.mode);
    if (error) {
      setFormError(error);
      return;
    }
    setFormError(null);
    const scope = buildScope();
    try {
      const result =
        dialog.mode === "create"
          ? await createMutation.mutateAsync({
              name: name.trim(),
              email: email.trim(),
              password,
              roleKey: roleKey ?? "",
              scope,
            })
          : await grantMutation.mutateAsync({
              userId: dialog.target.id,
              roleKey: roleKey ?? "",
              scope,
            });
      if (result.ok) {
        closeDialog();
      } else {
        setFormError(result.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setFormError("Something went wrong. Please try again.");
    }
  }

  async function handleRevoke(
    user: AdminUserSummary,
    roleKeyToRevoke: string,
    scope: {
      arm?: string;
      regionSlug?: string;
      chapterSlug?: string;
    },
  ) {
    const label = `${user.name || user.email}`;
    if (!window.confirm(`Remove this role from ${label}?`)) return;
    setRowError(null);
    try {
      const result = await revokeMutation.mutateAsync({
        userId: user.id,
        roleKey: roleKeyToRevoke,
        scope,
      });
      if (!result.ok) setRowError(result.error ?? "Could not remove the role.");
    } catch {
      setRowError("Something went wrong. Please try again.");
    }
  }

  async function handleToggleActive(user: AdminUserSummary) {
    const verb = user.isActive ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${verb} ${user.name || user.email}?`)) return;
    setRowError(null);
    try {
      const result = await toggleMutation.mutateAsync({
        userId: user.id,
        isActive: !user.isActive,
      });
      if (!result.ok) setRowError(result.error ?? "Could not update the account.");
    } catch {
      setRowError("Something went wrong. Please try again.");
    }
  }

  const requirement = scopeRequirement(roleKey);
  const chapterArms = [...new Set((options.data?.chapters ?? []).map((chapter) => chapter.arm))];
  const armChoices = assignableArms.filter(
    (value) => roleKey !== "chapter_admin" || chapterArms.includes(value),
  );
  const chapterChoices = (options.data?.chapters ?? []).filter(
    (chapter) => !arm || chapter.arm === arm,
  );
  const selectedRole = assignableRoles.find((role) => role.key === roleKey);
  const dialogBusy = createMutation.isPending || grantMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Administrators</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Accounts that can sign in to the CMDA Nigeria admin console.
          </p>
        </div>
        {canAssignRoles && assignableRoles.length > 0 ? (
          <Button onClick={openCreate}>
            <UserPlus className="mr-2 h-4 w-4" />
            New administrator
          </Button>
        ) : null}
      </div>

      {rowError ? (
        <Alert variant="destructive">
          <AlertDescription>{rowError}</AlertDescription>
        </Alert>
      ) : null}

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
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                              title={scopeLabel(role.scope)}
                              className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"
                            >
                              {role.name}
                              {canAssignRoles && assignableRoles.length > 0 ? (
                                <button
                                  type="button"
                                  aria-label={`Remove ${role.name}`}
                                  className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                                  onClick={() => void handleRevoke(user, role.key, role.scope)}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              ) : null}
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
                    <TableCell className="text-xs tabular-nums text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1.5">
                        {canAssignRoles && assignableRoles.length > 0 ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openGrant(user)}
                            title="Grant a role to this administrator"
                          >
                            Grant role
                          </Button>
                        ) : null}
                        {canDeactivate ? (
                          <Button
                            variant={user.isActive ? "ghost" : "outline"}
                            size="sm"
                            onClick={() => void handleToggleActive(user)}
                            className={
                              user.isActive ? "text-destructive hover:text-destructive" : ""
                            }
                          >
                            {user.isActive ? "Deactivate" : "Activate"}
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={dialog.open}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialog.open && dialog.mode === "grant"
                ? `Grant role to ${dialog.target.name || dialog.target.email}`
                : "New administrator"}
            </DialogTitle>
            <DialogDescription>
              {dialog.open && dialog.mode === "grant"
                ? "Add another scoped role to this account."
                : "Create an account and assign its initial role. Access is limited to the chosen scope."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
            {dialog.open && dialog.mode === "create" ? (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="admin-name">Full name</Label>
                  <Input
                    id="admin-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-muted-foreground">At least 8 characters.</p>
                </div>
              </>
            ) : null}

            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select key={`role-${seq}`} onValueChange={changeRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {assignableRoles.map((role) => (
                    <SelectItem key={role.key} value={role.key}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedRole ? (
                <p className="text-xs text-muted-foreground">{selectedRole.description}</p>
              ) : null}
            </div>

            {requirement.systemWide && roleKey ? (
              <p className="rounded-md bg-accent px-3 py-2 text-xs text-accent-foreground">
                Super Admins receive unrestricted, system-wide access — no scope is required.
              </p>
            ) : null}

            {requirement.needsArm ? (
              <div className="space-y-1.5">
                <Label>Arm</Label>
                <Select key={`arm-${seq}-${roleKey ?? ""}`} onValueChange={changeArm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an arm" />
                  </SelectTrigger>
                  <SelectContent>
                    {armChoices.map((value) => (
                      <SelectItem key={value} value={value}>
                        {ARM_OPTIONS.find((option) => option.value === value)?.label ?? value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {requirement.needsChapter ? (
              <div className="space-y-1.5">
                <Label>Chapter</Label>
                <Select
                  key={`chapter-${seq}-${roleKey ?? ""}-${arm ?? ""}`}
                  onValueChange={setChapterSlug}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapterChoices.map((chapter) => (
                      <SelectItem key={chapter.slug} value={chapter.slug}>
                        {chapter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {requirement.needsRegion ? (
              <div className="space-y-1.5">
                <Label>Region (Global Network)</Label>
                <Select key={`region-${seq}-${roleKey ?? ""}`} onValueChange={setRegionSlug}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    {(options.data?.regions ?? []).map((region) => (
                      <SelectItem key={region.slug} value={region.slug}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {formError ? (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            ) : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={dialogBusy}>
                {dialogBusy
                  ? "Saving…"
                  : dialog.open && dialog.mode === "grant"
                    ? "Grant role"
                    : "Create administrator"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
