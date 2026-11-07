import { describe, expect, it } from "vitest";

import { opensInNewTab, safeHref } from "./safe-href.ts";

describe("safeHref", () => {
  it("keeps ordinary web destinations", () => {
    expect(safeHref("https://example.com/a?b=1")).toBe("https://example.com/a?b=1");
    expect(safeHref("http://example.com")).toBe("http://example.com");
    expect(safeHref("mailto:info@cmdanigeria.org")).toBe("mailto:info@cmdanigeria.org");
    expect(safeHref("tel:+2348091533339")).toBe("tel:+2348091533339");
  });

  it("keeps site-relative links", () => {
    expect(safeHref("/publications")).toBe("/publications");
    expect(safeHref("#in-this-issue")).toBe("#in-this-issue");
    expect(safeHref("?page=2")).toBe("?page=2");
    expect(safeHref("news/2026")).toBe("news/2026");
  });

  it("strips surrounding whitespace", () => {
    expect(safeHref("  https://example.com  ")).toBe("https://example.com");
  });

  it("rejects script and data URLs", () => {
    expect(safeHref("javascript:alert(document.cookie)")).toBeUndefined();
    expect(safeHref("JavaScript:alert(1)")).toBeUndefined();
    expect(safeHref(" javascript:alert(1)")).toBeUndefined();
    expect(safeHref("java\tscript:alert(1)")).toBeUndefined();
    expect(safeHref("java\nscript:alert(1)")).toBeUndefined();
    expect(safeHref("data:text/html,<script>alert(1)</script>")).toBeUndefined();
    expect(safeHref("vbscript:msgbox(1)")).toBeUndefined();
    expect(safeHref("file:///etc/passwd")).toBeUndefined();
    expect(safeHref("blob:https://example.com/abc")).toBeUndefined();
  });

  it("rejects non-strings and empty values", () => {
    expect(safeHref(undefined)).toBeUndefined();
    expect(safeHref(null)).toBeUndefined();
    expect(safeHref(42)).toBeUndefined();
    expect(safeHref("")).toBeUndefined();
    expect(safeHref("   ")).toBeUndefined();
  });
});

describe("opensInNewTab", () => {
  it("opens absolute web URLs in a new tab only", () => {
    expect(opensInNewTab("https://example.com")).toBe(true);
    expect(opensInNewTab("http://example.com")).toBe(true);
    expect(opensInNewTab("/publications")).toBe(false);
    expect(opensInNewTab("mailto:info@cmdanigeria.org")).toBe(false);
    expect(opensInNewTab(undefined)).toBe(false);
  });
});
