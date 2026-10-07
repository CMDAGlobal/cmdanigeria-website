import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/site/CmsPage";
import { Events } from "@/components/site/Events";
import { fetchEvents, fetchPageBySlug } from "@/sanity/data";

const title = "Events & Conferences | CMDA Nigeria";
const description =
  "National conferences, regional retreats, medical outreaches and student camps — find the next CMDA Nigeria gathering near you.";

export const Route = createFileRoute("/events")({
  loader: async () => ({
    page: await fetchPageBySlug({ data: "events" }),
    events: await fetchEvents(),
  }),
  component: EventsPage,
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

function EventsPage() {
  const { events, page } = Route.useLoaderData();
  return (
    <CmsPage
      page={page}

      eyebrow="Events"
      title="Gather, be equipped, and go out again"
      intro="Conferences, retreats, outreaches and student camps run through the year across our chapters nationwide."
    >
      <Events events={events} />
    </CmsPage>
  );
}
