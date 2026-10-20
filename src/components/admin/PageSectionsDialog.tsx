"use client";

import { useEffect, useMemo, useState } from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import { PAGE_SECTION_TYPE_KEYS, type PageSectionTypeKey } from "@/admin/content/validate";
import { pageSectionTypeLabel, flattenPortableText } from "@/admin/content/forms";
import type { ContentItem, PageSectionOrder, PageSectionRow } from "@/admin/content/types";
import { usePageSections, useSetPageSections } from "./admin-content";

export interface PageSectionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ContentItem | null;
}

interface DraftSection extends PageSectionRow {
  fields: Record<string, unknown>;
}

function sameOrder(left: PageSectionOrder[], right: PageSectionOrder[]): boolean {
  if (left.length !== right.length) return false;
  return left.every((row, index) => {
    const other = right[index];
    return other !== undefined && row.key === other.key && row.visible === other.visible;
  });
}

function makeKey(): string {
  return `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

const TEXT_FIELDS: Record<PageSectionTypeKey, Array<{ name: string; label: string }>> = {
  heroSection: [
    { name: "eyebrow", label: "Eyebrow" },
    { name: "heading", label: "Heading" },
    { name: "body", label: "Body" },
    { name: "ctaLabel", label: "Button label" },
    { name: "ctaHref", label: "Button link" },
  ],
  richTextSection: [
    { name: "eyebrow", label: "Eyebrow" },
    { name: "heading", label: "Heading" },
    { name: "body", label: "Body" },
  ],
  imageTextSection: [
    { name: "eyebrow", label: "Eyebrow" },
    { name: "heading", label: "Heading" },
    { name: "body", label: "Body" },
    { name: "imageAlt", label: "Image alt text" },
    { name: "imageCaption", label: "Image caption" },
    { name: "ctaLabel", label: "Button label" },
    { name: "ctaHref", label: "Button link" },
  ],
  statsSection: [
    { name: "eyebrow", label: "Eyebrow" },
    { name: "heading", label: "Heading" },
    { name: "body", label: "Body" },
  ],
  cardsSection: [
    { name: "eyebrow", label: "Eyebrow" },
    { name: "heading", label: "Heading" },
    { name: "body", label: "Body" },
  ],
  gallerySection: [
    { name: "eyebrow", label: "Eyebrow" },
    { name: "heading", label: "Heading" },
    { name: "body", label: "Body" },
  ],
  videoSection: [
    { name: "eyebrow", label: "Eyebrow" },
    { name: "heading", label: "Heading" },
    { name: "body", label: "Body" },
    { name: "videoId", label: "Video ID or URL" },
    { name: "caption", label: "Caption" },
  ],
  ctaSection: [
    { name: "eyebrow", label: "Eyebrow" },
    { name: "heading", label: "Heading" },
    { name: "body", label: "Body" },
    { name: "ctaLabel", label: "Button label" },
    { name: "ctaHref", label: "Button link" },
  ],
};

function SectionEditor({
  section,
  onChange,
}: {
  section: DraftSection;
  onChange: (fields: Record<string, unknown>) => void;
}) {
  const type = section.type as PageSectionTypeKey;
  const textFields = TEXT_FIELDS[type] ?? [];
  const get = (name: string): string => {
    const value = section.fields[name];
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return flattenPortableText(value);
    return "";
  };

  return (
    <div className="space-y-3 rounded-md border bg-muted/30 p-3">
      {textFields.map((field) => (
        <div key={field.name} className="space-y-1">
          <Label className="text-xs" htmlFor={`section-${section.key}-${field.name}`}>
            {field.label}
          </Label>
          {field.name === "body" ? (
            <Textarea
              id={`section-${section.key}-${field.name}`}
              value={get(field.name)}
              rows={3}
              placeholder="One paragraph per line."
              onChange={(event) =>
                onChange({ ...section.fields, [field.name]: event.target.value })
              }
            />
          ) : (
            <Input
              id={`section-${section.key}-${field.name}`}
              value={get(field.name)}
              onChange={(event) =>
                onChange({ ...section.fields, [field.name]: event.target.value })
              }
            />
          )}
        </div>
      ))}

      {type === "videoSection" ? (
        <div className="space-y-1">
          <Label className="text-xs" htmlFor={`section-${section.key}-provider`}>
            Provider
          </Label>
          <Select
            value={
              typeof section.fields["provider"] === "string"
                ? section.fields["provider"]
                : "youtube"
            }
            onValueChange={(value) => onChange({ ...section.fields, provider: value })}
          >
            <SelectTrigger id={`section-${section.key}-provider`} className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="vimeo">Vimeo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {type === "ctaSection" ? (
        <div className="space-y-1">
          <Label className="text-xs" htmlFor={`section-${section.key}-tone`}>
            Style
          </Label>
          <Select
            value={typeof section.fields["tone"] === "string" ? section.fields["tone"] : "primary"}
            onValueChange={(value) => onChange({ ...section.fields, tone: value })}
          >
            <SelectTrigger id={`section-${section.key}-tone`} className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primary">Primary</SelectItem>
              <SelectItem value="muted">Muted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {type === "imageTextSection" ? (
        <div className="space-y-1">
          <Label className="text-xs" htmlFor={`section-${section.key}-imageSide`}>
            Image side
          </Label>
          <Select
            value={
              typeof section.fields["imageSide"] === "string"
                ? section.fields["imageSide"]
                : "right"
            }
            onValueChange={(value) => onChange({ ...section.fields, imageSide: value })}
          >
            <SelectTrigger id={`section-${section.key}-imageSide`} className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {type === "cardsSection" ? (
        <div className="space-y-1">
          <Label className="text-xs" htmlFor={`section-${section.key}-columns`}>
            Columns
          </Label>
          <Select
            value={typeof section.fields["columns"] === "string" ? section.fields["columns"] : "3"}
            onValueChange={(value) => onChange({ ...section.fields, columns: value })}
          >
            <SelectTrigger id={`section-${section.key}-columns`} className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {type === "statsSection" ? (
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Checkbox
            checked={section.fields["autoFill"] === true}
            onCheckedChange={(checked) =>
              onChange({ ...section.fields, autoFill: checked === true })
            }
          />
          Fill from live CMS counts
        </label>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Photos, gallery images and rich card lists keep their Studio-managed content. Text fields
        saved here update the live page.
      </p>
    </div>
  );
}

/**
 * Reorder, hide, add, delete and edit a page's sections. Field edits cover
 * text/eyebrow/heading and simple type options; image assets stay Studio-only.
 */
export function PageSectionsDialog({ open, onOpenChange, item }: PageSectionsDialogProps) {
  const itemId = item?.id ?? null;
  const query = usePageSections(itemId, open);
  const save = useSetPageSections();

  const serverRows = useMemo(() => query.data?.sections ?? null, [query.data]);
  const [draft, setDraft] = useState<DraftSection[] | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newType, setNewType] = useState<string>("richTextSection");

  const rows: DraftSection[] = draft ?? (serverRows ?? []).map((row) => ({ ...row, fields: {} }));
  const dirty = draft !== null;

  useEffect(() => {
    if (!open) {
      setDraft(null);
      setEditingKey(null);
    }
  }, [open]);

  function ensureDraft(): DraftSection[] {
    return draft ?? (serverRows ?? []).map((row) => ({ ...row, fields: {} }));
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      setDraft(null);
      setEditingKey(null);
    }
    onOpenChange(next);
  }

  function setVisible(key: string, visible: boolean) {
    setDraft(ensureDraft().map((row) => (row.key === key ? { ...row, visible } : row)));
  }

  function move(index: number, delta: number) {
    const next = [...ensureDraft()];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    const [moved] = next.splice(index, 1);
    if (!moved) return;
    next.splice(target, 0, moved);
    setDraft(next);
  }

  function remove(key: string) {
    setDraft(ensureDraft().filter((row) => row.key !== key));
    if (editingKey === key) setEditingKey(null);
  }

  function addSection() {
    const type = newType as PageSectionTypeKey;
    if (!(PAGE_SECTION_TYPE_KEYS as readonly string[]).includes(type)) return;
    const row: DraftSection = {
      key: makeKey(),
      type,
      label: pageSectionTypeLabel(type),
      visible: true,
      fields: {},
    };
    setDraft([...ensureDraft(), row]);
    setEditingKey(row.key);
  }

  function updateFields(key: string, fields: Record<string, unknown>) {
    setDraft(ensureDraft().map((row) => (row.key === key ? { ...row, fields } : row)));
  }

  async function saveSections() {
    if (!itemId) return;
    try {
      const payload: PageSectionOrder[] = rows.map((row) => {
        const entry: PageSectionOrder = { key: row.key, visible: row.visible };
        // Existing server sections omit type; new ones must declare it.
        const existed = (serverRows ?? []).some((stored) => stored.key === row.key);
        if (!existed) entry.type = row.type;
        if (row.fields && Object.keys(row.fields).length > 0) entry.fields = row.fields;
        return entry;
      });
      const result = await save.mutateAsync({ id: itemId, sections: payload });
      if (result.ok) {
        toast.success("Page sections updated.");
        setDraft(null);
        setEditingKey(null);
        handleOpenChange(false);
        void query.refetch();
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  const unchanged =
    !dirty &&
    serverRows !== null &&
    sameOrder(
      rows.map((row) => ({ key: row.key, visible: row.visible })),
      serverRows.map((row) => ({ key: row.key, visible: row.visible })),
    );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Page sections</DialogTitle>
          <DialogDescription>
            {item?.title ?? "This page"} — add, edit, show, hide or reorder sections.
          </DialogDescription>
        </DialogHeader>

        {query.isFetching && serverRows === null ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : query.isError ? (
          <p className="text-sm text-destructive">
            {query.data?.error ?? "Could not load this page's sections."}
          </p>
        ) : (
          <>
            <ul className="space-y-2">
              {rows.map((row, index) => (
                <li key={row.key} className="rounded-md border">
                  <div className="flex items-center justify-between gap-3 px-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{row.label}</p>
                      <Badge variant="outline" className="mt-1 whitespace-nowrap">
                        {pageSectionTypeLabel(row.type)}
                      </Badge>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <label className="mr-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Checkbox
                          checked={row.visible}
                          onCheckedChange={(checked) => setVisible(row.key, checked === true)}
                          aria-label={`Show ${row.label}`}
                        />
                        Visible
                      </label>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setEditingKey(editingKey === row.key ? null : row.key)}
                        aria-label={`Edit ${row.label}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={index === 0}
                        onClick={() => move(index, -1)}
                        aria-label={`Move ${row.label} up`}
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={index === rows.length - 1}
                        onClick={() => move(index, 1)}
                        aria-label={`Move ${row.label} down`}
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => remove(row.key)}
                        aria-label={`Delete ${row.label}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  {editingKey === row.key ? (
                    <div className="border-t px-3 py-3">
                      <SectionEditor
                        section={row}
                        onChange={(fields) => updateFields(row.key, fields)}
                      />
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>

            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-1">
                <Label className="text-xs" htmlFor="new-section-type">
                  New section type
                </Label>
                <Select value={newType} onValueChange={setNewType}>
                  <SelectTrigger id="new-section-type" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SECTION_TYPE_KEYS.map((type) => (
                      <SelectItem key={type} value={type}>
                        {pageSectionTypeLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm" onClick={addSection}>
                <Plus className="mr-1 h-3.5 w-3.5" aria-hidden />
                Add section
              </Button>
            </div>
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => void saveSections()} disabled={unchanged || save.isPending}>
            {save.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save sections
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
