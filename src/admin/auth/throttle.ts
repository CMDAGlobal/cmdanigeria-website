/**
 * Login throttling policy.
 *
 * Passwords are verified with PBKDF2 at 310k iterations, so an unthrottled
 * login endpoint is both a brute-force target and a cheap CPU-denial-of-service
 * lever. Attempts are counted in three buckets:
 *
 *   • `email+ip`  – the sharpest signal; 5 failures in 15 minutes locks 15 min.
 *   • `ip`        – stops one host spraying many accounts.
 *   • `email`     – stops a botnet spreading guesses across many hosts.
 *
 * The per-email bucket is deliberately looser than the per-pair bucket so an
 * attacker cannot cheaply lock a known admin out by spamming their address.
 */

export const LOGIN_WINDOW_MS = 15 * 60 * 1000;
export const LOGIN_LOCK_MS = 15 * 60 * 1000;

export const MAX_FAILURES_PER_EMAIL_IP = 5;
export const MAX_FAILURES_PER_IP = 20;
export const MAX_FAILURES_PER_EMAIL = 20;

/** Longest password we are willing to hash; PBKDF2 cost scales with input size. */
export const MAX_PASSWORD_LENGTH = 4096;

export interface ThrottleBucket {
  failures: number;
  /** Epoch millis when the current counting window opened. */
  windowStartedAt: number;
  /** Epoch millis until which the bucket is locked, or null. */
  lockedUntil: number | null;
}

export interface ThrottleKeys {
  emailIp: string;
  ip: string | null;
  email: string;
}

export function throttleKeys(email: string, ip: string | null): ThrottleKeys {
  return {
    emailIp: `email-ip:${email}|${ip ?? "unknown"}`,
    ip: ip ? `ip:${ip}` : null,
    email: `email:${email}`,
  };
}

export function maxFailuresFor(key: string): number {
  if (key.startsWith("email-ip:")) return MAX_FAILURES_PER_EMAIL_IP;
  if (key.startsWith("ip:")) return MAX_FAILURES_PER_IP;
  return MAX_FAILURES_PER_EMAIL;
}

/** Remaining lock time in milliseconds; `0` when the request may proceed. */
export function retryAfterMs(bucket: ThrottleBucket | null, now: number): number {
  if (!bucket?.lockedUntil) return 0;
  return Math.max(0, bucket.lockedUntil - now);
}

/**
 * Applies one failure to a bucket: starts a fresh window when the previous one
 * has elapsed, otherwise increments and locks once the limit is reached.
 */
export function applyFailure(
  bucket: ThrottleBucket | null,
  limit: number,
  now: number,
  windowMs: number = LOGIN_WINDOW_MS,
  lockMs: number = LOGIN_LOCK_MS,
): ThrottleBucket {
  const expired = !bucket || now - bucket.windowStartedAt >= windowMs;
  const failures = (expired ? 0 : bucket.failures) + 1;
  return {
    failures,
    windowStartedAt: expired ? now : bucket.windowStartedAt,
    lockedUntil: failures >= limit ? now + lockMs : null,
  };
}

/** Human-readable, non-enumerating message for a locked-out attempt. */
export function lockoutMessage(waitMs: number): string {
  const minutes = Math.max(1, Math.ceil(waitMs / 60_000));
  return `Too many sign-in attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`;
}
