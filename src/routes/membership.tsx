import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/site/CmsPage";
import { Membership } from "@/components/site/Events";
import { ReasonsToJoin } from "@/components/site/ReasonsToJoin";
import { fetchPageBySlug, fetchPageCounters } from "@/sanity/data";

const title = "Membership | CMDA Nigeria";
const description =
  "Join over 11,000 Christian doctors, dentists and medical students. Explore student, professional and global membership options.";

export const Route = createFileRoute("/membership")({
  loader: async () => {
    const [page, counters] = await Promise.all([
      fetchPageBySlug({ data: "membership" }),
      fetchPageCounters(),
    ]);
    return { page, counters };
  },
  component: MembershipPage,
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

function MembershipPage() {
  const { page, counters } = Route.useLoaderData();
  return (
    <CmsPage
      page={page}
      counters={counters}
      eyebrow="Membership"
      title="Belong to a fellowship that shapes your practice"
      intro="Membership connects you to mentorship, continuing education, missions opportunities and a network of colleagues who share your convictions."
    >
      <ReasonsToJoin />
      <Membership />
    </CmsPage>
  );
}
