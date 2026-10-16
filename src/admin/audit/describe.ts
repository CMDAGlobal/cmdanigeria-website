const ARM_LABELS: Record<string, string> = {
  global: "Global Network",
  students: "Students' Arm",
  doctors: "Doctors' Arm",
};

const OBJECT_LABELS: Record<string, string> = {
  chapter: "chapter",
  region: "region",
  leader: "leadership",
  event: "event",
  news: "news post",
  announcement: "announcement",
  outreach: "outreach",
  publication: "newsletter",
  page: "page",
  media: "media file",
  user: "administrator account",
  admin_user: "administrator account",
  auth: "session",
  settings: "settings",
  authorization: "request",
};

const VERBS: Record<string, string> = {
  create: "created",
  update: "updated",
  delete: "deleted",
  publish: "published",
  schedule: "scheduled",
  unpublish: "unpublished",
  archive: "archived",
  send: "marked as sent",
  upload: "uploaded",
  login: "signed in to",
  logout: "signed out of",
  logout_all: "signed out of all sessions on",
  password_change: "changed the password on",
  role_grant: "granted a role on",
  role_revoke: "revoked a role from",
  deactivate: "deactivated",
  denied: "was denied",
};

function titleCase(slug: string): string {
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Loose wire shape for a scope as it arrives over the server boundary. */
export interface AuditScopeInput {
  arm?: string;
  regionSlug?: string;
  chapterSlug?: string;
}

/**
 * Human label for the scope an audit row was recorded under: "Lagos Chapter",
 * "West Africa region", "Doctors' Arm", or null for a system-wide action.
 */
export function auditScopeLabel(scope: AuditScopeInput | null | undefined): string | null {
  if (!scope) return null;
  if (scope.chapterSlug) return `${titleCase(scope.chapterSlug)} Chapter`;
  if (scope.regionSlug) return `${titleCase(scope.regionSlug)} region`;
  if (scope.arm) return ARM_LABELS[scope.arm] ?? titleCase(scope.arm);
  return null;
}

/**
 * Turn a machine audit action ("event.create") into a plain-English phrase
 * ("created an event"). Pair with auditScopeLabel for the full sentence
 * ("Lagos Chapter created an event").
 */
export function auditActionPhrase(action: string): string {
  const [domain = "", verb] = action.split(".");
  const object = OBJECT_LABELS[domain] ?? domain;
  if (!verb) return object;
  const conjugated = VERBS[verb] ?? `${verb}ed`;
  if (verb === "logout_all" || verb === "password_change") return conjugated;
  if (verb === "login") return `${conjugated} the admin dashboard`;
  if (verb === "denied") return conjugated;
  const needsArticle = /^[aeiou]/i.test(object);
  return `${conjugated} ${needsArticle ? "an" : "a"} ${object}`;
}

/**
 * Full sentence for an audit row: scope prefix + action phrase. Examples:
 *   "Lagos Chapter created an event"
 *   "Doctors' Arm archived a newsletter"
 *   "Signed in to the admin dashboard" (no scope)
 */
export function describeAuditEntry(action: string, scope?: AuditScopeInput | null): string {
  const phrase = auditActionPhrase(action);
  const label = auditScopeLabel(scope);
  if (!label) {
    return phrase.charAt(0).toUpperCase() + phrase.slice(1);
  }
  return `${label} ${phrase}`;
}
