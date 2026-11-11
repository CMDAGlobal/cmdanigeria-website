export const SESSION_COOKIE_NAME = "cmda_admin";

export const DEFAULT_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** Sessions unused for this long are treated as expired (stolen-laptop safety). */
export const DEFAULT_SESSION_IDLE_MS = 12 * 60 * 60 * 1000;

/**
 * Floor accepted at *sign-in*, so accounts created before the password policy
 * existed can still authenticate. New passwords are governed by
 * `password-policy.ts`, which requires 12+ characters.
 */
export const PASSWORD_MIN_LENGTH = 8;

export const EMAIL_MAX_LENGTH = 254;
