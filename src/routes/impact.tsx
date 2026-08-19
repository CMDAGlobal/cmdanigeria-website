import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ImpactStats } from "@/components/site/ImpactStats";
import { ImpactStories } from "@/components/site/Stories";

const title = "Our Impact | CMDA Nigeria";
const description =
  "50+ years, 11,000+ members, 105 chapters — the measurable impact of Christian healthcare professionals across Nigeria and beyond.";

export const Route = createFileRoute("/impact")({
  component: ImpactPage,
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

function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Our impact"
        title="Measured in lives reached, not activity reported"
        intro="Outreaches, scholarships, chapters and hospitals — here is what five decades of faithful service looks like in numbers and in stories."
      />
      <ImpactStats />
      <ImpactStories />
    </>
  );
}
