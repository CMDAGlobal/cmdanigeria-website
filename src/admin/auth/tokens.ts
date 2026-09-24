import { encodeBase64Url, encodeUtf8 } from "./encoding";

const TOKEN_BYTES = 32;

/** Opaque random session token handed to the client via a cookie. */
export function generateSessionToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(TOKEN_BYTES));
  return encodeBase64Url(bytes);
}

/** Deterministic SHA-256 digest used as the server-side lookup key. */
export async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encodeUtf8(token));
  return encodeBase64Url(new Uint8Array(digest));
}
