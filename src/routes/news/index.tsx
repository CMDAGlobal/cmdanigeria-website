import { createFileRoute } from "@tanstack/react-router";
import { Newspaper } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { Reveal, Section, SectionHead } from "@/components/site/primitives";
import { NewsCard } from "@/components/site/org/cards";
import { fetchPosts } from "@/sanity/data";

const title = "News | CMDA Nigeria";
const description =
  "Articles, press releases, public statements and media coverage from the CMDA Nigeria newsroom.";

export const Route = createFileRoute("/news/")({
  loader: async () => ({ posts: await fetchPosts() }),
  component: NewsPage,
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

function NewsPage() {
  const { posts } = Route.useLoaderData();
  return (
    <>
      <PageHero
        eyebrow="News"
        title="News from the fellowship"
        intro="Stories, press releases and public statements from CMDA Nigeria — reports from the field, updates from the national office and coverage from across the network."
      />
      <Section className="paper">
        <SectionHead
          eyebrow="Newsroom"
          title="The latest from CMDA Nigeria"
          intro="Everything published here appears first in the newsroom."
        />
        {posts.length > 0 ? (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <NewsCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <Reveal className="mt-16">
            <div className="border border-dashed border-border p-10 text-center">
              <Newspaper className="mx-auto mb-4 size-8 text-cmda-green" aria-hidden="true" />
              <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                No news published yet
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Articles, press releases and statements will appear here as they are published.
              </p>
            </div>
          </Reveal>
        )}
      </Section>
    </>
  );
}
