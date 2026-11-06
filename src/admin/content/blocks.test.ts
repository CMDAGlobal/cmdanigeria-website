import { describe, expect, it } from "vitest";

import {
  blockToText,
  blocksToPortable,
  parseBlocksJson,
  portableToBlocks,
  serializeBlocks,
  type NewsletterBlock,
} from "./blocks";

describe("newsletter blocks", () => {
  it("maps each block kind to the portable shape the site renders", () => {
    const blocks: NewsletterBlock[] = [
      { id: "p1", kind: "paragraph", text: "Hello **world**" },
      { id: "h1", kind: "heading", text: "A section", level: 2 },
      { id: "q1", kind: "quote", text: "Grace upon grace" },
      { id: "c1", kind: "callout", text: "Remember the date" },
      { id: "l1", kind: "list", items: ["One", "Two"] },
      { id: "d1", kind: "divider" },
      { id: "b1", kind: "button", label: "Read more", href: "https://example.com" },
    ];

    const out = blocksToPortable(blocks);
    const styles = out.map((block) => block["style"]);
    expect(styles).toEqual([
      "normal",
      "h2",
      "blockquote",
      "callout",
      "normal",
      "normal",
      "divider",
      "normal",
    ]);
    expect(out[0]?.["_type"]).toBe("block");
    expect(out[4]?.["listItem"]).toBe("bullet");
    expect(out[7]?.["markDefs"]).toEqual([
      { _type: "link", _key: "cta-link", href: "https://example.com" },
    ]);
    // Every stored member carries a unique key for Sanity's array.
    expect(new Set(out.map((block) => block["_key"])).size).toBe(out.length);
  });

  it("keeps photo blocks and drops empty ones", () => {
    const out = blocksToPortable([
      {
        id: "image-1",
        kind: "image",
        assetId: "image-abc-1600x900-webp",
        url: "https://cdn.example.com/a.webp",
        alt: "Students at a conference",
        caption: "Conference 2026",
      },
      { id: "image-2", kind: "image", assetId: "", url: "", alt: "", caption: "" },
      { id: "para-1", kind: "paragraph", text: "   " },
    ]);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({
      _type: "image",
      asset: { _type: "reference", _ref: "image-abc-1600x900-webp" },
      alt: "Students at a conference",
      caption: "Conference 2026",
    });
  });

  it("round-trips stored content back into editor blocks", () => {
    const stored = [
      {
        _type: "block",
        style: "h2",
        markDefs: [],
        children: [{ _type: "span", text: "Lead story", marks: [] }],
      },
      {
        _type: "block",
        style: "normal",
        markDefs: [],
        children: [
          { _type: "span", text: "Grace and ", marks: [] },
          { _type: "span", text: "truth", marks: ["strong"] },
        ],
      },
      {
        _type: "block",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [{ _type: "span", text: "First", marks: [] }],
      },
      {
        _type: "block",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [{ _type: "span", text: "Second", marks: [] }],
      },
      {
        _type: "block",
        style: "blockquote",
        markDefs: [],
        children: [{ _type: "span", text: "A quote", marks: [] }],
      },
      {
        _type: "image",
        asset: { _type: "reference", _ref: "image-ref-100x100-jpg" },
        assetRef: "image-ref-100x100-jpg",
        assetUrl: "https://cdn.example.com/b.jpg",
        alt: "Photo",
      },
    ];

    const blocks = portableToBlocks(stored);
    expect(blocks.map((block) => block.kind)).toEqual([
      "heading",
      "paragraph",
      "list",
      "quote",
      "image",
    ]);
    expect(blocks[1]).toMatchObject({ kind: "paragraph", text: "Grace and **truth**" });
    expect(blocks[2]).toMatchObject({ kind: "list", items: ["First", "Second"] });
    expect(blocks[4]).toMatchObject({
      kind: "image",
      assetId: "image-ref-100x100-jpg",
      url: "https://cdn.example.com/b.jpg",
      alt: "Photo",
    });
  });

  it("reads links and bold back out of spans", () => {
    const text = blockToText({
      _type: "block",
      style: "normal",
      markDefs: [{ _type: "link", _key: "l1", href: "https://cmdanigeria.org" }],
      children: [{ _type: "span", text: "Visit", marks: ["l1"] }],
    });
    expect(text).toBe("[Visit](https://cmdanigeria.org)");
  });

  it("falls back safely on malformed editor state", () => {
    expect(parseBlocksJson("")).toEqual([]);
    expect(parseBlocksJson("not json")).toEqual([]);
    expect(parseBlocksJson('{"kind":"paragraph"}')).toEqual([]);
    expect(parseBlocksJson('[{"kind":"nope"},{"kind":"paragraph","text":"Hi"}]')).toHaveLength(1);
  });

  it("serialize then parse restores the same content", () => {
    const blocks = portableToBlocks([
      {
        _type: "block",
        style: "normal",
        markDefs: [],
        children: [{ _type: "span", text: "One paragraph", marks: [] }],
      },
    ]);
    const restored = parseBlocksJson(serializeBlocks(blocks));
    expect(restored).toHaveLength(1);
    expect(restored[0]).toMatchObject({ kind: "paragraph", text: "One paragraph" });
    // Fresh ids so React keys stay unique per parse.
    expect(restored[0]?.id).not.toBe(blocks[0]?.id);
  });
});
