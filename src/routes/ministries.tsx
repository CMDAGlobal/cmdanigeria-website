import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/site/CmsPage";
import { fetchPageBySlug, fetchPageCounters } from "@/sanity/data";
import { MinistriesFull } from "@/components/site/Ministries";

const title = "Ministries | CMDA Nigeria";
const description =
  "Explore IfEHL, the Institute of Medical Missions, EXCEL, Wholeness Missions and the CMDA Nigeria Global Network.";

export const Route = createFileRoute("/ministries")({
  loader: async () => {
    const [page, counters] = await Promise.all([
      fetchPageBySlug({ data: "ministries" }),
      fetchPageCounters(),
    ]);
    return { page, counters };
  },
  component: MinistriesPage,
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

function MinistriesPage() {
  const { page, counters } = Route.useLoaderData();
  return (
    <CmsPage
      page={page}
      counters={counters}

      eyebrow="Ministries"
      title="Specialised arms carrying the mission forward"
      intro="Each ministry sharpens a different edge of our calling — leadership formation, missions training, student excellence and global fellowship."
    >
      <MinistriesFull />
    </CmsPage>
  );
}
