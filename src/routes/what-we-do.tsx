import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { WhatWeDo } from "@/components/site/About";

const title = "What We Do | CMDA Nigeria";
const description =
  "Leadership development, medical missions, advocacy, student discipleship and whole-person care — the twelve pillars of CMDA Nigeria's work.";

export const Route = createFileRoute("/what-we-do")({
  component: WhatWeDoPage,
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

function WhatWeDoPage() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="Twelve pillars of ministry across Nigerian healthcare"
        intro="From bedside evangelism to national health advocacy, our work equips healthcare professionals to serve patients in body, mind and spirit."
      />
      <WhatWeDo />
    </>
  );
}
