import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Camera, Download, FileText } from "lucide-react";
import type { PrescriptionRecord } from "@/sanity/types";
import { Reveal, Section, SectionHead } from "./primitives";

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="relative aspect-[3/4] w-full border-2 border-dashed border-gold/40 bg-gold/5">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gold/60">
        <Camera className="size-8" aria-hidden="true" />
        <span className="px-4 text-center text-xs font-semibold tracking-wide uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}

const KIND_LABELS: Record<string, string> = {
  prescription: "Prescription",
  newsletter: "Newsletter",
  journal: "Journal",
  book: "Book",
};

function issueLabel(issueDate: string | null | undefined): string {
  if (!issueDate) return "";
  const parsed = new Date(issueDate);
  if (Number.isNaN(parsed.getTime())) return issueDate;
  return parsed.toLocaleDateString("en-NG", { month: "long", year: "numeric" });
}

/* ─── 2. Ministries / Programs ─── */

const ministries = [
  { title: "IfEHL", full: "Institute for Excellence in Healthcare and Leadership" },
  { title: "IMM", full: "Institute of Medical Missions" },
  {
    title: "Wholeness Missions",
    full: "Whole-person care projects addressing body, mind and spirit in communities",
  },
  { title: "EXCEL", full: "Academic and professional development ministry" },
  { title: "The Lady Doctor", full: "Platform for female medical professionals and students" },
  { title: "Saline Training", full: "Practical clinical skills training programme" },
];

/* ─── 3. Media / Resources ─── */

const media = [
  {
    title: "Starting Strong 1 & 2",
    desc: "Foundation resources equipping new members and fresh graduates with the spiritual, professional and personal anchors they need from day one.",
  },
  {
    title: "Spotlight",
    desc: "A regular feature highlighting individuals, chapters and projects making an impact across CMDA Nigeria.",
  },
  {
    title: "Monthly Webinars",
    desc: "Online learning sessions covering clinical topics, leadership, missions and faith integration.",
  },
  {
    title: "The Prescription",
    desc: "A devotional resource connecting Scripture to the daily realities of healthcare practice.",
  },
  {
    title: "CMDA Podcast",
    desc: "Conversations, testimonies and teaching from CMDA Nigeria leaders, alumni and guests.",
  },
];

/* ─── 4. National Conferences ─── */

const conferences = [
  {
    title: "National Conference — Students",
    desc: "Annual gathering of CMDA student members for worship, teaching, fellowship, missions deployment and leadership equipping.",
  },
  {
    title: "National Zonal Conference — Doctors",
    desc: "Regional conferences for doctors and dentists — professional development, CME, fellowship and strategic planning.",
  },
  {
    title: "Zonal Prayer & Missions Conference — Students",
    desc: "Intense prayer and missions-focused conferences at the zonal level, preparing students for deployment.",
  },
  {
    title: "Joint Conference",
    desc: "Combined gathering of the Doctors' and Students' arms for unified worship, vision-setting and cross-generational mentorship.",
  },
];

/* ─── 5. Leadership Development ─── */

const leadership = [
  {
    title: "Cluster Levites Training",
    desc: "Leadership formation programme for emerging student leaders — spiritual depth, organisational skills and servant-leadership.",
  },
  {
    title: "NEC Retreat",
    desc: "Annual retreat for the National Executive Council — prayer, strategic reflection, team-building and alignment.",
  },
];

/* ─── 6. Awards & Recognition ─── */

const awards = [
  {
    title: "The Chima Onoka Award",
    desc: "Recognises outstanding academic achievement by a CMDA member, honouring the legacy of Prof. Chima Onoka.",
  },
  {
    title: "Emmanuel T. Alagoa Excellence in Writing Award",
    desc: "Recognises exceptional writing skill among CMDA members, encouraging clear communication of faith, science and professional insight.",
  },
  {
    title: "Other Awards",
    desc: "Various awards presented at national conferences recognising chapter excellence, mission impact, leadership service and lifetime contribution.",
  },
];

/* ─── Reusable category section ─── */

function CategorySection({
  id,
  eyebrow,
  title,
  items,
  withDesc = false,
  tone = "light",
}: {
  id: string;
  eyebrow: string;
  title: string;
  items: { title: string; desc?: string; full?: string }[];
  withDesc?: boolean;
  tone?: "light" | "dark";
}) {
  return (
    <Section id={id} className={tone === "dark" ? "bg-muted" : "paper"}>
      <SectionHead eyebrow={eyebrow} title={title} />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Reveal key={item.title}>
            <div className="border border-border bg-background p-6 transition-shadow hover:shadow-card h-full">
              <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                {item.title}
              </h3>
              {item.full && <p className="mt-1 text-xs font-medium text-primary">{item.full}</p>}
              {withDesc && item.desc && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ─── Main Exports ─── */

export function PublicationsList({ issues = [] }: { issues?: PrescriptionRecord[] }) {
  return (
    <Section id="publications" className="paper">
      <SectionHead
        eyebrow="Publications"
        title="Voices of the fellowship"
        intro="Magazines, journals and newsletters keeping CMDA Nigeria's doctors and students informed, encouraged, and equipped."
      />
      {issues.length > 0 ? (
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {issues.map((issue) => {
            const cover = issue.cover?.asset?.url;
            const kind = KIND_LABELS[issue.kind ?? ""] ?? "Publication";
            const issued = issueLabel(issue.issueDate);
            const heading = (
              <h3 className="mt-2 font-display text-lg font-bold">
                {issue.issueNumber ? `${issue.title} #${issue.issueNumber}` : issue.title}
              </h3>
            );
            const body = (
              <>
                <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                  {[kind, issued].filter(Boolean).join(" · ")}
                </p>
                <div className="mt-2">{heading}</div>
                {issue.summary && (
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {issue.summary}
                  </p>
                )}
              </>
            );
            return (
              <Reveal key={issue._id} className="h-full">
                <article className="card-editorial flex h-full flex-col">
                  {cover ? (
                    <img
                      src={cover}
                      alt={issue.cover?.alt ?? issue.title}
                      loading="lazy"
                      className="aspect-[3/4] w-full object-cover"
                    />
                  ) : (
                    <ImagePlaceholder label={`${kind} cover`} />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {issue.slug ? (
                      <Link
                        to="/publications/$slug"
                        params={{ slug: issue.slug }}
                        className="group flex flex-1 flex-col focus-visible:outline-none"
                      >
                        {body}
                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:underline">
                          {issue.hasBody ? "Read issue" : "View issue"}
                          <ArrowUpRight className="size-3.5" aria-hidden="true" />
                        </span>
                      </Link>
                    ) : (
                      body
                    )}
                    {issue.downloadUrl && !issue.hasBody ? (
                      <a
                        href={issue.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                      >
                        <Download className="size-4" aria-hidden="true" />
                        Download issue
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      ) : (
        <Reveal className="mt-16">
          <div className="border border-dashed border-border p-10 text-center">
            <FileText className="mx-auto mb-4 size-8 text-cmda-green" aria-hidden="true" />
            <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
              No issues published yet
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The Prescription newsletter and other publications will appear here as they are
              published.
            </p>
          </div>
        </Reveal>
      )}
    </Section>
  );
}

export function BooksAndReports() {
  return (
    <>
      <CategorySection
        id="ministries-programs"
        eyebrow="Ministries / Programs"
        title="Programmes built for lasting impact"
        items={ministries}
      />
      <CategorySection
        id="media-resources"
        eyebrow="Media / Resources"
        title="Tools for growth and learning"
        items={media}
        withDesc
        tone="dark"
      />
      <CategorySection
        id="national-conferences"
        eyebrow="National Conferences"
        title="Gathering the fellowship"
        items={conferences}
        withDesc
      />
      <CategorySection
        id="leadership-development"
        eyebrow="Leadership Development"
        title="Forming the next generation of leaders"
        items={leadership}
        withDesc
        tone="dark"
      />
      <CategorySection
        id="awards"
        eyebrow="Awards & Recognition"
        title="Celebrating excellence and impact"
        items={awards}
        withDesc
      />
    </>
  );
}
