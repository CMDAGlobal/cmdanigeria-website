import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/site/CmsPage";
import { MediaResources } from "@/components/site/MediaResources";
import { fetchPageBySlug, fetchPageCounters } from "@/sanity/data";

const title = "Media & Resources | CMDA Nigeria";
const description =
  "Podcasts, webinars, devotionals and training resources from CMDA Nigeria — equipping healthcare professionals for faith and practice.";

export const Route = createFileRoute("/media-resources")({
  loader: async () => {
    const [page, counters] = await Promise.all([
      fetchPageBySlug({ data: "media-resources" }),
      fetchPageCounters(),
    ]);
    return { page, counters };
  },
  component: MediaResourcesPage,
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.page?.seoTitle || title },
      { name: "description", content: loaderData?.page?.seoDescription || description },
      { property: "og:title", content: loaderData?.page?.seoTitle || title },
      { property: "og:description", content: loaderData?.page?.seoDescription || description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function MediaResourcesPage() {
  const { page, counters } = Route.useLoaderData();
  return (
    <CmsPage
      page={page}
      counters={counters}
      eyebrow="Media & resources"
      title="Tools for growth, learning and spiritual nourishment"
      intro="From webinars to podcasts to devotionals — CMDA Nigeria produces resources to equip every member for faith and practice."
    >
      <MediaResources />
    </CmsPage>
  );
}
