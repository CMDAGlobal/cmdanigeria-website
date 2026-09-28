import { describe, expect, it } from "vitest";
import { actorCoversDoc, deriveWriteScope, grantCoversDoc, type CoverOrg } from "./cover";
import type { ContentScopeMeta, ScopeGrant } from "./types";

const ORG: CoverOrg = {
  chapterArms: new Map([
    ["lagos", "students"],
    ["ibadan", "students"],
    ["abuja", "doctors"],
  ]),
  zoneArms: new Map([
    ["lagos-west", "students"],
    ["northwest", "doctors"],
  ]),
  regionSlugs: new Set(["africa", "uk-europe"]),
};

function meta(partial: Partial<ContentScopeMeta>): ContentScopeMeta {
  return { arm: null, regions: [], zones: [], chapters: [], ...partial };
}

const STUDENTS_WIDE = meta({ arm: "students" });
const STUDENTS_LAGOS = meta({ arm: "students", chapters: ["lagos"] });
const STUDENTS_MULTI = meta({ arm: "students", chapters: ["lagos", "ibadan"] });
const GLOBAL_AFRICA = meta({ arm: "global", regions: ["africa"] });
const NO_ARM = meta({});

describe("grantCoversDoc", () => {
  it("system grants cover every document", () => {
    const system: ScopeGrant = {};
    expect(grantCoversDoc(system, STUDENTS_WIDE, ORG)).toBe(true);
    expect(grantCoversDoc(system, NO_ARM, ORG)).toBe(true);
    expect(grantCoversDoc(system, STUDENTS_MULTI, ORG)).toBe(true);
  });

  it("arm grants cover arm-wide documents in their arm only", () => {
    const students: ScopeGrant = { arm: "students" };
    expect(grantCoversDoc(students, STUDENTS_WIDE, ORG)).toBe(true);
    expect(grantCoversDoc(students, meta({ arm: "doctors" }), ORG)).toBe(false);
    expect(grantCoversDoc(students, NO_ARM, ORG)).toBe(false);
    expect(grantCoversDoc(students, meta({ arm: null, chapters: ["lagos"] }), ORG)).toBe(false);
  });

  it("arm grants accept unit tags inside the arm and reject foreign units", () => {
    const students: ScopeGrant = { arm: "students" };
    expect(grantCoversDoc(students, STUDENTS_LAGOS, ORG)).toBe(true);
    expect(grantCoversDoc(students, meta({ arm: "students", chapters: ["abuja"] }), ORG)).toBe(
      false,
    );
    expect(grantCoversDoc(students, meta({ arm: "students", chapters: ["ghost"] }), ORG)).toBe(
      false,
    );
    expect(grantCoversDoc(students, meta({ arm: "students", zones: ["lagos-west"] }), ORG)).toBe(
      true,
    );
    expect(grantCoversDoc(students, meta({ arm: "students", zones: ["northwest"] }), ORG)).toBe(
      false,
    );
  });

  it("region tags only exist on global content", () => {
    const global: ScopeGrant = { arm: "global" };
    const students: ScopeGrant = { arm: "students" };
    expect(grantCoversDoc(global, GLOBAL_AFRICA, ORG)).toBe(true);
    expect(grantCoversDoc(global, meta({ arm: "global", regions: ["ghost"] }), ORG)).toBe(false);
    expect(grantCoversDoc(students, GLOBAL_AFRICA, ORG)).toBe(false);
  });

  it("chapter grants only cover a document tagged to exactly their chapter", () => {
    const lagos: ScopeGrant = { arm: "students", chapterSlug: "lagos" };
    expect(grantCoversDoc(lagos, STUDENTS_LAGOS, ORG)).toBe(true);
    // Arm-wide content is visible to chapter admins but not writable by them.
    expect(grantCoversDoc(lagos, STUDENTS_WIDE, ORG)).toBe(false);
    expect(grantCoversDoc(lagos, meta({ arm: "students", chapters: ["ibadan"] }), ORG)).toBe(false);
    expect(grantCoversDoc(lagos, STUDENTS_MULTI, ORG)).toBe(false);
    expect(grantCoversDoc(lagos, meta({ arm: "students", zones: ["lagos-west"] }), ORG)).toBe(
      false,
    );
    expect(grantCoversDoc(lagos, meta({ arm: "doctors", chapters: ["lagos"] }), ORG)).toBe(false);
  });

  it("region grants only cover a document tagged to exactly their region", () => {
    const africa: ScopeGrant = { arm: "global", regionSlug: "africa" };
    expect(grantCoversDoc(africa, GLOBAL_AFRICA, ORG)).toBe(true);
    expect(grantCoversDoc(africa, meta({ arm: "global", regions: ["uk-europe"] }), ORG)).toBe(
      false,
    );
    expect(grantCoversDoc(africa, meta({ arm: "global" }), ORG)).toBe(false);
    expect(
      grantCoversDoc(
        africa,
        meta({ arm: "global", regions: ["africa"], chapters: ["lagos"] }),
        ORG,
      ),
    ).toBe(false);
    expect(
      grantCoversDoc(
        africa,
        meta({ arm: "global", regions: ["africa"], zones: ["lagos-west"] }),
        ORG,
      ),
    ).toBe(false);
    expect(grantCoversDoc(africa, meta({ arm: "students", regions: ["africa"] }), ORG)).toBe(false);
  });

  it("selfSlug exempts a chapter's own tag from the org lookup", () => {
    const arm: ScopeGrant = { arm: "students" };
    expect(
      grantCoversDoc(arm, meta({ arm: "students", chapters: ["brand-new"] }), ORG, "brand-new"),
    ).toBe(true);
    expect(
      grantCoversDoc(
        arm,
        meta({ arm: "students", chapters: ["brand-new", "lagos"] }),
        ORG,
        "brand-new",
      ),
    ).toBe(true);
    // Creating a chapter before it is indexed in the organisation lookup.
    expect(
      grantCoversDoc(
        { arm: "students", chapterSlug: "lagos" },
        meta({ arm: "students", chapters: ["lagos"] }),
        { ...ORG, chapterArms: new Map<string, string>() },
        "lagos",
      ),
    ).toBe(true);
  });
});

describe("actorCoversDoc", () => {
  it("passes when any role grant covers the document", () => {
    const actor = {
      userId: "u1",
      roles: [
        {
          roleKey: "chapter_admin" as const,
          scope: { arm: "students" as const, chapterSlug: "ibadan" },
        },
        { roleKey: "super_admin" as const, scope: {} },
      ],
    };
    expect(actorCoversDoc(actor, STUDENTS_LAGOS, ORG)).toBe(true);
    const single = {
      userId: "u2",
      roles: [
        {
          roleKey: "chapter_admin" as const,
          scope: { arm: "students" as const, chapterSlug: "ibadan" },
        },
      ],
    };
    expect(actorCoversDoc(single, STUDENTS_LAGOS, ORG)).toBe(false);
  });
});

describe("deriveWriteScope", () => {
  it("derives the narrowest scope from a document", () => {
    expect(deriveWriteScope(STUDENTS_WIDE)).toEqual({ arm: "students" });
    expect(deriveWriteScope(STUDENTS_LAGOS)).toEqual({ arm: "students", chapterSlug: "lagos" });
    expect(deriveWriteScope(GLOBAL_AFRICA)).toEqual({ arm: "global", regionSlug: "africa" });
    expect(deriveWriteScope(STUDENTS_MULTI)).toEqual({ arm: "students" });
    expect(deriveWriteScope(NO_ARM)).toEqual({});
  });

  it("fails closed on unknown arm values", () => {
    expect(deriveWriteScope(meta({ arm: "bogus", chapters: ["lagos"] }))).toEqual({});
  });
});
