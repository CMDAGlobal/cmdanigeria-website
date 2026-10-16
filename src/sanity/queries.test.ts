import { describe, expect, it } from "vitest";
import { parse } from "groq-js";

import * as queries from "./queries";

/** Full queries (they start a statement); `*Projection` exports are fragments. */
const isQuery = (name: string, value: unknown): value is string =>
  typeof value === "string" &&
  !name.endsWith("Projection") &&
  (value.trimStart().startsWith("*") || value.trimStart().startsWith("{"));

const publicQueries: Array<[string, string]> = [];
for (const entry of Object.entries(queries)) {
  if (isQuery(entry[0], entry[1])) publicQueries.push([entry[0], entry[1]]);
}

describe("public GROQ", () => {
  it("exports the queries the site depends on", () => {
    const names = publicQueries.map(([name]) => name);
    expect(names).toEqual(
      expect.arrayContaining([
        "chapterQuery",
        "regionQuery",
        "zoneQuery",
        "pageCountersQuery",
        "outreachListQuery",
      ]),
    );
  });

  it.each(publicQueries)("parses: %s", (_name, sql) => {
    expect(() => parse(sql)).not.toThrow();
  });

  it("never nests an object projection inside an array projection", () => {
    // `gallery[]{ {...} }` is invalid GROQ: imageProjection already carries its own
    // braces. This shipped broken and silently sent every chapter and region page
    // to its hardcoded fallback.
    for (const [name, sql] of publicQueries) {
      expect(sql, `${name} must not contain "[]{ {"`).not.toMatch(/\[\]\s*\{\s*\{/);
    }
  });

  it("keeps chapters created before the lifecycle fields still counted", () => {
    // Missing `active` / `publication` default to visible, otherwise the 82 existing
    // chapters would drop out of every public counter.
    for (const name of ["pageCountersQuery", "chapterCountsQuery"] as const) {
      const sql = queries[name as keyof typeof queries] as string;
      expect(sql, name).toContain("coalesce(active, true)");
      expect(sql, name).toContain('coalesce(publication, "published")');
    }
  });

  it("excludes deactivated and unpublished chapters from their detail pages", () => {
    expect(queries.chapterQuery).toContain("coalesce(active, true)");
    expect(queries.chapterQuery).toContain('coalesce(publication, "published")');
    expect(queries.regionQuery).toContain("coalesce(active, true)");
  });

  it("hides unit-scoped events and posts from the national listings", () => {
    // National /events and /news show only items with no chapter, zone or
    // region references — unit-scoped items surface on their own pages.
    const national = "count(chapters) == 0 && count(zones) == 0 && count(regions) == 0";
    expect(queries.eventListQuery).toContain(national);
    expect(queries.postListQuery).toContain(national);
  });

  it("lists featured events first", () => {
    expect(queries.eventListQuery).toContain("order(featured desc, startDate asc)");
  });

  it("exposes event cover, organizer and featured in the public projection", () => {
    expect(queries.eventProjection).toContain("organizer");
    expect(queries.eventProjection).toContain("featured");
    expect(queries.eventProjection).toContain("coverImage");
  });

  it("exposes SEO fields on public posts", () => {
    // postFields is embedded in postListQuery, postDetailQuery and section queries.
    expect(queries.postListQuery).toContain("seoTitle");
    expect(queries.postListQuery).toContain("seoDescription");
    expect(queries.postDetailQuery).toContain("seoTitle");
  });

  it("includes zone events in the zone detail query", () => {
    expect(queries.zoneQuery).toContain('"events"');
    expect(queries.zoneQuery).toContain('_type == "event"');
  });

  it("gates the public outreach listing on the publication lifecycle", () => {
    // Outreaches surface publicly on /what-we-do — drafts and archived
    // campaigns must never reach that listing.
    expect(queries.outreachListQuery).toContain('!(_id in path("drafts.**"))');
    expect(queries.outreachListQuery).toContain('publication == "published"');
    expect(queries.outreachListQuery).toContain("publishAt <= now()");
  });
});
