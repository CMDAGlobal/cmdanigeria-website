import { createFileRoute } from "@tanstack/react-router";
import { RegionPage } from "@/components/site/org/RegionPage";
import { fetchRegion } from "@/sanity/data";
import type { RegionDetail } from "@/sanity/types";

export const Route = createFileRoute("/global-network/$slug")({
  loader: async ({ params }) => ({ region: await fetchRegion({ data: params.slug }) }),
  component: RegionRoute,
  head: ({ loaderData }) => {
    const region = loaderData?.region;
    const title = region
      ? `${region.name} Region | CMDA Nigeria Global Network`
      : "Region | CMDA Nigeria";
    const description =
      region?.tagline ??
      "Explore a CMDA Nigeria Global Network region — leadership, events, announcements, activities and chapters.";
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

function RegionRoute() {
  const { region } = Route.useLoaderData() as { region?: RegionDetail | null };
  return <RegionPage region={region ?? null} />;
}