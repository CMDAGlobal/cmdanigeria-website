import { describe, expect, it } from "vitest";

import { auditActionPhrase, auditScopeLabel, describeAuditEntry } from "./describe";

describe("auditScopeLabel", () => {
  it("returns null for a system-wide or missing scope", () => {
    expect(auditScopeLabel(null)).toBeNull();
    expect(auditScopeLabel(undefined)).toBeNull();
    expect(auditScopeLabel({})).toBeNull();
  });

  it("labels a chapter grant by its slug", () => {
    expect(auditScopeLabel({ arm: "students", chapterSlug: "lagos" })).toBe("Lagos Chapter");
    expect(auditScopeLabel({ chapterSlug: "unilag-medical" })).toBe("Unilag Medical Chapter");
  });

  it("labels a region grant by its slug", () => {
    expect(auditScopeLabel({ arm: "global", regionSlug: "west-africa" })).toBe(
      "West Africa region",
    );
  });

  it("labels an arm-only grant with the arm display name", () => {
    expect(auditScopeLabel({ arm: "doctors" })).toBe("Doctors' Arm");
    expect(auditScopeLabel({ arm: "students" })).toBe("Students' Arm");
    expect(auditScopeLabel({ arm: "global" })).toBe("Global Network");
  });
});

describe("auditActionPhrase", () => {
  it("turns module verbs into plain English", () => {
    expect(auditActionPhrase("event.create")).toBe("created an event");
    expect(auditActionPhrase("chapter.update")).toBe("updated a chapter");
    expect(auditActionPhrase("news.publish")).toBe("published a news post");
    expect(auditActionPhrase("publication.archive")).toBe("archived a newsletter");
    expect(auditActionPhrase("media.upload")).toBe("uploaded a media file");
    expect(auditActionPhrase("leader.delete")).toBe("deleted a leadership");
    expect(auditActionPhrase("page.update")).toBe("updated a page");
    expect(auditActionPhrase("user.create")).toBe("created an administrator account");
    expect(auditActionPhrase("user.role_grant")).toBe("granted a role on an administrator account");
  });

  it("handles auth and denial actions", () => {
    expect(auditActionPhrase("auth.login")).toBe("signed in to the admin dashboard");
    expect(auditActionPhrase("auth.logout")).toBe("signed out of a session");
    expect(auditActionPhrase("auth.logout_all")).toBe("signed out of all sessions on");
    expect(auditActionPhrase("auth.password_change")).toBe("changed the password on");
    expect(auditActionPhrase("authorization.denied")).toBe("was denied");
  });

  it("falls back to the raw domain for unknown verbs", () => {
    expect(auditActionPhrase("thing.frobnicate")).toBe("frobnicateed a thing");
    expect(auditActionPhrase("mystery")).toBe("mystery");
  });
});

describe("describeAuditEntry", () => {
  it("combines scope prefix and action phrase", () => {
    expect(describeAuditEntry("event.create", { arm: "students", chapterSlug: "lagos" })).toBe(
      "Lagos Chapter created an event",
    );
    expect(describeAuditEntry("news.publish", { arm: "doctors", chapterSlug: "ph" })).toBe(
      "Ph Chapter published a news post",
    );
    expect(
      describeAuditEntry("announcement.archive", { arm: "global", regionSlug: "west-africa" }),
    ).toBe("West Africa region archived an announcement");
  });

  it("capitalises the sentence when there is no scope", () => {
    expect(describeAuditEntry("auth.login")).toBe("Signed in to the admin dashboard");
    expect(describeAuditEntry("user.create", {})).toBe("Created an administrator account");
  });
});
