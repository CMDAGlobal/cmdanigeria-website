import { describe, expect, it } from "vitest";
import type { ContentScopeMeta, ScopeGrant } from "./types";
import { buildScopeMeta, grantsFromRoles, isSystemGrant, visibleToGrants } from "./scope";

const meta = (input: Partial<ContentScopeMeta>): ContentScopeMeta => ({
  arm: null,
  regions: [],
  zones: [],
  chapters: [],
  ...input,
});

const grants: ScopeGrant[] = [{ arm: "students", chapterSlug: "lagos" }];

const armWide = meta({ arm: "students" });
const ownChapter = meta({ arm: "students", chapters: ["lagos"] });
const otherChapter = meta({ arm: "students", chapters: ["abuja"] });
const zoneTagged = meta({ arm: "students", zones: ["western"] });
const regionTagged = meta({ arm: "global", regions: ["africa"] });
const otherRegion = meta({ arm: "global", regions: ["uk-europe"] });
const globalWide = meta({ arm: "global" });
const doctorsWide = meta({ arm: "doctors" });

describe("visibleToGrants", () => {
  it("denies a user with no grants", () => {
    expect(visibleToGrants(ownChapter, [])).toBe(false);
  });

  it("lets a system grant see everything", () => {
    const system: ScopeGrant[] = [{}];
    for (const m of [armWide, ownChapter, otherChapter, zoneTagged, regionTagged, globalWide]) {
      expect(visibleToGrants(m, system)).toBe(true);
    }
  });

  it("shows a chapter admin its own chapter and arm-wide content", () => {
    expect(visibleToGrants(ownChapter, grants)).toBe(true);
    expect(visibleToGrants(armWide, grants)).toBe(true);
  });

  it("hides another chapter from a chapter admin", () => {
    expect(visibleToGrants(otherChapter, grants)).toBe(false);
  });

  it("fails closed on content scoped to a zone or region", () => {
    expect(visibleToGrants(zoneTagged, grants)).toBe(false);
    expect(visibleToGrants(regionTagged, grants)).toBe(false);
  });

  it("keeps global content out of an arm-scoped grant", () => {
    expect(visibleToGrants(globalWide, grants)).toBe(false);
    expect(visibleToGrants(regionTagged, grants)).toBe(false);
  });

  it("keeps another arm out of an arm-scoped grant", () => {
    expect(visibleToGrants(doctorsWide, [{ arm: "students" }])).toBe(false);
    expect(visibleToGrants(armWide, [{ arm: "students" }])).toBe(true);
  });

  it("shows a global arm grant the global hierarchy", () => {
    const global: ScopeGrant[] = [{ arm: "global" }];
    expect(visibleToGrants(globalWide, global)).toBe(true);
    expect(visibleToGrants(regionTagged, global)).toBe(true);
    expect(visibleToGrants(armWide, global)).toBe(false);
  });

  it("scopes a region admin to its own region only", () => {
    const africa: ScopeGrant[] = [{ arm: "global", regionSlug: "africa" }];
    expect(visibleToGrants(regionTagged, africa)).toBe(true);
    expect(visibleToGrants(otherRegion, africa)).toBe(false);
    expect(visibleToGrants(zoneTagged, africa)).toBe(false);
    expect(visibleToGrants(globalWide, africa)).toBe(true);
  });

  it("hides chapters from a region admin", () => {
    const africa: ScopeGrant[] = [{ arm: "global", regionSlug: "africa" }];
    expect(visibleToGrants(ownChapter, africa)).toBe(false);
  });

  it("treats a bare region grant without an arm as region-scoped", () => {
    expect(visibleToGrants(regionTagged, [{ regionSlug: "africa" }])).toBe(true);
    expect(visibleToGrants(otherRegion, [{ regionSlug: "africa" }])).toBe(false);
  });

  it("unions multiple grants", () => {
    const both: ScopeGrant[] = [
      { arm: "students", chapterSlug: "lagos" },
      { arm: "global", regionSlug: "africa" },
    ];
    expect(visibleToGrants(ownChapter, both)).toBe(true);
    expect(visibleToGrants(regionTagged, both)).toBe(true);
    expect(visibleToGrants(otherChapter, both)).toBe(false);
  });
});

describe("buildScopeMeta", () => {
  it("normalises single values and arrays to string arrays, dropping non-strings", () => {
    expect(
      buildScopeMeta({
        arm: "students",
        regions: "africa",
        zones: [{ slug: "western", region: null }, null, "western"],
        chapters: ["lagos", "", 7],
      }),
    ).toEqual({
      arm: "students",
      regions: ["africa"],
      zones: ["western"],
      chapters: ["lagos"],
    });
  });

  it("drops a missing arm", () => {
    expect(buildScopeMeta({ arm: "" }).arm).toBeNull();
  });
});

describe("grantsFromRoles", () => {
  it("copies only defined scope fields", () => {
    expect(
      grantsFromRoles([{ scope: { arm: "doctors", chapterSlug: "lagos" } }, { scope: {} }]),
    ).toEqual([{ arm: "doctors", chapterSlug: "lagos" }, {}]);
  });
});

describe("isSystemGrant", () => {
  it("recognises only a fully empty scope", () => {
    expect(isSystemGrant({})).toBe(true);
    expect(isSystemGrant({ arm: "students" })).toBe(false);
    expect(isSystemGrant({ regionSlug: "africa" })).toBe(false);
    expect(isSystemGrant({ chapterSlug: "lagos" })).toBe(false);
  });
});
