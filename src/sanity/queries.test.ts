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
      expect.arrayContaining(["chapterQuery", "regionQuery", "zoneQuery", "pageCountersQuery"]),
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
});
