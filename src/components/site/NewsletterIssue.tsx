import { useEffect, useState } from "react";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { ArrowUpRight, CalendarDays, Clock, Download, Mail, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { opensInNewTab, safeHref } from "@/lib/safe-href";
import {
  asRecord,
  formatIssueMonth,
  prepareNewsletterBody,
  readingMinutes,
} from "@/lib/newsletter";
import { buttonVariants } from "./primitives";

export interface NewsletterIssueData {
  title: string;
  slug?: string | null | undefined;
  issueNumber?: number | null | undefined;
  issueDate?: string | null | undefined;
  author?: string | null | undefined;
  summary?: string | null | undefined;
  coverUrl?: string | null | undefined;
  coverAlt?: string | null | undefined;
  body?: unknown[] | null | undefined;
  downloadUrl?: string | null | undefined;
  external?: boolean | undefined;
}

const sectionId = (value: unknown): string | undefined => {
  const block = asRecord(value);
  const id = block?.["_sectionId"];
  return typeof id === "string" ? id : undefined;
};

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-6 text-[1.0625rem] leading-[1.9] text-foreground/85 first:mt-0">
        {children}
      </p>
    ),
    h2: ({ children, value }) => (
      <h2
        id={sectionId(value)}
        className="mt-14 scroll-mt-28 border-t border-border pt-8 font-display text-2xl font-extrabold tracking-tight text-foreground lg:text-[1.85rem]"
      >
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3
        id={sectionId(value)}
        className="mt-10 scroll-mt-28 font-display text-lg font-bold tracking-tight text-foreground lg:text-xl"
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-8 font-display text-base font-bold tracking-tight text-foreground">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-10 border-l-2 border-gold pl-6 font-display text-xl leading-snug font-semibold text-primary-deep lg:text-2xl">
        {children}
      </blockquote>
    ),
    callout: ({ children }) => (
      <aside className="my-10 border border-cmda-green/25 bg-cmda-green/[0.06] px-6 py-5">
        <p className="eyebrow text-cmda-green">Note</p>
        <div className="mt-2 text-[1rem] leading-relaxed text-foreground/85">{children}</div>
      </aside>
    ),
    divider: () => (
      <hr className="my-12 h-px border-0 bg-gradient-to-r from-transparent via-gold to-transparent" />
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-6 space-y-3 pl-1 marker:text-gold">{children}</ul>,
    number: ({ children }) => (
      <ol className="mt-6 list-decimal space-y-3 pl-6 marker:font-semibold marker:text-cmda-green">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex gap-3 text-[1.0625rem] leading-[1.75] text-foreground/85">
        <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-cmda-green" />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href = safeHref(value?.href);
      if (!href) return <>{children}</>;
      return (
        <a
          href={href}
          target={opensInNewTab(href) ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="font-semibold text-cmda-green underline decoration-gold/60 underline-offset-4 hover:text-cmda-green-deep"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const image = asRecord(value);
      const asset = image ? asRecord(image["asset"]) : null;
      const url = asset && typeof asset["url"] === "string" ? asset["url"] : null;
      if (!url) return null;
      const alt = image && typeof image["alt"] === "string" ? image["alt"] : "";
      const caption = image && typeof image["caption"] === "string" ? image["caption"] : "";
      return (
        <figure className="my-10">
          <img
            src={url}
            alt={alt}
            loading="lazy"
            className="w-full border border-border object-cover"
          />
          {caption ? (
            <figcaption className="mt-3 border-l border-gold pl-3 text-xs leading-relaxed text-muted-foreground">
              {caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

function ShareLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-cmda-green hover:text-cmda-green"
    >
      {label}
    </a>
  );
}

export function NewsletterIssue({
  issue,
  shareUrl,
  subscribeHref = "/contact",
}: {
  issue: NewsletterIssueData;
  shareUrl?: string | undefined;
  subscribeHref?: string;
}) {
  const date = formatIssueMonth(issue.issueDate);
  const { body, headings } = prepareNewsletterBody(issue.body);
  const minutes = readingMinutes(body);
  const issueLabel = issue.issueNumber ? `Issue #${issue.issueNumber}` : "Newsletter";
  // Share links point at the live page once it has hydrated; static rendering
  // has no location, so the block is simply hidden until then.
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    if (shareUrl === undefined) setOrigin(window.location.href);
  }, [shareUrl]);
  const share = shareUrl ?? origin;
  const encoded = encodeURIComponent(share);

  return (
    <article className="pt-24">
      {/* Masthead */}
      <header className="border-b border-primary-deep bg-primary-deep text-primary-foreground">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4 lg:px-10">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <a
              href="/publications"
              className="font-display text-base font-extrabold tracking-[0.22em] uppercase text-primary-foreground transition-colors hover:text-gold"
            >
              Prescription
            </a>
            <span className="text-[10px] tracking-[0.2em] uppercase text-primary-foreground/55">
              The monthly newsletter of CMDA Nigeria
            </span>
          </div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-gold">
            {issueLabel}
            {date ? ` · ${date}` : ""}
          </p>
        </div>
      </header>

      <div className="px-6 py-14 lg:px-10 lg:py-20">
        <div className="mx-auto w-full max-w-6xl">
          {/* Issue header */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-gold" aria-hidden="true" />
              <p className="eyebrow text-cmda-green">
                {date ? `${date} · ${issueLabel}` : issueLabel}
              </p>
              <span className="h-px w-10 bg-gold" aria-hidden="true" />
            </div>
            <h1 className="display-1 mt-6 text-balance text-4xl lg:text-[3.75rem] lg:leading-[1.02]">
              {issue.title}
            </h1>
            {issue.summary ? (
              <p className="lede mx-auto mt-6 max-w-2xl text-balance text-muted-foreground">
                {issue.summary}
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs tracking-wide text-muted-foreground">
              {issue.author ? (
                <span className="inline-flex items-center gap-2">
                  <User className="size-3.5 text-cmda-green" aria-hidden="true" />
                  {issue.author}
                </span>
              ) : null}
              {date ? (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="size-3.5 text-cmda-green" aria-hidden="true" />
                  {date}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-2">
                <Clock className="size-3.5 text-cmda-green" aria-hidden="true" />
                {minutes} min read
              </span>
            </div>
          </div>

          {/* Cover */}
          {issue.coverUrl ? (
            <figure className="mx-auto mt-12 max-w-5xl">
              <div className="framed">
                <img
                  src={issue.coverUrl}
                  alt={issue.coverAlt ?? issue.title}
                  className="aspect-[16/9] w-full object-cover object-center"
                />
              </div>
            </figure>
          ) : null}

          {/* Body + contents */}
          <div className="mx-auto mt-14 grid max-w-5xl gap-12 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16">
            <div className="min-w-0">
              {body.length > 0 ? (
                <PortableText
                  value={body as Parameters<typeof PortableText>[0]["value"]}
                  components={components}
                />
              ) : (
                <p className="text-muted-foreground">
                  {issue.summary ??
                    "The full text of this issue has not been published yet. Check back soon."}
                </p>
              )}

              {issue.downloadUrl ? (
                <div className="mt-12 border-t border-border pt-6">
                  <a
                    href={issue.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    {issue.external ? (
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    ) : (
                      <Download className="size-4" aria-hidden="true" />
                    )}
                    {issue.external ? "Read this issue elsewhere" : "Download this issue"}
                  </a>
                </div>
              ) : null}
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-10">
                {headings.length > 0 ? (
                  <nav aria-label="In this issue">
                    <p className="eyebrow text-cmda-green">In this issue</p>
                    <ol className="mt-4 space-y-3 border-t border-border pt-4">
                      {headings.map((heading, index) => (
                        <li key={heading.id} className={heading.level === 3 ? "pl-4" : undefined}>
                          <a
                            href={`#${heading.id}`}
                            className="flex gap-3 text-sm leading-snug text-foreground/75 transition-colors hover:text-cmda-green"
                          >
                            <span className="font-display text-[10px] font-bold tracking-wider text-gold">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span>{heading.text}</span>
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                ) : null}

                {share ? (
                  <div>
                    <p className="eyebrow text-cmda-green">Share this issue</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <ShareLink href={`https://wa.me/?text=${encoded}`} label="WhatsApp" />
                      <ShareLink href={`https://x.com/intent/tweet?url=${encoded}`} label="X" />
                    </div>
                  </div>
                ) : null}
              </div>
            </aside>
          </div>

          {/* Subscribe */}
          <div className="mx-auto mt-16 max-w-5xl bg-primary-deep px-8 py-10 text-primary-foreground lg:px-12">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <p className="eyebrow text-gold">Never miss an issue</p>
                <p className="mt-3 max-w-xl font-display text-xl font-bold tracking-tight lg:text-2xl">
                  The Prescription arrives every month — devotion, reports and news from across the
                  fellowship.
                </p>
              </div>
              <a
                href={subscribeHref}
                className={cn(buttonVariants({ variant: "gold" }), "shrink-0")}
              >
                <Mail className="size-4" aria-hidden="true" />
                Subscribe
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
