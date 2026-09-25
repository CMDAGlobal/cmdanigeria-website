"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Images, Search } from "lucide-react";

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
import { useMediaLibrary } from "./admin-content";
import { hasPermission, useAdminSession } from "./admin-session";
import { NoAccess } from "./NoAccess";

const STUDIO_TYPE_BY_OWNER: Record<string, string> = {
  Chapter: "chapter",
  Event: "event",
  Announcement: "announcement",
  "News item": "post",
  Outreach: "outreach",
  Page: "page",
};

function studioUrl(ownerId: string, ownerType: string): string {
  const type = STUDIO_TYPE_BY_OWNER[ownerType] ?? ownerType;
  return `/studio/intent/edit/id=${encodeURIComponent(ownerId)}&type=${encodeURIComponent(type)}`;
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
            Every image currently in use across chapters, events, news and pages.
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

      <Card>
        <CardHeader>
          <CardTitle>Assets in use</CardTitle>
          <CardDescription>
            {configured
              ? "Read-only index. Replace or add images in the Studio."
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
