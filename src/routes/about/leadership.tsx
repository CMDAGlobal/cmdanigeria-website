import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/site/CmsPage";
import { LeadershipPage } from "@/components/site/org/LeadershipPage";
import { fetchLeadership, fetchPageBySlug } from "@/sanity/data";

const title = "National Leadership | CMDA Nigeria";
const description =
  "Meet the leadership of CMDA Nigeria — our Board of Trustees, Governing Board, Management Team and the Student NEC.";

export const Route = createFileRoute("/about/leadership")({
  loader: async () => ({
    leadership: await fetchLeadership(),
    page: await fetchPageBySlug({ data: "leadership" }),
  }),
  component: LeadershipRoute,
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

function LeadershipRoute() {
  const { leadership, page } = Route.useLoaderData();
  return (
    <CmsPage
      page={page}
      eyebrow="Who we are"
      title="Our national leadership"
      intro="CMDA Nigeria is guided by trustees, a governing board and a management team, alongside the National Executive Committee of the Students' Arm."
    >
      <LeadershipPage leadership={leadership} />
    </CmsPage>
  );
}
