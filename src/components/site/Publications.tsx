import { Camera } from "lucide-react";
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

/* ─── 1. Publications ─── */

const publications = [
  {
    title: "Wholeness Magazine",
    desc: "A flagship publication of the Students' arm of CMDA Nigeria, containing news, reports, enriching articles and future plans targeted at Christian medical and dental students in their training.",
    placeholder: "Wholeness Magazine cover",
  },
  {
    title: "Touch Magazine",
    desc: "An annual publication of the Doctors' arm of CMDA Nigeria, containing news and reports from across various chapters, future plans, and enriching articles addressing challenges encountered by Christian medics in practice.",
    placeholder: "Touch Magazine cover",
  },
  {
    title: "Missions Exploits",
    desc: "An annual publication documenting and celebrating the missions activities and experiences of student members. It captures the impact of outreaches, highlights testimonies and shares stories of service, faith, and transformation.",
    placeholder: "Missions Exploits cover",
  },
  {
    title: "Wholeness Journal",
    desc: "An annual academic and devotional journal for medical and dental students, featuring peer-reviewed articles, reflections, and reports from chapters across Nigeria.",
    placeholder: "Wholeness Journal cover",
  },
  {
    title: "Chapter Newsletters",
    desc: "Regular newsletters produced by local CMDA chapters across universities and hospitals, sharing fellowship updates, testimonies, event reports and prayer points.",
    placeholder: "Chapter newsletter",
  },
];

/* ─── 2. Ministries / Programs ─── */

const ministries = [
  { title: "IfEHL", full: "Institute for Excellence in Healthcare and Leadership" },
  { title: "IMM", full: "Institute of Medical Missions" },
  { title: "Wholeness Missions", full: "Whole-person care projects addressing body, mind and spirit in communities" },
  { title: "EXCEL", full: "Academic and professional development ministry" },
  { title: "The Lady Doctor", full: "Platform for female medical professionals and students" },
  { title: "Saline Training", full: "Practical clinical skills training programme" },
];

/* ─── 3. Media / Resources ─── */

const media = [
  { title: "Starting Strong 1 & 2", desc: "Foundation resources equipping new members and fresh graduates with the spiritual, professional and personal anchors they need from day one." },
  { title: "Spotlight", desc: "A regular feature highlighting individuals, chapters and projects making an impact across CMDA Nigeria." },
  { title: "Monthly Webinars", desc: "Online learning sessions covering clinical topics, leadership, missions and faith integration." },
  { title: "The Prescription", desc: "A devotional resource connecting Scripture to the daily realities of healthcare practice." },
  { title: "CMDA Podcast", desc: "Conversations, testimonies and teaching from CMDA Nigeria leaders, alumni and guests." },
];

/* ─── 4. National Conferences ─── */

const conferences = [
  { title: "National Conference — Students", desc: "Annual gathering of CMDA student members for worship, teaching, fellowship, missions deployment and leadership equipping." },
  { title: "National Zonal Conference — Doctors", desc: "Regional conferences for doctors and dentists — professional development, CME, fellowship and strategic planning." },
  { title: "Zonal Prayer & Missions Conference — Students", desc: "Intense prayer and missions-focused conferences at the zonal level, preparing students for deployment." },
  { title: "Joint Conference", desc: "Combined gathering of the Doctors' and Students' arms for unified worship, vision-setting and cross-generational mentorship." },
];

/* ─── 5. Leadership Development ─── */

const leadership = [
  { title: "Cluster Levites Training", desc: "Leadership formation programme for emerging student leaders — spiritual depth, organisational skills and servant-leadership." },
  { title: "NEC Retreat", desc: "Annual retreat for the National Executive Council — prayer, strategic reflection, team-building and alignment." },
];

/* ─── 6. Awards & Recognition ─── */

const awards = [
  { title: "The Chima Onoka Award", desc: "Recognises outstanding academic achievement by a CMDA member, honouring the legacy of Prof. Chima Onoka." },
  { title: "Emmanuel T. Alagoa Excellence in Writing Award", desc: "Recognises exceptional writing skill among CMDA members, encouraging clear communication of faith, science and professional insight." },
  { title: "Other Awards", desc: "Various awards presented at national conferences recognising chapter excellence, mission impact, leadership service and lifetime contribution." },
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
              {item.full && (
                <p className="mt-1 text-xs font-medium text-primary">{item.full}</p>
              )}
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

export function PublicationsList() {
  return (
    <Section id="publications" className="paper">
      <SectionHead
        eyebrow="Publications"
        title="Voices of the fellowship"
        intro="Magazines, journals and newsletters keeping CMDA Nigeria's doctors and students informed, encouraged, and equipped."
      />
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {publications.map((item) => (
          <Reveal key={item.title}>
            <div className="card-editorial flex h-full flex-col">
              <ImagePlaceholder label={item.placeholder} />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
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
