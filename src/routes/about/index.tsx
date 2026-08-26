import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import {
  OurStory,
  VisionAndMission,
  CoreValues,
  StatementOfFaith,
  LeadershipDevelopment,
  AwardsAndRecognition,
  HistoryTeaser,
} from "@/components/site/About";

const title = "Who We Are | CMDA Nigeria";
const description =
  "Since 1972, CMDA Nigeria has united Christian doctors, dentists and students around whole-person care — our story, mission, vision and statement of faith.";

export const Route = createFileRoute("/about")({
  component: AboutPage,
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

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Who we are"
        title="A fellowship of Christian healthcare professionals since 1972"
        intro="CMDA Nigeria brings together doctors, dentists and students across 36 states and the FCT to practise medicine with clinical excellence, Christ-like compassion and unwavering integrity."
      />
      <OurStory />
      <VisionAndMission />
      <CoreValues />
      <LeadershipDevelopment />
      <AwardsAndRecognition />
      <StatementOfFaith />
      <HistoryTeaser />
    </>
  );
}
