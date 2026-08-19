import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { buttonVariants, Reveal, Section, SectionHead } from "./primitives";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────
 * Ministry data
 * ────────────────────────────────────────────── */

const trainingArms = [
  {
    short: "IfEHL",
    name: "Institute for Excellence in Healthcare and Leadership",
    desc: "The leadership development arm of CMDA Nigeria, established to raise healthcare professionals who lead with compassion, competence, and character.",
    full: `Conceived in 2015 and launched in 2018, IfEHL was founded in response to the growing need for purposeful, ethical, and transformational leadership within Nigeria's healthcare system and beyond. Through values-driven training, mentorship, research, and strategic collaboration, the Institute equips healthcare professionals to provide excellent care, influence health systems, and drive sustainable change.

Since its inception, IfEHL has trained and mentored over 350 healthcare professionals through its Basic and Advanced leadership programmes, with alumni serving and making an impact across hospitals, academia, public health, policy, and global health institutions in Nigeria and around the world.

At IfEHL, we believe that transforming healthcare begins with transforming the healthcare professional. We are committed to building a global community of leaders who view healthcare not just as a profession, but as a calling to serve, lead, and shape the future of healthcare with excellence and integrity.`,
  },
  {
    short: "IMM",
    name: "Institute of Medical Missions",
    desc: "The missions training and mobilisation arm of CMDA Nigeria, dedicated to raising Christian healthcare professionals who advance God's Kingdom through medical missions.",
    full: `Established in 2006, following a vision to rekindle the missionary passion among Christian health professionals, IMM equips doctors, dentists, nurses, pharmacists, and other healthcare workers to integrate faith with professional practice and serve communities with compassion, excellence, and the love of Christ.

Through mission-focused training, mentorship, research, and strategic partnerships, IMM prepares healthcare professionals for impactful service in Nigeria and across the world. More than a training institute, IMM is a growing movement committed to building a generation of disciple-makers who see healthcare as a platform for fulfilling the Great Commission and transforming lives through holistic, Christ-centred care.`,
  },
  {
    short: "EXCEL",
    name: "EXCEL",
    desc: "The academic and professional development ministry of CMDA Nigeria, committed to helping Christian medical and dental students and practitioners achieve excellence in learning, practice, and service.",
    full: `Through academic support, clinical mentorship, peer learning, and leadership development, EXCEL equips members to grow in competence, character, and Christ-centred professionalism.

Its programmes include the EXCEL Programme for Students, Whole Person Medicine Training, Continuing Medical Education (CME), The Good Teacher, Developing Health Course, and the Publications & Library. Together, these initiatives promote academic excellence, patient-centred care, values-based teaching, lifelong learning, and access to quality educational resources.

Through EXCEL, CMDA Nigeria is raising healthcare professionals who are academically sound, professionally competent, and equipped to serve God and humanity with excellence.`,
  },
  {
    short: "Starting Strong",
    name: "Starting Strong",
    desc: "Equipping new members and fresh graduates with the foundation they need to thrive in faith, practice, and professional life from day one.",
    full: "",
  },
];

const otherMinistries = [
  {
    short: "Impact Fund",
    name: "Impact Fund",
    desc: "Funding scholarships, missions and emergency healthcare interventions.",
    full: "",
  },
  {
    short: "Wholeness",
    name: "Wholeness Missions",
    desc: "Whole-person care projects addressing body, mind and spirit in communities.",
    full: "",
  },
  {
    short: "Global",
    name: "Global Network",
    desc: "Connecting Nigerian Christian healthcare professionals in over 20 countries.",
    full: "",
  },
];

/* ──────────────────────────────────────────────
 * Ministry row with expandable description
 * ────────────────────────────────────────────── */

function MinistryRow({
  item,
  index,
}: {
  item: (typeof trainingArms)[number];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = item.full.length > 0;

  return (
    <Reveal delay={index * 60}>
      <div className="border-b border-border">
        <div className="group grid grid-cols-[auto_1fr_auto] items-start gap-6 py-8 transition-colors hover:bg-accent/50 sm:gap-10 sm:px-5">
          <span className="numeral shrink-0 pt-1 transition-colors group-hover:text-primary group-hover:[-webkit-text-stroke:0]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <span className="eyebrow block text-gold">{item.short}</span>
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
    </Reveal>
  );
}

/* ──────────────────────────────────────────────
 * Ministries list — used on homepage & /ministries
 * ────────────────────────────────────────────── */

export function Ministries() {
  return (
    <Section id="ministries">
      <SectionHead
        eyebrow="Featured ministries"
        title="Institutions built for lasting impact"
        action={
          <Link to="/ministries" className={cn(buttonVariants({ variant: "outline" }))}>
            View all ministries
          </Link>
        }
      />

      <div className="mt-16 border-t border-border">
        {trainingArms.map((m, i) => (
          <MinistryRow key={m.short} item={m} index={i} />
        ))}
        {otherMinistries.map((m, i) => (
          <MinistryRow key={m.short} item={m} index={trainingArms.length + i} />
        ))}
      </div>
    </Section>
  );
}

/* ──────────────────────────────────────────────
 * Full ministries page — detailed sections
 * ────────────────────────────────────────────── */

function MinistryDetail({
  item,
  index,
}: {
  item: (typeof trainingArms)[number];
  index: number;
}) {
  return (
    <Reveal>
      <div className="grid items-start gap-12 py-16 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div>
          <span className="numeral">{String(index + 1).padStart(2, "0")}</span>
          <span className="eyebrow mt-4 block text-gold">{item.short}</span>
          <h3 className="mt-3 display-2 text-balance">{item.name}</h3>
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
    <>
      <Section id="training-arms" className="paper">
        <SectionHead
          eyebrow="Training arms"
          title="Forming leaders for the future of healthcare"
          intro="IfEHL, IMM, EXCEL, and Starting Strong are the training arms of CMDA Nigeria — each equipping a different dimension of the healthcare professional."
        />
        <div className="mt-8 divide-y divide-border border-t border-border">
          {trainingArms.map((m, i) => (
            <MinistryDetail key={m.short} item={m} index={i} />
          ))}
        </div>
      </Section>

      <Section id="other-ministries" className="bg-muted">
        <SectionHead
          eyebrow="Other ministries"
          title="Carrying the mission into every sphere"
        />
        <div className="mt-8 divide-y divide-border border-t border-border">
          {otherMinistries.map((m, i) => (
            <MinistryDetail key={m.short} item={m} index={trainingArms.length + i} />
          ))}
        </div>
      </Section>
    </>
  );
}
