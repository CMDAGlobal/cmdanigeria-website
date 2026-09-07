import { createFileRoute } from "@tanstack/react-router";
import { ZonePage } from "@/components/site/org/ZonePage";
import { fetchZone } from "@/sanity/data";
import type { ZoneDetail } from "@/sanity/types";

export const Route = createFileRoute("/zones/$slug")({
  loader: async ({ params }) => ({ zone: await fetchZone({ data: params.slug }) }),
  component: ZoneRoute,
  head: ({ loaderData }) => {
    const zone = loaderData?.zone;
    const title = zone ? `${zone.name} | CMDA Nigeria` : "Zone | CMDA Nigeria";
    const description = zone?.intro ?? zone?.tagline ?? "Explore a CMDA Nigeria zone — leadership, chapters, events and outreach.";
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
  const { zone } = Route.useLoaderData() as { zone?: ZoneDetail | null };
  return <ZonePage zone={zone ?? null} />;
}