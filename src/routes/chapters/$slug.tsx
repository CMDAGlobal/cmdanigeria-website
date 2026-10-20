import { createFileRoute, notFound } from "@tanstack/react-router";
import { ChapterNotFound, ChapterPage } from "@/components/site/org/ChapterPage";
import { fetchChapter } from "@/sanity/data";

export const Route = createFileRoute("/chapters/$slug")({
  loader: async ({ params }) => {
    const chapter = await fetchChapter({ data: params.slug });
    if (!chapter) throw notFound();
    return { chapter };
  },
  component: ChapterRoute,
  notFoundComponent: ChapterNotFound,
  head: ({ loaderData }) => {
    const chapter = loaderData?.chapter;
    const title = chapter ? `${chapter.name} | CMDA Nigeria` : "Chapter | CMDA Nigeria";
    const description =
      chapter?.institution ??
      "A chapter of the CMDA Nigeria fellowship — leadership, activities, events and gallery.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
});

function ChapterRoute() {
  const { chapter } = Route.useLoaderData();
  return <ChapterPage chapter={chapter} />;
}
