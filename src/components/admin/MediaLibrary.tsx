"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  ExternalLink,
  FileText,
  ImageIcon,
  Images,
  Loader2,
  Replace,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

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
  useDeleteSanityAsset,
  useLibraryAssets,
  useMediaLibrary,
  useReplaceSanityAsset,
  useUploadSanityAsset,
} from "./admin-content";
import { hasPermission, useAdminSession } from "./admin-session";
import { NoAccess } from "./NoAccess";
import type { AssetListEntry } from "@/admin/content/types";

const STUDIO_TYPE_BY_OWNER: Record<string, string> = {
  Chapter: "chapter",
  Event: "event",
  Announcement: "announcement",
  "News item": "post",
  Outreach: "outreach",
  Page: "page",
};

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const ACCEPT = {
  image: "image/png,image/jpeg,image/webp,image/gif,image/avif",
  file: "application/pdf,.pdf,.doc,.docx",
} as const;

function studioUrl(ownerId: string, ownerType: string): string {
  const type = STUDIO_TYPE_BY_OWNER[ownerType] ?? ownerType;
  return `/studio/intent/edit/id=${encodeURIComponent(ownerId)}&type=${encodeURIComponent(type)}`;
}

/** Chunked so large files do not blow the argument limit of `String.fromCharCode`. */
function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const step = 0x8000;
  for (let i = 0; i < bytes.length; i += step) {
    binary += String.fromCharCode(...bytes.subarray(i, i + step));
  }
  return btoa(binary);
}

function formatBytes(size: number | null): string {
  if (size === null || size < 0) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function assetKindOf(asset: AssetListEntry): "image" | "file" {
  return asset.kind === "file" || asset.id.startsWith("file-") ? "file" : "image";
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

export function MediaLibrary() {
  const session = useAdminSession();
  const query = useMediaLibrary();
  const [search, setSearch] = useState("");
  const [ownerType, setOwnerType] = useState("all");

  const allAssets = useMemo(() => query.data?.assets ?? [], [query.data]);

  const ownerOptions = useMemo(() => {
    const set = new Set<string>();
    for (const asset of allAssets) set.add(asset.ownerType);
    return [...set].sort();
  }, [allAssets]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return allAssets
      .filter((asset) => {
        if (ownerType !== "all" && asset.ownerType !== ownerType) return false;
        if (!term) return true;
        return (
          asset.owner.toLowerCase().includes(term) ||
          (asset.caption ?? "").toLowerCase().includes(term) ||
          (asset.alt ?? "").toLowerCase().includes(term)
        );
      })
      .slice(0, 120);
  }, [allAssets, search, ownerType]);

  if (!hasPermission(session.data, "media.read")) {
    return <NoAccess icon={Images} permission="media.read" />;
  }

  const configured = query.data?.configured !== false;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Media Library</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Upload, replace and search every file in the content store, plus an index of images
            currently in use.
          </p>
        </div>
        <Button variant="outline" asChild className="shrink-0">
          <a href="/studio" target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" />
            Open in Studio
          </a>
        </Button>
      </div>

      {query.data?.stats.length ? (
        <div className="grid gap-3 sm:grid-cols-3">
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

      <AssetBrowser configured={configured} />

      <Card>
        <CardHeader>
          <CardTitle>Assets in use</CardTitle>
          <CardDescription>
            {configured
              ? "Index of images referenced by chapters, events, news and pages. Click through to edit the owning document in Studio."
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
                placeholder="Search owners, captions or alt text"
                className="pl-9"
                aria-label="Search media"
              />
            </div>
            {ownerOptions.length > 1 ? (
              <Select value={ownerType} onValueChange={setOwnerType}>
                <SelectTrigger className="sm:w-52" aria-label="Filter by content type">
                  <SelectValue placeholder="All content" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All content</SelectItem>
                  {ownerOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
          </div>

          {query.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-44 w-full" />
              ))}
            </div>
          ) : query.isError ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Could not load the media library.
            </div>
          ) : !configured ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Set <code className="text-primary">SANITY_PROJECT_ID</code> to connect the content
              store.
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              {allAssets.length === 0
                ? "No images are in use yet. Add cover images or galleries in the Studio."
                : "No assets match the current filters."}
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visible.map((asset) => (
                  <figure
                    key={asset.id}
                    className="overflow-hidden rounded-lg border bg-background transition-shadow hover:shadow-md"
                  >
                    <a
                      href={studioUrl(asset.ownerId, asset.ownerType)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={asset.url}
                        alt={asset.alt ?? asset.caption ?? asset.owner}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover"
                      />
                    </a>
                    <figcaption className="space-y-2 px-3 py-2.5">
                      <p className="truncate text-sm font-medium" title={asset.owner}>
                        {asset.owner}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline">{asset.field}</Badge>
                        <span className="text-xs text-muted-foreground">{asset.ownerType}</span>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
              {allAssets.length > visible.length ? (
                <p className="text-xs text-muted-foreground">
                  Showing {visible.length} of {allAssets.length} assets.
                </p>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AssetBrowser({ configured }: { configured: boolean }) {
  const session = useAdminSession();
  const canWrite = hasPermission(session.data, "media.write");
  const canDelete = hasPermission(session.data, "media.delete");

  const [search, setSearch] = useState("");
  const [kind, setKind] = useState<"all" | "image" | "file">("all");
  const debouncedSearch = useDebouncedValue(search.trim(), 300);

  const library = useLibraryAssets({ kind, search: debouncedSearch }, configured);
  const upload = useUploadSanityAsset(null);
  const replace = useReplaceSanityAsset();
  const remove = useDeleteSanityAsset();

  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [uploadKind, setUploadKind] = useState<"image" | "file">("image");
  const [replaceTarget, setReplaceTarget] = useState<AssetListEntry | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [deleteTarget, setDeleteTarget] = useState<AssetListEntry | null>(null);

  const assets = library.data?.assets ?? [];
  const busy = upload.isPending || replace.isPending || remove.isPending;

  async function handleUpload(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("Files must be 8 MB or smaller.");
      return;
    }
    try {
      const base64 = toBase64(await file.arrayBuffer());
      const result = await upload.mutateAsync({
        kind: uploadKind,
        filename: file.name,
        contentType: file.type || (uploadKind === "image" ? "image/png" : "application/pdf"),
        base64,
      });
      if (result.ok) {
        toast.success(`${file.name} uploaded.`);
      } else {
        toast.error(result.error ?? "The upload failed.");
      }
    } catch {
      toast.error("The upload failed. Please try again.");
    } finally {
      if (uploadInputRef.current) uploadInputRef.current.value = "";
    }
  }

  async function handleReplace(file: File | undefined) {
    if (!file || !replaceTarget) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("Files must be 8 MB or smaller.");
      return;
    }
    const targetAssetKind = assetKindOf(replaceTarget);
    try {
      const base64 = toBase64(await file.arrayBuffer());
      const result = await replace.mutateAsync({
        id: replaceTarget.id,
        kind: targetAssetKind,
        filename: file.name,
        contentType: file.type || (targetAssetKind === "image" ? "image/png" : "application/pdf"),
        base64,
      });
      if (result.ok) {
        toast.success("File replaced. Everything using it now shows the new version.");
        setReplaceTarget(null);
      } else {
        toast.error(result.error ?? "The replace failed.");
      }
    } catch {
      toast.error("The replace failed. Please try again.");
    } finally {
      if (replaceInputRef.current) replaceInputRef.current.value = "";
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const result = await remove.mutateAsync({ id: deleteTarget.id });
    if (result.ok) {
      toast.success(`${deleteTarget.name} deleted.`);
      setDeleteTarget(null);
    } else {
      toast.error(result.error ?? "The delete failed.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All assets</CardTitle>
        <CardDescription>
          {configured
            ? "Search every uploaded image and document. Replace a file to update it everywhere it is used; delete only works once nothing references it."
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
              placeholder="Search by file name"
              className="pl-9"
              aria-label="Search all assets by file name"
            />
          </div>
          <Select
            value={kind}
            onValueChange={(value) => setKind(value as "all" | "image" | "file")}
          >
            <SelectTrigger className="sm:w-40" aria-label="Filter by asset type">
              <SelectValue placeholder="All files" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All files</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="file">Documents</SelectItem>
            </SelectContent>
          </Select>
          {canWrite ? (
            <div className="flex gap-2">
              <Select
                value={uploadKind}
                onValueChange={(value) => setUploadKind(value as "image" | "file")}
              >
                <SelectTrigger className="w-28" aria-label="Upload type">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="file">Document</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                size="sm"
                disabled={upload.isPending}
                onClick={() => uploadInputRef.current?.click()}
              >
                {upload.isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 size-4" />
                )}
                Upload
              </Button>
            </div>
          ) : null}
        </div>

        {configured ? (
          <input
            ref={uploadInputRef}
            type="file"
            className="hidden"
            accept={ACCEPT[uploadKind]}
            onChange={(event) => void handleUpload(event.target.files?.[0])}
          />
        ) : null}
        <input
          ref={replaceInputRef}
          type="file"
          className="hidden"
          accept={replaceTarget ? ACCEPT[assetKindOf(replaceTarget)] : undefined}
          onChange={(event) => void handleReplace(event.target.files?.[0])}
        />

        {library.isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-36 w-full" />
            ))}
          </div>
        ) : library.isError ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            Could not load assets.
          </div>
        ) : !configured ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            Set <code className="text-primary">SANITY_PROJECT_ID</code> to connect the content
            store.
          </div>
        ) : assets.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            {debouncedSearch || kind !== "all"
              ? "No assets match the current filters."
              : "No files uploaded yet."}
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {assets.map((asset) => {
              const isImage = assetKindOf(asset) === "image";
              return (
                <li
                  key={asset.id}
                  className="flex flex-col overflow-hidden rounded-lg border bg-background"
                >
                  <div className="flex h-32 items-center justify-center bg-muted/30">
                    {isImage ? (
                      <img
                        src={asset.url}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FileText className="size-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 px-3 py-2.5">
                    <p className="truncate text-sm font-medium" title={asset.name}>
                      {asset.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isImage ? "Image" : "Document"}
                      {asset.size !== null ? ` · ${formatBytes(asset.size)}` : ""}
                      {asset.createdAt ? ` · ${formatDate(asset.createdAt)}` : ""}
                    </p>
                    <div className="mt-auto flex items-center gap-1">
                      {canWrite ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          disabled={busy}
                          onClick={() => setReplaceTarget(asset)}
                        >
                          <Replace className="mr-1 size-3.5" />
                          Replace
                        </Button>
                      ) : null}
                      {canDelete ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-destructive hover:text-destructive"
                          disabled={busy}
                          onClick={() => setDeleteTarget(asset)}
                        >
                          <Trash2 className="mr-1 size-3.5" />
                          Delete
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {(library.data?.total ?? 0) > 0 ? (
          <p className="text-xs text-muted-foreground">
            {library.data?.total} asset{library.data?.total === 1 ? "" : "s"}
            {debouncedSearch ? ` matching “${debouncedSearch}”` : ""}.
          </p>
        ) : null}
      </CardContent>

      <AlertDialog
        open={replaceTarget !== null}
        onOpenChange={(open) => {
          if (!open) setReplaceTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace “{replaceTarget?.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              Upload a new file to take its place. Every page already using this file will show the
              new version automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={replace.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={replace.isPending}
              onClick={(event) => {
                event.preventDefault();
                replaceInputRef.current?.click();
              }}
            >
              {replace.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <ImageIcon className="mr-2 size-4" />
              )}
              Choose new file
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{deleteTarget?.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the file from the content store. It can only be deleted once nothing on
              the site uses it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={remove.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={remove.isPending}
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
            >
              {remove.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 size-4" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
