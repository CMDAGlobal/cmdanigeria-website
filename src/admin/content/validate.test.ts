import { describe, expect, it } from "vitest";
import {
  ContentInputError,
  assertSlug,
  effectiveCreateScope,
  MODULE_MUTATIONS,
  normalizeArm,
  normalizeScopeInput,
  parseModuleConfig,
  slugify,
  validateCreatePublication,
  validateFields,
  validatePublicationTransition,
} from "./validate";

const events = MODULE_MUTATIONS.events;
const pages = MODULE_MUTATIONS.pages;
const regions = MODULE_MUTATIONS.regions;

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
