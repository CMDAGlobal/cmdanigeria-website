import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { PublicationsList, BooksAndReports } from "@/components/site/Publications";

const title = "Publications | CMDA Nigeria";
const description =
  "Magazines, journals, books, and annual reports from CMDA Nigeria — equipping Christian healthcare professionals with knowledge and inspiration.";

export const Route = createFileRoute("/publications")({
  component: PublicationsPage,
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

function PublicationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Publications"
        title="Words that equip, inspire, and carry the mission forward"
        intro="From annual magazines to training manuals and annual reports — CMDA Nigeria produces resources for every member of the fellowship."
      />
      <PublicationsList />
      <BooksAndReports />
    </>
  );
}
