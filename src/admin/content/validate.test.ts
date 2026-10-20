import { describe, expect, it } from "vitest";
import {
  ContentInputError,
  applyPageSections,
  applySectionOrder,
  assertSlug,
  effectiveCreateScope,
  MODULE_MUTATIONS,
  normalizeArm,
  normalizeGalleryField,
  normalizeScopeInput,
  parseModuleConfig,
  slugify,
  validateCreatePublication,
  validateFields,
  validatePageSection,
  validatePublicationTransition,
  writeScopeRefs,
} from "./validate";

const chapters = MODULE_MUTATIONS.chapters;
const events = MODULE_MUTATIONS.events;
const pages = MODULE_MUTATIONS.pages;
const regions = MODULE_MUTATIONS.regions;
const publications = MODULE_MUTATIONS.publications;

describe("parseModuleConfig", () => {
  it("resolves known modules and rejects everything else", () => {
    expect(parseModuleConfig("events")?.type).toBe("event");
    expect(parseModuleConfig("news")?.type).toBe("post");
    expect(parseModuleConfig("bogus")).toBeNull();
    expect(parseModuleConfig(42)).toBeNull();
  });
});

describe("slug helpers", () => {
  it("slugifies titles", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
    expect(slugify("  CAFÉ  Nite ")).toBe("cafe-nite");
    expect(slugify("!!!")).toBe("");
  });

  it("validates slugs", () => {
    expect(assertSlug("lagos-2026")).toBe("lagos-2026");
    expect(() => assertSlug("Not A Slug")).toThrow(ContentInputError);
    expect(() => assertSlug("-nope")).toThrow(ContentInputError);
  });

  it("normalizes arms", () => {
    expect(normalizeArm("students")).toBe("students");
    expect(normalizeArm(null)).toBeNull();
    expect(normalizeArm(undefined)).toBeNull();
    expect(() => normalizeArm("bogus")).toThrow(ContentInputError);
  });
});

describe("validateFields", () => {
  it("creates: requires the module's required fields", () => {
    expect(() => validateFields(events, {}, { partial: false })).toThrow(ContentInputError);
    expect(() => validateFields(events, { title: "" }, { partial: false })).toThrow(
      ContentInputError,
    );
    const ok = validateFields(
      events,
      { title: "Camp", startDate: "2026-12-01T09:00:00.000Z" },
      { partial: false },
    );
    expect(ok["title"]).toBe("Camp");
  });

  it("rejects fields outside the allowlist", () => {
    expect(() => validateFields(events, { title: "Camp", _rev: "x" }, { partial: false })).toThrow(
      ContentInputError,
    );
    expect(() =>
      validateFields(pages, { title: "Home", publication: "published" }, { partial: false }),
    ).toThrow(ContentInputError);
  });

  it("normalizes arm, scope arrays and slug", () => {
    const ok = validateFields(
      events,
      {
        title: "Camp",
        startDate: "2026-12-01T09:00:00.000Z",
        arm: "students",
        chapters: ["lagos", 7, "ibadan"],
        regions: "not-an-array",
        slug: " Camp-2026 ",
      },
      { partial: false },
    );
    expect(ok["arm"]).toBe("students");
    expect(ok["chapters"]).toEqual(["lagos", "ibadan"]);
    expect(ok["regions"]).toEqual(["not-an-array"]);
    expect(ok["slug"]).toBe("camp-2026");
  });

  it("accepts rich body blocks but rejects mixed arrays", () => {
    const blocks = [{ _type: "block", children: [{ _type: "span", text: "hi" }] }];
    const ok = validateFields(pages, { title: "Home", body: blocks }, { partial: false });
    expect(ok["body"]).toEqual(blocks);
    expect(() =>
      validateFields(pages, { title: "Home", body: ["a", { b: 1 }] }, { partial: false }),
    ).toThrow(ContentInputError);
  });

  it("whitelists nested contact, social and resource fields", () => {
    const ok = validateFields(
      chapters,
      {
        contactInfo: { email: "luth@cmda.org", phone: null, address: "Lagos" },
        socialLinks: { instagram: "https://instagram.com/cmda" },
        resources: [{ title: "Handbook", url: "", kind: "document" }],
        membership: [{ value: "120", label: "Membership strength" }],
        active: false,
      },
      { partial: true },
    );
    expect(ok["contactInfo"]).toEqual({ email: "luth@cmda.org", phone: "", address: "Lagos" });
    expect(ok["socialLinks"]).toEqual({
      instagram: "https://instagram.com/cmda",
      x: "",
      facebook: "",
      whatsapp: "",
    });
    expect(ok["resources"]).toEqual([
      { title: "Handbook", description: "", url: "", kind: "document" },
    ]);
    expect(ok["membership"]).toEqual([{ value: "120", label: "Membership strength" }]);
    expect(ok["active"]).toBe(false);

    // A cleared object unsets the field; an emptied list stays a list.
    expect(
      validateFields(chapters, { contactInfo: null }, { partial: true })["contactInfo"],
    ).toBeNull();
    expect(validateFields(chapters, { resources: [] }, { partial: true })["resources"]).toEqual([]);

    // Sub-keys outside the schema are rejected rather than silently dropped.
    expect(() =>
      validateFields(chapters, { contactInfo: { bankDetails: "secret" } }, { partial: true }),
    ).toThrow(ContentInputError);
    expect(() =>
      validateFields(chapters, { socialLinks: ["https://x.com"] }, { partial: true }),
    ).toThrow(ContentInputError);
    expect(() =>
      validateFields(chapters, { resources: [{ title: "ok" }, "row"] }, { partial: true }),
    ).toThrow(ContentInputError);
    expect(() =>
      validateFields(chapters, { membership: [{ count: 3 }] }, { partial: true }),
    ).toThrow(ContentInputError);
  });

  it("updates: allows partial input but not emptying required fields", () => {
    const ok = validateFields(events, { venue: "Hall" }, { partial: true });
    expect(ok).toEqual({ venue: "Hall" });
    expect(() => validateFields(events, { title: null }, { partial: true })).toThrow(
      ContentInputError,
    );
    expect(() => validateFields(events, { unknownKey: 1 }, { partial: true })).toThrow(
      ContentInputError,
    );
  });

  it("regions are self-scoping: no arm, unit refs or publication fields", () => {
    expect(regions.type).toBe("region");
    expect(regions.selfUnit).toBe(true);
    expect(regions.publication).toBe(false);
    expect(regions.writePermission).toBe("regions.write");
    expect(regions.deletePermission).toBe("regions.delete");
    for (const key of ["arm", "regions", "zones", "chapters", "publication", "stats", "gallery"]) {
      expect(regions.allowed).not.toContain(key);
    }
    const ok = validateFields(
      regions,
      { name: "West Africa", countries: ["Nigeria", "Ghana"], order: 2 },
      { partial: false },
    );
    expect(ok["countries"]).toEqual(["Nigeria", "Ghana"]);
    for (const key of ["arm", "regions", "zones", "chapters"]) {
      expect(() =>
        validateFields(regions, { name: "West Africa", [key]: [] }, { partial: false }),
      ).toThrow(ContentInputError);
    }
  });

  it("publications require a title, issue date and type, and allow scope + lifecycle", () => {
    expect(publications.type).toBe("prescription");
    expect(publications.publication).toBe(true);
    expect(publications.writePermission).toBe("publications.write");
    expect(publications.deletePermission).toBe("publications.delete");
    expect(publications.required).toEqual(["title", "issueDate", "kind"]);
    expect(() => validateFields(publications, { title: "March 2026" }, { partial: false })).toThrow(
      ContentInputError,
    );
    const ok = validateFields(
      publications,
      {
        title: "Prescription - March 2026",
        issueDate: "2026-03-01",
        kind: "prescription",
        arm: "global",
        regions: ["west-africa"],
        url: "https://example.org/issue.pdf",
        summary: "Monthly digest",
      },
      { partial: false },
    );
    expect(ok["issueDate"]).toBe("2026-03-01");
    expect(ok["kind"]).toBe("prescription");
    expect(ok["regions"]).toEqual(["west-africa"]);
    expect(ok["url"]).toBe("https://example.org/issue.pdf");
    // `gallery` and `publication` stay Studio-only.
    for (const key of ["gallery", "publication"]) {
      expect(() =>
        validateFields(
          publications,
          { title: "x", issueDate: "2026-03-01", kind: "prescription", [key]: "nope" },
          { partial: false },
        ),
      ).toThrow(ContentInputError);
    }
    expect(publications.allowed).toContain("body");
    // The dashboard body is markdown-lite Portable Text: accept block arrays,
    // reject non-block garbage like every other rich field.
    const bodyBlocks = [
      {
        _type: "block",
        style: "normal",
        markDefs: [],
        children: [{ _type: "span", text: "Hi", marks: [] }],
      },
    ];
    const withBody = validateFields(
      publications,
      { title: "x", issueDate: "2026-03-01", kind: "prescription", body: bodyBlocks },
      { partial: false },
    );
    expect(withBody["body"]).toEqual(bodyBlocks);
    expect(() =>
      validateFields(
        publications,
        { title: "x", issueDate: "2026-03-01", kind: "prescription", body: ["a", { b: 1 }] },
        { partial: false },
      ),
    ).toThrow(ContentInputError);
    // Issue metadata the dashboard does own.
    const meta = validateFields(
      publications,
      {
        title: "x",
        issueDate: "2026-03-01",
        kind: "prescription",
        issueNumber: 65,
        author: "CMDA Nigeria",
      },
      { partial: false },
    );
    expect(meta["issueNumber"]).toBe(65);
    expect(meta["author"]).toBe("CMDA Nigeria");
  });

  it("rejects issue numbers that are not positive whole numbers", () => {
    const base = { title: "x", issueDate: "2026-03-01", kind: "prescription" };
    for (const bad of [0, -3, 65.5, "sixty-five", 99_999]) {
      expect(() =>
        validateFields(publications, { ...base, issueNumber: bad }, { partial: false }),
      ).toThrow(ContentInputError);
    }
  });

  it("publications accept cover, alt text and issue files as asset references", () => {
    const imageId = "image-8ef1c9d4a7b2c5e6f0a1b2c3d4e5f6g7h8i9j0k1l2m-1200x800-jpg";
    const fileId = "file-1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b-pdf";
    const out = validateFields(
      publications,
      {
        title: "Touch Magazine",
        issueDate: "2025-12-01",
        kind: "journal",
        coverImage: imageId,
        coverAlt: "Cover of Touch Magazine",
        file: fileId,
      },
      { partial: false },
    );
    expect(out["coverImage"]).toEqual({
      _type: "image",
      alt: "Cover of Touch Magazine",
      asset: { _type: "reference", _ref: imageId },
    });
    expect(out["file"]).toEqual({
      _type: "file",
      asset: { _type: "reference", _ref: fileId },
    });
    // Alt text stays a top-level field as well, so Studio can filter on it.
    expect(out["coverAlt"]).toBe("Cover of Touch Magazine");
  });

  it("clears assets with an empty string and rejects malformed asset ids", () => {
    const base = { title: "x", issueDate: "2026-03-01", kind: "prescription" };
    const cleared = validateFields(publications, { ...base, coverImage: "" }, { partial: false });
    expect(cleared["coverImage"]).toBeNull();
    // An image id in the file slot and vice versa must not slip through.
    expect(() =>
      validateFields(
        publications,
        { ...base, file: "image-8ef1c9d4a7b2c5e6f0a1b2c3d4e5f6g7h8i9j0k1l2m-1200x800-jpg" },
        { partial: false },
      ),
    ).toThrow(ContentInputError);
    expect(() =>
      validateFields(publications, { ...base, coverImage: "nope" }, { partial: false }),
    ).toThrow(ContentInputError);
  });
});

describe("publication validation", () => {
  it("creates as draft or published", () => {
    expect(validateCreatePublication(undefined)).toBe("draft");
    expect(validateCreatePublication("published")).toBe("published");
    expect(() => validateCreatePublication("scheduled")).toThrow(ContentInputError);
  });

  it("transitions need a date only when scheduled", () => {
    expect(validatePublicationTransition("archived", null)).toEqual({
      publication: "archived",
      publishAt: null,
    });
    const iso = "2026-12-01T09:00:00.000Z";
    expect(validatePublicationTransition("scheduled", iso)).toEqual({
      publication: "scheduled",
      publishAt: iso,
    });
    expect(() => validatePublicationTransition("scheduled", null)).toThrow(ContentInputError);
    expect(() => validatePublicationTransition("bogus", null)).toThrow(ContentInputError);
  });
});

describe("scope inputs", () => {
  it("normalizes scope input", () => {
    expect(normalizeScopeInput(undefined)).toEqual({
      arm: null,
      regions: [],
      zones: [],
      chapters: [],
    });
    expect(normalizeScopeInput({ arm: "global", regions: ["africa"] })).toEqual({
      arm: "global",
      regions: ["africa"],
      zones: [],
      chapters: [],
    });
    expect(() => normalizeScopeInput({ arm: "bogus" })).toThrow(ContentInputError);
    expect(() => normalizeScopeInput("nope")).toThrow(ContentInputError);
  });

  it("derives effective create scope with arm precedence", () => {
    expect(effectiveCreateScope({}, {})).toEqual({
      arm: "global",
      regions: [],
      zones: [],
      chapters: [],
    });
    expect(effectiveCreateScope({ arm: "students" }, { arm: "doctors" })).toEqual({
      arm: "students",
      regions: [],
      zones: [],
      chapters: [],
    });
    expect(effectiveCreateScope({}, { arm: "doctors" })).toEqual({
      arm: "doctors",
      regions: [],
      zones: [],
      chapters: [],
    });
  });
});

describe("applySectionOrder", () => {
  const stored = [
    { _key: "a", type: "heroSection", heading: "Welcome", visible: true },
    { _key: "b", type: "statsSection", heading: "Numbers", visible: false },
    { _key: "c", type: "ctaSection", heading: "Join" },
  ];

  it("reorders and copies content from the stored document", () => {
    const result = applySectionOrder(stored, [
      { key: "c", visible: true },
      { key: "a", visible: false },
      { key: "b", visible: true },
    ]);
    expect(result.changed).toBe(true);
    expect(result.sections.map((section) => section["_key"])).toEqual(["c", "a", "b"]);
    expect(result.sections[0]?.["heading"]).toBe("Join");
    expect(result.sections[1]?.["heading"]).toBe("Welcome");
    expect(result.sections.map((section) => section["visible"])).toEqual([true, false, true]);
  });

  it("reports no change when order and flags already match", () => {
    const result = applySectionOrder(stored, [
      { key: "a", visible: true },
      { key: "b", visible: false },
      { key: "c", visible: true },
    ]);
    expect(result.changed).toBe(false);
    expect(result.sections[2]?.["heading"]).toBe("Join");
  });

  it("rejects a list that drops a section", () => {
    expect(() =>
      applySectionOrder(stored, [
        { key: "a", visible: true },
        { key: "b", visible: true },
      ]),
    ).toThrow(ContentInputError);
  });

  it("rejects a list that invents a section", () => {
    expect(() =>
      applySectionOrder(stored, [
        { key: "a", visible: true },
        { key: "b", visible: true },
        { key: "zzz", visible: true },
      ]),
    ).toThrow(ContentInputError);
  });

  it("rejects a duplicate key", () => {
    expect(() =>
      applySectionOrder(stored, [
        { key: "a", visible: true },
        { key: "a", visible: true },
        { key: "b", visible: true },
      ]),
    ).toThrow(ContentInputError);
  });

  it("rejects a non-boolean visible flag", () => {
    expect(() =>
      applySectionOrder(stored, [
        { key: "a", visible: "yes" },
        { key: "b", visible: true },
        { key: "c", visible: true },
      ]),
    ).toThrow(ContentInputError);
  });

  it("only accepts an empty list for a page with no sections", () => {
    expect(applySectionOrder([], []).changed).toBe(false);
    expect(applySectionOrder(null, []).changed).toBe(false);
    expect(() => applySectionOrder(null, [{ key: "a", visible: true }])).toThrow(ContentInputError);
  });
});

describe("validatePageSection", () => {
  it("accepts a minimal hero section and defaults visible to true", () => {
    const section = validatePageSection(
      { _key: "a", _type: "heroSection", heading: "Welcome" },
      { partial: false },
    );
    expect(section["_type"]).toBe("heroSection");
    expect(section["heading"]).toBe("Welcome");
    expect(section["visible"]).toBe(true);
  });

  it("converts a plain-text body into portable-text blocks", () => {
    const section = validatePageSection(
      { _key: "a", _type: "richTextSection", body: "First line.\n\nSecond line." },
      { partial: false },
    );
    const body = section["body"] as Array<{ children: Array<{ text: string }> }>;
    expect(body).toHaveLength(2);
    expect(body[0]?.children[0]?.text).toBe("First line.");
    expect(body[1]?.children[0]?.text).toBe("Second line.");
  });

  it("rejects unknown fields and unknown types", () => {
    expect(() =>
      validatePageSection({ _key: "a", _type: "heroSection", evil: true }, { partial: false }),
    ).toThrow(ContentInputError);
    expect(() =>
      validatePageSection({ _key: "a", _type: "notASection" }, { partial: false }),
    ).toThrow(ContentInputError);
  });

  it("normalizes stats items and CTA tone", () => {
    const section = validatePageSection(
      {
        _key: "a",
        _type: "statsSection",
        autoFill: true,
        items: [
          { value: "120", label: "Chapters" },
          { value: "5000", label: "Members" },
        ],
      },
      { partial: false },
    );
    expect(section["autoFill"]).toBe(true);
    expect(section["items"]).toEqual([
      { value: "120", label: "Chapters" },
      { value: "5000", label: "Members" },
    ]);
    const cta = validatePageSection(
      { _key: "b", _type: "ctaSection", tone: "muted", ctaLabel: "Give" },
      { partial: false },
    );
    expect(cta["tone"]).toBe("muted");
  });

  it("rejects a video section without a usable type-safe provider", () => {
    const section = validatePageSection(
      { _key: "v", _type: "videoSection", provider: "tiktok", videoId: "abc" },
      { partial: false },
    );
    expect(section["provider"]).toBe("youtube");
  });
});

describe("applyPageSections", () => {
  const stored = [
    { _key: "a", _type: "heroSection", heading: "Welcome", visible: true },
    { _key: "b", _type: "statsSection", heading: "Numbers", visible: true },
    { _key: "c", _type: "ctaSection", heading: "Join", visible: true },
  ];

  it("reorders without touching content when fields are omitted", () => {
    const result = applyPageSections(stored, [
      { key: "c", visible: true },
      { key: "a", visible: false },
      { key: "b", visible: true },
    ]);
    expect(result.changed).toBe(true);
    expect(result.sections.map((section) => section["_key"])).toEqual(["c", "a", "b"]);
    expect(result.sections[0]?.["heading"]).toBe("Join");
    expect(result.sections[1]?.["visible"]).toBe(false);
  });

  it("merges field edits onto an existing section", () => {
    const result = applyPageSections(stored, [
      { key: "a", visible: true, fields: { heading: "New welcome", eyebrow: "About" } },
      { key: "b", visible: true },
      { key: "c", visible: true },
    ]);
    expect(result.changed).toBe(true);
    expect(result.sections[0]?.["heading"]).toBe("New welcome");
    expect(result.sections[0]?.["eyebrow"]).toBe("About");
    expect(result.sections[0]?.["_type"]).toBe("heroSection");
  });

  it("creates a new section when type is supplied", () => {
    const result = applyPageSections(stored, [
      { key: "a", visible: true },
      { key: "b", visible: true },
      { key: "c", visible: true },
      { key: "new1", visible: true, type: "richTextSection", fields: { heading: "Extra" } },
    ]);
    expect(result.changed).toBe(true);
    expect(result.sections).toHaveLength(4);
    expect(result.sections[3]?.["_type"]).toBe("richTextSection");
    expect(result.sections[3]?.["heading"]).toBe("Extra");
  });

  it("deletes sections that are dropped from the list", () => {
    const result = applyPageSections(stored, [
      { key: "a", visible: true },
      { key: "c", visible: true },
    ]);
    expect(result.changed).toBe(true);
    expect(result.sections.map((section) => section["_key"])).toEqual(["a", "c"]);
  });

  it("rejects a new section without a known type", () => {
    expect(() =>
      applyPageSections(stored, [
        { key: "a", visible: true },
        { key: "b", visible: true },
        { key: "c", visible: true },
        { key: "new1", visible: true },
      ]),
    ).toThrow(ContentInputError);
  });

  it("rejects unknown fields in a field edit", () => {
    expect(() =>
      applyPageSections(stored, [
        { key: "a", visible: true, fields: { evil: true } },
        { key: "b", visible: true },
        { key: "c", visible: true },
      ]),
    ).toThrow(ContentInputError);
  });

  it("reports no change when nothing differs", () => {
    const result = applyPageSections(stored, [
      { key: "a", visible: true },
      { key: "b", visible: true },
      { key: "c", visible: true },
    ]);
    expect(result.changed).toBe(false);
  });
});

const IMAGE_ID = "image-abc123def456-800x600-png";

describe("normalizeGalleryField", () => {
  it("normalizes rows into galleryImage objects", () => {
    const rows = normalizeGalleryField([
      { image: IMAGE_ID, alt: "Students at camp", caption: "Camp 2026" },
      { image: ` ${IMAGE_ID} `, alt: "  ", caption: null },
    ]);
    expect(rows).toEqual([
      {
        _type: "galleryImage",
        image: { _type: "image", asset: { _type: "reference", _ref: IMAGE_ID } },
        alt: "Students at camp",
        caption: "Camp 2026",
      },
      {
        _type: "galleryImage",
        image: { _type: "image", asset: { _type: "reference", _ref: IMAGE_ID } },
      },
    ]);
  });

  it("drops rows without a valid image and treats empty as no gallery", () => {
    expect(normalizeGalleryField([])).toEqual([]);
    expect(normalizeGalleryField(null)).toEqual([]);
    expect(normalizeGalleryField(undefined)).toEqual([]);
    expect(normalizeGalleryField("")).toEqual([]);
    expect(normalizeGalleryField([{ alt: "photoless" }])).toEqual([]);
    expect(normalizeGalleryField([{ image: "" }])).toEqual([]);
  });

  it("rejects unknown row keys, non-arrays and oversized galleries", () => {
    expect(() => normalizeGalleryField([{ image: IMAGE_ID, url: "x" }])).toThrow(ContentInputError);
    expect(() => normalizeGalleryField("nope")).toThrow(ContentInputError);
    // A malformed asset id is rejected outright rather than dropped — the row
    // was explicitly populated, so silence would hide the mistake.
    expect(() => normalizeGalleryField([{ image: "not-an-asset" }])).toThrow(ContentInputError);
    expect(() =>
      normalizeGalleryField(Array.from({ length: 31 }, () => ({ image: IMAGE_ID }))),
    ).toThrow(ContentInputError);
    expect(
      normalizeGalleryField(Array.from({ length: 30 }, () => ({ image: IMAGE_ID }))),
    ).toHaveLength(30);
  });

  it("validateFields routes the chapters gallery through normalizeGalleryField", () => {
    const ok = validateFields(
      chapters,
      { name: "CMDA LUTH", gallery: [{ image: IMAGE_ID, alt: "Hall" }] },
      { partial: false },
    );
    expect(ok["gallery"]).toEqual([
      {
        _type: "galleryImage",
        image: { _type: "image", asset: { _type: "reference", _ref: IMAGE_ID } },
        alt: "Hall",
      },
    ]);
  });
});

describe("writeScopeRefs", () => {
  const leadership = MODULE_MUTATIONS.leadership;
  const refs = {
    chapters: new Map([["luth", "chapter-luth"]]),
    zones: new Map([["lagos", "zone-lagos"]]),
    regions: new Map([["south-west", "region-sw"]]),
  };
  const allKeys = { regions: true, zones: true, chapters: true };

  it("writes single refs for leadership and nulls them when the scope is empty", () => {
    const payload: Record<string, unknown> = {};
    writeScopeRefs(
      payload,
      leadership,
      { arm: "students", regions: [], zones: ["lagos"], chapters: ["luth"] },
      refs,
      allKeys,
    );
    expect(payload).toEqual({
      memberOfChapter: { _type: "reference", _ref: "chapter-luth" },
      zone: { _type: "reference", _ref: "zone-lagos" },
      region: null,
    });
  });

  it("keeps ref arrays for modules without singleRefs", () => {
    const payload: Record<string, unknown> = {};
    writeScopeRefs(
      payload,
      events,
      { arm: "students", regions: [], zones: ["lagos"], chapters: ["luth"] },
      refs,
      allKeys,
    );
    expect(payload).toEqual({
      regions: [],
      zones: [{ _type: "reference", _ref: "zone-lagos" }],
      chapters: [{ _type: "reference", _ref: "chapter-luth" }],
    });
  });

  it("only writes the keys it is asked to", () => {
    const payload: Record<string, unknown> = {};
    writeScopeRefs(
      payload,
      leadership,
      { arm: "students", regions: [], zones: [], chapters: ["luth"] },
      refs,
      { chapters: true },
    );
    expect(payload).toEqual({
      memberOfChapter: { _type: "reference", _ref: "chapter-luth" },
    });
  });
});
