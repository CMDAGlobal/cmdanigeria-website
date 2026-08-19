import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Events } from "@/components/site/Events";

const title = "Events & Conferences | CMDA Nigeria";
const description =
  "National conferences, regional retreats, medical outreaches and student camps — find the next CMDA Nigeria gathering near you.";

export const Route = createFileRoute("/events")({
  component: EventsPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Gather, be equipped, and go out again"
        intro="Conferences, retreats, outreaches and student camps run through the year across our chapters nationwide."
      />
      <Events />
    </>
  );
}
