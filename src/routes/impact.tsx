import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/site/CmsPage";
import { ImpactStats } from "@/components/site/ImpactStats";
import { ImpactStories } from "@/components/site/Stories";
import { fetchChapterCounts, fetchPageBySlug } from "@/sanity/data";

const title = "Our Impact | CMDA Nigeria";
const description =
  "50+ years, 11,000+ members, 80+ chapters — the measurable impact of Christian healthcare professionals across Nigeria and beyond.";

export const Route = createFileRoute("/impact")({
  loader: async () => ({
    page: await fetchPageBySlug({ data: "impact" }),
    chapters: await fetchChapterCounts(),
  }),
  component: ImpactPage,
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

function ImpactPage() {
  const { chapters, page } = Route.useLoaderData();
  return (
    <CmsPage
      page={page}

      eyebrow="Our impact"
      title="Measured in lives reached, not activity reported"
      intro="Outreaches, scholarships, chapters and hospitals — here is what five decades of faithful service looks like in numbers and in stories."
    >
      <ImpactStats chapters={chapters} />
      <ImpactStories />
    </CmsPage>
  );
}
