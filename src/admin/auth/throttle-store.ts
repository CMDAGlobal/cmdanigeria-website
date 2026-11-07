import { query } from "../db/client";
import {
  LOGIN_LOCK_MS,
  LOGIN_WINDOW_MS,
  applyFailure,
  maxFailuresFor,
  type ThrottleBucket,
  type ThrottleKeys,
} from "./throttle";

/**
 * Persistence for login throttling. Attempts live in Postgres rather than
 * process memory because serverless instances come and go — an in-memory
 * counter would reset on every cold start and could never see a distributed
 * attack.
 *
 * Every call fails open: if the throttle table is unavailable the login still
 * proceeds (it is an additive control, and admin auth already depends on this
 * database being reachable).
 */
interface ThrottleRow {
  failures: number;
  window_started_at: string | Date;
  locked_until: string | Date | null;
}

function toMillis(value: string | Date): number {
  return value instanceof Date ? value.getTime() : Date.parse(value);
}

function toBucket(row: ThrottleRow | undefined): ThrottleBucket | null {
  if (!row) return null;
  const windowStartedAt = toMillis(row.window_started_at);
  if (!Number.isFinite(windowStartedAt)) return null;
  const lockedAt = row.locked_until ? toMillis(row.locked_until) : null;
  return {
    failures: Number(row.failures) || 0,
    windowStartedAt,
    lockedUntil: lockedAt !== null && Number.isFinite(lockedAt) ? lockedAt : null,
  };
}

export async function readBucket(key: string): Promise<ThrottleBucket | null> {
  try {
    const rows = await query<ThrottleRow>(
      `select failures, window_started_at, locked_until
         from admin_login_throttle
        where key = $1
        limit 1`,
      [key],
    );
    return toBucket(rows[0]);
  } catch (error) {
    console.error("[admin:auth] throttle read failed", error);
    return null;
  }
}

export async function recordFailure(key: string, now: number): Promise<ThrottleBucket | null> {
  const limit = maxFailuresFor(key);
  try {
    const rows = await query<ThrottleRow>(
      `insert into admin_login_throttle (key, failures, window_started_at, locked_until)
       values ($1, 1, now(), null)
       on conflict (key) do update set
         failures = case
           when admin_login_throttle.window_started_at <= now() - ($2::int * interval '1 millisecond')
             then 1
           else admin_login_throttle.failures + 1
         end,
         window_started_at = case
           when admin_login_throttle.window_started_at <= now() - ($2::int * interval '1 millisecond')
             then now()
           else admin_login_throttle.window_started_at
         end,
         locked_until = case
           when admin_login_throttle.window_started_at <= now() - ($2::int * interval '1 millisecond')
             then null
           when admin_login_throttle.failures + 1 >= $3::int
             then now() + ($4::int * interval '1 millisecond')
           else admin_login_throttle.locked_until
         end,
         updated_at = now()
       returning failures, window_started_at, locked_until`,
      [key, LOGIN_WINDOW_MS, limit, LOGIN_LOCK_MS],
    );
    const bucket = toBucket(rows[0]);
    // Pure policy mirror of the SQL above keeps the two in sync in tests, and
    // covers the (rare) case where RETURNING hands back nothing.
    return bucket ?? applyFailure(null, limit, now);
  } catch (error) {
    console.error("[admin:auth] throttle write failed", error);
    return null;
  }
}

/**
 * Counts one failed attempt against every bucket and reports how long the
 * caller is now locked out for. `0` means "not locked yet".
 */
export async function noteLoginFailure(
  keys: ThrottleKeys,
  now: number = Date.now(),
): Promise<number> {
  const targets = [keys.emailIp];
  if (keys.ip) targets.push(keys.ip);
  targets.push(keys.email);

  const buckets = await Promise.all(targets.map((key) => recordFailure(key, now)));
  let waitMs = 0;
  for (const bucket of buckets) {
    if (!bucket?.lockedUntil) continue;
    waitMs = Math.max(waitMs, bucket.lockedUntil - now);
  }
  return Math.max(0, waitMs);
}

/** Clears every bucket for this identity after a successful sign-in. */
export async function clearLoginFailures(keys: ThrottleKeys): Promise<void> {
  const targets = [keys.emailIp, keys.email];
  if (keys.ip) targets.push(keys.ip);
  try {
    await query(`delete from admin_login_throttle where key = any($1::text[])`, [targets]);
  } catch (error) {
    console.error("[admin:auth] throttle clear failed", error);
  }
}

/** Opportunistic cleanup of stale buckets; failures are ignored. */
export async function pruneLoginThrottle(): Promise<void> {
  try {
    await query(
      `delete from admin_login_throttle
        where updated_at < now() - interval '1 day'
          and (locked_until is null or locked_until < now())`,
    );
  } catch (error) {
    console.error("[admin:auth] throttle prune failed", error);
  }
}
