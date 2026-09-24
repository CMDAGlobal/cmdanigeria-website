import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./password.ts";
import { generateSessionToken, hashToken } from "./tokens.ts";
import { constantTimeEqual } from "./encoding.ts";

describe("password hashing", () => {
  it("hashes and verifies a correct password", async () => {
    const stored = await hashPassword("correct horse battery staple");
    expect(stored.startsWith("pbkdf2$")).toBe(true);
    await expect(verifyPassword("correct horse battery staple", stored)).resolves.toBe(true);
  });

  it("rejects a wrong password", async () => {
    const stored = await hashPassword("secret-pass-123");
    await expect(verifyPassword("wrong-pass", stored)).resolves.toBe(false);
  });

  it("rejects malformed stored values", async () => {
    await expect(verifyPassword("anything", "not-a-valid-format")).resolves.toBe(false);
    await expect(verifyPassword("anything", "pbkdf2$abc$1$1")).resolves.toBe(false);
    await expect(verifyPassword("anything", "$pbkdf2$310000$$")).resolves.toBe(false);
  });

  it("produces a unique salt per hash", async () => {
    const a = await hashPassword("same-password");
    const b = await hashPassword("same-password");
    expect(a).not.toBe(b);
  });
});

describe("session tokens", () => {
  it("generates unique tokens", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const token = generateSessionToken();
      expect(seen.has(token)).toBe(false);
      seen.add(token);
    }
  });

  it("hashes tokens deterministically and irreversibly", async () => {
    const token = "token-1";
    const first = await hashToken(token);
    const second = await hashToken(token);
    expect(first).toBe(second);
    expect(first).not.toContain(token);
  });
});

describe("constant-time compare", () => {
  it("matches equal buffers and rejects unequal ones", () => {
    expect(constantTimeEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]))).toBe(true);
    expect(constantTimeEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 4]))).toBe(false);
    expect(constantTimeEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2, 3]))).toBe(false);
  });
});
