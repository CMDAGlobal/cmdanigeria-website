import { createFileRoute, notFound } from "@tanstack/react-router";

import { CmsPage } from "@/components/site/CmsPage";
import { fetchPageBySlug, fetchPageCounters } from "@/sanity/data";

export const Route = createFileRoute("/$slug")({
  loader: async ({ params }) => {
    const [page, counters] = await Promise.all([
      fetchPageBySlug({ data: params.slug }),
      fetchPageCounters(),
    ]);
    // Unpublished or unknown pages render the root 404 — never fallback copy,
    // otherwise the dashboard's publish controls do nothing for custom pages.
    if (!page) throw notFound();
    return { page, counters };
  },
  component: CmsSlugPage,
  head: ({ loaderData }) => {
    const page = loaderData?.page;
    const title = page?.seoTitle
      ? page.seoTitle
      : page?.title
        ? `${page.title} | CMDA Nigeria`
        : "Page not found | CMDA Nigeria";
    const description =
      page?.seoDescription ||
      page?.summary ||
      "CMDA Nigeria — fellowship, mission and advocacy for Christian healthcare professionals.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
});

/**
 * Catch-all for pages created in the dashboard's Pages module: static routes
 * outrank it, so /events, /about, /admin etc. keep their own components — this
 * only serves slugs that have no file route of their own, which is every page
 * an editor publishes from the dashboard.
 */
function CmsSlugPage() {
  const { page, counters } = Route.useLoaderData();
  return (
    <CmsPage
      page={page}
      counters={counters}
      eyebrow={page.eyebrow ?? ""}
      title={page.title ?? ""}
      intro={page.summary ?? ""}
      image={page.coverImage ?? null}
    />
  );
}
