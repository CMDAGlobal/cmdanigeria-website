import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/site/CmsPage";
import {
  OurStory,
  VisionAndMission,
  CoreValues,
  StatementOfFaith,
  LeadershipDevelopment,
  AwardsAndRecognition,
  HistoryTeaser,
} from "@/components/site/About";
import { fetchPageBySlug, fetchPageCounters } from "@/sanity/data";

const title = "Who We Are | CMDA Nigeria";
const description =
  "Since 1972, CMDA Nigeria has united Christian doctors, dentists and students around whole-person care — our story, mission, vision and statement of faith.";

export const Route = createFileRoute("/about/")({
  loader: async () => {
    const [page, counters] = await Promise.all([
      fetchPageBySlug({ data: "about" }),
      fetchPageCounters(),
    ]);
    return { page, counters };
  },
  component: AboutPage,
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

function AboutPage() {
  const { page, counters } = Route.useLoaderData();
  return (
    <CmsPage
      page={page}
      counters={counters}
      eyebrow="Who we are"
      title="A fellowship of Christian healthcare professionals since 1972"
      intro="CMDA Nigeria brings together doctors, dentists and students across 36 states and the FCT to practise medicine with clinical excellence, Christ-like compassion and unwavering integrity."
    >
      <OurStory />
      <VisionAndMission />
      <CoreValues />
      <LeadershipDevelopment />
      <AwardsAndRecognition />
      <StatementOfFaith />
      <HistoryTeaser />
    </CmsPage>
  );
}
