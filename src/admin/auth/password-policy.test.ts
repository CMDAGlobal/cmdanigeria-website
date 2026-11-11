import { describe, expect, it } from "vitest";

import {
  PASSWORD_POLICY_MIN_LENGTH,
  checkPasswordPolicy,
  passwordPolicyMessage,
} from "./password-policy.ts";

describe("checkPasswordPolicy", () => {
  it("accepts a long, unique passphrase", () => {
    expect(checkPasswordPolicy("Wholeness-House-2026")).toBeNull();
    expect(checkPasswordPolicy("correct horse battery staple")).toBeNull();
  });

  it("enforces the minimum length", () => {
    expect(checkPasswordPolicy("short")).toBe("too_short");
    expect(checkPasswordPolicy("a".repeat(PASSWORD_POLICY_MIN_LENGTH - 1))).toBe("too_short");
    expect(checkPasswordPolicy(undefined)).toBe("too_short");
    expect(checkPasswordPolicy(123456789012)).toBe("too_short");
  });

  it("rejects the passwords people actually use", () => {
    expect(checkPasswordPolicy("password1234")).toBe("too_common");
    expect(checkPasswordPolicy("Password1234")).toBe("too_common");
    expect(checkPasswordPolicy("cmdanigeria2026")).toBeNull(); // not on the list, long enough
    expect(checkPasswordPolicy("cmdanigeria123")).toBe("too_common");
  });

  it("rejects identity-derived and degenerate passwords", () => {
    expect(checkPasswordPolicy("admin@cmdanigeria.org", { email: "admin@cmdanigeria.org" })).toBe(
      "matches_identity",
    );
    expect(checkPasswordPolicy("abcdefabcdef", { name: "abcdefabcdef" })).toBe("matches_identity");
    expect(checkPasswordPolicy("aaaaaaaaaaaaaa")).toBe("repeated_character");
  });

  it("does not reject an otherwise good password just because it contains the name", () => {
    expect(
      checkPasswordPolicy("Ifeanyi-hospital-2026", {
        name: "Ifeanyi",
        email: "ifeanyi@example.com",
      }),
    ).toBeNull();
  });
});

describe("passwordPolicyMessage", () => {
  it("states the current minimum", () => {
    expect(passwordPolicyMessage("too_short")).toContain(String(PASSWORD_POLICY_MIN_LENGTH));
    expect(passwordPolicyMessage("too_common")).toMatch(/common/i);
  });
});
