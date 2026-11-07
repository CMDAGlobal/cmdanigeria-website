/**
 * Guard for CMS-authored link destinations.
 *
 * Editors paste URLs into newsletter buttons and inline links. If a
 * `javascript:` (or `data:`, `vbscript:`, `file:`) URL reaches an anchor it
 * executes in the visitor's session, so every link that comes from the content
 * lake is passed through here before it is rendered or stored.
 *
 * Allowed: `http:`, `https:`, `mailto:`, `tel:`, plus ordinary relative paths
 * (`/news`, `#section`, `?page=2`). Everything else is rejected.
 */
const ALLOWED_SCHEMES = new Set(["http", "https", "mailto", "tel"]);

const SCHEME = /^([a-zA-Z][a-zA-Z0-9+.-]*):/;

/**
 * Removes ASCII whitespace and control characters. Browsers ignore them inside
 * a scheme ("java\tscript:alert(1)"), so classification must look at the
 * compact form rather than the raw string.
 */
function compactHref(value: string): string {
  let out = "";
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    if (code > 0x20 && code !== 0x7f) out += char;
  }
  return out;
}

export function safeHref(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const value = raw.trim();
  if (!value) return undefined;
  // Long destinations are never legitimate and only bloat the content lake.
  if (value.length > 2048) return undefined;

  const compact = compactHref(value);
  if (!compact) return undefined;

  if (compact.startsWith("#") || compact.startsWith("?") || compact.startsWith("/")) {
    return value;
  }

  const match = SCHEME.exec(compact);
  if (!match) {
    // No scheme at all: a relative path such as "news/2026". Harmless.
    return value;
  }

  const scheme = (match[1] ?? "").toLowerCase();
  return ALLOWED_SCHEMES.has(scheme) ? value : undefined;
}

/** True when the link is an absolute web URL and should open in a new tab. */
export function opensInNewTab(href: string | undefined): boolean {
  if (!href) return false;
  return /^https?:/i.test(compactHref(href));
}
