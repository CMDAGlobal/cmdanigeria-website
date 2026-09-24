import { query } from "../db/client";
import { adminSessionTtlMs } from "../config";
import { hashToken } from "./tokens";

export interface SessionUserRow {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
}

export interface SessionLookupResult {
  session: {
    id: string;
    user_id: string;
    token_hash: string;
    created_at: string;
    expires_at: string;
    last_seen_at: string | null;
    ip_address: string | null;
    user_agent: string | null;
    revoked_at: string | null;
  };
  user: SessionUserRow;
}

export async function createSessionRecord(
  userId: string,
  rawToken: string,
  meta: { ipAddress?: string | null; userAgent?: string | null },
): Promise<void> {
  const tokenHash = await hashToken(rawToken);
  await query(
    `insert into admin_sessions
       (user_id, token_hash, expires_at, ip_address, user_agent)
     values ($1, $2, $3, $4, $5)`,
    [
      userId,
      tokenHash,
      new Date(Date.now() + adminSessionTtlMs()).toISOString(),
      meta.ipAddress ?? null,
      meta.userAgent ?? null,
    ],
  );
}

/**
 * Resolves a raw cookie token to its session row (plus the owning user) when
 * the session is valid and has not expired or been revoked.
 */
export async function findValidSession(rawToken: string): Promise<SessionLookupResult | null> {
  const tokenHash = await hashToken(rawToken);
  const rows = await query<{
    session_id: string;
    user_id: string;
    created_at: string;
    expires_at: string;
    last_seen_at: string | null;
    ip_address: string | null;
    user_agent: string | null;
    revoked_at: string | null;
    email: string;
    name: string;
    is_active: boolean;
  }>(
    `select s.id as session_id, s.user_id,
            s.created_at, s.expires_at, s.last_seen_at,
            s.ip_address, s.user_agent, s.revoked_at,
            u.email, u.name, u.is_active
     from admin_sessions s
     join admin_users u on u.id = s.user_id
     where s.token_hash = $1
       and s.revoked_at is null
       and s.expires_at > now()
     limit 1`,
    [tokenHash],
  );
  const row = rows[0];
  if (!row) return null;
  return {
    session: {
      id: row.session_id,
      user_id: row.user_id,
      token_hash: tokenHash,
      created_at: row.created_at,
      expires_at: row.expires_at,
      last_seen_at: row.last_seen_at,
      ip_address: row.ip_address,
      user_agent: row.user_agent,
      revoked_at: row.revoked_at,
    },
    user: {
      id: row.user_id,
      email: row.email,
      name: row.name,
      is_active: row.is_active,
    },
  };
}

export async function touchSession(sessionId: string): Promise<void> {
  await query(`update admin_sessions set last_seen_at = now() where id = $1`, [sessionId]);
}

export async function revokeSessionByToken(rawToken: string): Promise<void> {
  const tokenHash = await hashToken(rawToken);
  await query(
    `update admin_sessions set revoked_at = now() where token_hash = $1 and revoked_at is null`,
    [tokenHash],
  );
}

export async function deleteExpiredSessions(): Promise<void> {
  await query(`delete from admin_sessions where expires_at <= now()`);
}
