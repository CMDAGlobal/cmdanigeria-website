import { textToBlocks } from "./forms";

/**
 * Newsletter body blocks as the dashboard edits them. Each block is one unit
 * an editor can add, reorder, edit or delete — paragraphs, headings, photos,
 * pull quotes, callouts, lists, dividers and buttons.
 *
 * On save the list is converted to the Portable Text array the site already
 * renders, so content created here is identical in shape to content created in
 * Studio (and stays readable by both).
 */
export type NewsletterBlockKind =
  "paragraph" | "heading" | "quote" | "callout" | "list" | "image" | "divider" | "button";

export interface ParagraphBlock {
  id: string;
  kind: "paragraph";
  text: string;
}

export interface HeadingBlock {
  id: string;
  kind: "heading";
  text: string;
  level: 2 | 3;
}

export interface QuoteBlock {
  id: string;
  kind: "quote";
  text: string;
}

export interface CalloutBlock {
  id: string;
  kind: "callout";
  text: string;
}

export interface ListBlock {
  id: string;
  kind: "list";
  items: string[];
}

export interface ImageBlock {
  id: string;
  kind: "image";
  /** Sanity asset id — empty until a photo is uploaded or chosen. */
  assetId: string;
  /** Preview URL, kept for the editor and dropped on save. */
  url: string;
  alt: string;
  caption: string;
}

export interface DividerBlock {
  id: string;
  kind: "divider";
}

export interface ButtonBlock {
  id: string;
  kind: "button";
  label: string;
  href: string;
}

export type NewsletterBlock =
  | ParagraphBlock
  | HeadingBlock
  | QuoteBlock
  | CalloutBlock
  | ListBlock
  | ImageBlock
  | DividerBlock
  | ButtonBlock;

export const BLOCK_LABELS: Record<NewsletterBlockKind, string> = {
  paragraph: "Paragraph",
  heading: "Heading",
  quote: "Pull quote",
  callout: "Callout",
  list: "Bullet list",
  image: "Photo",
  divider: "Divider",
  button: "Button / link",
};

let idCounter = 0;

/** Stable React key for a block — never stored. */
export function newBlockId(kind: string): string {
  idCounter += 1;
  return `${kind}-${idCounter}`;
}

export function emptyBlock(kind: NewsletterBlockKind): NewsletterBlock {
  const id = newBlockId(kind);
  switch (kind) {
    case "heading":
      return { id, kind, text: "", level: 2 };
    case "quote":
      return { id, kind, text: "" };
    case "callout":
      return { id, kind, text: "" };
    case "list":
      return { id, kind, items: [""] };
    case "image":
      return { id, kind, assetId: "", url: "", alt: "", caption: "" };
    case "divider":
      return { id, kind };
    case "button":
      return { id, kind, label: "", href: "" };
    case "paragraph":
    default:
      return { id, kind: "paragraph", text: "" };
  }
}

type PortableBlockOut = Record<string, unknown>;

interface SpanOut {
  _type: "span";
  text: string;
  marks: string[];
}

interface MarkDefOut {
  _type: "link";
  _key: string;
  href: string;
}

interface ParsedBlock {
  _type: "block";
  style: string;
  markDefs: MarkDefOut[];
  children: SpanOut[];
}

/**
 * Inline markdown-lite (`**bold**`, `[text](url)`) is parsed by the same helper
 * the rest of the dashboard uses, so formatting survives a round trip.
 */
function inlineBlock(text: string, style: string): ParsedBlock {
  const flat = text.replace(/\s*\r?\n\s*/g, " ").trim();
  const parsed = textToBlocks(flat)[0];
  if (!parsed) {
    return {
      _type: "block",
      style,
      markDefs: [],
      children: [{ _type: "span", text: "", marks: [] }],
    };
  }
  const markDefs: MarkDefOut[] = parsed.markDefs.map((def) => ({
    _type: "link",
    _key: def._key,
    href: def.href,
  }));
  const children: SpanOut[] = parsed.children.map((span) => ({
    _type: "span",
    text: span.text,
    marks: [...span.marks],
  }));
  return { _type: "block", style, markDefs, children };
}

/** Editor blocks → the Portable Text array stored on the document. */
export function blocksToPortable(blocks: NewsletterBlock[]): PortableBlockOut[] {
  const out: PortableBlockOut[] = [];
  for (const block of blocks) {
    switch (block.kind) {
      case "paragraph": {
        if (!block.text.trim()) break;
        out.push({ ...inlineBlock(block.text, "normal") });
        break;
      }
      case "heading": {
        if (!block.text.trim()) break;
        out.push({ ...inlineBlock(block.text, block.level === 3 ? "h3" : "h2") });
        break;
      }
      case "quote": {
        if (!block.text.trim()) break;
        out.push({ ...inlineBlock(block.text, "blockquote") });
        break;
      }
      case "callout": {
        if (!block.text.trim()) break;
        out.push({ ...inlineBlock(block.text, "callout") });
        break;
      }
      case "list": {
        for (const item of block.items) {
          if (!item.trim()) continue;
          out.push({ ...inlineBlock(item, "normal"), listItem: "bullet", level: 1 });
        }
        break;
      }
      case "image": {
        if (!block.assetId.trim()) break;
        const image: PortableBlockOut = {
          _type: "image",
          asset: { _type: "reference", _ref: block.assetId.trim() },
        };
        if (block.alt.trim()) image["alt"] = block.alt.trim();
        if (block.caption.trim()) image["caption"] = block.caption.trim();
        out.push(image);
        break;
      }
      case "divider": {
        out.push({ _type: "block", style: "divider", markDefs: [], children: [] });
        break;
      }
      case "button": {
        if (!block.label.trim() || !block.href.trim()) break;
        const parsed = inlineBlock(block.label, "normal");
        const key = "cta-link";
        parsed.markDefs.push({ _type: "link", _key: key, href: block.href.trim() });
        parsed.children = parsed.children.map((span) => ({ ...span, marks: [...span.marks, key] }));
        out.push({ ...parsed });
        break;
      }
    }
  }
  // Array members need unique keys in Sanity; derive them from the position.
  return out.map((block, index) => ({ ...block, _key: `nl-${index + 1}` }));
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

/** Portable Text spans → markdown-lite text (headings, bold, links). */
export function blockToText(value: unknown): string {
  const block = asRecord(value);
  if (!block) return "";
  const hrefs = new Map<string, string>();
  const defs = Array.isArray(block["markDefs"]) ? block["markDefs"] : [];
  for (const raw of defs) {
    const def = asRecord(raw);
    if (!def) continue;
    if (
      def["_type"] === "link" &&
      typeof def["_key"] === "string" &&
      typeof def["href"] === "string"
    ) {
      hrefs.set(def["_key"], def["href"]);
    }
  }
  const children = Array.isArray(block["children"]) ? block["children"] : [];
  let text = "";
  for (const raw of children) {
    const span = asRecord(raw);
    if (!span) continue;
    const spanText = typeof span["text"] === "string" ? span["text"] : "";
    const marks = Array.isArray(span["marks"])
      ? span["marks"].filter((mark): mark is string => typeof mark === "string")
      : [];
    let piece = spanText;
    if (marks.includes("strong")) piece = `**${piece}**`;
    for (const mark of marks) {
      const href = hrefs.get(mark);
      if (href) piece = `[${piece}](${href})`;
    }
    text += piece;
  }
  return text;
}

function firstLink(block: Record<string, unknown>): string {
  const defs = Array.isArray(block["markDefs"]) ? block["markDefs"] : [];
  for (const raw of defs) {
    const def = asRecord(raw);
    if (def && def["_type"] === "link" && typeof def["href"] === "string") return def["href"];
  }
  return "";
}

/** Stored Portable Text (or a legacy plain array) → editor blocks. */
export function portableToBlocks(value: unknown): NewsletterBlock[] {
  if (!Array.isArray(value)) return [];
  const blocks: NewsletterBlock[] = [];
  let list: ListBlock | null = null;
  const flush = (): void => {
    if (list && list.items.some((item) => item.trim())) blocks.push(list);
    list = null;
  };

  for (const raw of value) {
    const entry = asRecord(raw);
    if (!entry) continue;

    if (entry["_type"] === "image") {
      flush();
      const asset = asRecord(entry["asset"]);
      const assetId =
        typeof entry["assetRef"] === "string"
          ? entry["assetRef"]
          : asset && typeof asset["_ref"] === "string"
            ? asset["_ref"]
            : "";
      const url =
        typeof entry["assetUrl"] === "string"
          ? entry["assetUrl"]
          : asset && typeof asset["url"] === "string"
            ? asset["url"]
            : "";
      if (!assetId && !url) continue;
      blocks.push({
        id: newBlockId("image"),
        kind: "image",
        assetId,
        url,
        alt: typeof entry["alt"] === "string" ? entry["alt"] : "",
        caption: typeof entry["caption"] === "string" ? entry["caption"] : "",
      });
      continue;
    }

    if (entry["_type"] !== "block") continue;

    const listItem = entry["listItem"];
    if (listItem === "bullet" || listItem === "number") {
      const text = blockToText(entry);
      if (list) list.items.push(text);
      else {
        list = { id: newBlockId("list"), kind: "list", items: [text] };
      }
      continue;
    }
    flush();

    const style = typeof entry["style"] === "string" ? entry["style"] : "normal";
    const text = blockToText(entry);
    switch (style) {
      case "h2":
        blocks.push({ id: newBlockId("heading"), kind: "heading", text, level: 2 });
        break;
      case "h3":
      case "h4":
        blocks.push({ id: newBlockId("heading"), kind: "heading", text, level: 3 });
        break;
      case "blockquote":
        blocks.push({ id: newBlockId("quote"), kind: "quote", text });
        break;
      case "callout":
        blocks.push({ id: newBlockId("callout"), kind: "callout", text });
        break;
      case "divider":
        blocks.push({ id: newBlockId("divider"), kind: "divider" });
        break;
      case "button":
        blocks.push({
          id: newBlockId("button"),
          kind: "button",
          label: text,
          href: firstLink(entry),
        });
        break;
      default:
        if (text.trim()) blocks.push({ id: newBlockId("paragraph"), kind: "paragraph", text });
        break;
    }
  }
  flush();
  return blocks;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function sanitizeBlock(raw: unknown): NewsletterBlock | null {
  const entry = asRecord(raw);
  if (!entry) return null;
  const kind = entry["kind"];
  switch (kind) {
    case "paragraph":
      return { id: newBlockId("paragraph"), kind, text: readString(entry["text"]) };
    case "heading":
      return {
        id: newBlockId("heading"),
        kind,
        text: readString(entry["text"]),
        level: entry["level"] === 3 ? 3 : 2,
      };
    case "quote":
      return { id: newBlockId("quote"), kind, text: readString(entry["text"]) };
    case "callout":
      return { id: newBlockId("callout"), kind, text: readString(entry["text"]) };
    case "list": {
      const items = Array.isArray(entry["items"])
        ? entry["items"].filter((item): item is string => typeof item === "string")
        : [];
      return { id: newBlockId("list"), kind, items: items.length > 0 ? items : [""] };
    }
    case "image":
      return {
        id: newBlockId("image"),
        kind,
        assetId: readString(entry["assetId"]),
        url: readString(entry["url"]),
        alt: readString(entry["alt"]),
        caption: readString(entry["caption"]),
      };
    case "divider":
      return { id: newBlockId("divider"), kind };
    case "button":
      return {
        id: newBlockId("button"),
        kind,
        label: readString(entry["label"]),
        href: readString(entry["href"]),
      };
    default:
      return null;
  }
}

/** Editor state is kept as JSON on the form value so unsaved changes compare cheaply. */
export function serializeBlocks(blocks: NewsletterBlock[]): string {
  return JSON.stringify(
    blocks.map((block) => {
      const { id: _id, ...rest } = block;
      return rest;
    }),
  );
}

export function parseBlocksJson(value: string): NewsletterBlock[] {
  const trimmed = value.trim();
  if (!trimmed) return [];
  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) return [];
    const blocks: NewsletterBlock[] = [];
    for (const raw of parsed) {
      const block = sanitizeBlock(raw);
      if (block) blocks.push(block);
    }
    // Position-based ids keep React keys stable while the editor re-parses the
    // JSON on every keystroke (otherwise inputs lose focus mid-typing).
    return blocks.map((block, index) => ({ ...block, id: `${block.kind}-${index + 1}` }));
  } catch {
    return [];
  }
}
