"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { armLabel } from "@/admin/content/mappers";
import {
  FORM_DEFAULTS,
  flattenPortableText,
  formFieldsFor,
  isoToLocalInput,
  localInputToIso,
  tagsToText,
  textToBlocks,
  textToTags,
  type FormField,
} from "@/admin/content/forms";
import { MODULE_MUTATIONS, assertSlug } from "@/admin/content/validate";
import type { ContentItem, ContentModuleKey } from "@/admin/content/types";
import {
  useContentDoc,
  useContentScopeOptions,
  useCreateContent,
  useUpdateContent,
} from "./admin-content";
import { UnitMultiSelect } from "./UnitMultiSelect";
import { MediaField } from "./MediaField";

export interface ContentEditorDialogProps {
  module: ContentModuleKey;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** null → create mode. */
  item: ContentItem | null;
  noun?: string;
}

type Values = Record<string, string>;
type Flags = Record<string, boolean>;
type UnitKey = "regions" | "zones" | "chapters";
/** Preview metadata for attached assets — the form itself stores bare ids. */
type Previews = Record<string, { url: string | null; name: string | null }>;

interface ScopeState {
  arm: string;
  regions: string[];
  zones: string[];
  chapters: string[];
}

interface Snapshot {
  values: Values;
  flags: Flags;
  scope: ScopeState;
}

function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const left = [...a].sort().join("\n");
  const right = [...b].sort().join("\n");
  return left === right;
}

export function ContentEditorDialog({
  module,
  open,
  onOpenChange,
  item,
  noun = "item",
}: ContentEditorDialogProps) {
  const isCreate = item === null;
  const fields = useMemo(() => formFieldsFor(module), [module]);
  const config = MODULE_MUTATIONS[module];
  const supportsPublication = config.publication;
  // Self-unit types (chapters, regions) scope themselves, so only chapters —
  // which pick an arm — get a scope editor.
  const showsScope = !config.selfUnit || config.allowed.includes("arm");

  const docQuery = useContentDoc(module, item?.id ?? null, open && !isCreate);
  const optionsQuery = useContentScopeOptions(open);
  const createMutation = useCreateContent(module);
  const updateMutation = useUpdateContent(module);
  const busy = createMutation.isPending || updateMutation.isPending;

  const [values, setValues] = useState<Values>({});
  const [flags, setFlags] = useState<Flags>({});
  const [previews, setPreviews] = useState<Previews>({});
  const [scope, setScope] = useState<ScopeState>({
    arm: "global",
    regions: [],
    zones: [],
    chapters: [],
  });
  const [publication, setPublication] = useState("draft");
  const [initial, setInitial] = useState<Snapshot | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const scopeOptions = optionsQuery.data;
  const optionsLoaded = scopeOptions?.ok === true;

  // Blank form for create.
  useEffect(() => {
    if (!open || !isCreate) return;
    const nextValues: Values = {};
    const nextFlags: Flags = {};
    for (const field of fields) {
      if (field.kind === "boolean") {
        nextFlags[field.name] = FORM_DEFAULTS[field.name] === true;
      } else {
        const fallback = FORM_DEFAULTS[field.name];
        const candidate = typeof fallback === "string" ? fallback : "";
        const options = field.options?.map((option) => option.value) ?? [];
        // A default that is not a valid option for this module falls back to the first one.
        nextValues[field.name] =
          options.length > 0 && !options.includes(candidate) ? (options[0] ?? "") : candidate;
      }
    }
    setValues(nextValues);
    setFlags(nextFlags);
    setPreviews({});
    setScope({ arm: "global", regions: [], zones: [], chapters: [] });
    setPublication("draft");
    setInitial(null);
    setFormError(null);
  }, [open, isCreate, fields]);

  // Populate edit mode once the document for the current item arrives.
  useEffect(() => {
    if (!open || isCreate) return;
    const data = docQuery.data;
    if (!data?.ok || data.id !== item?.id) return;
    const nextValues: Values = {};
    const nextFlags: Flags = {};
    for (const field of fields) {
      const raw = data.fields[field.name];
      if (field.kind === "boolean") {
        nextFlags[field.name] = raw === true;
      } else if (field.kind === "datetime") {
        nextValues[field.name] = isoToLocalInput(raw);
      } else if (field.kind === "rich") {
        nextValues[field.name] = flattenPortableText(raw);
      } else if (field.kind === "tags") {
        nextValues[field.name] = tagsToText(raw);
      } else if (field.kind === "number") {
        nextValues[field.name] = raw === null || raw === undefined || raw === "" ? "" : String(raw);
      } else {
        nextValues[field.name] = typeof raw === "string" ? raw : "";
      }
    }
    const nextScope: ScopeState = {
      arm: data.scope.arm ?? "global",
      regions: [...data.scope.regions],
      zones: [...data.scope.zones],
      chapters: [...data.scope.chapters],
    };
    const nextPreviews: Previews = {};
    for (const [key, asset] of Object.entries(data.assets ?? {})) {
      nextPreviews[key] = { url: asset.url, name: asset.name };
    }
    setValues(nextValues);
    setFlags(nextFlags);
    setPreviews(nextPreviews);
    setScope(nextScope);
    setInitial({ values: nextValues, flags: nextFlags, scope: nextScope });
    setFormError(null);
  }, [open, isCreate, docQuery.data, item?.id, fields]);

  // Create: default to the first arm the actor may assign.
  useEffect(() => {
    if (!open || !isCreate || !scopeOptions?.ok) return;
    setScope((prev) => {
      if (scopeOptions.arms.includes(prev.arm)) return prev;
      return {
        arm: scopeOptions.arms[0] ?? "global",
        regions: [],
        zones: [],
        chapters: [],
      };
    });
  }, [open, isCreate, scopeOptions]);

  // Create: preselect when the actor can only tag a single chapter.
  useEffect(() => {
    if (!open || !isCreate || !scopeOptions?.ok) return;
    setScope((prev) => {
      if (prev.chapters.length > 0) return prev;
      const candidates = scopeOptions.chapters.filter((entry) => (entry.arm ?? "") === prev.arm);
      if (candidates.length !== 1 || !candidates[0]) return prev;
      return { ...prev, chapters: [candidates[0].slug] };
    });
  }, [open, isCreate, scopeOptions]);

  const assignableRegions = useMemo(
    () => (scopeOptions?.ok && scope.arm === "global" ? scopeOptions.regions : []),
    [scopeOptions, scope.arm],
  );
  const assignableZones = useMemo(
    () =>
      scopeOptions?.ok && scope.arm !== "global"
        ? scopeOptions.zones.filter((entry) => (entry.arm ?? "") === scope.arm)
        : [],
    [scopeOptions, scope.arm],
  );
  const assignableChapters = useMemo(
    () =>
      scopeOptions?.ok
        ? scopeOptions.chapters.filter((entry) => (entry.arm ?? "") === scope.arm)
        : [],
    [scopeOptions, scope.arm],
  );

  function changeArm(next: string) {
    setScope((prev) => {
      if (next === prev.arm) return prev;
      if (!scopeOptions?.ok) return { ...prev, arm: next, regions: [], zones: [], chapters: [] };
      const chapterArms = new Map(
        scopeOptions.chapters.map((entry) => [entry.slug, entry.arm ?? ""]),
      );
      const zoneArms = new Map(scopeOptions.zones.map((entry) => [entry.slug, entry.arm ?? ""]));
      return {
        arm: next,
        regions: next === "global" ? prev.regions : [],
        zones:
          next === "global" ? [] : prev.zones.filter((slug) => (zoneArms.get(slug) ?? "") === next),
        chapters: prev.chapters.filter((slug) => (chapterArms.get(slug) ?? "") === next),
      };
    });
  }

  function changeUnits(key: UnitKey, next: string[]) {
    setScope((prev) => ({ ...prev, [key]: next }));
  }

  function validateForm(): string | null {
    for (const field of fields) {
      const raw = (values[field.name] ?? "").trim();
      if (field.required) {
        if (field.kind === "boolean") {
          if (flags[field.name] !== true) return `${field.label} must be enabled.`;
          continue;
        }
        if (!raw) return `${field.label} is required.`;
      }
      if (!raw) continue;
      if (field.kind === "datetime" && !localInputToIso(raw)) {
        return `${field.label} is not a valid date and time.`;
      }
      if (field.kind === "number" && Number.isNaN(Number(raw))) {
        return `${field.label} must be a number.`;
      }
    }
    const slug = (values["slug"] ?? "").trim();
    if (slug) {
      try {
        assertSlug(slug);
      } catch {
        return "The slug may only contain lowercase letters, numbers and dashes.";
      }
    }
    return null;
  }

  function buildCreateFields(): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.kind === "note") continue;
      const raw = (values[field.name] ?? "").trim();
      switch (field.kind) {
        case "boolean":
          out[field.name] = flags[field.name] === true;
          break;
        case "number":
          if (raw !== "") out[field.name] = Number(raw);
          break;
        case "rich": {
          const blocks = textToBlocks(raw);
          if (blocks.length > 0) out[field.name] = blocks;
          break;
        }
        case "tags": {
          const tags = textToTags(raw);
          if (tags.length > 0) out[field.name] = tags;
          break;
        }
        case "datetime": {
          const iso = localInputToIso(raw);
          if (iso) out[field.name] = iso;
          break;
        }
        default:
          if (raw !== "") out[field.name] = raw;
      }
    }
    return out;
  }

  function buildChangedFields(): { fields: Record<string, unknown>; error?: string } {
    if (!initial) return { fields: {}, error: "The document is still loading." };
    const out: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.kind === "note") continue;
      if (field.kind === "boolean") {
        const before = initial.flags[field.name] === true;
        const now = flags[field.name] === true;
        if (before !== now) out[field.name] = now;
        continue;
      }
      const before = (initial.values[field.name] ?? "").trim();
      const now = (values[field.name] ?? "").trim();
      if (now === before) continue;
      switch (field.kind) {
        case "datetime":
          if (!now) {
            out[field.name] = null;
            break;
          }
          {
            const iso = localInputToIso(now);
            if (!iso) return { fields: {}, error: `${field.label} is not a valid date and time.` };
            out[field.name] = iso;
          }
          break;
        case "rich":
          out[field.name] = textToBlocks(now);
          break;
        case "tags":
          out[field.name] = textToTags(now);
          break;
        case "number":
          if (now === "") out[field.name] = null;
          else out[field.name] = Number(now);
          break;
        default:
          out[field.name] = now;
      }
    }

    if (showsScope) {
      const scopeChanged =
        scope.arm !== initial.scope.arm ||
        !sameSet(scope.regions, initial.scope.regions) ||
        !sameSet(scope.zones, initial.scope.zones) ||
        !sameSet(scope.chapters, initial.scope.chapters);
      if (scopeChanged) {
        out["arm"] = scope.arm;
        if (module !== "chapters") {
          out["regions"] = scope.regions;
          out["zones"] = scope.zones;
          out["chapters"] = scope.chapters;
        }
      }
    }
    return { fields: out };
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    if (isCreate) {
      try {
        const result = await createMutation.mutateAsync({
          module,
          fields: buildCreateFields(),
          // A region is its own unit, so it carries no pickable scope.
          scope: showsScope
            ? {
                arm: scope.arm,
                regions: module === "chapters" ? [] : scope.regions,
                zones: module === "chapters" ? [] : scope.zones,
                chapters: module === "chapters" ? [] : scope.chapters,
              }
            : { arm: "global", regions: [], zones: [], chapters: [] },
          ...(supportsPublication ? { publication } : {}),
        });
        if (result.ok) {
          const created = (values[config.titleField] ?? "").trim();
          toast.success(`“${created || noun}” created.`);
          onOpenChange(false);
        } else {
          setFormError(result.error ?? "Something went wrong. Please try again.");
        }
      } catch {
        setFormError("Something went wrong. Please try again.");
      }
      return;
    }

    if (!item) return;
    const changed = buildChangedFields();
    if (changed.error) {
      setFormError(changed.error);
      return;
    }
    if (Object.keys(changed.fields).length === 0) {
      toast.info("No changes to save.");
      return;
    }
    try {
      const result = await updateMutation.mutateAsync({
        module,
        id: item.id,
        fields: changed.fields,
      });
      if (result.ok) {
        toast.success("Changes saved.");
        onOpenChange(false);
      } else {
        setFormError(result.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setFormError("Something went wrong. Please try again.");
    }
  }

  const docFailed =
    !isCreate && (docQuery.isError || (docQuery.data !== undefined && !docQuery.data.ok));
  const docErrorMessage = docQuery.isError
    ? "Could not load this item."
    : docQuery.data && !docQuery.data.ok
      ? (docQuery.data.error ?? "Could not load this item.")
      : "Could not load this item.";
  const dataCurrent = !isCreate && docQuery.data?.ok === true && docQuery.data.id === item?.id;
  const loading = !isCreate && !docFailed && !(initial !== null && dataCurrent);

  function renderField(field: FormField) {
    const id = `editor-${field.name}`;
    const required = field.required ? " *" : "";
    const help = field.help ? <p className="text-xs text-muted-foreground">{field.help}</p> : null;
    const set = (value: string) => setValues((prev) => ({ ...prev, [field.name]: value }));

    if (field.kind === "note") {
      return (
        <div key={field.name} className="space-y-2 sm:col-span-2">
          <Label>{field.label}</Label>
          <p className="border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
            {field.note}
          </p>
        </div>
      );
    }

    if (field.kind === "boolean") {
      return (
        <div key={field.name} className="flex items-center gap-2 sm:col-span-2">
          <Checkbox
            id={id}
            checked={flags[field.name] === true}
            onCheckedChange={(checked) =>
              setFlags((prev) => ({ ...prev, [field.name]: checked === true }))
            }
          />
          <Label htmlFor={id} className="cursor-pointer font-normal">
            {field.label}
          </Label>
          {field.help ? (
            <span className="text-xs text-muted-foreground">— {field.help}</span>
          ) : null}
        </div>
      );
    }

    if (field.kind === "select") {
      return (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={id}>
            {field.label}
            {required}
          </Label>
          <Select value={values[field.name] ?? ""} onValueChange={set}>
            <SelectTrigger id={id} aria-label={field.label}>
              <SelectValue placeholder="Select…" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {help}
        </div>
      );
    }

    if (field.kind === "image" || field.kind === "file") {
      return (
        <MediaField
          key={field.name}
          id={id}
          label={field.label}
          kind={field.kind}
          module={module}
          value={values[field.name] ?? ""}
          previewUrl={previews[field.name]?.url ?? null}
          help={field.help}
          onChange={(assetId, url) => {
            setValues((prev) => ({ ...prev, [field.name]: assetId }));
            setPreviews((prev) => ({ ...prev, [field.name]: { url, name: null } }));
          }}
        />
      );
    }

    if (field.kind === "textarea" || field.kind === "rich" || field.kind === "tags") {
      return (
        <div key={field.name} className="space-y-2 sm:col-span-2">
          <Label htmlFor={id}>
            {field.label}
            {required}
          </Label>
          <Textarea
            id={id}
            rows={field.rows ?? 4}
            value={values[field.name] ?? ""}
            onChange={(event) => set(event.target.value)}
            placeholder={field.placeholder}
          />
          {help}
        </div>
      );
    }

    const inputType =
      field.kind === "datetime"
        ? "datetime-local"
        : field.kind === "date"
          ? "date"
          : field.kind === "number"
            ? "number"
            : field.kind === "url"
              ? "url"
              : "text";
    return (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={id}>
          {field.label}
          {required}
        </Label>
        <Input
          id={id}
          type={inputType}
          value={values[field.name] ?? ""}
          onChange={(event) => set(event.target.value)}
          placeholder={field.placeholder}
        />
        {help}
      </div>
    );
  }

  const title = isCreate
    ? `New ${noun}`
    : `Edit “${item?.title ?? docQuery.data?.title ?? "item"}”`;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setFormError(null);
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isCreate
              ? `Add a new ${noun} to the content store.`
              : "Update the details below. Text you leave untouched keeps its Studio formatting."}
          </DialogDescription>
        </DialogHeader>

        {docFailed ? (
          <Alert variant="destructive">
            <AlertTitle>Cannot edit</AlertTitle>
            <AlertDescription>{docErrorMessage}</AlertDescription>
          </Alert>
        ) : loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-5">
            {formError ? (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">{fields.map(renderField)}</div>

            {showsScope ? (
              <div className="space-y-4 rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium">Scope</p>
                  <p className="text-xs text-muted-foreground">
                    {module === "chapters"
                      ? "Which arm this chapter belongs to."
                      : "Who sees this item. Keep Global Network for network-wide content."}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="editor-arm">Arm</Label>
                    <Select value={scope.arm} onValueChange={changeArm}>
                      <SelectTrigger id="editor-arm" aria-label="Arm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(scopeOptions?.ok ? scopeOptions.arms : [scope.arm]).map((arm) => (
                          <SelectItem key={arm} value={arm}>
                            {armLabel(arm)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {module !== "chapters" && assignableRegions.length > 0 ? (
                    <UnitMultiSelect
                      label="Regions"
                      options={assignableRegions}
                      selected={scope.regions}
                      onChange={(next) => changeUnits("regions", next)}
                    />
                  ) : null}
                  {module !== "chapters" && assignableZones.length > 0 ? (
                    <UnitMultiSelect
                      label="Zones"
                      options={assignableZones}
                      selected={scope.zones}
                      onChange={(next) => changeUnits("zones", next)}
                    />
                  ) : null}
                  {module !== "chapters" && assignableChapters.length > 0 ? (
                    <UnitMultiSelect
                      label="Chapters"
                      options={assignableChapters}
                      selected={scope.chapters}
                      onChange={(next) => changeUnits("chapters", next)}
                    />
                  ) : null}
                </div>
              </div>
            ) : null}

            {isCreate && supportsPublication ? (
              <div className="space-y-2 rounded-lg border p-4">
                <Label htmlFor="editor-publication">Visibility</Label>
                <Select value={publication} onValueChange={setPublication}>
                  <SelectTrigger id="editor-publication" aria-label="Visibility">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft — hidden from the public site</SelectItem>
                    <SelectItem value="published">Published — visible immediately</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : isCreate ? `Create ${noun}` : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
