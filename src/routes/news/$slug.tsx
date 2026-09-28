import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, CalendarDays } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { Reveal, Section, buttonVariants } from "@/components/site/primitives";
import { PortableContent } from "@/components/site/portable";
import { formatDate, kindLabel } from "@/components/site/org/cards";
import { fetchPost } from "@/sanity/data";
import { cn } from "@/lib/utils";

const siteTitle = "News | CMDA Nigeria";
const siteDescription = "Stories, press releases and public statements from CMDA Nigeria.";

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ params }) => ({ post: await fetchPost({ data: params.slug }) }),
  component: NewsDetailPage,
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    const title = post ? `${post.title} | CMDA Nigeria News` : siteTitle;
    const description = post?.excerpt ?? siteDescription;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
});

function NewsDetailPage() {
  const { post } = Route.useLoaderData();

  if (!post) {
    return (
      <>
        <PageHero
          eyebrow="News"
          title="News item not found"
          intro="This story may have been unpublished or the address may be incorrect."
        />
        <Section className="paper">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Link to="/news" className={cn(buttonVariants({ variant: "primary" }))}>
              Back to all news
            </Link>
          </Reveal>
        </Section>
      </>
    );
  }

  const date = formatDate(post.publishedAt);
  const coverUrl = post.cover?.asset?.url;
  const hasBody = Boolean(post.body?.length);

  return (
    <>
      <PageHero
        eyebrow={kindLabel(post.kind)}
        title={post.title}
        intro={post.excerpt ?? "News from the CMDA Nigeria newsroom."}
      />
      <Section className="paper">
        <article className="mx-auto max-w-3xl">
          <Reveal>
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cmda-green hover:text-cmda-green-deep"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              All news
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border pb-6 text-sm text-muted-foreground">
              {date ? (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {date}
                </span>
              ) : null}
              {post.category ? (
                <span className="eyebrow text-cmda-green">{post.category}</span>
              ) : null}
              {post.author?.name ? <span>By {post.author.name}</span> : null}
            </div>

            {coverUrl ? (
              <img
                src={coverUrl}
                alt={post.cover?.alt ?? post.title}
                className="mt-8 aspect-video w-full border border-border object-cover"
              />
            ) : null}

            <div className="mt-8 text-base leading-relaxed text-foreground">
              {hasBody ? (
                <PortableContent value={post.body} />
              ) : (
                <p className="text-muted-foreground">
                  {post.excerpt ?? "This item points to coverage published elsewhere."}
                </p>
              )}
            </div>

            {post.link ? (
              <div className="mt-10 border-t border-border pt-6">
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                  {hasBody ? "Originally published elsewhere" : "Read the full story"}
                </a>
              </div>
            ) : null}

            {post.tags?.length ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </Reveal>
        </article>
      </Section>
    </>
  );
}
