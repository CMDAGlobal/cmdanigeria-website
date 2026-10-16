import type { ContentModuleKey } from "./types";

/**
 * Public URL for a dashboard item, or null when the module has no standalone
 * public page (announcements surface on arm pages; outreaches are listed on
 * the What We Do programme page; leadership is shown collectively; there is
 * no per-person route).
 */
export function publicHref(
  module: ContentModuleKey,
  slug: string | null | undefined,
): string | null {
  if (!slug) return null;
  switch (module) {
    case "events":
      return `/events/${slug}`;
    case "news":
      return `/news/${slug}`;
    case "publications":
      return `/publications/${slug}`;
    case "chapters":
      return `/chapters/${slug}`;
    case "regions":
      return `/global-network/${slug}`;
    case "pages":
      return `/${slug}`;
    case "outreaches":
      return "/what-we-do#outreaches";
    default:
      return null;
  }
}
