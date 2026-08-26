import { CalendarDays, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { buttonVariants, Reveal, Section, SectionHead } from "./primitives";
import { cn } from "@/lib/utils";

const events = [
  {
    date: "20–23 Aug",
    year: "2026",
    title: "Students' Annual National Conference",
    place: "Benin City, Edo State",
    type: "Students",
  },
  {
    date: "TBA",
    year: "2026",
    title: "Doctors' National Conference",
    place: "Nigeria",
    type: "Conference",
  },
  {
    date: "TBA",
    year: "2026",
    title: "The Americas In-Person Retreat",
    place: "United States",
    type: "Global Network",
  },
  {
    date: "Monthly",
    year: "2026",
    title: "Wholeness Webinar Series",
    place: "Online",
    type: "Webinar",
  },
];

const nationalConferences = [
  {
    title: "National Conference — Students",
    desc: "Annual gathering of CMDA student members from across Nigeria for worship, teaching, fellowship, missions deployment and leadership equipping.",
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


export function Events() {
  return (
    <>
      <Section id="events" className="bg-muted">
        <SectionHead
          eyebrow="Upcoming events"
          title="Gather, train, and be sent"
          action={
            <Link to="/events" className={cn(buttonVariants({ variant: "outline" }))}>
              Full events calendar
            </Link>
          }
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {events.map((e, i) => (
            <Reveal key={e.title} delay={(i % 2) * 90}>
              <article className="card-editorial flex h-full flex-col gap-6 p-8 sm:flex-row sm:items-center">
                <div className="w-24 shrink-0 border-r border-border pr-4 text-center sm:text-left">
                  <p className="font-display text-base font-extrabold text-primary">{e.date}</p>
                  <p className="eyebrow mt-2 text-muted-foreground">{e.year}</p>
                </div>
                <div className="flex-1">
                  <span className="eyebrow text-secondary">{e.type}</span>
                  <h3 className="mt-2 font-display text-lg leading-snug font-bold">{e.title}</h3>
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4" aria-hidden="true" />
                    {e.place}
                  </p>
                </div>
                <a
                  href="#events"
                  className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
                  aria-label={`Register for ${e.title}`}
                >
                  <CalendarDays aria-hidden="true" />
                  Register
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="national-conferences" className="paper">
        <SectionHead
          eyebrow="National conferences"
          title="Gathering the fellowship for worship, training and vision"
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {nationalConferences.map((c, i) => (
            <Reveal key={c.title} delay={(i % 2) * 90}>
              <div className="border border-border bg-background p-6 transition-shadow hover:shadow-card h-full">
                <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                  {c.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

const tiers = [
  {
    title: "Doctors & Dentists",
    desc: "Fellowship, CPD, chapter life, mentorship and mission opportunities.",
    points: ["Chapter membership", "Conference discounts", "Digital membership card"],
  },
  {
    title: "Medical & Dental Students",
    desc: "Discipleship, EXCEL formation, leadership training and clinical mentoring.",
    points: ["55 student chapters", "Scholarship access", "Leadership pipeline"],
  },
  {
    title: "Global Network",
    desc: "For Nigerian Christian healthcare professionals serving abroad.",
    points: ["Regional gatherings", "Mission partnerships", "Diaspora giving"],
  },
];

export function MembershipAndGiving() {
  return (
    <>
      <Membership />
      <Giving />
    </>
  );
}

export function Membership() {
  return (
    <>
      <Section id="membership">

        <SectionHead
          eyebrow="Membership"
          title="Join over 11,000 colleagues in the fellowship"
          intro="Three ways to belong — whichever season of practice you are in."
        />
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.title} delay={i * 90}>
              <div className="card-editorial flex h-full flex-col p-8">
                <span className="numeral">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 font-display text-xl font-bold">{t.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {t.points.map((p) => (
                    <li key={p} className="flex gap-3 text-muted-foreground">
                      <span className="mt-2 h-px w-4 shrink-0 bg-gold" />
                      {p}
                    </li>
                  ))}
                </ul>
                <a
                  href="#membership"
                  className={cn(buttonVariants({ variant: "primary" }), "mt-8 w-full")}
                >
                  Apply Online
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

export function Giving() {
  return (
    <>
      <Section id="give" className="gradient-brand text-primary-foreground">

        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-gold" aria-hidden="true" />
              <p className="eyebrow text-gold">Give</p>
            </div>
            <h2 className="display-2 mt-6 text-balance">
              Your giving sends a healthcare worker where the need is greatest
            </h2>
            <p className="lede mt-6 text-primary-foreground/80">
              Support medical missions, student scholarships, emergency relief and the Impact Fund —
              with transparent reporting on every naira received.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#give" className={cn(buttonVariants({ variant: "gold", size: "lg" }))}>
                Donate Today
              </a>
              <a href="#give" className={cn(buttonVariants({ variant: "onDark", size: "lg" }))}>
                Sponsor a Student
              </a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-5">
              {[
                { label: "Impact Fund 2027", raised: 72 },
                { label: "Northern Medical Missions", raised: 48 },
                { label: "Student Scholarships", raised: 61 },
              ].map((c) => (
                <div
                  key={c.label}
                  className="card-editorial-dark p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-display text-sm font-bold">{c.label}</p>
                    <p className="font-display text-sm font-bold text-gold">{c.raised}%</p>
                  </div>
                  <div
                    className="mt-4 h-1.5 w-full overflow-hidden bg-primary-foreground/20"
                    role="progressbar"
                    aria-valuenow={c.raised}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${c.label} funding progress`}
                  >
                    <div className="h-full bg-gold" style={{ width: `${c.raised}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
