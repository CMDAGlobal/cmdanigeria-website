import { describe, expect, it } from "vitest";
import {
  FORM_DEFAULTS,
  MODULE_FORM_FIELDS,
  assignableScopeOptions,
  compactRows,
  flattenPortableText,
  formFieldsFor,
  isBlankObject,
  isoToLocalInput,
  jsonToObject,
  jsonToRows,
  localInputToIso,
  objectToJson,
  pageSectionTypeLabel,
  rowsToJson,
  tagsToText,
  textToBlocks,
  textToTags,
} from "./forms";
import type { ContentModuleKey } from "./types";
import { MODULE_MUTATIONS } from "./validate";

const MODULES: ContentModuleKey[] = [
  "chapters",
  "regions",
  "events",
  "news",
  "announcements",
  "outreaches",
  "pages",
  "publications",
];

const ORG = {
  chapters: [
    { slug: "luth", name: "CMDA LUTH", arm: "students" },
    { slug: "unilag", name: "CMDA Unilag", arm: "students" },
    { slug: "abu", name: "CMDA ABU", arm: "doctors" },
  ],
  regions: [
    { slug: "south-west", name: "South West" },
    { slug: "north", name: "North" },
  ],
  zones: [
    { slug: "lagos-zone", name: "Lagos Zone", arm: "students" },
    { slug: "north-zone", name: "North Zone", arm: "doctors" },
  ],
};

describe("form config integrity", () => {
  it("every form field is inside the server allowlist", () => {
    for (const module of MODULES) {
      const allowed = MODULE_MUTATIONS[module].allowed;
      for (const field of MODULE_FORM_FIELDS[module]) {
        // `note` controls are read-only hints, never submitted.
        if (field.kind === "note") continue;
        expect(allowed, `${module}.${field.name}`).toContain(field.name);
      }
    }
  });

  it("notes are display-only and never required", () => {
    for (const module of MODULES) {
      for (const field of MODULE_FORM_FIELDS[module]) {
        if (field.kind !== "note") continue;
        expect(field.required, `${module}.${field.name}`).toBeUndefined();
        expect(field.note, `${module}.${field.name}`).toBeTruthy();
      }
    }
  });

  it("every server-required field has a form control, marked required", () => {
    for (const module of MODULES) {
      const fields = formFieldsFor(module);
      const names = fields.map((field) => field.name);
      for (const key of MODULE_MUTATIONS[module].required) {
        expect(names, `${module} requires ${key}`).toContain(key);
      }
      const requiredNames = fields.filter((field) => field.required).map((field) => field.name);
      expect(requiredNames.sort()).toEqual([...MODULE_MUTATIONS[module].required].sort());
    }
  });

  it("selects carry options and defaults map to real controls", () => {
    const known = new Set(
      MODULES.flatMap((module) => MODULE_FORM_FIELDS[module].map((f) => f.name)),
    );
    for (const key of Object.keys(FORM_DEFAULTS)) {
      expect(known, `default for ${key}`).toContain(key);
    }
    for (const module of MODULES) {
      for (const field of MODULE_FORM_FIELDS[module]) {
        if (field.kind === "select") {
          expect(field.options, `${module}.${field.name}`).toBeTruthy();
          expect(field.options?.length ?? 0).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe("value conversions", () => {
  it("round-trips plain text through Portable Text", () => {
    const text = "First line.\nSecond line.";
    expect(flattenPortableText(textToBlocks(text))).toBe(text);
    expect(flattenPortableText(textToBlocks("  spaced  \n\n\n"))).toBe("spaced");
  });

  it("ignores non-block entries", () => {
    expect(flattenPortableText("nope")).toBe("");
    expect(flattenPortableText(null)).toBe("");
    expect(flattenPortableText([{ _type: "image" }, 7])).toBe("");
    const mixed = [
      { _type: "block", children: [{ _type: "span", text: "ok" }] },
      { _type: "block", children: "not-an-array" },
    ];
    expect(flattenPortableText(mixed)).toBe("ok");
  });

  it("round-trips datetimes through the local input format", () => {
    const local = "2026-05-10T14:30";
    const iso = localInputToIso(local);
    expect(iso).toBeTruthy();
    expect(isoToLocalInput(iso)).toBe(local);
    expect(isoToLocalInput("not-a-date")).toBe("");
    expect(localInputToIso("")).toBeNull();
    expect(localInputToIso("nonsense")).toBeNull();
  });

  it("normalizes tag lists", () => {
    expect(tagsToText(["news", "health"])).toBe("news, health");
    expect(tagsToText("broken")).toBe("");
    expect(textToTags("news,  health ,news,")).toEqual(["news", "health"]);
    expect(textToTags("  ")).toEqual([]);
  });

  it("round-trips nested object and list fields through JSON", () => {
    const columns = [
      { name: "email", label: "Email" },
      { name: "phone", label: "Phone" },
    ];
    const empty = jsonToObject(columns, objectToJson(columns, null));
    expect(empty).toEqual({ email: "", phone: "" });
    expect(isBlankObject(empty)).toBe(true);

    const stored = objectToJson(columns, { email: "a@b.co", phone: null, other: "dropped" });
    expect(jsonToObject(columns, stored)).toEqual({ email: "a@b.co", phone: "" });
    expect(isBlankObject(jsonToObject(columns, stored))).toBe(false);

    const rowColumns = [
      { name: "title", label: "Title" },
      { name: "url", label: "Link" },
    ];
    const json = rowsToJson(rowColumns, [{ title: "Handbook" }, { title: "" }]);
    expect(jsonToRows(rowColumns, json)).toEqual([
      { title: "Handbook", url: "" },
      { title: "", url: "" },
    ]);
    expect(compactRows(jsonToRows(rowColumns, json))).toEqual([{ title: "Handbook", url: "" }]);
    expect(jsonToRows(rowColumns, "not json")).toEqual([]);
  });
});

describe("assignableScopeOptions", () => {
  it("system grants may tag everything", () => {
    const options = assignableScopeOptions([{}], ORG);
    expect(options.arms).toEqual(["global", "students", "doctors"]);
    expect(options.chapters.map((c) => c.slug).sort()).toEqual(["abu", "luth", "unilag"]);
    expect(options.zones.map((z) => z.slug).sort()).toEqual(["lagos-zone", "north-zone"]);
    expect(options.regions.map((r) => r.slug).sort()).toEqual(["north", "south-west"]);
  });

  it("arm grants only get their own arm's chapters and zones, never regions", () => {
    const options = assignableScopeOptions([{ arm: "students" }], ORG);
    expect(options.arms).toEqual(["students"]);
    expect(options.chapters.map((c) => c.slug).sort()).toEqual(["luth", "unilag"]);
    expect(options.zones.map((z) => z.slug)).toEqual(["lagos-zone"]);
    expect(options.regions).toEqual([]);
  });

  it("global-arm grants get every region but no chapters or zones", () => {
    const options = assignableScopeOptions([{ arm: "global" }], ORG);
    expect(options.arms).toEqual(["global"]);
    expect(options.regions.map((r) => r.slug).sort()).toEqual(["north", "south-west"]);
    expect(options.chapters).toEqual([]);
    expect(options.zones).toEqual([]);
  });

  it("chapter grants only get their own chapter", () => {
    const options = assignableScopeOptions([{ arm: "students", chapterSlug: "luth" }], ORG);
    expect(options.arms).toEqual(["students"]);
    expect(options.chapters.map((c) => c.slug)).toEqual(["luth"]);
    expect(options.chapters[0]?.title).toBe("CMDA LUTH");
    expect(options.zones).toEqual([]);
    expect(options.regions).toEqual([]);
  });

  it("region grants only get their own region", () => {
    const options = assignableScopeOptions([{ arm: "global", regionSlug: "south-west" }], ORG);
    expect(options.arms).toEqual(["global"]);
    expect(options.regions.map((r) => r.slug)).toEqual(["south-west"]);
    expect(options.chapters).toEqual([]);
    expect(options.zones).toEqual([]);
  });

  it("unions multiple grants", () => {
    const options = assignableScopeOptions(
      [{ arm: "students" }, { arm: "doctors", chapterSlug: "abu" }],
      ORG,
    );
    expect(options.arms).toEqual(["students", "doctors"]);
    expect(options.chapters.map((c) => c.slug).sort()).toEqual(["abu", "luth", "unilag"]);
    // The chapter-scoped grant contributes only its own chapter, not arm-wide zones.
    expect(options.zones.map((z) => z.slug)).toEqual(["lagos-zone"]);
  });

  it("fails closed on unknown chapter slugs", () => {
    const options = assignableScopeOptions([{ arm: "students", chapterSlug: "ghost" }], ORG);
    expect(options.chapters).toEqual([{ slug: "ghost", title: "ghost", arm: "students" }]);
    expect(options.zones).toEqual([]);
    expect(options.regions).toEqual([]);
  });
});

describe("pageSectionTypeLabel", () => {
  it("uses the titles Sanity Studio shows", () => {
    expect(pageSectionTypeLabel("heroSection")).toBe("Hero");
    expect(pageSectionTypeLabel("statsSection")).toBe("Statistics");
    expect(pageSectionTypeLabel("ctaSection")).toBe("Call to action");
  });

  it("falls back to the raw type for an unknown section", () => {
    expect(pageSectionTypeLabel("newSection")).toBe("newSection");
  });
});
