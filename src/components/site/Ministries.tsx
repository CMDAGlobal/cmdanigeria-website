import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { buttonVariants, Reveal, Section, SectionHead } from "./primitives";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────
 * Ministry data — the six ministry areas of CMDA Nigeria
 * ────────────────────────────────────────────── */

interface MinistryItem {
  short: string;
  name: string;
  desc: string;
  full: string;
  link: string;
  /** External "See more" target when the ministry has its own site. */
  external?: string;
  /** Optional ministry logo shown as a picture block on the full ministries page. */
  logo?: string;
}

const ministries: MinistryItem[] = [
  {
    short: "IfEHL",
    name: "Institute for Excellence in Healthcare and Leadership",
    desc: "The healthcare sector is a unique and essential contributor to the overall wellbeing of a country, given its focus on human lives.",
    full: `For individuals and families, their quality of life, productivity, and societal relevance rest significantly on the extent to which they have access to and can utilize holistic care.

To achieve holistic care, which is care for the body, soul and spirit, care providers must be knowledgeable, excellent, proficient, compassionate and productive.

Those who shape or lead the sector at any level must be skilled enough to efficiently and effectively manage human, financial and material resources, to make meaningful contributions to individual and population health improvement.

They must also have passion and commitment to ensure fairness and accountability.`,
    link: "/ministries/ifehl",
    external: "https://ifehl.org",
    logo: "/logos/ifehl.png",
  },
  {
    short: "IMM",
    name: "Institute of Medical Missions",
    desc: "IMM was established in 2006 to mobilize, train, and mentor doctors, medical students and health workers to understand, support and commit themselves to missions work across various platforms within and beyond Nigeria.",
    full: `The training opportunities offered by the Institute are implemented using an interactive adult learning approach (andragogy). Participants are exposed to highly engaging faculty members who have practical life experiences in missions.

The Foundation Course in Medical Missions which last one week is formational, and goes beyond the traditional approaches of merely disseminating information and imparting knowledge.`,
    link: "/ministries/imm",
    external: "https://immafrica.com",
    logo: "/logos/imm.png",
  },
  {
    short: "Wholeness Missions",
    name: "Wholeness Missions Outreach",
    desc: "Wholeness Missions is the mission arm of CMDA Nigeria through which members, partners, and collaborators provide health, healing, and support to individuals, households, and communities within and outside Nigeria.",
    full: `This is achieved through the mission's outreaches, missions awareness, resources, and in-reaches to members, in line with CMDA Nigeria's vision of caring for the whole man: spirit, soul, and body.

Missions in CMDA Nigeria is as old as the organization — from its inception under the leadership of the Late Sir, Dr. Eze Akanu Ibiam, members were constantly mobilized for outreaches. The term 'Wholeness Missions' was adopted for all mission activities of CMDA Nigeria in 2018.`,
    link: "/ministries/wholeness-missions",
    external: "https://cmdanigeria.org/what-we-do/wholeness-missions/",
    logo: "/logos/wholeness-missions-outreach.png",
  },
  {
    short: "Starting Strong",
    name: "Starting Strong",
    desc: "A monthly mentorship and capacity-building program equipping young doctors with the knowledge, skills, and insights they need to navigate their careers successfully.",
    full: `Our mission is to expose early-career medical professionals to a wide range of career pathways, helping them navigate their professional journeys with clarity and confidence. Each session features seasoned professionals sharing practical guidance on diverse career pathways, financial literacy, work-life balance, and more.

Starting Strong is more than a program — it is a movement raising a generation of doctors who are spiritually strong, professionally excellent, financially stable, and committed to making a difference in every community they serve.`,
    link: "/ministries/starting-strong",
  },
  {
    short: "EXCEL",
    name: "EXCEL",
    desc: "The academic and professional development ministry of CMDA Nigeria, committed to helping Christian medical and dental students and practitioners achieve excellence in learning, practice, and service.",
    full: `Through academic support, clinical mentorship, peer learning, and leadership development, EXCEL equips members to grow in competence, character, and Christ-centred professionalism.

Its programmes include the EXCEL Programme for Students, Whole Person Medicine Training, Continuing Medical Education (CME), The Good Teacher, Developing Health Course, and the Publications & Library. Together, these initiatives promote academic excellence, patient-centred care, values-based teaching, lifelong learning, and access to quality educational resources.

Through EXCEL, CMDA Nigeria is raising healthcare professionals who are academically sound, professionally competent, and equipped to serve God and humanity with excellence.`,
    link: "/ministries/excel",
    logo: "/logos/excel.png",
  },
  {
    short: "Lady Doctors & Students",
    name: "Lady Doctors & Students",
    desc: "The CMDA-Lady Doctors/Students (CMDA-LD/LS) community is an off-shoot of CMDA Nigeria. Our vision is to empower godly women of global impact and influence to transform the health sector.",
    full: `The core mandates of our mission are: 1) Empowering women in the health sector to maximize their talents for the glory of Jesus. 2) Fostering a community of godly ladies bonded by shared gospel values. 3) Transforming lives, societies, and communities through our skills and services.`,
    link: "/ministries/the-lady-doctor",
  },
];

/* ──────────────────────────────────────────────
 * Ministry row with expandable description
 * ────────────────────────────────────────────── */

function MinistryRow({ item, index }: { item: (typeof ministries)[number]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = item.full.length > 0;

  return (
    <Reveal delay={index * 60}>
      <div className="border-b border-border">
        <div className="group grid grid-cols-[auto_1fr_auto] items-start gap-6 py-8 transition-colors hover:bg-accent/50 sm:gap-10 sm:px-5">
          <span className="numeral shrink-0 pt-1 transition-colors group-hover:text-cmda-green group-hover:[-webkit-text-stroke:0]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <span className="eyebrow block text-cmda-green">{item.short}</span>
            <span className="mt-2 block font-display text-xl leading-snug font-bold sm:text-2xl">
              {item.name}
            </span>
            <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
              {item.desc}
            </span>
            {hasMore && expanded && (
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                {item.full.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {item.external ? (
              <a
                href={item.external}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-1 pt-1 text-sm font-semibold text-cmda-green transition-colors hover:text-cmda-green-deep"
              >
                See more
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            ) : item.link ? (
              <Link
                to={item.link}
                className="flex shrink-0 items-center gap-1 pt-1 text-sm font-semibold text-cmda-green transition-colors hover:text-cmda-green-deep"
              >
                Learn more
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            ) : null}
            {hasMore ? (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="flex shrink-0 items-center gap-1 pt-1 text-sm font-semibold text-primary transition-colors hover:text-primary-deep"
                aria-expanded={expanded}
              >
                {expanded ? "Less" : "More"}
                <ChevronDown
                  className={cn("size-4 transition-transform", expanded && "rotate-180")}
                  aria-hidden="true"
                />
              </button>
            ) : (
              <ArrowUpRight
                className="size-6 shrink-0 pt-1 text-primary transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ──────────────────────────────────────────────
 * Ministries list — used on homepage & /ministries
 * ────────────────────────────────────────────── */

export function Ministries() {
  return (
    <Section id="ministries" className="relative overflow-hidden">
      {/* Background image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.07]"
        style={{ backgroundImage: "url(/bg-3.webp)" }}
      />
      <SectionHead
        eyebrow="Featured ministries"
        title="Institutions built for lasting impact"
        action={
          <Link
            to="/ministries"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-cmda-green text-cmda-green hover:bg-cmda-green hover:text-white",
            )}
          >
            View all ministries
          </Link>
        }
      />

      <div className="mt-16 border-t border-border">
        {ministries.map((m, i) => (
          <MinistryRow key={m.short} item={m} index={i} />
        ))}
      </div>
    </Section>
  );
}

/* ──────────────────────────────────────────────
 * Full ministries page — detailed sections
 * ────────────────────────────────────────────── */

function MinistryDetail({ item, index }: { item: (typeof ministries)[number]; index: number }) {
  return (
    <Reveal>
      <div className="grid items-start gap-12 py-16 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div>
          <span className="numeral">{String(index + 1).padStart(2, "0")}</span>
          <span className="eyebrow mt-4 block text-cmda-green">{item.short}</span>
          <h3 className="mt-3 display-2 text-balance">{item.name}</h3>
          {item.logo ? (
            <div className="mt-6 flex h-24 w-full max-w-xs items-center rounded-lg border border-border bg-background p-5">
              <img
                src={item.logo}
                alt=""
                loading="lazy"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : null}
          {item.external ? (
            <a
              href={item.external}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-cmda-green transition-colors hover:text-cmda-green-deep"
            >
              See more
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          ) : item.link ? (
            <Link
              to={item.link}
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-cmda-green transition-colors hover:text-cmda-green-deep"
            >
              Learn more
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
        <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
          <p className="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-extrabold first-letter:text-primary">
            {item.desc}
          </p>
          {item.full.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export function MinistriesFull() {
  return (
    <Section id="ministries" className="paper">
      <SectionHead
        eyebrow="Our ministries"
        title="Six ministries carrying the mission forward"
        intro="IfEHL, IMM, Wholeness Missions Outreach, Starting Strong, EXCEL and Lady Doctors & Students — each sharpening a different edge of our calling."
      />
      <div className="mt-8 divide-y divide-border border-t border-border">
        {ministries.map((m, i) => (
          <MinistryDetail key={m.short} item={m} index={i} />
        ))}
      </div>
    </Section>
  );
}
