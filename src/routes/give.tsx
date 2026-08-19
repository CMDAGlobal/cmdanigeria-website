import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Giving } from "@/components/site/Events";

const title = "Give | CMDA Nigeria";
const description =
  "Support medical missions, student scholarships and emergency relief through CMDA Nigeria — with transparent reporting on every naira received.";

export const Route = createFileRoute("/give")({
  component: GivePage,
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

function GivePage() {
  return (
    <>
      <PageHero
        eyebrow="Give"
        title="Send healthcare where the need is greatest"
        intro="Every gift funds outreaches, scholarships and mission hospitals — and every naira is accounted for in our published reports."
      />
      <Giving />
    </>
  );
}
