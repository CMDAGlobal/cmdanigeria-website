"use client";

import { useMemo, useState } from "react";

import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";

import { pageSectionTypeLabel } from "@/admin/content/forms";
import type { ContentItem, PageSectionRow } from "@/admin/content/types";
import { usePageSections, useSetPageSections } from "./admin-content";

export interface PageSectionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ContentItem | null;
}

function sameOrder(left: PageSectionRow[], right: PageSectionRow[]): boolean {
  if (left.length !== right.length) return false;
  return left.every((row, index) => {
    const other = right[index];
    return other !== undefined && row.key === other.key && row.visible === other.visible;
  });
}

/**
 * Reorder and hide a page's sections. Section content itself is edited in
 * Studio - this dialog only ever sends `{ key, visible }` pairs back.
 */
export function PageSectionsDialog({ open, onOpenChange, item }: PageSectionsDialogProps) {
  const itemId = item?.id ?? null;
  const query = usePageSections(itemId, open);
  const save = useSetPageSections();

  const serverRows = useMemo(() => query.data?.sections ?? null, [query.data]);
  const [draft, setDraft] = useState<PageSectionRow[] | null>(null);

  const rows = draft ?? serverRows ?? [];
  const dirty = draft !== null && serverRows !== null && !sameOrder(draft, serverRows);

  function handleOpenChange(next: boolean) {
    if (!next) setDraft(null);
    onOpenChange(next);
  }

  function setVisible(key: string, visible: boolean) {
    setDraft(rows.map((row) => (row.key === key ? { ...row, visible } : row)));
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    const [moved] = next.splice(index, 1);
    if (!moved) return;
    next.splice(target, 0, moved);
    setDraft(next);
  }

  async function saveSections() {
    if (!itemId || !dirty) return;
    try {
      const result = await save.mutateAsync({
        id: itemId,
        sections: rows.map((row) => ({ key: row.key, visible: row.visible })),
      });
      if (result.ok) {
        toast.success("Page sections updated.");
        setDraft(null);
        handleOpenChange(false);
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Page sections</DialogTitle>
          <DialogDescription>
            {item?.title ?? "This page"} — show, hide or reorder sections. Section text and images
            are edited in Studio.
          </DialogDescription>
        </DialogHeader>

        {query.isFetching && rows.length === 0 ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : query.isError ? (
          <p className="text-sm text-destructive">
            {query.data?.error ?? "Could not load this page's sections."}
          </p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            This page has no sections yet. Add them in Studio, then come back to arrange them.
          </p>
        ) : (
          <ul className="space-y-2">
            {rows.map((row, index) => (
              <li
                key={row.key}
                className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{row.label}</p>
                  <Badge variant="outline" className="mt-1 whitespace-nowrap">
                    {pageSectionTypeLabel(row.type)}
                  </Badge>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Checkbox
                      checked={row.visible}
                      onCheckedChange={(checked) => setVisible(row.key, checked === true)}
                      aria-label={`Show ${row.label}`}
                    />
                    Visible
                  </label>
                  <div className="flex flex-col">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-6"
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                      aria-label={`Move ${row.label} up`}
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-6"
                      disabled={index === rows.length - 1}
                      onClick={() => move(index, 1)}
                      aria-label={`Move ${row.label} down`}
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => void saveSections()} disabled={!dirty || save.isPending}>
            {save.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save sections
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
