import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { MediaResources } from "@/components/site/MediaResources";

const title = "Media & Resources | CMDA Nigeria";
const description =
  "Podcasts, webinars, devotionals and training resources from CMDA Nigeria — equipping healthcare professionals for faith and practice.";

export const Route = createFileRoute("/media-resources")({
  component: MediaResourcesPage,
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

function MediaResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Media & resources"
        title="Tools for growth, learning and spiritual nourishment"
        intro="From webinars to podcasts to devotionals — CMDA Nigeria produces resources to equip every member for faith and practice."
      />
      <MediaResources />
    </>
  );
}
