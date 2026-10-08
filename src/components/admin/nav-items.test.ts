import { describe, expect, it } from "vitest";

import { PERMISSION_KEYS } from "../../admin/rbac/permissions";
import type { AdminSession } from "./admin-session";
import { isChapterDashboard, NAV_ITEMS, visibleNavItems } from "./nav-items";

function makeSession(partial: Partial<AdminSession>): AdminSession {
  return { user: null, permissions: [], roles: [], ...partial };
}

const CHAPTER_PERMS = [
  "users.read",
  "chapters.read",
  "chapters.write",
  "events.read",
  "events.write",
  "news.read",
  "news.write",
  "announcements.read",
  "announcements.write",
  "outreaches.read",
  "outreaches.write",
  "publications.read",
  "publications.write",
  "media.read",
  "media.write",
  "pages.read",
];

const studentsChapterAdmin = makeSession({
  permissions: CHAPTER_PERMS,
  roles: [
    {
      key: "chapter_admin",
      name: "Chapter Admin",
      scope: { arm: "students", chapterSlug: "luth" },
    },
  ],
});

const doctorsChapterAdmin = makeSession({
  permissions: CHAPTER_PERMS,
  roles: [
    { key: "chapter_admin", name: "Chapter Admin", scope: { arm: "doctors", chapterSlug: "luth" } },
  ],
});

const hrefs = (session: AdminSession) => visibleNavItems(session).map((item) => item.href);

describe("isChapterDashboard", () => {
  it("is true only when every role held is chapter_admin", () => {
    expect(isChapterDashboard(studentsChapterAdmin)).toBe(true);
    expect(isChapterDashboard(doctorsChapterAdmin)).toBe(true);
    expect(isChapterDashboard(undefined)).toBe(false);
    expect(isChapterDashboard(null)).toBe(false);
    expect(isChapterDashboard(makeSession({}))).toBe(false);
    expect(
      isChapterDashboard(
        makeSession({
          roles: [{ key: "content_editor", name: "Content Editor", scope: { arm: "students" } }],
        }),
      ),
    ).toBe(false);
    expect(
      isChapterDashboard(
        makeSession({
          roles: [
            {
              key: "chapter_admin",
              name: "Chapter Admin",
              scope: { arm: "students", chapterSlug: "luth" },
            },
            { key: "arm_admin", name: "Arm Admin", scope: { arm: "students" } },
          ],
        }),
      ),
    ).toBe(false);
  });
});

describe("visibleNavItems", () => {
  it("keeps the whole dashboard for system-wide administrators", () => {
    const superAdmin = makeSession({
      permissions: [...PERMISSION_KEYS],
      roles: [{ key: "super_admin", name: "Super Admin", scope: {} }],
    });
    expect(hrefs(superAdmin)).toEqual(NAV_ITEMS.map((item) => item.href));
    expect(hrefs(superAdmin)).toHaveLength(15);
  });

  it("filters by permission only when no chapter role is held", () => {
    const editor = makeSession({ permissions: ["news.read", "pages.read"] });
    expect(hrefs(editor)).toEqual(["/admin", "/admin/news", "/admin/pages", "/admin/blog"]);
  });

  it("gives chapter admins only their chapter's modules", () => {
    expect(hrefs(studentsChapterAdmin)).toEqual([
      "/admin",
      "/admin/news",
      "/admin/announcements",
      "/admin/outreaches",
      "/admin/students",
      "/admin/events",
      "/admin/media",
    ]);
  });

  it("hides main-admin modules even when the chapter admin holds the permission", () => {
    const visible = hrefs(studentsChapterAdmin);
    expect(visible).not.toContain("/admin/pages");
    expect(visible).not.toContain("/admin/newsletter");
    expect(visible).not.toContain("/admin/users");
    expect(visible).not.toContain("/admin/blog");
    expect(visible).not.toContain("/admin/global-network");
    expect(visible).not.toContain("/admin/audit");
    expect(visible).not.toContain("/admin/settings");
  });

  it("shows only the chapter admin's own arm", () => {
    expect(hrefs(studentsChapterAdmin)).toContain("/admin/students");
    expect(hrefs(studentsChapterAdmin)).not.toContain("/admin/doctors");
    expect(hrefs(doctorsChapterAdmin)).toContain("/admin/doctors");
    expect(hrefs(doctorsChapterAdmin)).not.toContain("/admin/students");
  });

  it("shows both arm entries for chapter admins of both arms", () => {
    const both = makeSession({
      permissions: CHAPTER_PERMS,
      roles: [
        {
          key: "chapter_admin",
          name: "Chapter Admin",
          scope: { arm: "students", chapterSlug: "luth" },
        },
        {
          key: "chapter_admin",
          name: "Chapter Admin",
          scope: { arm: "doctors", chapterSlug: "abu" },
        },
      ],
    });
    expect(hrefs(both)).toContain("/admin/students");
    expect(hrefs(both)).toContain("/admin/doctors");
  });

  it("does not restrict actors who also hold a higher role", () => {
    const mixed = makeSession({
      permissions: [...PERMISSION_KEYS],
      roles: [
        {
          key: "chapter_admin",
          name: "Chapter Admin",
          scope: { arm: "students", chapterSlug: "luth" },
        },
        { key: "arm_admin", name: "Arm Admin", scope: { arm: "students" } },
      ],
    });
    expect(hrefs(mixed)).toEqual(NAV_ITEMS.map((item) => item.href));
  });
});
