import { describe, expect, it } from "vitest";
import { mapRegions, regionStats } from "./mappers";

const ROWS = [
  {
    id: "r1",
    title: "West Africa",
    slug: "west-africa",
    countries: ["Nigeria", "Ghana"],
    intro: "A region intro",
  },
  {
    id: "r2",
    title: "UK & Europe",
    slug: "uk-europe",
    countries: ["United Kingdom"],
    tagline: "Europe hub",
  },
  { id: "r3", title: "Unlisted", slug: "unlisted" },
  { id: "r4", title: "No slug" },
];

describe("mapRegions", () => {
  it("scopes every region to itself inside the Global Network", () => {
    const items = mapRegions(ROWS);
    expect(items.map((item) => item.slug)).toEqual(["west-africa", "uk-europe", "unlisted", null]);
    expect(items[0]?.scope).toEqual({
      arm: "global",
      regions: ["west-africa"],
      zones: [],
      chapters: [],
    });
    expect(items[0]?.arm).toBe("global");
    // A region with no slug cannot be self-scoped and falls back to system scope.
    expect(items[3]?.scope).toEqual({ arm: "global", regions: [], zones: [], chapters: [] });
  });

  it("summarises countries as the subtitle and keeps regions publication-free", () => {
    const items = mapRegions(ROWS);
    expect(items[0]?.title).toBe("West Africa");
    expect(items[0]?.subtitle).toBe("Nigeria, Ghana");
    expect(items[2]?.subtitle).toBeNull();
    for (const item of items) {
      expect(item.status).toBeNull();
      expect(item.draft).toBe(false);
      expect(item.date).toBeNull();
    }
  });

  it("counts regions and those with country coverage", () => {
    expect(regionStats(mapRegions(ROWS))).toEqual([
      { label: "Total regions", value: 4 },
      { label: "With country coverage", value: 2 },
    ]);
    expect(regionStats([])).toEqual([
      { label: "Total regions", value: 0 },
      { label: "With country coverage", value: 0 },
    ]);
  });
});
