import { createFileRoute, notFound } from "@tanstack/react-router";
import { RegionNotFound, RegionPage } from "@/components/site/org/RegionPage";
import { fetchRegion } from "@/sanity/data";

export const Route = createFileRoute("/global-network/$slug")({
  loader: async ({ params }) => {
    const region = await fetchRegion({ data: params.slug });
    if (!region) throw notFound();
    return { region };
  },
  component: RegionRoute,
  notFoundComponent: RegionNotFound,
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
  const { region } = Route.useLoaderData();
  return <RegionPage region={region} />;
}
