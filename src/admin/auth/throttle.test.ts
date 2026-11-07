import { describe, expect, it } from "vitest";

import {
  LOGIN_LOCK_MS,
  LOGIN_WINDOW_MS,
  MAX_FAILURES_PER_EMAIL,
  MAX_FAILURES_PER_EMAIL_IP,
  MAX_FAILURES_PER_IP,
  applyFailure,
  lockoutMessage,
  maxFailuresFor,
  retryAfterMs,
  throttleKeys,
  type ThrottleBucket,
} from "./throttle.ts";

const NOW = 1_700_000_000_000;

describe("throttleKeys", () => {
  it("builds a per pair, per ip and per email bucket", () => {
    const keys = throttleKeys("admin@example.com", "203.0.113.9");
    expect(keys.emailIp).toBe("email-ip:admin@example.com|203.0.113.9");
    expect(keys.ip).toBe("ip:203.0.113.9");
    expect(keys.email).toBe("email:admin@example.com");
  });

  it("omits the ip bucket when the request carries no address", () => {
    expect(throttleKeys("admin@example.com", null).ip).toBeNull();
  });
});

describe("maxFailuresFor", () => {
  it("applies the tightest limit to the email+ip pair", () => {
    expect(maxFailuresFor("email-ip:a|1.1.1.1")).toBe(MAX_FAILURES_PER_EMAIL_IP);
    expect(maxFailuresFor("ip:1.1.1.1")).toBe(MAX_FAILURES_PER_IP);
    expect(maxFailuresFor("email:a")).toBe(MAX_FAILURES_PER_EMAIL);
    expect(MAX_FAILURES_PER_EMAIL_IP).toBeLessThan(MAX_FAILURES_PER_IP);
  });
});

describe("applyFailure", () => {
  it("counts up without locking before the limit", () => {
    const bucket = applyFailure(null, 5, NOW);
    expect(bucket.failures).toBe(1);
    expect(bucket.lockedUntil).toBeNull();
    const next = applyFailure(bucket, 5, NOW + 1000);
    expect(next.failures).toBe(2);
    expect(next.lockedUntil).toBeNull();
  });

  it("locks when the limit is reached", () => {
    let bucket: ThrottleBucket | null = null;
    for (let i = 0; i < 5; i += 1) bucket = applyFailure(bucket, 5, NOW);
    expect(bucket?.failures).toBe(5);
    expect(bucket?.lockedUntil).toBe(NOW + LOGIN_LOCK_MS);
  });

  it("resets once the window elapses", () => {
    const stale: ThrottleBucket = {
      failures: 4,
      windowStartedAt: NOW - LOGIN_WINDOW_MS - 1,
      lockedUntil: null,
    };
    const bucket = applyFailure(stale, 5, NOW);
    expect(bucket.failures).toBe(1);
    expect(bucket.windowStartedAt).toBe(NOW);
  });
});

describe("retryAfterMs", () => {
  it("reports the remaining lock time and zero when free", () => {
    expect(retryAfterMs(null, NOW)).toBe(0);
    expect(retryAfterMs({ failures: 5, windowStartedAt: NOW, lockedUntil: null }, NOW)).toBe(0);
    expect(
      retryAfterMs({ failures: 5, windowStartedAt: NOW, lockedUntil: NOW + 60_000 }, NOW),
    ).toBe(60_000);
    expect(retryAfterMs({ failures: 5, windowStartedAt: NOW, lockedUntil: NOW - 1 }, NOW)).toBe(0);
  });
});

describe("lockoutMessage", () => {
  it("rounds up to whole minutes", () => {
    expect(lockoutMessage(1)).toContain("1 minute.");
    expect(lockoutMessage(90_000)).toContain("2 minutes.");
  });
});
