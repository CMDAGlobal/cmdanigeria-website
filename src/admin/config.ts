import { readEnv } from "../sanity/config";
import { DEFAULT_SESSION_IDLE_MS, DEFAULT_SESSION_TTL_MS } from "./auth/constants";

export const adminDatabaseUrl = (): string | undefined => readEnv("ADMIN_DATABASE_URL");

/** Overridable session lifetime (default 7 days). */
export const adminSessionTtlMs = (): number => {
  const raw = readEnv("ADMIN_SESSION_TTL_MS");
  const parsed = raw ? Number(raw) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_SESSION_TTL_MS;
};

/** Overridable idle timeout (default 12 hours of inactivity). */
export const adminSessionIdleMs = (): number => {
  const raw = readEnv("ADMIN_SESSION_IDLE_MS");
  const parsed = raw ? Number(raw) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_SESSION_IDLE_MS;
};

/** Cookies are marked Secure only outside local development. */
export const isProduction = (): boolean => readEnv("NODE_ENV") === "production";
