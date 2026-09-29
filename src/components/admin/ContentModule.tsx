"use client";

import { useMemo, useState } from "react";
import {
  CalendarClock,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { armLabel, kindLabel } from "@/admin/content/mappers";
import { MODULE_MUTATIONS } from "@/admin/content/validate";
import type { ContentItem, ContentModuleKey } from "@/admin/content/types";
import {
  CONTENT_PUBLICATION_STATUSES,
  type ContentPublicationStatus,
} from "@/admin/content/validate";
import type { PermissionKey } from "@/admin/rbac/permissions";
import { useContentModule, useDeleteContent, useSetPublication } from "./admin-content";
import { hasPermission, useAdminSession } from "./admin-session";
import { ContentEditorDialog } from "./ContentEditorDialog";
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
  /** Singular noun used by the create button, e.g. "event". */
  noun?: string;
  /** Locks the arm filter, e.g. an arm hub page for `students`. */
  initialArm?: string;
  /** Restricts the list to one document kind, e.g. `article` for the blog. */
  kindFilter?: string;
}

const MAX_ROWS = 200;

const PUBLICATION_LABELS: Record<ContentPublicationStatus, string> = {
  draft: "Draft",
  published: "Published",
  scheduled: "Scheduled",
  archived: "Archived",
};

function publicationFromStatus(item: ContentItem): ContentPublicationStatus | null {
  const label = item.status?.label.toLowerCase();
  if (label === "draft" || label === "published" || label === "scheduled" || label === "archived") {
    return label;
  }
  return null;
}

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
  noun = "item",
  initialArm,
  kindFilter,
}: ContentModuleProps) {
  const session = useAdminSession();
  const query = useContentModule(module);
  const [search, setSearch] = useState("");
  const [arm, setArm] = useState(initialArm ?? "all");
  const [status, setStatus] = useState("all");
  const [statusItem, setStatusItem] = useState<ContentItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<ContentItem | null>(null);
  const [editor, setEditor] = useState<{ open: boolean; item: ContentItem | null }>({
    open: false,
    item: null,
  });
  const [nextStatus, setNextStatus] = useState<ContentPublicationStatus>("published");
  const [publishAtLocal, setPublishAtLocal] = useState("");

  const writePermission = permission.replace(/\.read$/, ".write") as PermissionKey;
  const deletePermission = permission.replace(/\.read$/, ".delete") as PermissionKey;
  const canWrite = hasPermission(session.data, writePermission);
  const canDelete = hasPermission(session.data, deletePermission);
  const supportsPublication = MODULE_MUTATIONS[module].publication;

  const setPublication = useSetPublication(module);
  const removeItem = useDeleteContent(module);
  const publicationBusy = setPublication.isPending;
  const deleteBusy = removeItem.isPending;

  function openStatusDialog(item: ContentItem) {
    setNextStatus(publicationFromStatus(item) ?? "published");
    setPublishAtLocal("");
    setStatusItem(item);
  }

  async function applyPublication() {
    if (!statusItem) return;
    let publishAt: string | null = null;
    if (nextStatus === "scheduled") {
      const parsed = publishAtLocal ? new Date(publishAtLocal) : null;
      if (!parsed || Number.isNaN(parsed.getTime())) {
        toast.error("Choose a valid date and time for the scheduled release.");
        return;
      }
      publishAt = parsed.toISOString();
    }
    try {
      const result = await setPublication.mutateAsync({
        module,
        id: statusItem.id,
        publication: nextStatus,
        publishAt,
      });
      if (result.ok) {
        toast.success(
          `“${statusItem.title}” is now ${PUBLICATION_LABELS[nextStatus].toLowerCase()}.`,
        );
        setStatusItem(null);
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  async function confirmDelete() {
    if (!deleteItem) return;
    try {
      const result = await removeItem.mutateAsync({ module, id: deleteItem.id });
      if (result.ok) {
        toast.success(`“${deleteItem.title}” deleted.`);
        setDeleteItem(null);
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

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
        if (kindFilter && item.kind !== kindFilter) return false;
        if (status !== "all" && (item.status?.label ?? "") !== status) return false;
        return matches(item, term);
      })
      .slice(0, MAX_ROWS);
  }, [allItems, search, arm, status, kindFilter]);

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
        <div className="flex shrink-0 items-center gap-2">
          {canWrite && configured ? (
            <Button onClick={() => setEditor({ open: true, item: null })}>
              <Plus className="h-4 w-4" />
              New {noun}
            </Button>
          ) : null}
          <Button variant="outline" asChild>
            <a href={`/studio/${studioType}`} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
              Open in Studio
            </a>
          </Button>
        </div>
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
              ? `Scoped to your role.${
                  initialArm ? ` Showing ${armLabel(initialArm)} only.` : ""
                }${kindFilter ? ` Showing ${kindLabel(kindFilter)} only.` : ""} Create and edit in the dashboard, use the row menu for publication and deletion, or open Studio for full editing.`
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
            {armOptions.length > 1 && !initialArm ? (
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
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={studioUrl(studioType, item.id)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground transition-colors hover:text-primary"
                            aria-label={`Edit ${item.title} in Studio`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          {canWrite || canDelete ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  aria-label={`Actions for ${item.title}`}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {canWrite ? (
                                  <DropdownMenuItem
                                    onSelect={() => setEditor({ open: true, item })}
                                  >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit…
                                  </DropdownMenuItem>
                                ) : null}
                                {canWrite && supportsPublication ? (
                                  <DropdownMenuItem onSelect={() => openStatusDialog(item)}>
                                    <CalendarClock className="mr-2 h-4 w-4" />
                                    Change status…
                                  </DropdownMenuItem>
                                ) : null}
                                {canDelete ? (
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onSelect={() => setDeleteItem(item)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete…
                                  </DropdownMenuItem>
                                ) : null}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : null}
                        </div>
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

      <ContentEditorDialog
        module={module}
        open={editor.open}
        onOpenChange={(open) => setEditor((prev) => ({ ...prev, open }))}
        item={editor.item}
        noun={noun}
      />

      <Dialog
        open={statusItem !== null}
        onOpenChange={(open) => {
          if (!open) setStatusItem(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change publication status</DialogTitle>
            <DialogDescription>{statusItem?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="publication-status">Status</Label>
              <Select
                value={nextStatus}
                onValueChange={(value) => setNextStatus(value as ContentPublicationStatus)}
              >
                <SelectTrigger id="publication-status" aria-label="Publication status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_PUBLICATION_STATUSES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {PUBLICATION_LABELS[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {nextStatus === "scheduled" ? (
              <div className="space-y-2">
                <Label htmlFor="publish-at">Publish at</Label>
                <Input
                  id="publish-at"
                  type="datetime-local"
                  value={publishAtLocal}
                  onChange={(event) => setPublishAtLocal(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The item appears on the public site at this time.
                </p>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusItem(null)}
              disabled={publicationBusy}
            >
              Cancel
            </Button>
            <Button onClick={applyPublication} disabled={publicationBusy}>
              {publicationBusy ? "Saving…" : "Apply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteItem !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteItem(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              “{deleteItem?.title}” will be permanently removed from the content store. This cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteBusy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteBusy}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteBusy ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
