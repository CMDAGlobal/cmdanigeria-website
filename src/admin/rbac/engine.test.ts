import { describe, it, expect } from "vitest";
import {
  AuthorizationError,
  authorize,
  can,
  effectivePermissions,
  scopeContains,
  type Actor,
} from "./engine.ts";
import { PERMISSION_KEYS } from "./permissions.ts";
import type { PermissionKey } from "./permissions.ts";

const DOCTORS_ARM = { arm: "doctors" } as const;
const STUDENTS_ARM = { arm: "students" } as const;

const doctorsChapterScope = { arm: "doctors", chapterSlug: "lagos" } as const;
const lagosChapterScope = { arm: "students", chapterSlug: "lagos" } as const;
const ibadanChapterScope = { arm: "students", chapterSlug: "ibadan" } as const;

function makeActor(roles: Actor["roles"]): Actor {
  return { userId: "actor-1", roles };
}

const superAdmin: Actor = makeActor([{ roleKey: "super_admin", scope: {} }]);
const doctorsArmAdmin: Actor = makeActor([{ roleKey: "arm_admin", scope: { arm: "doctors" } }]);
const lagosChapterAdmin: Actor = makeActor([
  { roleKey: "chapter_admin", scope: lagosChapterScope },
]);
const lagosEditor: Actor = makeActor([{ roleKey: "content_editor", scope: lagosChapterScope }]);

describe("scopeContains", () => {
  it("system scope contains every scope", () => {
    expect(scopeContains({}, doctorsChapterScope)).toBe(true);
    expect(scopeContains({}, ibadanChapterScope)).toBe(true);
  });

  it("arm scope contains only its own arm", () => {
    expect(scopeContains({ arm: "doctors" }, doctorsChapterScope)).toBe(true);
    expect(scopeContains({ arm: "doctors" }, lagosChapterScope)).toBe(false);
  });

  it("chapter scope contains only its own chapter", () => {
    expect(scopeContains(lagosChapterScope, lagosChapterScope)).toBe(true);
    expect(scopeContains(lagosChapterScope, ibadanChapterScope)).toBe(false);
    expect(scopeContains(lagosChapterScope, doctorsChapterScope)).toBe(false);
  });
});

describe("effectivePermissions", () => {
  it("unions permissions across roles without duplication", () => {
    const perms = effectivePermissions(superAdmin.roles);
    expect(perms.length).toBe(PERMISSION_KEYS.length);
    expect(new Set(perms).size).toBe(PERMISSION_KEYS.length);
  });

  it("reflects the granted matrix per role", () => {
    expect(effectivePermissions(lagosEditor.roles)).toContain("events.write");
    expect(effectivePermissions(lagosEditor.roles)).not.toContain("users.read");
  });
});

describe("permission matrix — Super Admin", () => {
  it("is granted every permission at any scope", () => {
    for (const permission of PERMISSION_KEYS) {
      expect(can(superAdmin, permission, ibadanChapterScope)).toBe(true);
      expect(can(superAdmin, permission)).toBe(true);
    }
  });

  it("can delete users, change settings and view audit logs", () => {
    expect(can(superAdmin, "users.delete", STUDENTS_ARM)).toBe(true);
    expect(can(superAdmin, "settings.write")).toBe(true);
    expect(can(superAdmin, "audit_logs.view", lagosChapterScope)).toBe(true);
  });
});

describe("permission matrix — Arm Admin (doctors)", () => {
  it("is granted arm-scoped permissions", () => {
    expect(can(doctorsArmAdmin, "users.read", DOCTORS_ARM)).toBe(true);
    expect(can(doctorsArmAdmin, "chapters.write", DOCTORS_ARM)).toBe(true);
    expect(can(doctorsArmAdmin, "events.write", doctorsChapterScope)).toBe(true);
    expect(can(doctorsArmAdmin, "audit_logs.view", DOCTORS_ARM)).toBe(true);
  });

  it("is denied permissions outside the doctors arm (scope)", () => {
    expect(can(doctorsArmAdmin, "chapters.write", STUDENTS_ARM)).toBe(false);
    expect(can(doctorsArmAdmin, "events.write", lagosChapterScope)).toBe(false);
  });

  it("is denied permissions the role does not hold at all", () => {
    expect(can(doctorsArmAdmin, "users.delete", DOCTORS_ARM)).toBe(false);
    expect(can(doctorsArmAdmin, "settings.write", DOCTORS_ARM)).toBe(false);
  });

  it("cannot act when no scope is supplied for a scoped permission", () => {
    // No role covers the full system, so a scope-less request is denied for
    // scoped roles even though the permission itself is granted.
    expect(can(doctorsArmAdmin, "chapters.write")).toBe(false);
    expect(can(doctorsArmAdmin, "users.read")).toBe(false);
  });
});

describe("permission matrix — Chapter Admin (students/lagos)", () => {
  it("manages its own chapter's content", () => {
    expect(can(lagosChapterAdmin, "events.write", lagosChapterScope)).toBe(true);
    expect(can(lagosChapterAdmin, "leaders.write", lagosChapterScope)).toBe(true);
    expect(can(lagosChapterAdmin, "news.write", lagosChapterScope)).toBe(true);
    expect(can(lagosChapterAdmin, "chapters.write", lagosChapterScope)).toBe(true);
    expect(can(lagosChapterAdmin, "pages.read", lagosChapterScope)).toBe(true);
  });

  it("is denied access to another chapter (IDOR protection)", () => {
    expect(can(lagosChapterAdmin, "events.write", ibadanChapterScope)).toBe(false);
    expect(can(lagosChapterAdmin, "leaders.write", ibadanChapterScope)).toBe(false);
    expect(can(lagosChapterAdmin, "chapters.read", ibadanChapterScope)).toBe(false);
  });

  it("cannot manage users, settings or audit logs", () => {
    expect(can(lagosChapterAdmin, "users.write", lagosChapterScope)).toBe(false);
    expect(can(lagosChapterAdmin, "settings.write", lagosChapterScope)).toBe(false);
    expect(can(lagosChapterAdmin, "audit_logs.view", lagosChapterScope)).toBe(false);
    expect(can(lagosChapterAdmin, "pages.write", lagosChapterScope)).toBe(false);
  });
});

describe("permission matrix — Content Editor (students/lagos)", () => {
  it("creates and edits content in its own chapter", () => {
    expect(can(lagosEditor, "events.write", lagosChapterScope)).toBe(true);
    expect(can(lagosEditor, "news.write", lagosChapterScope)).toBe(true);
    expect(can(lagosEditor, "announcements.write", lagosChapterScope)).toBe(true);
    expect(can(lagosEditor, "media.write", lagosChapterScope)).toBe(true);
    expect(can(lagosEditor, "pages.read", lagosChapterScope)).toBe(true);
  });

  it("is denied destructive and privileged permissions", () => {
    expect(can(lagosEditor, "events.delete", lagosChapterScope)).toBe(false);
    expect(can(lagosEditor, "leaders.delete", lagosChapterScope)).toBe(false);
    expect(can(lagosEditor, "users.read", lagosChapterScope)).toBe(false);
    expect(can(lagosEditor, "settings.write", lagosChapterScope)).toBe(false);
    expect(can(lagosEditor, "audit_logs.view", lagosChapterScope)).toBe(false);
  });

  it("is scoped to its own chapter", () => {
    expect(can(lagosEditor, "events.write", ibadanChapterScope)).toBe(false);
  });
});

describe("authorize", () => {
  it("passes for a permitted, in-scope action", () => {
    expect(() => authorize(lagosChapterAdmin, "events.delete", lagosChapterScope)).not.toThrow();
  });

  it("throws AuthorizationError when the permission is missing", () => {
    expect(() => authorize(lagosEditor, "users.read", lagosChapterScope)).toThrow(
      AuthorizationError,
    );
  });

  it("throws AuthorizationError when out of scope", () => {
    let thrown: unknown;
    try {
      authorize(lagosChapterAdmin, "events.write", ibadanChapterScope);
    } catch (caught) {
      thrown = caught;
    }
    expect(thrown).toBeInstanceOf(AuthorizationError);
    expect((thrown as AuthorizationError).reason).toBe("scope_outside_role");
  });

  it("carries a structured context for auditing", () => {
    try {
      authorize(lagosEditor, "settings.write", lagosChapterScope);
    } catch (caught) {
      const error = caught as AuthorizationError;
      expect(error.ctx.permission).toBe("settings.write");
      expect(error.ctx.actorUserId).toBe("actor-1");
      return;
    }
    throw new Error("expected authorize to throw");
  });
});

describe("unrestricted scope semantics", () => {
  it("a scoped permission requested without a scope is denied unless system-wide", () => {
    expect(can(superAdmin, "settings.write")).toBe(true);
    const scoped: PermissionKey = "events.write";
    expect(can(doctorsArmAdmin, scoped)).toBe(false);
  });
});
