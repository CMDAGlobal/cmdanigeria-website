import { query } from "../db/client";
import { buildAuditEntry, type AuditEntryInput } from "./actions";

/**
 * Persist one audit-log row. Never throws — audit failures must not take down
 * the operation being recorded.
 */
export async function recordAudit(input: AuditEntryInput): Promise<void> {
  try {
    const entry = buildAuditEntry(input);
    await query(
      `insert into admin_audit_logs (
         actor_user_id, action, target_type, target_id,
         scope_arm, scope_region, scope_chapter,
         outcome, reason, ip_address, user_agent
       ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        entry.actorUserId ?? null,
        entry.action,
        entry.targetType ?? null,
        entry.targetId ?? null,
        entry.scope?.arm ?? null,
        entry.scope?.regionSlug ?? null,
        entry.scope?.chapterSlug ?? null,
        entry.outcome,
        entry.reason ?? null,
        entry.ipAddress ?? null,
        entry.userAgent ?? null,
      ],
    );
  } catch (error) {
    console.error("[admin:audit] failed to write audit entry", error);
  }
}
