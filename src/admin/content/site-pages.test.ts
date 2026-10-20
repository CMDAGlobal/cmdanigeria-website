import { describe, expect, it } from "vitest";

import { KIND_LABELS, MODULE_ROUTE_PREFIX, SITE_PAGES } from "./site-pages";

describe("SITE_PAGES", () => {
  it("covers the hybrid home and arm routes", () => {
    const hybrid = SITE_PAGES.filter((entry) => entry.kind === "hybrid").map((e) => e.pageSlug);
    expect(hybrid).toContain("home");
    expect(hybrid).toContain("students-arm");
    expect(hybrid).toContain("doctors-arm");
    expect(hybrid).toContain("global-network");
  });

  it("gives every entry a unique path", () => {
    const paths = SITE_PAGES.map((entry) => entry.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("gives every entry a title and kind label", () => {
    for (const entry of SITE_PAGES) {
      expect(entry.title.trim()).not.toBe("");
      expect(KIND_LABELS[entry.kind]).toBeTruthy();
    }
  });

  it("routes list entries to a real admin module", () => {
    for (const entry of SITE_PAGES) {
      if (entry.kind !== "list") continue;
      expect(entry.editModule).toBeTruthy();
      expect(MODULE_ROUTE_PREFIX[entry.editModule ?? ""]).toMatch(/^\/admin/);
    }
  });

  it("gives cms and hybrid entries a pageSlug", () => {
    for (const entry of SITE_PAGES) {
      if (entry.kind === "cms" || entry.kind === "hybrid") {
        expect(entry.pageSlug).toBeTruthy();
      }
    }
  });
});
