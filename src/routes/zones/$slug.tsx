import { createFileRoute, notFound } from "@tanstack/react-router";
import { ZoneNotFound, ZonePage } from "@/components/site/org/ZonePage";
import { fetchZone } from "@/sanity/data";

export const Route = createFileRoute("/zones/$slug")({
  loader: async ({ params }) => {
    const zone = await fetchZone({ data: params.slug });
    if (!zone) throw notFound();
    return { zone };
  },
  component: ZoneRoute,
  notFoundComponent: ZoneNotFound,
  head: ({ loaderData }) => {
    const zone = loaderData?.zone;
    const title = zone ? `${zone.name} | CMDA Nigeria` : "Zone | CMDA Nigeria";
    const description =
      zone?.intro ??
      zone?.tagline ??
      "Explore a CMDA Nigeria zone — leadership, chapters, events and outreach.";
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

function ZoneRoute() {
  const { zone } = Route.useLoaderData();
  return <ZonePage zone={zone} />;
}
