import { describe, expect, it } from "vitest";

import { parseAssetId } from "./asset-id";
import { validateUpload } from "./asset-validate";
import { changedTopLevelKeys, swapAssetRef } from "./asset-relink";

describe("parseAssetId", () => {
  it("accepts well-formed image and file ids", () => {
    expect(parseAssetId("image-abc123-def456-300x200-png")).toBe("image-abc123-def456-300x200-png");
    expect(parseAssetId("file-abc123-original.pdf")).toBe("file-abc123-original.pdf");
  });

  it("trims surrounding whitespace", () => {
    expect(parseAssetId("  image-abc-123  ")).toBe("image-abc-123");
  });

  it("rejects non-strings, empty values and bad shapes", () => {
    expect(parseAssetId(null)).toBeNull();
    expect(parseAssetId(undefined)).toBeNull();
    expect(parseAssetId(42)).toBeNull();
    expect(parseAssetId("")).toBeNull();
    expect(parseAssetId("image")).toBeNull();
    expect(parseAssetId("image-")).toBeNull();
    expect(parseAssetId("svg-abc123")).toBeNull();
    expect(parseAssetId("image-abc;DROP")).toBeNull();
    expect(parseAssetId("image-abc def")).toBeNull();
    expect(parseAssetId("x".repeat(129))).toBeNull();
  });
});

describe("validateUpload", () => {
  const tinyPng = Buffer.from([0x89, 0x50, 0x4e, 0x47]).toString("base64");
  const tinyPdf = Buffer.from("%PDF-1.4").toString("base64");

  it("accepts a valid image upload", () => {
    const result = validateUpload("image", "cover.png", "image/png", tinyPng);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.filename).toBe("cover.png");
      expect(result.contentType).toBe("image/png");
      expect(result.bytes.byteLength).toBeGreaterThan(0);
    }
  });

  it("accepts a valid document upload", () => {
    const result = validateUpload("file", "guidelines.pdf", "application/pdf", tinyPdf);
    expect(result.ok).toBe(true);
  });

  it("trims the filename", () => {
    const result = validateUpload("image", "  cover.png  ", "image/png", tinyPng);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.filename).toBe("cover.png");
  });

  it("rejects an empty or over-long filename", () => {
    expect(validateUpload("image", "", "image/png", tinyPng).ok).toBe(false);
    expect(validateUpload("image", "   ", "image/png", tinyPng).ok).toBe(false);
    expect(validateUpload("image", "a".repeat(201), "image/png", tinyPng).ok).toBe(false);
  });

  it("rejects missing base64 data", () => {
    expect(validateUpload("image", "cover.png", "image/png", "").ok).toBe(false);
    expect(validateUpload("image", "cover.png", "image/png", undefined).ok).toBe(false);
  });

  it("rejects disallowed MIME types per kind", () => {
    const badImage = validateUpload("image", "cover.pdf", "application/pdf", tinyPdf);
    expect(badImage.ok).toBe(false);
    if (!badImage.ok) expect(badImage.error).toMatch(/PNG, JPEG/);

    const badFile = validateUpload("file", "cover.png", "image/png", tinyPng);
    expect(badFile.ok).toBe(false);
    if (!badFile.ok) expect(badFile.error).toMatch(/PDF or Word/);
  });

  it("matches MIME types case-insensitively", () => {
    expect(validateUpload("image", "c.PNG", "IMAGE/PNG", tinyPng).ok).toBe(true);
  });

  it("rejects an empty byte payload", () => {
    const empty = Buffer.alloc(0).toString("base64");
    const result = validateUpload("image", "cover.png", "image/png", empty);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/no file data|empty/i);
  });

  it("rejects payloads over the 8 MB cap", () => {
    const big = Buffer.alloc(8 * 1024 * 1024 + 1, 1).toString("base64");
    const result = validateUpload("image", "huge.png", "image/png", big);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/8 MB/);
  });
});

describe("swapAssetRef", () => {
  const oldId = "image-old-1";
  const newId = "image-new-2";

  it("rewires a single reference", () => {
    const doc = { cover: { _type: "image", asset: { _type: "reference", _ref: oldId } } };
    const out = swapAssetRef(doc, oldId, newId);
    expect(out.cover.asset._ref).toBe(newId);
  });

  it("rewires references nested in arrays (galleries)", () => {
    const doc = {
      gallery: [
        { _type: "image", asset: { _type: "reference", _ref: oldId } },
        { _type: "image", asset: { _type: "reference", _ref: "image-other" } },
      ],
    };
    const out = swapAssetRef(doc, oldId, newId);
    expect(out.gallery[0]?.asset._ref).toBe(newId);
    expect(out.gallery[1]?.asset._ref).toBe("image-other");
  });

  it("leaves non-matching references and scalars untouched", () => {
    const doc = {
      title: "Hello",
      cover: { _type: "image", asset: { _type: "reference", _ref: "image-keep" } },
      count: 3,
    };
    const out = swapAssetRef(doc, oldId, newId);
    expect(out).toEqual(doc);
  });

  it("does not mutate the input document", () => {
    const doc = { cover: { asset: { _type: "reference", _ref: oldId } } };
    swapAssetRef(doc, oldId, newId);
    expect(doc.cover.asset._ref).toBe(oldId);
  });
});

describe("changedTopLevelKeys", () => {
  it("lists only top-level keys whose deep content changed", () => {
    const original = { title: "A", cover: { asset: { _ref: "image-old" } }, tags: ["x"] };
    const updated = { title: "A", cover: { asset: { _ref: "image-new" } }, tags: ["x"] };
    expect(changedTopLevelKeys(original, updated)).toEqual(["cover"]);
  });

  it("ignores underscore-prefixed system fields", () => {
    const original = { _id: "doc1", _rev: "abc", cover: { asset: { _ref: "old" } } };
    const updated = { _id: "doc1", _rev: "def", cover: { asset: { _ref: "new" } } };
    expect(changedTopLevelKeys(original, updated)).toEqual(["cover"]);
  });

  it("returns an empty list when nothing changed", () => {
    const doc = { title: "Same", cover: { asset: { _ref: "image-x" } } };
    expect(changedTopLevelKeys(doc, { ...doc })).toEqual([]);
  });
});
