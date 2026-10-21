export type SitePageKind = "cms" | "hybrid" | "unit" | "list" | "static";

export interface SitePageEntry {
  title: string;
  path: string;
  kind: SitePageKind;
  /** Sanity `page` slug when the route is backed by a page doc. */
  pageSlug?: string;
  /** Content module whose list/edit screens manage this route's data. */
  editModule?: string;
  /** Short hint shown when the route has no dashboard edit target. */
  editHint?: string;
  /** Publication status when a backing page doc exists (filled at runtime). */
  publication?: string | null;
  /** True when a Sanity page doc was found for the slug. */
  hasDoc?: boolean;
}

/**
 * Every known public route, so the Website Pages registry can show admins
 * where each URL's content lives. Dynamic page-doc entries (/$slug pages
 * stored in Sanity) are appended at runtime by the pages view.
 */
export const SITE_PAGES: SitePageEntry[] = [
  {
    title: "Home",
    path: "/",
    kind: "hybrid",
    pageSlug: "home",
    editHint: "CMS sections stack above the live home blocks.",
  },
  {
    title: "Students' Arm",
    path: "/students-arm",
    kind: "hybrid",
    pageSlug: "students-arm",
    editHint: "CMS sections stack above the live students' arm blocks.",
  },
  {
    title: "Doctors' Arm",
    path: "/doctors-arm",
    kind: "hybrid",
    pageSlug: "doctors-arm",
    editHint: "CMS sections stack above the live doctors' arm blocks.",
  },
  {
    title: "Global Network",
    path: "/global-network",
    kind: "hybrid",
    pageSlug: "global-network",
    editHint: "CMS sections stack above the live regional map.",
  },
  {
    title: "About CMDA",
    path: "/about",
    kind: "cms",
    pageSlug: "about",
    editHint: "Edit in Sanity Studio as a page document.",
  },
  {
    title: "Our History",
    path: "/about/history",
    kind: "cms",
    pageSlug: "about-history",
    editHint: "Edit in Sanity Studio as a page document.",
  },
  {
    title: "Leadership",
    path: "/about/leadership",
    kind: "cms",
    pageSlug: "about-leadership",
    editHint: "Edit in Sanity Studio as a page document.",
  },
  {
    title: "What We Do",
    path: "/what-we-do",
    kind: "cms",
    pageSlug: "what-we-do",
    editHint: "Edit in Sanity Studio as a page document.",
  },
  {
    title: "Ministries",
    path: "/ministries",
    kind: "cms",
    pageSlug: "ministries",
    editHint: "Edit in Sanity Studio as a page document.",
  },
  {
    title: "Impact",
    path: "/impact",
    kind: "cms",
    pageSlug: "impact",
    editHint: "Edit in Sanity Studio as a page document.",
  },
  {
    title: "Membership",
    path: "/membership",
    kind: "cms",
    pageSlug: "membership",
    editHint: "Edit in Sanity Studio as a page document.",
  },
  {
    title: "Give",
    path: "/give",
    kind: "static",
    editHint: "Category cards and copy are code constants on the Give hub page.",
  },
  {
    title: "Give — Doctors & Students",
    path: "/give/doctors-students",
    kind: "static",
    editHint: "Areas of need and giving copy are code constants on this page.",
  },
  {
    title: "Give — Global Network",
    path: "/give/global-network",
    kind: "static",
    editHint: "Areas of need and giving copy are code constants on this page.",
  },
  {
    title: "Give — Non-Members",
    path: "/give/non-members",
    kind: "static",
    editHint: "The non-member donation form is front-end only and shows a success message.",
  },
  {
    title: "Contact",
    path: "/contact",
    kind: "static",
    editHint: "Contact details are code constants on the Contact page.",
  },
  {
    title: "Media & Resources",
    path: "/media-resources",
    kind: "cms",
    pageSlug: "media-resources",
    editHint: "Edit in Sanity Studio as a page document.",
  },
  {
    title: "Events",
    path: "/events",
    kind: "list",
    editModule: "events",
  },
  {
    title: "News",
    path: "/news",
    kind: "list",
    editModule: "news",
  },
  {
    title: "Publications",
    path: "/publications",
    kind: "list",
    editModule: "publications",
  },
  {
    title: "Chapters",
    path: "/chapters",
    kind: "list",
    editModule: "chapters",
  },
  {
    title: "Announcements",
    path: "/announcements",
    kind: "list",
    editModule: "announcements",
  },
  {
    title: "Outreaches",
    path: "/what-we-do#outreaches",
    kind: "list",
    editModule: "outreaches",
  },
];

export const KIND_LABELS: Record<SitePageKind, string> = {
  cms: "Page",
  hybrid: "Hybrid",
  unit: "Unit page",
  list: "Managed list",
  static: "Managed in code",
};

export const MODULE_ROUTE_PREFIX: Record<string, string> = {
  events: "/admin/events",
  news: "/admin/news",
  publications: "/admin/newsletter",
  chapters: "/admin/chapters",
  announcements: "/admin/announcements",
  outreaches: "/admin/outreaches",
  regions: "/admin/global-network",
  leadership: "/admin/leadership",
  pages: "/admin/pages",
};
