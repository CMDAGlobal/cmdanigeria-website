"use client";

import { useRef, useState } from "react";

import { toast } from "sonner";
import { FileText, ImageIcon, Loader2, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useSanityAssets, useUploadSanityAsset } from "./admin-content";
import type { ContentModuleKey } from "@/admin/content/types";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const ACCEPT = {
  image: "image/png,image/jpeg,image/webp,image/gif,image/avif",
  file: "application/pdf,.pdf,.doc,.docx",
} as const;

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

export interface MediaFieldProps {
  id: string;
  label: string;
  kind: "image" | "file";
  module: ContentModuleKey;
  /** Bare Sanity asset id, as stored in the form. */
  value: string;
  previewUrl: string | null;
  onChange: (assetId: string, url: string | null) => void;
  help?: string | undefined;
}

export function MediaField({
  id,
  label,
  kind,
  module,
  value,
  previewUrl,
  onChange,
  help,
}: MediaFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [browseOpen, setBrowseOpen] = useState(false);
  const upload = useUploadSanityAsset(module);
  const library = useSanityAssets(kind, browseOpen);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("Files must be 8 MB or smaller.");
      return;
    }
    try {
      const base64 = toBase64(await file.arrayBuffer());
      const result = await upload.mutateAsync({
        module,
        kind,
        filename: file.name,
        contentType: file.type || (kind === "image" ? "image/png" : "application/pdf"),
        base64,
      });
      if (result.ok && result.id) {
        onChange(result.id, result.url ?? null);
        toast.success(`${label} uploaded.`);
      } else {
        toast.error(result.error ?? "The upload failed.");
      }
    } catch {
      toast.error("The upload failed. Please try again.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3 sm:col-span-2">
      <Label htmlFor={id}>{label}</Label>

      {value ? (
        <div className="flex items-center gap-4 border border-border bg-muted/30 p-3">
          {kind === "image" && previewUrl ? (
            <img
              src={previewUrl}
              alt=""
              className="size-20 shrink-0 border border-border object-cover"
            />
          ) : (
            <span className="flex size-20 shrink-0 items-center justify-center border border-border bg-background text-muted-foreground">
              {kind === "image" ? (
                <ImageIcon className="size-6" />
              ) : (
                <FileText className="size-6" />
              )}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {previewUrl ? previewUrl.split("/").pop() : value}
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{value}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Remove ${label.toLowerCase()}`}
            onClick={() => onChange("", null)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          id={id}
          type="button"
          variant="outline"
          size="sm"
          disabled={upload.isPending}
          onClick={() => inputRef.current?.click()}
        >
          {upload.isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Upload className="mr-2 size-4" />
          )}
          {value ? "Replace" : "Upload"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setBrowseOpen((open) => !open)}
        >
          {browseOpen ? "Hide library" : "Choose existing"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={ACCEPT[kind]}
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />
      </div>

      {browseOpen && (
        <div className="border border-border">
          {library.isLoading ? (
            <div className="grid grid-cols-3 gap-2 p-3 sm:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="aspect-square w-full" />
              ))}
            </div>
          ) : (library.data?.assets.length ?? 0) === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              Nothing in the library yet — upload a file first.
            </p>
          ) : (
            <ul className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto p-3 sm:grid-cols-4">
              {(library.data?.assets ?? []).map((asset) => (
                <li key={asset.id}>
                  <button
                    type="button"
                    title={asset.name}
                    className="block w-full border border-border p-1 transition-colors hover:border-primary focus-visible:border-primary focus-visible:outline-none"
                    onClick={() => {
                      onChange(asset.id, asset.url);
                      setBrowseOpen(false);
                    }}
                  >
                    {kind === "image" ? (
                      <img
                        src={asset.url}
                        alt=""
                        loading="lazy"
                        className="aspect-square w-full object-cover"
                      />
                    ) : (
                      <span className="flex aspect-square w-full items-center justify-center text-muted-foreground">
                        <FileText className="size-6" />
                      </span>
                    )}
                    <span className="mt-1 block truncate text-[10px] text-muted-foreground">
                      {asset.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {help ? <p className="text-xs text-muted-foreground">{help}</p> : null}
    </div>
  );
}
