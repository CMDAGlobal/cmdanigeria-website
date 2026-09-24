import { deleteCookie, getCookie, getRequest, setCookie } from "@tanstack/react-start/server";
import { isProduction, adminSessionTtlMs } from "../config";
import { recordAudit } from "../audit/record";
import { query } from "../db/client";
import { buildActor, getRoleAssignments } from "./actor";
import type { AdminUserRecord } from "./actor";
import type { Actor, RoleScopePair } from "../rbac/engine";
import { effectivePermissions } from "../rbac/engine";
import type { PermissionKey } from "../rbac/permissions";
import type { ArmKey, RoleKey } from "../rbac/roles";
import {
  deleteExpiredSessions,
  createSessionRecord,
  findValidSession,
  revokeSessionByToken,
  touchSession,
} from "./session-store";
import { generateSessionToken } from "./tokens";
import { verifyPassword } from "./password";
import { PASSWORD_MIN_LENGTH, SESSION_COOKIE_NAME } from "./constants";

interface RequestMeta {
  ipAddress: string | null;
  userAgent: string | null;
}

function requestMeta(): RequestMeta {
  try {
    const request = getRequest();
    const userAgent = request.headers.get("user-agent");
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ipAddress = (forwarded?.split(",")[0] ?? realIp ?? null)?.trim() ?? null;
    return {
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
    };
  } catch {
    return { ipAddress: null, userAgent: null };
  }
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax" as const,
    path: "/",
    maxAge: Math.floor(adminSessionTtlMs() / 1000),
  };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export interface LoginResult {
  ok: boolean;
  error?: string;
  user?: { id: string; email: string; name: string };
}

export async function loginWithPassword(email: string, password: string): Promise<LoginResult> {
  const meta = requestMeta();
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || normalizedEmail.length > 254) {
    return failLogin("invalid_credentials", meta);
  }
  if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
    return failLogin("invalid_credentials", meta);
  }

  try {
    const rows = await query<{
      id: string;
      email: string;
      name: string;
      password_hash: string;
      is_active: boolean;
    }>(
      `select id, email, name, password_hash, is_active from admin_users where email = $1 limit 1`,
      [normalizedEmail],
    );
    const user = rows[0];

    const validPassword = user ? await verifyPassword(password, user.password_hash) : false;
    if (!user || !validPassword || !user.is_active) {
      return failLogin("invalid_credentials", meta);
    }

    await deleteExpiredSessions();

    const token = generateSessionToken();
    await createSessionRecord(user.id, token, meta);
    setCookie(SESSION_COOKIE_NAME, token, cookieOptions());

    await recordAudit({
      actorUserId: user.id,
      action: "auth.login",
      outcome: "success",
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return {
      ok: true,
      user: { id: user.id, email: user.email, name: user.name },
    };
  } catch (error) {
    console.error("[admin:auth] login failed unexpectedly", error);
    await recordAudit({
      action: "auth.login",
      outcome: "error",
      reason: "unexpected_error",
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

async function failLogin(reason: string, meta: RequestMeta): Promise<LoginResult> {
  await recordAudit({
    action: "auth.login",
    outcome: "denied",
    reason,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });
  return { ok: false, error: "Invalid email or password." };
}

export interface EffectiveRole {
  key: RoleKey;
  name: string;
  scope: { arm?: ArmKey; regionSlug?: string; chapterSlug?: string };
}

export interface CurrentActorResult {
  user: { id: string; email: string; name: string };
  actor: Actor;
  permissions: PermissionKey[];
  roles: EffectiveRole[];
}

function toEffectiveRole(pair: RoleScopePair): EffectiveRole {
  const scope: EffectiveRole["scope"] = {};
  if (pair.scope.arm) scope.arm = pair.scope.arm;
  if (pair.scope.regionSlug) scope.regionSlug = pair.scope.regionSlug;
  if (pair.scope.chapterSlug) scope.chapterSlug = pair.scope.chapterSlug;
  return { key: pair.roleKey, name: pair.roleKey, scope };
}

export async function getCurrentActor(): Promise<CurrentActorResult | null> {
  const token = getCookie(SESSION_COOKIE_NAME);
  if (!token) return null;

  const found = await findValidSession(token);
  if (!found) {
    deleteCookie(SESSION_COOKIE_NAME, { path: "/" });
    return null;
  }
  if (!found.user.is_active) {
    await revokeSessionByToken(token);
    deleteCookie(SESSION_COOKIE_NAME, { path: "/" });
    return null;
  }

  void touchSession(found.session.id);
  await deleteExpiredSessions();

  const roles = await getRoleAssignments(found.user.id);
  const actor = buildActor(found.user.id, roles);
  const permissions = effectivePermissions(roles);

  return {
    user: {
      id: found.user.id,
      email: found.user.email,
      name: found.user.name,
    },
    actor,
    permissions,
    roles: roles.map(toEffectiveRole),
  };
}

export async function logout(meta?: RequestMeta): Promise<{ ok: true }> {
  const request = meta ?? requestMeta();
  const token = getCookie(SESSION_COOKIE_NAME);
  if (token) {
    await revokeSessionByToken(token);
  }
  deleteCookie(SESSION_COOKIE_NAME, { path: "/" });
  await recordAudit({
    action: "auth.logout",
    outcome: "success",
    ipAddress: request.ipAddress,
    userAgent: request.userAgent,
  });
  return { ok: true };
}

export type { AdminUserRecord };
