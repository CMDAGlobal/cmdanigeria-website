import { describe, expect, it } from "vitest";
import { mapPublications, mapRegions, publicationStats, regionStats } from "./mappers";

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

const PUBLICATION_ROWS = [
  {
    id: "p1",
    title: "Prescription - March 2026",
    slug: "prescription-march-2026",
    kind: "prescription",
    issueNumber: 65,
    issueDate: "2026-03-01",
    author: "CMDA Nigeria",
    publication: "published",
    url: "https://example.org/prescription-march-2026.pdf",
    arm: "global",
    regions: ["west-africa"],
  },
  {
    id: "p2",
    title: "Students Digest",
    slug: "students-digest",
    kind: "newsletter",
    publication: "draft",
    arm: "students",
    zones: ["south-west"],
  },
];

describe("mapPublications", () => {
  it("labels the publication type, appends the issue number and flags reading links", () => {
    const items = mapPublications(PUBLICATION_ROWS);
    expect(items[0]?.title).toBe("Prescription - March 2026 #65");
    expect(items[0]?.subtitle).toBe("Prescription");
    expect(items[0]?.date).toBe("2026-03-01");
    expect(items[0]?.detail).toBe("#65 · CMDA Nigeria");
    expect(items[1]?.subtitle).toBe("Newsletter");
    expect(items[1]?.detail).toBeNull();
  });

  it("falls back to a reading link when an issue has no number or author", () => {
    const items = mapPublications([{ id: "p4", title: "Touch", url: "https://example.org/touch" }]);
    expect(items[0]?.title).toBe("Touch");
    expect(items[0]?.detail).toBe("Has reading link");
  });

  it("falls back to a prescription kind and a generic title when data is missing", () => {
    const items = mapPublications([{ id: "p3" }]);
    expect(items[0]?.title).toBe("Untitled issue");
    expect(items[0]?.subtitle).toBe("Prescription");
    expect(items[0]?.date).toBeNull();
  });

  it("carries publication status and scope", () => {
    const items = mapPublications(PUBLICATION_ROWS);
    expect(items[0]?.status).toEqual({ label: "Published", tone: "secondary" });
    expect(items[0]?.draft).toBe(false);
    expect(items[0]?.scope).toEqual({
      arm: "global",
      regions: ["west-africa"],
      zones: [],
      chapters: [],
    });
    expect(items[1]?.draft).toBe(true);
    expect(items[1]?.status).toEqual({ label: "Draft", tone: "destructive" });
    expect(items[1]?.scope?.zones).toEqual(["south-west"]);
  });

  it("counts issues, drafts and those with a reading link", () => {
    expect(publicationStats(mapPublications(PUBLICATION_ROWS))).toEqual([
      { label: "Total issues", value: 2 },
      { label: "Published", value: 1 },
      { label: "Drafts", value: 1 },
      { label: "With reading link", value: 0 },
    ]);
    const withLink = mapPublications([{ id: "p5", title: "Touch", url: "https://example.org/t" }]);
    expect(publicationStats(withLink).at(-1)).toEqual({ label: "With reading link", value: 1 });
    expect(publicationStats([]).every((stat) => stat.value === 0)).toBe(true);
  });
});
