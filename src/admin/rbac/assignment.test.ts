import { describe, it, expect } from "vitest";
import { AuthorizationError, type Actor } from "./engine.ts";
import {
  assertCanAssignRole,
  assertTargetInScope,
  assertValidScopeForRole,
  assignableRoleKeys,
  canAssignRole,
} from "./assignment.ts";
import { validateScopeForRole } from "./roles.ts";

function actor(roles: Actor["roles"]): Actor {
  return { userId: "actor-1", roles };
}

const superAdmin = actor([{ roleKey: "super_admin", scope: {} }]);
const studentsArmAdmin = actor([{ roleKey: "arm_admin", scope: { arm: "students" } }]);
const globalArmAdmin = actor([{ roleKey: "arm_admin", scope: { arm: "global" } }]);
const lagosChapterAdmin = actor([
  { roleKey: "chapter_admin", scope: { arm: "students", chapterSlug: "lagos" } },
]);

describe("validateScopeForRole", () => {
  it("accepts a system scope only for super_admin", () => {
    expect(validateScopeForRole("super_admin", {}).ok).toBe(true);
    expect(validateScopeForRole("super_admin", { arm: "students", chapterSlug: "lagos" }).ok).toBe(
      false,
    );
  });

  it("requires an arm and nothing narrower for arm_admin", () => {
    expect(validateScopeForRole("arm_admin", { arm: "students" }).ok).toBe(true);
    expect(validateScopeForRole("arm_admin", {}).ok).toBe(false);
    expect(validateScopeForRole("arm_admin", { arm: "students", chapterSlug: "lagos" }).ok).toBe(
      false,
    );
  });

  it("requires arm + chapterSlug for chapter_admin", () => {
    expect(
      validateScopeForRole("chapter_admin", { arm: "students", chapterSlug: "lagos" }).ok,
    ).toBe(true);
    expect(validateScopeForRole("chapter_admin", { arm: "students" }).ok).toBe(false);
    expect(validateScopeForRole("chapter_admin", { chapterSlug: "lagos" }).ok).toBe(false);
    expect(
      validateScopeForRole("chapter_admin", {
        arm: "students",
        chapterSlug: "lagos",
        regionSlug: "lagos",
      }).ok,
    ).toBe(false);
  });

  it("requires the global arm + regionSlug for region_admin", () => {
    expect(validateScopeForRole("region_admin", { arm: "global", regionSlug: "lagos" }).ok).toBe(
      true,
    );
    expect(validateScopeForRole("region_admin", { regionSlug: "lagos" }).ok).toBe(false);
    expect(validateScopeForRole("region_admin", { arm: "students", regionSlug: "lagos" }).ok).toBe(
      false,
    );
    expect(validateScopeForRole("region_admin", { arm: "global" }).ok).toBe(false);
  });

  it("requires an arm for content_editor", () => {
    expect(validateScopeForRole("content_editor", { arm: "students" }).ok).toBe(true);
    expect(
      validateScopeForRole("content_editor", { arm: "students", chapterSlug: "lagos" }).ok,
    ).toBe(true);
    expect(validateScopeForRole("content_editor", {}).ok).toBe(false);
  });

  it("rejects unknown arm values", () => {
    expect(validateScopeForRole("arm_admin", { arm: "alumni" as unknown as "students" }).ok).toBe(
      false,
    );
  });
});

describe("canAssignRole", () => {
  it("lets a super admin grant any role at any scope", () => {
    expect(
      canAssignRole(superAdmin, "chapter_admin", { arm: "students", chapterSlug: "lagos" }),
    ).toBe(true);
    expect(canAssignRole(superAdmin, "region_admin", { arm: "global", regionSlug: "lagos" })).toBe(
      true,
    );
    expect(canAssignRole(superAdmin, "arm_admin", { arm: "doctors" })).toBe(true);
    expect(canAssignRole(superAdmin, "super_admin", {})).toBe(true);
  });

  it("lets an arm admin grant chapter/content roles inside their own arm only", () => {
    expect(
      canAssignRole(studentsArmAdmin, "chapter_admin", { arm: "students", chapterSlug: "lagos" }),
    ).toBe(true);
    expect(canAssignRole(studentsArmAdmin, "content_editor", { arm: "students" })).toBe(true);
    expect(
      canAssignRole(studentsArmAdmin, "chapter_admin", { arm: "doctors", chapterSlug: "lagos" }),
    ).toBe(false);
    expect(canAssignRole(studentsArmAdmin, "content_editor", { arm: "doctors" })).toBe(false);
  });

  it("blocks privilege escalation upwards", () => {
    expect(canAssignRole(studentsArmAdmin, "super_admin", { arm: "students" })).toBe(false);
    expect(canAssignRole(studentsArmAdmin, "super_admin", {})).toBe(false);
    expect(canAssignRole(studentsArmAdmin, "arm_admin", { arm: "doctors" })).toBe(false);
  });

  it("allows peers to grant the same role within their scope", () => {
    expect(canAssignRole(studentsArmAdmin, "arm_admin", { arm: "students" })).toBe(true);
  });

  it("lets the global arm admin grant region roles", () => {
    expect(
      canAssignRole(globalArmAdmin, "region_admin", { arm: "global", regionSlug: "lagos" }),
    ).toBe(true);
    expect(
      canAssignRole(studentsArmAdmin, "region_admin", { arm: "global", regionSlug: "lagos" }),
    ).toBe(false);
  });

  it("keeps chapter admins inside their own chapter", () => {
    expect(
      canAssignRole(lagosChapterAdmin, "content_editor", { arm: "students", chapterSlug: "lagos" }),
    ).toBe(true);
    expect(
      canAssignRole(lagosChapterAdmin, "content_editor", {
        arm: "students",
        chapterSlug: "ibadan",
      }),
    ).toBe(false);
    expect(
      canAssignRole(lagosChapterAdmin, "chapter_admin", { arm: "students", chapterSlug: "lagos" }),
    ).toBe(true);
  });
});

describe("assignableRoleKeys", () => {
  it("offers every role to a super admin", () => {
    expect(assignableRoleKeys(superAdmin)).toEqual([
      "super_admin",
      "arm_admin",
      "chapter_admin",
      "region_admin",
      "content_editor",
    ]);
  });

  it("excludes super_admin for an arm admin", () => {
    expect(assignableRoleKeys(studentsArmAdmin)).toEqual([
      "arm_admin",
      "chapter_admin",
      "region_admin",
      "content_editor",
    ]);
  });

  it("limits a chapter admin to chapter-level roles", () => {
    expect(assignableRoleKeys(lagosChapterAdmin)).toEqual(["chapter_admin", "content_editor"]);
  });
});

describe("assertCanAssignRole", () => {
  it("throws with role_assignment_denied when only the rank rule blocks it", () => {
    try {
      assertCanAssignRole(studentsArmAdmin, "super_admin", { arm: "students" });
      throw new Error("expected assertCanAssignRole to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(AuthorizationError);
      expect((error as AuthorizationError).reason).toBe("role_assignment_denied");
    }
  });

  it("throws with scope_outside_role when the scope is outside the actor", () => {
    try {
      assertCanAssignRole(studentsArmAdmin, "arm_admin", { arm: "doctors" });
      throw new Error("expected assertCanAssignRole to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(AuthorizationError);
      expect((error as AuthorizationError).reason).toBe("scope_outside_role");
    }
  });
});

describe("assertValidScopeForRole", () => {
  it("throws invalid_scope when the grant shape does not fit the role", () => {
    try {
      assertValidScopeForRole(superAdmin, "region_admin", { regionSlug: "lagos" });
      throw new Error("expected assertValidScopeForRole to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(AuthorizationError);
      expect((error as AuthorizationError).reason).toBe("invalid_scope");
    }
  });

  it("passes for a well-formed grant", () => {
    expect(() =>
      assertValidScopeForRole(superAdmin, "region_admin", {
        arm: "global",
        regionSlug: "lagos",
      }),
    ).not.toThrow();
  });
});

describe("assertTargetInScope", () => {
  const studentsChapterGrant = { arm: "students" as const, chapterSlug: "lagos" };
  const doctorsChapterGrant = { arm: "doctors" as const, chapterSlug: "lagos" };

  it("lets system actors touch any account", () => {
    expect(() => assertTargetInScope(superAdmin, [doctorsChapterGrant])).not.toThrow();
    expect(() => assertTargetInScope(superAdmin, [])).not.toThrow();
  });

  it("lets scoped actors act only on accounts fully inside their scope", () => {
    expect(() => assertTargetInScope(studentsArmAdmin, [studentsChapterGrant])).not.toThrow();
    expect(() => assertTargetInScope(studentsArmAdmin, [doctorsChapterGrant])).toThrow(
      AuthorizationError,
    );
    expect(() =>
      assertTargetInScope(studentsArmAdmin, [studentsChapterGrant, doctorsChapterGrant]),
    ).toThrow(AuthorizationError);
  });

  it("fails closed for accounts without any grants", () => {
    expect(() => assertTargetInScope(studentsArmAdmin, [])).toThrow(AuthorizationError);
  });
});
