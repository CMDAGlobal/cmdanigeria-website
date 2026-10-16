import { describe, expect, it } from "vitest";

import { AUDIT_ACTIONS } from "../audit/actions";
import { describeAuditEntry } from "../audit/describe";
import { PERMISSION_KEYS } from "../rbac/permissions";
import { ROLE_DEFINITIONS } from "../rbac/roles";
import { NAV_ITEMS } from "../../components/admin/nav-items";
import { CONTENT_QUERIES, STUDIO_TYPE_BY_MODULE } from "./queries";
import { MODULE_FORM_FIELDS } from "./forms";
import { publicHref } from "./public-href";
import { MODULE_MUTATIONS } from "./validate";
import type { ContentModuleKey } from "./types";

const MODULES = Object.keys(MODULE_MUTATIONS) as ContentModuleKey[];

/** Modules whose publication transitions include a send step. */
const SENDABLE: ContentModuleKey[] = ["publications"];

describe("module registry acceptance", () => {
  it("every module has a list query and a studio type", () => {
    for (const module of MODULES) {
      expect(CONTENT_QUERIES[module], `query for ${module}`).toBeTruthy();
      expect(STUDIO_TYPE_BY_MODULE[module], `studio type for ${module}`).toBeTruthy();
    }
  });

  it("every module has form fields", () => {
    for (const module of MODULES) {
      expect(MODULE_FORM_FIELDS[module].length, `form fields for ${module}`).toBeGreaterThan(0);
    }
  });

  it("every module's permissions exist in the permission registry", () => {
    for (const module of MODULES) {
      const config = MODULE_MUTATIONS[module];
      expect(PERMISSION_KEYS as readonly string[]).toContain(config.writePermission);
      expect(PERMISSION_KEYS as readonly string[]).toContain(config.deletePermission);
    }
  });

  it("every module has a documented public-link behaviour", () => {
    for (const module of MODULES) {
      const withSlug = publicHref(module, "sample-slug");
      const withoutSlug = publicHref(module, null);
      expect(withoutSlug, `no-slug behaviour for ${module}`).toBeNull();
      if (withSlug !== null) {
        expect(withSlug, `slug behaviour for ${module}`).toMatch(/^\//);
      }
    }
  });
});

describe("audit vocabulary acceptance", () => {
  it("every module audit prefix has create/update/delete actions", () => {
    const actions = new Set<string>(AUDIT_ACTIONS);
    for (const module of MODULES) {
      const prefix = MODULE_MUTATIONS[module].auditPrefix;
      expect(actions.has(`${prefix}.create`), `${prefix}.create`).toBe(true);
      expect(actions.has(`${prefix}.update`), `${prefix}.update`).toBe(true);
      expect(actions.has(`${prefix}.delete`), `${prefix}.delete`).toBe(true);
    }
  });

  it("publication modules have publish lifecycle actions", () => {
    const actions = new Set<string>(AUDIT_ACTIONS);
    for (const module of MODULES) {
      if (!MODULE_MUTATIONS[module].publication) continue;
      const prefix = MODULE_MUTATIONS[module].auditPrefix;
      for (const verb of ["publish", "schedule", "unpublish", "archive"]) {
        expect(actions.has(`${prefix}.${verb}`), `${prefix}.${verb}`).toBe(true);
      }
    }
  });

  it("sendable modules have a send action", () => {
    const actions = new Set<string>(AUDIT_ACTIONS);
    for (const module of SENDABLE) {
      const prefix = MODULE_MUTATIONS[module].auditPrefix;
      expect(actions.has(`${prefix}.send`), `${prefix}.send`).toBe(true);
    }
  });

  it("the humanizer produces a non-empty phrase for every registered action", () => {
    for (const action of AUDIT_ACTIONS) {
      const phrase = describeAuditEntry(action);
      expect(phrase.trim(), `phrase for ${action}`).not.toBe("");
    }
  });

  it("the humanizer prefixes scope labels for scoped entries", () => {
    const phrase = describeAuditEntry("event.create", { chapterSlug: "lagos" });
    expect(phrase).toContain("Lagos Chapter");
  });
});

describe("role registry acceptance", () => {
  it("every role permission is a registered permission key", () => {
    const known = new Set<string>(PERMISSION_KEYS);
    for (const [key, definition] of Object.entries(ROLE_DEFINITIONS)) {
      for (const permission of definition.permissions) {
        expect(known.has(permission), `${key} → ${permission}`).toBe(true);
      }
    }
  });

  it("every module write permission is held by at least one role", () => {
    const held = new Set<string>();
    for (const definition of Object.values(ROLE_DEFINITIONS)) {
      for (const permission of definition.permissions) held.add(permission);
    }
    for (const module of MODULES) {
      expect(held.has(MODULE_MUTATIONS[module].writePermission), `write for ${module}`).toBe(true);
      expect(held.has(MODULE_MUTATIONS[module].deletePermission), `delete for ${module}`).toBe(
        true,
      );
    }
  });

  it("nav item permissions are registered permission keys", () => {
    const known = new Set<string>(PERMISSION_KEYS);
    for (const item of NAV_ITEMS) {
      if (!item.permission) continue;
      expect(known.has(item.permission), `nav permission ${item.permission}`).toBe(true);
    }
  });
});
