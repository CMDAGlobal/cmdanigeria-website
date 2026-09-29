import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, CalendarDays, Download, User } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { PortableContent } from "@/components/site/portable";
import { Reveal, Section, buttonVariants } from "@/components/site/primitives";
import { fetchPrescription } from "@/sanity/data";
import { cn } from "@/lib/utils";

const siteTitle = "Publications | CMDA Nigeria";
const siteDescription = "Magazines, journals, newsletters and reports from CMDA Nigeria.";

const KIND_LABELS: Record<string, string> = {
  prescription: "Prescription",
  newsletter: "Newsletter",
  journal: "Journal",
  book: "Book",
};

function formatIssueDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
}

export const Route = createFileRoute("/publications/$slug")({
  loader: async ({ params }) => ({ issue: await fetchPrescription({ data: params.slug }) }),
  component: PublicationDetailPage,
  head: ({ loaderData }) => {
    const issue = loaderData?.issue;
    const title = issue ? `${issue.title} | CMDA Nigeria` : siteTitle;
    const description = issue?.summary ?? siteDescription;
    const image = issue?.cover?.asset?.url;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        ...(image ? [{ property: "og:image", content: image }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
});

function PublicationDetailPage() {
  const { issue } = Route.useLoaderData();

  if (!issue) {
    return (
      <>
        <PageHero
          eyebrow="Publications"
          title="Issue not found"
          intro="This issue may have been unpublished, or the address may be incorrect."
        />
        <Section className="paper">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Link to="/publications" className={cn(buttonVariants({ variant: "primary" }))}>
              Back to all publications
            </Link>
          </Reveal>
        </Section>
      </>
    );
  }

  const kind = KIND_LABELS[issue.kind ?? ""] ?? "Publication";
  const date = formatIssueDate(issue.issueDate);
  const coverUrl = issue.cover?.asset?.url;
  const hasBody = Boolean(issue.body?.length);
  const issueLabel = issue.issueNumber ? `${kind} #${issue.issueNumber}` : kind;
  // `downloadUrl` is the external reading link when present, otherwise the
  // uploaded file — so the card and the detail page can share one field.
  const external = issue.url;

  return (
    <>
      <PageHero
        eyebrow={issueLabel}
        title={issue.title}
        intro={issue.summary ?? `Read the latest from CMDA Nigeria.`}
      />
      <Section className="paper">
        <article className="mx-auto max-w-3xl">
          <Reveal>
            <Link
              to="/publications"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cmda-green hover:text-cmda-green-deep"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              All publications
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border pb-6 text-sm text-muted-foreground">
              {date ? (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {date}
                </span>
              ) : null}
              {issue.author ? (
                <span className="inline-flex items-center gap-2">
                  <User className="size-4" aria-hidden="true" />
                  {issue.author}
                </span>
              ) : null}
            </div>

            {coverUrl ? (
              <img
                src={coverUrl}
                alt={issue.cover?.alt ?? issue.title}
                className="mt-8 max-h-[32rem] w-full border border-border object-cover"
              />
            ) : null}

            <div className="mt-8 text-base leading-relaxed text-foreground">
              {hasBody ? (
                <PortableContent value={issue.body} />
              ) : (
                <p className="text-muted-foreground">
                  {issue.summary ??
                    "The full text of this issue has not been published yet. Check back soon."}
                </p>
              )}
            </div>

            {issue.downloadUrl ? (
              <div className="mt-10 border-t border-border pt-6">
                <a
                  href={issue.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  {external ? (
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  ) : (
                    <Download className="size-4" aria-hidden="true" />
                  )}
                  {external ? "Read this issue elsewhere" : "Download this issue"}
                </a>
              </div>
            ) : null}
          </Reveal>
        </article>
      </Section>
    </>
  );
}
