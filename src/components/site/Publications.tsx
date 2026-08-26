import { Camera, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Reveal, Section, SectionHead } from "./primitives";
import { cn } from "@/lib/utils";

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

function Expandable({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className={cn(!open && "max-h-40 overflow-hidden relative")}>
        {children}
        {!open && (
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
        )}
      </div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-3 flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-deep"
        aria-expanded={open}
      >
        {open ? "Show less" : "Read more"}
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>
    </div>
  );
}

/* ─── Publications ─── */

const publications = [
  {
    title: "Wholeness Magazine",
    tag: "Students' Arm",
    desc: "A flagship publication of the Students' arm of CMDA Nigeria, containing news and reports from across various chapters, future plans and targets, and enriching articles targeted at addressing common challenges encountered by Christian medical and dental students in their training.",
    placeholder: "Wholeness Magazine cover",
  },
  {
    title: "Touch Magazine",
    tag: "Doctors' Arm",
    desc: "An annual publication of the Doctors' arm of CMDA Nigeria, containing news and reports from across various chapters within the nation, future plans and targets of the organisation, and enriching articles targeted at addressing common challenges encountered by Christian medics in their practice.",
    placeholder: "Touch Magazine cover",
  },
  {
    title: "Missions Exploits",
    tag: "Students' Arm",
    desc: "An annual publication documenting and celebrating the missions activities and experiences of the Association's student members. It captures the impact of mission outreaches, highlights testimonies and lessons from the field, and shares stories of service, faith, and transformation.",
    placeholder: "Missions Exploits cover",
  },
  {
    title: "Wholeness Journal",
    tag: "Students' Arm",
    desc: "An annual academic and devotional journal for medical and dental students, featuring peer-reviewed articles, reflections, and reports from chapters across Nigeria.",
    placeholder: "Wholeness Journal cover",
  },
  {
    title: "Chapter Newsletters",
    tag: "Various Chapters",
    desc: "Regular newsletters produced by local CMDA chapters across universities and hospitals, sharing fellowship updates, testimonies, event reports and prayer points.",
    placeholder: "Chapter newsletter",
  },
  {
    title: "Multiply",
    tag: "Book",
    desc: "An 86-page book by Prof. Chima Onoka offering a fresh and thought-provoking perspective on Christian medical mission. It explores the place of personal, God-given vision within CMDA, the relevance of individual calling, the challenge of mission fatigue, and the broader meaning of mission beyond traditional rural outreaches.",
    placeholder: "Multiply book cover",
  },
  {
    title: "Logo Exploration Manual",
    tag: "Training Manual",
    desc: "A training manual aimed at exposing medical and dental students, as well as doctors and dentists, to the essential tools for caring for the whole man. It provides a foundation for understanding the vision of CMDA Nigeria and highlights the core precepts and philosophies for effective practice of the vision.",
    placeholder: "Logo Exploration Manual cover",
  },
];

/* ─── Ministries / Programs ─── */

const ministries = [
  {
    title: "IfEHL",
    full: "Institute for Excellence in Healthcare and Leadership",
    desc: "The leadership development arm of CMDA Nigeria, established to raise healthcare professionals who lead with compassion, competence, and character.",
  },
  {
    title: "IMM",
    full: "Institute of Medical Missions",
    desc: "The missions training and mobilisation arm of CMDA Nigeria, dedicated to raising Christian healthcare professionals who advance God's Kingdom through medical missions.",
  },
  {
    title: "Wholeness Missions",
    full: "Wholeness Missions",
    desc: "Whole-person care projects addressing body, mind and spirit in communities across Nigeria through medical outreaches, health education and Gospel outreach.",
  },
  {
    title: "EXCEL",
    full: "EXCEL",
    desc: "The academic and professional development ministry of CMDA Nigeria, committed to helping Christian medical and dental students and practitioners achieve excellence in learning, practice, and service.",
  },
  {
    title: "The Lady Doctor",
    full: "The Lady Doctor",
    desc: "A platform addressing key aspects of the life and journey of female medical professionals and students, including spiritual and holistic growth, career, leadership, family and ministry.",
  },
  {
    title: "Saline Training",
    full: "Saline Training",
    desc: "Practical clinical skills training programme equipping students and young doctors with hands-on competencies for compassionate, whole-person patient care.",
  },
];

/* ─── Media / Resources ─── */

const media = [
  {
    title: "Starting Strong 1 & 2",
    desc: "Foundation resources equipping new members and fresh graduates with the spiritual, professional and personal anchors they need to thrive from day one.",
  },
  {
    title: "Spotlight",
    desc: "A regular feature highlighting individuals, chapters and projects making an impact across CMDA Nigeria — celebrating faith in action.",
  },
  {
    title: "Monthly Webinars",
    desc: "Online learning sessions covering clinical topics, leadership, missions and faith integration, open to all CMDA members and guests.",
  },
  {
    title: "The Prescription",
    desc: "A devotional and reflection resource connecting Scripture to the daily realities of healthcare practice, offered to members for spiritual nourishment.",
  },
  {
    title: "CMDA Podcast",
    desc: "Conversations, testimonies and teaching from CMDA Nigeria leaders, alumni and guests — available on popular podcast platforms.",
    tag: "Coming soon",
  },
];

/* ─── National Conferences ─── */

const conferences = [
  {
    title: "National Conference — Students",
    desc: "The annual gathering of CMDA student members from across Nigeria for worship, teaching, fellowship, missions deployment and leadership equipping.",
  },
  {
    title: "National Zonal Conference — Doctors",
    desc: "Regional conferences bringing together doctors and dentists for professional development, continuing medical education, fellowship and strategic planning.",
  },
  {
    title: "Zonal Prayer & Missions Conference — Students",
    desc: "Intense prayer and missions-focused conferences at the zonal level, preparing student members for deployment to underserved communities.",
  },
  {
    title: "Joint Conference",
    desc: "A combined gathering of the Doctors' and Students' arms for unified worship, vision-setting, training and cross-generational mentorship.",
  },
];

/* ─── Leadership Development ─── */

const leadership = [
  {
    title: "Cluster Levites Training",
    desc: "A leadership formation programme for emerging student leaders, equipping them with spiritual depth, organisational skills and a servant-leadership mindset.",
  },
  {
    title: "NEC Retreat",
    desc: "An annual retreat for the National Executive Council — a time of prayer, strategic reflection, team-building and alignment for the year ahead.",
  },
];

/* ─── Awards ─── */

const awards = [
  {
    title: "The Chima Onoka Award",
    desc: "Recognises outstanding academic achievement by a CMDA member, honouring the legacy of Prof. Chima Onoka and his commitment to excellence in medical practice and scholarship.",
  },
  {
    title: "Emmanuel T. Alagoa Excellence in Writing Award",
    desc: "Recognises exceptional writing skill among CMDA members, encouraging clear communication of faith, science and professional insight.",
  },
  {
    title: "Other Awards",
    desc: "Various awards presented at national conferences recognising chapter excellence, mission impact, leadership service and lifetime contribution to the fellowship.",
  },
];

/* ─── Other ─── */

const other = [
  {
    title: "Wholeness House / Secretariat Story",
    desc: "The story of CMDA Nigeria's national headquarters — from vision to reality — and its role as the administrative and spiritual nerve centre of the fellowship.",
  },
  {
    title: "CMDA Nigeria Elders",
    desc: "Honouring the founding fathers and senior members whose vision, sacrifice and faithfulness built the foundation upon which the fellowship stands.",
  },
  {
    title: "Logo Exploration",
    desc: "A visual journey through the evolution of CMDA Nigeria's identity — the meanings, stories and values embedded in the association's emblem.",
  },
];

/* ─── Section Renderer ─── */

function CategorySection({
  id,
  eyebrow,
  title,
  items,
  tone = "light",
}: {
  id: string;
  eyebrow: string;
  title: string;
  items: { title: string; desc: string; full?: string; tag?: string }[];
  tone?: "light" | "dark";
}) {
  return (
    <Section id={id} className={tone === "dark" ? "bg-muted" : "paper"}>
      <SectionHead
        eyebrow={eyebrow}
        title={title}
      />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Reveal key={item.title}>
            <div className="border border-border bg-background p-6 transition-shadow hover:shadow-card h-full">
              {item.tag && (
                <span className="mb-3 inline-block border border-gold/30 bg-gold/5 px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-wide uppercase text-gold">
                  {item.tag}
                </span>
              )}
              <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                {item.title}
              </h3>
              {item.full && item.full !== item.title && (
                <p className="mt-1 text-xs font-medium text-primary">{item.full}</p>
              )}
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ─── Main Export ─── */

export function PublicationsList() {
  return (
    <Section id="publications" className="paper">
      <SectionHead
        eyebrow="Publications"
        title="Voices of the fellowship"
        intro="Magazines, journals and newsletters keeping CMDA Nigeria's doctors and students informed, encouraged, and equipped."
      />
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {publications.map((item) => (
          <Reveal key={item.title}>
            <div className="card-editorial flex h-full flex-col">
              <ImagePlaceholder label={item.placeholder} />
              <div className="flex flex-1 flex-col p-6">
                <span className="eyebrow text-gold">{item.tag}</span>
                <h3 className="mt-3 font-display text-lg font-bold">{item.title}</h3>
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
        title="Institutions and programmes built for lasting impact"
        items={ministries}
      />
      <CategorySection
        id="media-resources"
        eyebrow="Media / Resources"
        title="Tools for growth, learning and spiritual nourishment"
        items={media}
        tone="dark"
      />
      <CategorySection
        id="national-conferences"
        eyebrow="National Conferences"
        title="Gathering the fellowship for worship, training and vision"
        items={conferences}
      />
      <CategorySection
        id="leadership-development"
        eyebrow="Leadership Development"
        title="Forming the next generation of servant-leaders"
        items={leadership}
        tone="dark"
      />
      <CategorySection
        id="awards"
        eyebrow="Awards & Recognition"
        title="Celebrating excellence, faithfulness and impact"
        items={awards}
      />
      <CategorySection
        id="other"
        eyebrow="Other"
        title="Stories, people and identity"
        items={other}
        tone="dark"
      />
    </>
  );
}
