/**
 * Password policy for *setting* a password (account creation, password change).
 *
 * Sign-in still accepts the historic 8-character floor so existing accounts are
 * never locked out; this policy only governs new credentials.
 *
 * Length plus a common-password blocklist is current best practice (NIST
 * SP 800-63B) — composition rules like "one symbol, one digit" push people
 * towards predictable patterns without adding real strength.
 */
export const PASSWORD_POLICY_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 4096;

export type PasswordProblem =
  "too_short" | "too_long" | "too_common" | "matches_identity" | "repeated_character";

export interface PasswordContext {
  email?: string | null | undefined;
  name?: string | null | undefined;
}

/**
 * A short blocklist of the passwords that dominate real-world credential
 * dumps, plus obvious organisation-specific choices.
 */
const COMMON_PASSWORDS: ReadonlySet<string> = new Set([
  "123456789012",
  "1234567890",
  "123456789",
  "12345678",
  "12345678901",
  "qwertyuiop",
  "qwerty123",
  "password",
  "password1",
  "password1234",
  "password12345",
  "passw0rd1234",
  "p@ssw0rd1234",
  "p@ssword",
  "letmein123",
  "letmein",
  "welcome123",
  "welcome",
  "admin123",
  "administrator",
  "changeme",
  "changeme123",
  "iloveyou",
  "sunshine",
  "princess",
  "football",
  "baseball",
  "superman",
  "trustno1",
  "monkey123",
  "dragon123",
  "shadow123",
  "master123",
  "michael123",
  "jennifer123",
  "abc123456",
  "aaaaaa111111",
  "cmda12345678",
  "cmdanigeria",
  "cmdanigeria123",
  "nigeria12345",
  "nigeria2026",
  "hospital1234",
  "doctor123456",
  "medical12345",
  "christian123",
  "jesuschrist",
  "jesus123456",
  "faith123456",
  "grace123456",
  "blessed12345",
]);

export function checkPasswordPolicy(
  password: unknown,
  context: PasswordContext = {},
): PasswordProblem | null {
  if (typeof password !== "string" || password.length < PASSWORD_POLICY_MIN_LENGTH) {
    return "too_short";
  }
  if (password.length > PASSWORD_MAX_LENGTH) return "too_long";

  const lower = password.trim().toLowerCase();
  if (COMMON_PASSWORDS.has(lower) || COMMON_PASSWORDS.has(lower.replace(/\s+/g, ""))) {
    return "too_common";
  }

  const first = password[0];
  if (first !== undefined && [...password].every((char) => char === first)) {
    return "repeated_character";
  }

  const email = (context.email ?? "").trim().toLowerCase();
  const localPart = email.includes("@") ? email.slice(0, email.indexOf("@")) : "";
  if (localPart.length >= 4 && (lower === localPart || lower === email)) {
    return "matches_identity";
  }
  const name = (context.name ?? "").trim().toLowerCase();
  if (name.length >= 6 && lower === name) return "matches_identity";

  return null;
}

export function passwordPolicyMessage(problem: PasswordProblem): string {
  switch (problem) {
    case "too_short":
      return `Password must be at least ${PASSWORD_POLICY_MIN_LENGTH} characters.`;
    case "too_long":
      return `Password must be at most ${PASSWORD_MAX_LENGTH} characters.`;
    case "too_common":
      return "That password is too common. Choose something unique.";
    case "matches_identity":
      return "That password is too easy to guess from your name or email.";
    case "repeated_character":
      return "That password repeats a single character. Choose something stronger.";
  }
}
