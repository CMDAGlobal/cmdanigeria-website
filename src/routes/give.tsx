import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/site/CmsPage";
import { fetchPageBySlug, fetchPageCounters } from "@/sanity/data";
import { Giving } from "@/components/site/Events";

const title = "Give | CMDA Nigeria";
const description =
  "Support medical missions, student scholarships and emergency relief through CMDA Nigeria — with transparent reporting on every naira received.";

export const Route = createFileRoute("/give")({
  loader: async () => {
    const [page, counters] = await Promise.all([
      fetchPageBySlug({ data: "give" }),
      fetchPageCounters(),
    ]);
    return { page, counters };
  },
  component: GivePage,
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

function GivePage() {
  const { page, counters } = Route.useLoaderData();
  return (
    <CmsPage
      page={page}
      counters={counters}

      eyebrow="Give"
      title="Send healthcare where the need is greatest"
      intro="Every gift funds outreaches, scholarships and mission hospitals — and every naira is accounted for in our published reports."
    >
      <Giving />
    </CmsPage>
  );
}
