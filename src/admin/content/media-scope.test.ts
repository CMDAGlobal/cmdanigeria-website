import { describe, expect, it } from "vitest";
import type { Actor } from "../rbac/engine";
import type { Scope } from "../rbac/roles";
import {
  assetUploadScope,
  canAccessAsset,
  canMutateAsset,
  isGlobalAssetTag,
  type AssetScopeTag,
} from "./media-scope";

function actor(scopes: Scope[]): Actor {
  return {
    userId: "u1",
    roles: scopes.map((scope, index) => ({
      roleKey: (index === 0
        ? "chapter_admin"
        : "content_editor") as Actor["roles"][number]["roleKey"],
      scope,
    })),
  };
}

const systemActor = actor([{}]);
const lagosAdmin = actor([{ arm: "students", chapterSlug: "lagos" }]);
const doctorsAdmin = actor([{ arm: "doctors" }]);
const lagosTag: AssetScopeTag = { arm: "students", chapterSlug: "lagos" };

describe("assetUploadScope", () => {
  it("tags system-wide roles as global", () => {
    expect(assetUploadScope([{}])).toEqual({});
    expect(assetUploadScope([{}, { arm: "students" }])).toEqual({});
  });

  it("keeps a single scoped role's full tag", () => {
    expect(assetUploadScope([{ arm: "students", chapterSlug: "lagos" }])).toEqual({
      arm: "students",
      chapterSlug: "lagos",
    });
  });

  it("drops dimensions that disagree across roles", () => {
    const tag = assetUploadScope([
      { arm: "students", chapterSlug: "lagos" },
      { arm: "students", chapterSlug: "accra" },
    ]);
    expect(tag).toEqual({ arm: "students" });
  });

  it("returns a global tag when there are no roles", () => {
    expect(assetUploadScope([])).toEqual({});
  });
});

describe("isGlobalAssetTag", () => {
  it("treats null and empty tags as global", () => {
    expect(isGlobalAssetTag(null)).toBe(true);
    expect(isGlobalAssetTag(undefined)).toBe(true);
    expect(isGlobalAssetTag({})).toBe(true);
    expect(isGlobalAssetTag({ arm: "students" })).toBe(false);
  });
});

describe("canAccessAsset", () => {
  it("system actors see every asset", () => {
    expect(canAccessAsset(systemActor, lagosTag)).toBe(true);
    expect(canAccessAsset(systemActor, null)).toBe(true);
  });

  it("everyone with media.read sees untagged (legacy) assets", () => {
    expect(canAccessAsset(lagosAdmin, null)).toBe(true);
    expect(canAccessAsset(lagosAdmin, {})).toBe(true);
  });

  it("scoped actors see their own scope and wider tags", () => {
    expect(canAccessAsset(lagosAdmin, lagosTag)).toBe(true);
    expect(canAccessAsset(lagosAdmin, { arm: "students" })).toBe(true);
  });

  it("scoped actors cannot see other scopes", () => {
    expect(canAccessAsset(lagosAdmin, { arm: "students", chapterSlug: "accra" })).toBe(false);
    expect(canAccessAsset(doctorsAdmin, lagosTag)).toBe(false);
  });
});

describe("canMutateAsset", () => {
  it("system actors may replace or delete anything", () => {
    expect(canMutateAsset(systemActor, lagosTag)).toBe(true);
    expect(canMutateAsset(systemActor, null)).toBe(true);
  });

  it("scoped actors may not mutate global or legacy assets", () => {
    expect(canMutateAsset(lagosAdmin, null)).toBe(false);
    expect(canMutateAsset(lagosAdmin, {})).toBe(false);
    expect(canMutateAsset(lagosAdmin, { arm: "students" })).toBe(false);
  });

  it("scoped actors may mutate assets tagged within their scope", () => {
    expect(canMutateAsset(lagosAdmin, lagosTag)).toBe(true);
  });

  it("scoped actors may not mutate assets outside their scope", () => {
    expect(canMutateAsset(lagosAdmin, { arm: "students", chapterSlug: "accra" })).toBe(false);
    expect(canMutateAsset(doctorsAdmin, lagosTag)).toBe(false);
  });
});
