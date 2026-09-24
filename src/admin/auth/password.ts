import { constantTimeEqual, decodeBase64, encodeBase64, encodeUtf8 } from "./encoding.ts";

/**
 * Our own PBKDF2-SHA256 password hashing built on WebCrypto so it works in the
 * browser, the edge runtime and Node — no native dependencies.
 * Stored format: `pbkdf2$<iterations>$<salt_base64>$<hash_base64>`
 */
const PBKDF2_ITERATIONS = 310_000;
const SALT_BYTES = 16;
const KEY_LENGTH_BITS = 256;
const HASH_ALGORITHM = "SHA-256";

async function derive(
  password: string,
  salt: Uint8Array,
  iterations: number = PBKDF2_ITERATIONS,
): Promise<Uint8Array> {
  const keyMaterial = await crypto.subtle.importKey("raw", encodeUtf8(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: HASH_ALGORITHM,
      salt: salt.buffer as ArrayBuffer,
      iterations,
    },
    keyMaterial,
    KEY_LENGTH_BITS,
  );
  return new Uint8Array(bits);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const derived = await derive(password, salt);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${encodeBase64(salt)}$${encodeBase64(derived)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = Number(parts[1]);
  if (!Number.isFinite(iterations) || iterations <= 0) return false;
  let salt: Uint8Array;
  let expected: Uint8Array;
  try {
    salt = decodeBase64(parts[2] ?? "");
    expected = decodeBase64(parts[3] ?? "");
  } catch {
    return false;
  }
  const actual = await derive(password, salt, iterations);
  return constantTimeEqual(actual, expected);
}
