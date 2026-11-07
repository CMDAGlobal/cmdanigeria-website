/**
 * Response hardening applied to every SSR document.
 *
 * The CSP intentionally allows inline scripts/styles because TanStack Start
 * hydrates with inline bootstrap tags and the embedded Studio ships its own
 * bundle; a nonce-based policy is the next step. What it buys today is
 * clickjacking protection (`frame-ancestors` + `X-Frame-Options`), plugin and
 * `<base>` hijack protection, and a locked-down set of origins for frames and
 * connections.
 *
 * Frame sources are the ones the site actually embeds: Sanity Studio media,
 * YouTube/Vimeo videos and the OpenStreetMap panel on /contact.
 */
const CSP_DIRECTIVES = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io",
  "font-src 'self' data:",
  "media-src 'self' blob: https://cdn.sanity.io",
  "connect-src 'self' https://api.sanity.io https://*.api.sanity.io https://*.sanity.io wss: ws:",
  "frame-src 'self' https://*.sanity.io https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://www.openstreetmap.org",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
];

export const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  "Content-Security-Policy": CSP_DIRECTIVES.join("; "),
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
};

/**
 * Adds the headers in place when possible. Redirects and other synthesised
 * responses expose immutable header maps, so those are rebuilt instead.
 */
export function applySecurityHeaders(response: Response): Response {
  try {
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      if (!response.headers.has(name)) response.headers.set(name, value);
    }
    return response;
  } catch {
    const headers = new Headers(response.headers);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      if (!headers.has(name)) headers.set(name, value);
    }
    const body =
      response.status === 101 ||
      response.status === 204 ||
      response.status === 205 ||
      response.status === 304
        ? null
        : response.body;
    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
}
