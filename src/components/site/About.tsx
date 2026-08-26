import {
  Activity,
  Award,
  BookOpen,
  Globe2,
  GraduationCap,
  HeartHandshake,
  HandHeart,
  Lightbulb,
  Megaphone,
  Microscope,
  ShieldCheck,
  ShieldPlus,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { buttonVariants, Reveal, Section, SectionHead } from "./primitives";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────
 * WhoWeAre — compact version used on the homepage
 * ────────────────────────────────────────────── */

export function WhoWeAre() {
  return (
    <Section id="who-we-are" className="paper">
      <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-24">
        <Reveal className="order-2 lg:order-1">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
            <p className="eyebrow text-primary">Who we are</p>
          </div>
          <h2 className="display-2 mt-6 text-balance">
            Healthcare professionals called to heal, to teach, and to serve.
          </h2>
          <div className="mt-8 space-y-5 border-l border-border pl-6 text-base leading-relaxed text-muted-foreground">
            <p className="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-extrabold first-letter:text-primary">
              The Christian Medical and Dental Association of Nigeria is a network of Christian
              medical and dental practitioners registered with the Medical and Dental Council of
              Nigeria, together with students studying for the same qualification.
            </p>
            <p>
              Founded in 1972, the association has become a platform for nurturing medics to
              practise health care with a heart, and to provide leadership through various platforms
              in the health sector within and outside Nigeria.
            </p>
          </div>
          <dl className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                term: "Registration",
                def: "Registered with the Corporate Affairs Commission of Nigeria [RC 22373].",
              },
              {
                term: "ICMDA",
                def: "A member of the International Christian Medical and Dental Association.",
              },
              {
                term: "Two arms",
                def: "Doctors' arm since 8 April 1972; Students' arm since 16 September 1981.",
              },
            ].map((item) => (
              <div key={item.term} className="border-t border-gold/50 pt-4">
                <dt className="eyebrow text-primary">{item.term}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.def}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link to="/about" className={cn(buttonVariants({ variant: "primary" }))}>
              Read Our Story
            </Link>
            <Link to="/ministries" className={cn(buttonVariants({ variant: "outline" }))}>
              Our Ministries
            </Link>
          </div>
        </Reveal>

        <Reveal className="order-1 lg:order-2" delay={120}>
          <div className="relative">
            <div className="framed">
              <img
                src="/About1.webp"
                alt="Nigerian medical students praying together before ward rounds"
                width={1408}
                height={1008}
                loading="lazy"
                className="aspect-4/5 size-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-4 hidden w-64 bg-primary-deep p-6 text-primary-foreground shadow-elegant sm:block lg:-left-12">
              <p className="font-display text-5xl leading-none font-extrabold text-gold">1972</p>
              <p className="mt-3 text-xs leading-relaxed text-primary-foreground/75">
                The year our fellowship began — five decades of whole-person care.
              </p>
            </div>
            <div className="mt-6 hidden overflow-hidden lg:block">
              <img
                src="/About2.webp"
                alt="Delegates at a CMDA Nigeria healthcare leadership conference"
                width={1408}
                height={1008}
                loading="lazy"
                className="aspect-16/7 size-full object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ──────────────────────────────────────────────
 * OurStory — full version for the About page
 * ────────────────────────────────────────────── */

export function OurStory() {
  return (
    <Section id="our-story" className="paper">
      <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-24">
        <Reveal className="order-2 lg:order-1">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
            <p className="eyebrow text-primary">Our story</p>
          </div>
          <h2 className="display-2 mt-6 text-balance">
            Five decades of faith, sacrifice, and service in healthcare.
          </h2>
          <div className="mt-8 space-y-5 border-l border-border pl-6 text-base leading-relaxed text-muted-foreground">
            <p className="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-extrabold first-letter:text-primary">
              The Christian Medical and Dental Association of Nigeria (CMDA Nigeria) is a faith-based
              network of Christian medical and dental practitioners registered with the Medical and
              Dental Council of Nigeria, alongside students training in these professions.
            </p>
            <p>
              Established in 1972, CMDA Nigeria has spent over five decades equipping healthcare
              professionals to serve with clinical excellence, Christ-like compassion, and integrity.
              We believe that God created humanity as spirit, soul, and body (1 Thessalonians 5:23),
              and we are committed to raising healthcare professionals who provide holistic care
              while reflecting Christ in their personal and professional lives.
            </p>
            <p>
              Through fellowship, mentorship, leadership development, medical missions, health
              education, and professional support, we empower our members to be effective witnesses
              for Christ and to positively influence healthcare and society.
            </p>
          </div>
          <dl className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                term: "Registration",
                def: "Registered with the Corporate Affairs Commission of Nigeria [RC 22373].",
              },
              {
                term: "ICMDA",
                def: "A member of the International Christian Medical and Dental Association.",
              },
              {
                term: "Two arms",
                def: "Doctors' arm since 8 April 1972; Students' arm since 16 September 1981.",
              },
            ].map((item) => (
              <div key={item.term} className="border-t border-gold/50 pt-4">
                <dt className="eyebrow text-primary">{item.term}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.def}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="order-1 lg:order-2" delay={120}>
          <div className="relative">
            <div className="framed">
              <img
                src="/About1.webp"
                alt="Nigerian medical students praying together before ward rounds"
                width={1408}
                height={1008}
                loading="lazy"
                className="aspect-4/5 size-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-4 hidden w-64 bg-primary-deep p-6 text-primary-foreground shadow-elegant sm:block lg:-left-12">
              <p className="font-display text-5xl leading-none font-extrabold text-gold">1972</p>
              <p className="mt-3 text-xs leading-relaxed text-primary-foreground/75">
                The year our fellowship began — five decades of whole-person care.
              </p>
            </div>
            <div className="mt-6 hidden overflow-hidden lg:block">
              <img
                src="/About2.webp"
                alt="Delegates at a CMDA Nigeria healthcare leadership conference"
                width={1408}
                height={1008}
                loading="lazy"
                className="aspect-16/7 size-full object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ──────────────────────────────────────────────
 * VisionAndMission
 * ────────────────────────────────────────────── */

export function VisionAndMission() {
  return (
    <Section id="vision-mission" className="bg-muted">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
            <p className="eyebrow text-primary">Vision</p>
          </div>
          <h2 className="display-2 mt-6 text-balance">
            God made man — spirit, soul, and body.
          </h2>
          <div className="mt-8 space-y-5 border-l border-border pl-6 text-base leading-relaxed text-muted-foreground">
            <p>
              He has called us Christians in the Medical and Dental disciplines to be proficient in
              caring for the whole man.
            </p>
            <p className="font-display text-sm font-semibold text-primary">
              — 1 Thessalonians 5:23b
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
            <p className="eyebrow text-primary">Mission</p>
          </div>
          <h2 className="display-2 mt-6 text-balance">
            A Christian witness through healthcare in every community.
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              The Christian Medical and Dental Association of Nigeria seeks to establish a Christian
              witness through Medical and Dental doctors and students in every community in Nigeria
              and beyond.
            </p>
            <div className="mt-6 space-y-4">
              {[
                "To start and strengthen CMDA Nigeria chapters nationally through calling, equipping, fellowship and service.",
                "To establish and enhance Christian witness through members' personal and corporate ministry in holistic care, health education, missions, and leadership in healthcare.",
              ].map((mandate, i) => (
                <div key={i} className="flex gap-4">
                  <span className="mt-1 flex size-7 shrink-0 items-center justify-center border border-gold text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <p>{mandate}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ──────────────────────────────────────────────
 * CoreValues
 * ────────────────────────────────────────────── */

const values = [
  { icon: HandHeart, title: "Compassion", desc: "Caring for the whole person with Christ-like love." },
  { icon: ShieldCheck, title: "Character", desc: "Upholding moral integrity in personal and professional life." },
  { icon: Award, title: "Competence", desc: "Pursuing clinical excellence and continuous learning." },
  { icon: Sparkles, title: "Integrity", desc: "Acting with honesty and accountability at all times." },
  { icon: Stethoscope, title: "Excellence", desc: "Striving for the highest standards in healthcare practice." },
  { icon: Users, title: "Teamwork", desc: "Collaborating across disciplines for greater impact." },
  { icon: HeartHandshake, title: "Social Responsibility", desc: "Serving underserved communities with purpose and care." },
];

export function CoreValues() {
  return (
    <Section id="core-values">
      <SectionHead
        eyebrow="Core values"
        title="The principles that guide us"
        intro="Seven commitments that shape how we serve, lead, and care."
      />

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {values.map((item, i) => (
          <Reveal key={item.title} delay={(i % 3) * 90}>
            <div className="card-editorial flex h-full flex-col p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-11 items-center justify-center border border-border text-primary">
                  <item.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="numeral">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-8 font-display text-lg font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ──────────────────────────────────────────────
 * StatementOfFaith — placeholder
 * ────────────────────────────────────────────── */

export function StatementOfFaith() {
  return (
    <Section id="statement-of-faith" className="bg-primary-deep text-primary-foreground">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
            <p className="eyebrow text-gold">Statement of faith</p>
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
          </div>
          <h2 className="display-2 mt-6 text-balance">What we believe</h2>
          <div className="mt-10 rounded-sm border border-primary-foreground/15 bg-primary-foreground/5 p-10">
            <BookOpen className="mx-auto size-8 text-gold" aria-hidden="true" />
            <p className="mt-6 text-sm leading-relaxed text-primary-foreground/60">
              Our statement of faith is being prepared. In the meantime, we affirm the historic
              Christian faith as expressed in the Apostles' Creed and the Nicene Creed.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ──────────────────────────────────────────────
 * LeadershipDevelopment
 * ────────────────────────────────────────────── */

const leadershipItems = [
  {
    title: "Cluster Levites Training",
    desc: "A leadership formation programme for emerging student leaders, equipping them with spiritual depth, organisational skills and a servant-leadership mindset.",
  },
  {
    title: "NEC Retreat",
    desc: "An annual retreat for the National Executive Council — a time of prayer, strategic reflection, team-building and alignment for the year ahead.",
  },
];

export function LeadershipDevelopment() {
  return (
    <Section id="leadership-development" className="paper">
      <SectionHead
        eyebrow="Leadership development"
        title="Forming the next generation of servant-leaders"
      />
      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {leadershipItems.map((item, i) => (
          <Reveal key={item.title} delay={(i % 2) * 90}>
            <div className="border border-border bg-background p-6 transition-shadow hover:shadow-card h-full">
              <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ──────────────────────────────────────────────
 * AwardsAndRecognition
 * ────────────────────────────────────────────── */

const awardsItems = [
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

export function AwardsAndRecognition() {
  return (
    <Section id="awards" className="bg-muted">
      <SectionHead
        eyebrow="Awards & recognition"
        title="Celebrating excellence, faithfulness and impact"
      />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {awardsItems.map((item, i) => (
          <Reveal key={item.title} delay={(i % 3) * 90}>
            <div className="border border-border bg-background p-6 transition-shadow hover:shadow-card h-full">
              <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ──────────────────────────────────────────────
 * HistoryTeaser — CTA block linking to /about/history
 * ────────────────────────────────────────────── */

export function HistoryTeaser() {
  return (
    <Section id="history-teaser" className="paper">
      <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
            <p className="eyebrow text-primary">Our history</p>
          </div>
          <h2 className="display-2 mt-6 text-balance">
            From a pioneering vision to a nationwide movement.
          </h2>
          <p className="lede mt-6 text-muted-foreground">
            The history of CMDA Nigeria is a story of faith, sacrifice, service, and a continuing
            commitment to Christian witness in healthcare. From the efforts of Christian medical
            practitioners and the birth of the Fellowship of Christian Doctors in Nigeria in 1972,
            the movement has grown through generations committed to serving God and humanity.
          </p>
          <div className="mt-10">
            <Link
              to="/about/history"
              className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
            >
              Discover our journey
            </Link>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative">
            <div className="framed">
              <img
                src="/About2.webp"
                alt="Delegates at a CMDA Nigeria healthcare leadership conference"
                width={1408}
                height={1008}
                loading="lazy"
                className="aspect-4/3 size-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 hidden w-56 bg-primary-deep p-5 text-primary-foreground shadow-elegant sm:block lg:-right-10">
              <p className="font-display text-3xl leading-none font-extrabold text-gold">50+</p>
              <p className="mt-2 text-xs leading-relaxed text-primary-foreground/75">
                Years of Christian witness in healthcare.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ──────────────────────────────────────────────
 * WhatWeDo — used on /what-we-do page
 * ────────────────────────────────────────────── */

const pillars = [
  {
    icon: Award,
    title: "Leadership Development",
    desc: "Forming servant leaders for healthcare institutions and the nation.",
  },
  {
    icon: HeartHandshake,
    title: "Medical Missions",
    desc: "Reaching underserved communities with quality, compassionate care.",
  },
  {
    icon: GraduationCap,
    title: "Healthcare Training",
    desc: "Continuing education, clinical skills and ethics for practitioners.",
  },
  {
    icon: Users,
    title: "Student Ministry",
    desc: "Discipling the next generation of Christian healthcare professionals.",
  },
  {
    icon: Stethoscope,
    title: "Doctors Ministry",
    desc: "Fellowship, mentorship and support for doctors and dentists.",
  },
  {
    icon: Globe2,
    title: "Global Network",
    desc: "Connecting Nigerian professionals serving across the world.",
  },
  {
    icon: Megaphone,
    title: "Healthcare Advocacy",
    desc: "Speaking for life, ethics and equitable access to care.",
  },
  {
    icon: ShieldPlus,
    title: "Emergency Response",
    desc: "Rapid medical response in crises, epidemics and disasters.",
  },
  {
    icon: Microscope,
    title: "Research",
    desc: "Evidence for better practice, policy and population health.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "Technology and new models of care for African contexts.",
  },
  {
    icon: Activity,
    title: "Wholeness Projects",
    desc: "Whole-person interventions for lasting community health.",
  },
  {
    icon: BookOpen,
    title: "Community Outreach",
    desc: "Screening, education and follow-up care where it's needed.",
  },
];

export function WhatWeDo() {
  return (
    <Section id="what-we-do" className="bg-muted">
      <SectionHead
        eyebrow="What we do"
        title="Twelve pathways of ministry and service"
        intro="Every programme is designed to strengthen the healthcare professional, the institution and the community they serve."
      />

      <div className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((item, i) => (
          <Reveal key={item.title} delay={(i % 3) * 90}>
            <div className="group flex h-full flex-col bg-card p-8 transition-colors duration-500 hover:bg-primary-deep">
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-11 items-center justify-center border border-border text-primary transition-colors group-hover:border-gold group-hover:text-gold">
                  <item.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="numeral">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-8 font-display text-lg font-bold transition-colors group-hover:text-primary-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-primary-foreground/75">
                {item.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
