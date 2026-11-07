import { describe, expect, it } from "vitest";

import { SECURITY_HEADERS, applySecurityHeaders } from "./security-headers.ts";

describe("applySecurityHeaders", () => {
  it("adds hardening headers to a normal response", () => {
    const res = applySecurityHeaders(
      new Response("<html></html>", { headers: { "content-type": "text/html; charset=utf-8" } }),
    );
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      expect(res.headers.get(name)).toBe(value);
    }
    expect(res.headers.get("content-type")).toBe("text/html; charset=utf-8");
  });

  it("does not overwrite a header a route set deliberately", () => {
    const res = applySecurityHeaders(
      new Response("", { headers: { "X-Frame-Options": "SAMEORIGIN" } }),
    );
    expect(res.headers.get("X-Frame-Options")).toBe("SAMEORIGIN");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  it("blocks framing, plugins and base-tag hijacking", () => {
    const csp = SECURITY_HEADERS["Content-Security-Policy"] ?? "";
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(SECURITY_HEADERS["X-Frame-Options"]).toBe("DENY");
    expect(SECURITY_HEADERS["X-Content-Type-Options"]).toBe("nosniff");
    expect(SECURITY_HEADERS["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
  });

  it("still hardens responses with immutable headers (redirects)", () => {
    const res = applySecurityHeaders(Response.redirect("https://example.com/next", 302));
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("https://example.com/next");
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    expect(res.headers.get("Content-Security-Policy")).toContain("frame-ancestors 'none'");
  });
});
