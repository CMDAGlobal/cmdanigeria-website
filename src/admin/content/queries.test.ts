import { describe, expect, it } from "vitest";
import { parse } from "groq-js";

import {
  CONTENT_QUERIES,
  MEDIA_QUERY,
  PAGE_SECTIONS_QUERY,
  PAGE_SECTIONS_STORED_QUERY,
} from "./queries";

const MODULES = Object.keys(CONTENT_QUERIES) as Array<keyof typeof CONTENT_QUERIES>;

/**
 * The dashboard's own reads. `docDetailQuery` builds from the same allowlists,
 * so a field that cannot be projected would already fail here.
 */
describe("dashboard GROQ", () => {
  it.each(MODULES)("parses the list query: %s", (module) => {
    expect(() => parse(CONTENT_QUERIES[module])).not.toThrow();
  });

  it("parses the media library query", () => {
    expect(() => parse(MEDIA_QUERY)).not.toThrow();
  });

  it("reports the active flag so a deactivated unit is visible in the list", () => {
    expect(CONTENT_QUERIES.chapters).toContain("active");
    expect(CONTENT_QUERIES.regions).toContain("active");
  });

  it("parses the page sections queries", () => {
    expect(() => parse(PAGE_SECTIONS_QUERY)).not.toThrow();
    expect(() => parse(PAGE_SECTIONS_STORED_QUERY)).not.toThrow();
  });

  it("defaults a section's visible flag when the field is absent", () => {
    expect(PAGE_SECTIONS_QUERY).toContain("coalesce(visible, true)");
  });
});
