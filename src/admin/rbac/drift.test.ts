import { describe, expect, it } from "vitest";

import { PERMISSION_DESCRIPTIONS, PERMISSION_KEYS } from "./permissions";
import { ROLE_DEFINITIONS, ROLE_KEYS } from "./roles";

/**
 * Drift guard between the TypeScript role/permission registry and what
 * `scripts/admin-migrate.mjs` seeds into Postgres. The migrate script inserts
 * every entry of PERMISSION_DESCRIPTIONS and ROLE_DEFINITIONS verbatim, so a
 * mismatch here means the seeded database would diverge from runtime
 * authorization: an unknown role key is dropped by `isRoleKey`, and a
 * permission without a description is never inserted, breaking the
 * admin_role_permissions foreign key on the next role grant.
 */
describe("role registry ↔ seed drift", () => {
  it("ROLE_DEFINITIONS covers ROLE_KEYS exactly — no extras, none missing", () => {
    const defined = Object.keys(ROLE_DEFINITIONS).sort();
    const declared = [...ROLE_KEYS].sort();
    expect(defined).toEqual(declared);
  });

  it("each definition's key matches its registry entry", () => {
    for (const [key, definition] of Object.entries(ROLE_DEFINITIONS)) {
      expect(definition.key, `key for ${key}`).toBe(key);
    }
  });

  it("every PERMISSION_KEY has a description the migrate script can seed", () => {
    for (const permission of PERMISSION_KEYS) {
      expect(
        PERMISSION_DESCRIPTIONS[permission],
        `description for ${permission} (admin-migrate seeds from PERMISSION_DESCRIPTIONS)`,
      ).toBeTruthy();
    }
  });

  it("PERMISSION_DESCRIPTIONS has no keys outside PERMISSION_KEYS", () => {
    const known = new Set<string>(PERMISSION_KEYS);
    for (const key of Object.keys(PERMISSION_DESCRIPTIONS)) {
      expect(known.has(key), `undeclared permission ${key}`).toBe(true);
    }
  });

  it("every role's permissions are registered permission keys", () => {
    const known = new Set<string>(PERMISSION_KEYS);
    for (const [key, definition] of Object.entries(ROLE_DEFINITIONS)) {
      for (const permission of definition.permissions) {
        expect(known.has(permission), `${key} → ${permission}`).toBe(true);
      }
    }
  });

  it("super_admin holds every permission", () => {
    expect(new Set(ROLE_DEFINITIONS.super_admin.permissions)).toEqual(new Set(PERMISSION_KEYS));
  });

  it("role names are unique (the seed keys admin_roles on key, displays name)", () => {
    const names = Object.values(ROLE_DEFINITIONS).map((role) => role.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
