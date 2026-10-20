"use client";

import { useMemo, useState } from "react";
import { ExternalLink, FilePlus2, Pencil } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

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
import { KIND_LABELS, MODULE_ROUTE_PREFIX, SITE_PAGES } from "@/admin/content/site-pages";
import type { SitePageEntry } from "@/admin/content/site-pages";
import type { ContentItem, ContentModuleKey } from "@/admin/content/types";
import { useContentModule, useCreateContent } from "./admin-content";
import { ContentEditorDialog } from "./ContentEditorDialog";
import { hasPermission, useAdminSession } from "./admin-session";

export function WebsitePages() {
  const session = useAdminSession();
  const pagesQuery = useContentModule("pages");
  const createMutation = useCreateContent("pages");
  const [editorItem, setEditorItem] = useState<ContentItem | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const canWrite = hasPermission(session.data, "pages.write");

  const docBySlug = useMemo(() => {
    const map = new Map<string, ContentItem>();
    for (const item of pagesQuery.data?.items ?? []) {
      if (item.slug) map.set(item.slug, item);
    }
    return map;
  }, [pagesQuery.data]);

  const rows: SitePageEntry[] = useMemo(() => {
    const known = new Set(SITE_PAGES.map((entry) => entry.pageSlug).filter(Boolean));
    const dynamic: SitePageEntry[] = [];
    for (const item of pagesQuery.data?.items ?? []) {
      if (!item.slug || known.has(item.slug)) continue;
      dynamic.push({
        title: item.title,
        path: `/${item.slug}`,
        kind: "cms",
        pageSlug: item.slug,
        publication: item.status?.label ?? null,
        hasDoc: true,
      });
    }
    return [
      ...SITE_PAGES.map((entry) => {
        const doc = entry.pageSlug ? docBySlug.get(entry.pageSlug) : undefined;
        return {
          ...entry,
          publication: doc?.status?.label ?? null,
          hasDoc: Boolean(doc),
        };
      }),
      ...dynamic,
    ];
  }, [docBySlug, pagesQuery.data]);

  const loading = pagesQuery.isLoading;

  function openEditor(entry: SitePageEntry) {
    if (!entry.pageSlug) return;
    const doc = docBySlug.get(entry.pageSlug);
    if (doc) {
      setEditorItem(doc);
      setEditorOpen(true);
      return;
    }
    if (!canWrite) {
      toast.error("You need page-editing permission to create a page draft.");
      return;
    }
    void createMutation.mutateAsync(
      {
        module: "pages",
        fields: {
          title: entry.title,
          slug: entry.pageSlug,
          body: "",
          seoTitle: entry.title,
          seoDescription: "",
        },
        scope: { arm: "global", regions: [], zones: [], chapters: [] },
        publication: "draft",
      },
      {
        onSuccess: (result) => {
          if (result.ok) {
            toast.success(`Created a draft page for ${entry.title}.`);
            void pagesQuery.refetch();
          } else {
            toast.error(result.error ?? "Could not create the page draft.");
          }
        },
        onError: () => toast.error("Could not create the page draft."),
      },
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Website Pages</CardTitle>
          <CardDescription>
            Every public URL and where its content is managed — CMS page, hybrid sections, module
            lists or code constants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead className="hidden sm:table-cell">URL</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((entry) => {
                  const href = entry.path.startsWith("/") ? entry.path : `/${entry.path}`;
                  const base = href.split("#")[0] ?? href;
                  return (
                    <TableRow key={`${entry.title}-${entry.path}`}>
                      <TableCell>
                        <p className="font-medium">{entry.title}</p>
                        {entry.editHint ? (
                          <p className="mt-0.5 text-xs text-muted-foreground">{entry.editHint}</p>
                        ) : null}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <a
                          href={base}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                        >
                          {href}
                          <ExternalLink className="h-3 w-3" aria-hidden />
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="whitespace-nowrap">
                          {KIND_LABELS[entry.kind]}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {entry.publication ? (
                          <span className="text-xs">{entry.publication}</span>
                        ) : entry.kind === "static" || entry.kind === "list" ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">No draft</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {(entry.kind === "cms" || entry.kind === "hybrid") && entry.pageSlug ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditor(entry)}
                            disabled={createMutation.isPending}
                          >
                            {entry.hasDoc ? (
                              <>
                                <Pencil className="mr-1 h-3 w-3" aria-hidden />
                                Edit
                              </>
                            ) : (
                              <>
                                <FilePlus2 className="mr-1 h-3 w-3" aria-hidden />
                                Create draft
                              </>
                            )}
                          </Button>
                        ) : entry.kind === "list" && entry.editModule ? (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={MODULE_ROUTE_PREFIX[entry.editModule] ?? "/admin"}>
                              Manage list
                            </Link>
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">View only</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ContentEditorDialog
        module={"pages" satisfies ContentModuleKey as ContentModuleKey}
        open={editorOpen}
        onOpenChange={(open) => {
          setEditorOpen(open);
          if (!open) setEditorItem(null);
        }}
        item={editorItem}
        noun="page"
      />
    </div>
  );
}
