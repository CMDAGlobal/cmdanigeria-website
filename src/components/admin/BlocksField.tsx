"use client";

import { ArrowDown, ArrowUp, Copy, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { ContentModuleKey } from "@/admin/content/types";
import {
  BLOCK_LABELS,
  emptyBlock,
  parseBlocksJson,
  serializeBlocks,
  type NewsletterBlock,
  type NewsletterBlockKind,
} from "@/admin/content/blocks";
import { MediaField } from "./MediaField";

const BLOCK_KINDS: NewsletterBlockKind[] = [
  "paragraph",
  "heading",
  "image",
  "quote",
  "callout",
  "list",
  "divider",
  "button",
];

export interface BlocksFieldProps {
  id: string;
  label: string;
  module: ContentModuleKey;
  help?: string | undefined;
  /** JSON string holding the block list — keeps the form's string-state contract. */
  value: string;
  onChange: (value: string) => void;
}

/**
 * Block composer for long-form issues: paste text into paragraphs, drop in
 * headings, photos, pull quotes, callouts, lists, dividers and buttons, then
 * reorder them. Saved as Portable Text so the public site and Studio both read it.
 */
export function BlocksField({ id, label, module, help, value, onChange }: BlocksFieldProps) {
  const blocks = parseBlocksJson(value);

  const write = (next: NewsletterBlock[]): void => onChange(serializeBlocks(next));
  const replace = (index: number, block: NewsletterBlock): void =>
    write(blocks.map((entry, position) => (position === index ? block : entry)));
  const move = (index: number, delta: number): void => {
    const target = index + delta;
    const next = [...blocks];
    const moved = next[index];
    const swapped = next[target];
    if (!moved || !swapped) return;
    next[index] = swapped;
    next[target] = moved;
    write(next);
  };
  const duplicate = (index: number): void => {
    const block = blocks[index];
    if (!block) return;
    const copy = parseBlocksJson(serializeBlocks([block]))[0];
    if (!copy) return;
    const next = [...blocks];
    next.splice(index + 1, 0, copy);
    write(next);
  };
  const remove = (index: number): void => write(blocks.filter((_, position) => position !== index));

  function renderEditor(block: NewsletterBlock, index: number) {
    switch (block.kind) {
      case "paragraph":
        return (
          <Textarea
            rows={4}
            value={block.text}
            placeholder="Write a paragraph. **Bold** and [links](https://…) are supported."
            onChange={(event) => replace(index, { ...block, text: event.target.value })}
          />
        );
      case "heading":
        return (
          <div className="grid gap-2 sm:grid-cols-[1fr_9rem]">
            <Input
              value={block.text}
              placeholder="Section heading"
              onChange={(event) => replace(index, { ...block, text: event.target.value })}
            />
            <Select
              value={String(block.level)}
              onValueChange={(next) => replace(index, { ...block, level: next === "3" ? 3 : 2 })}
            >
              <SelectTrigger aria-label="Heading size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">Large heading</SelectItem>
                <SelectItem value="3">Small heading</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case "quote":
        return (
          <Textarea
            rows={2}
            value={block.text}
            placeholder="A line worth pulling out"
            onChange={(event) => replace(index, { ...block, text: event.target.value })}
          />
        );
      case "callout":
        return (
          <Textarea
            rows={2}
            value={block.text}
            placeholder="A short note, reminder or key fact"
            onChange={(event) => replace(index, { ...block, text: event.target.value })}
          />
        );
      case "list":
        return (
          <div className="space-y-1.5">
            <Textarea
              rows={Math.max(3, block.items.length)}
              value={block.items.join("\n")}
              placeholder={"One item per line\nSecond item"}
              onChange={(event) =>
                replace(index, { ...block, items: event.target.value.split(/\r?\n/) })
              }
            />
            <p className="text-xs text-muted-foreground">One item per line.</p>
          </div>
        );
      case "image":
        return (
          <div className="space-y-3">
            <MediaField
              id={`${id}-${index}-photo`}
              label="Photo"
              kind="image"
              module={module}
              value={block.assetId}
              previewUrl={block.url || null}
              onChange={(assetId, url) => replace(index, { ...block, assetId, url: url ?? "" })}
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                value={block.alt}
                placeholder="Describe the photo (alt text)"
                onChange={(event) => replace(index, { ...block, alt: event.target.value })}
              />
              <Input
                value={block.caption}
                placeholder="Caption (optional)"
                onChange={(event) => replace(index, { ...block, caption: event.target.value })}
              />
            </div>
          </div>
        );
      case "divider":
        return <p className="text-xs text-muted-foreground">A horizontal rule between sections.</p>;
      case "button":
        return (
          <div className="grid gap-2 sm:grid-cols-2">
            <Input
              value={block.label}
              placeholder="Button label"
              onChange={(event) => replace(index, { ...block, label: event.target.value })}
            />
            <Input
              type="url"
              value={block.href}
              placeholder="https://"
              onChange={(event) => replace(index, { ...block, href: event.target.value })}
            />
          </div>
        );
    }
  }

  return (
    <div className="space-y-3 sm:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <Label htmlFor={id}>{label}</Label>
          {help ? <p className="text-xs text-muted-foreground">{help}</p> : null}
        </div>
        <Select
          value=""
          onValueChange={(next) => write([...blocks, emptyBlock(next as NewsletterBlockKind)])}
        >
          <SelectTrigger id={id} className="w-44" aria-label="Add a block">
            <SelectValue placeholder="Add block…" />
          </SelectTrigger>
          <SelectContent>
            {BLOCK_KINDS.map((kind) => (
              <SelectItem key={kind} value={kind}>
                {BLOCK_LABELS[kind]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {blocks.length === 0 ? (
        <p className="border border-dashed p-4 text-sm text-muted-foreground">
          No content yet — add a paragraph to start the issue.
        </p>
      ) : (
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <div key={block.id} className="space-y-3 border bg-background p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold tracking-wide uppercase text-muted-foreground">
                  {BLOCK_LABELS[block.kind]}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Move block up"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Move block down"
                    disabled={index === blocks.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Duplicate block"
                    onClick={() => duplicate(index)}
                  >
                    <Copy className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove block"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              {renderEditor(block, index)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
