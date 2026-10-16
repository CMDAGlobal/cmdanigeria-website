import { describe, expect, it } from "vitest";

import { buildDashboardContentStats, maskDashboardContentStats } from "./dashboard-stats";
import type { DashboardStatsInput } from "./dashboard-stats";
import type { DashboardContentStats } from "./types";

function emptyInput(): DashboardStatsInput {
  return {
    pages: [],
    events: [],
    chapters: [],
    regions: [],
    posts: [],
    prescriptions: [],
    announcements: [],
    outreaches: [],
    leadership: [],
  };
}

const SYSTEM: { arm?: string; regionSlug?: string; chapterSlug?: string }[] = [{}];
const NOW = Date.parse("2026-06-15T12:00:00Z");

function fullStats(overrides: Partial<DashboardContentStats> = {}): DashboardContentStats {
  return {
    pages: { total: 0, published: 0, draft: 0 },
    events: { upcoming: 0, past: 0, draft: 0 },
    studentChapters: 0,
    doctorChapters: 0,
    regions: 0,
    posts: 0,
    newsletters: 0,
    mediaFiles: 0,
    ...overrides,
  };
}

describe("buildDashboardContentStats", () => {
  it("returns zeros for a null payload", () => {
    const result = buildDashboardContentStats(null, [], NOW);
    expect(result).toEqual(fullStats());
  });

  it("counts pages by publication state", () => {
    const input = emptyInput();
    input.pages = [
      { publication: "published" },
      { publication: "published" },
      { publication: "draft" },
      { draft: true },
    ];
    const result = buildDashboardContentStats(input, [...SYSTEM], NOW);
    expect(result.pages).toEqual({ total: 4, published: 2, draft: 2 });
  });

  it("splits events into upcoming, past and draft", () => {
    const input = emptyInput();
    input.events = [
      { startDate: "2026-07-01T00:00:00Z", publication: "published" },
      { startDate: "2026-01-01T00:00:00Z", publication: "published" },
      { publication: "draft" },
      { publication: "published" },
    ];
    const result = buildDashboardContentStats(input, [...SYSTEM], NOW);
    expect(result.events).toEqual({ upcoming: 1, past: 2, draft: 1 });
  });

  it("counts chapters by arm and regions separately", () => {
    const input = emptyInput();
    input.chapters = [
      { arm: "students", slug: "lagos" },
      { arm: "students", slug: "abuja" },
      { arm: "doctors", slug: "ph" },
    ];
    input.regions = [{ slug: "west-africa" }, { slug: "east-africa" }];
    const result = buildDashboardContentStats(input, [...SYSTEM], NOW);
    expect(result.studentChapters).toBe(2);
    expect(result.doctorChapters).toBe(1);
    expect(result.regions).toBe(2);
  });

  it("counts posts and prescriptions", () => {
    const input = emptyInput();
    input.posts = [{ publication: "published" }, { publication: "draft" }];
    input.prescriptions = [{ publication: "published" }];
    const result = buildDashboardContentStats(input, [...SYSTEM], NOW);
    expect(result.posts).toBe(2);
    expect(result.newsletters).toBe(1);
  });

  it("sums cover and gallery counts for media files", () => {
    const input = emptyInput();
    input.pages = [{ hasCover: true, galleryCount: 2 }];
    input.chapters = [{ arm: "students", slug: "lagos", galleryCount: 3 }];
    input.regions = [{ slug: "west", hasCover: true }];
    const result = buildDashboardContentStats(input, [...SYSTEM], NOW);
    expect(result.mediaFiles).toBe(1 + 2 + 3 + 1);
  });

  it("hides another chapter from a chapter-scoped grant", () => {
    const input = emptyInput();
    input.chapters = [
      { arm: "students", slug: "lagos" },
      { arm: "students", slug: "abuja" },
    ];
    input.events = [
      {
        arm: "students",
        chapters: ["lagos"],
        publication: "published",
        startDate: "2026-07-01T00:00:00Z",
      },
      {
        arm: "students",
        chapters: ["abuja"],
        publication: "published",
        startDate: "2026-07-01T00:00:00Z",
      },
    ];
    const grants = [{ arm: "students", chapterSlug: "lagos" }];
    const result = buildDashboardContentStats(input, grants, NOW);
    expect(result.studentChapters).toBe(1);
    expect(result.events?.upcoming).toBe(1);
  });

  it("shows arm-wide content to a chapter-scoped grant", () => {
    const input = emptyInput();
    input.events = [
      { arm: "students", publication: "published", startDate: "2026-07-01T00:00:00Z" },
      {
        arm: "students",
        chapters: ["abuja"],
        publication: "published",
        startDate: "2026-07-01T00:00:00Z",
      },
    ];
    const grants = [{ arm: "students", chapterSlug: "lagos" }];
    const result = buildDashboardContentStats(input, grants, NOW);
    expect(result.events?.upcoming).toBe(1);
  });

  it("hides another region from a region-scoped grant", () => {
    const input = emptyInput();
    input.regions = [{ slug: "west-africa" }, { slug: "east-africa" }];
    input.posts = [
      { arm: "global", regions: ["west-africa"], publication: "published" },
      { arm: "global", regions: ["east-africa"], publication: "published" },
    ];
    const grants = [{ arm: "global", regionSlug: "west-africa" }];
    const result = buildDashboardContentStats(input, grants, NOW);
    expect(result.regions).toBe(1);
    expect(result.posts).toBe(1);
  });

  it("limits an arm-scoped grant to its own arm", () => {
    const input = emptyInput();
    input.chapters = [
      { arm: "students", slug: "lagos" },
      { arm: "doctors", slug: "ph" },
    ];
    const result = buildDashboardContentStats(input, [{ arm: "students" }], NOW);
    expect(result.studentChapters).toBe(1);
    expect(result.doctorChapters).toBe(0);
  });
});

describe("maskDashboardContentStats", () => {
  it("nulls out every bucket a super admin would see only with permissions", () => {
    const result = maskDashboardContentStats(fullStats({ posts: 5 }), []);
    expect(result.pages).toBeNull();
    expect(result.events).toBeNull();
    expect(result.studentChapters).toBeNull();
    expect(result.posts).toBeNull();
    expect(result.newsletters).toBeNull();
    expect(result.mediaFiles).toBeNull();
  });

  it("keeps buckets whose read permission is granted", () => {
    const stats = fullStats({
      pages: { total: 3, published: 2, draft: 1 },
      posts: 5,
      studentChapters: 2,
    });
    const result = maskDashboardContentStats(stats, ["pages.read", "news.read", "chapters.read"]);
    expect(result.pages).toEqual({ total: 3, published: 2, draft: 1 });
    expect(result.posts).toBe(5);
    expect(result.studentChapters).toBe(2);
    expect(result.events).toBeNull();
    expect(result.newsletters).toBeNull();
    expect(result.mediaFiles).toBeNull();
  });
});
