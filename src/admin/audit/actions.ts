import type { Scope } from "../rbac/roles";

export const AUDIT_ACTIONS = [
  "auth.login",
  "auth.logout",
  "auth.logout_all",
  "auth.password_change",
  "authorization.denied",
  "user.create",
  "user.update",
  "user.deactivate",
  "user.role_grant",
  "user.role_revoke",
  "chapter.create",
  "chapter.update",
  "chapter.delete",
  "leader.create",
  "leader.update",
  "leader.delete",
  "event.create",
  "event.update",
  "event.delete",
  "news.create",
  "news.update",
  "news.delete",
  "announcement.create",
  "announcement.update",
  "announcement.delete",
  "outreach.create",
  "outreach.update",
  "outreach.delete",
  "media.upload",
  "media.update",
  "media.delete",
  "page.update",
  "settings.update",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export const AUDIT_OUTCOMES = ["success", "denied", "error"] as const;
export type AuditOutcome = (typeof AUDIT_OUTCOMES)[number];

export interface AuditEntryInput {
  actorUserId?: string | null;
  action: AuditAction | string;
  targetType?: string | null;
  targetId?: string | null;
  scope?: Scope | null;
  outcome: AuditOutcome;
  reason?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  occurredAt?: string;
}

export function buildAuditEntry(input: AuditEntryInput): AuditEntryInput {
  return {
    actorUserId: input.actorUserId ?? null,
    action: input.action,
    targetType: input.targetType ?? null,
    targetId: input.targetId ?? null,
    scope: input.scope ?? null,
    outcome: input.outcome,
    reason: input.reason ?? null,
    ipAddress: input.ipAddress ?? null,
    userAgent: input.userAgent ?? null,
  };
}

export function isAuditAction(value: string): value is AuditAction {
  return (AUDIT_ACTIONS as readonly string[]).includes(value);
}
