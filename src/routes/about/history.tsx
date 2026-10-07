import { createFileRoute, Link } from "@tanstack/react-router";
import { CmsPage } from "@/components/site/CmsPage";
import { HistoryTimeline } from "@/components/site/History";
import { buttonVariants } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
import { fetchPageBySlug, fetchPageCounters } from "@/sanity/data";

const title = "Our History | CMDA Nigeria";
const description =
  "From the pioneering work of Dr. Akanu Ibiam to a nationwide movement — discover the history of CMDA Nigeria spanning five decades of faith and service.";

export const Route = createFileRoute("/about/history")({
  loader: async () => {
    const [page, counters] = await Promise.all([
      fetchPageBySlug({ data: "history" }),
      fetchPageCounters(),
    ]);
    return { page, counters };
  },
  component: HistoryPage,
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

function HistoryPage() {
  const { page, counters } = Route.useLoaderData();
  return (
    <>
      <CmsPage
        page={page}
        counters={counters}
        eyebrow="Our history"
        title="A story of faith, sacrifice, and service"
        intro="From the pioneering efforts of Christian medical practitioners in the early 20th century to a nationwide movement — the history of CMDA Nigeria spans more than five decades."
      >
        <HistoryTimeline />
      </CmsPage>
      <section className="px-6 py-20 text-center lg:px-10">
        <Link to="/about" className={cn(buttonVariants({ variant: "outline" }))}>
          Back to Who We Are
        </Link>
      </section>
    </>
  );
}
