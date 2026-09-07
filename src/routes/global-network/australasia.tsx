import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, Section, SectionHead, buttonVariants } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
import { Globe, Handshake, Users, Heart, CalendarDays, MapPin, Newspaper, ArrowLeft } from "lucide-react";

const title = "Australasia Region | CMDA Nigeria Global Network";
const description =
  "The Australasia region of CMDA Nigeria's Global Network — connecting Nigerian Christian healthcare professionals across Australia and New Zealand.";

export const Route = createFileRoute("/global-network/australasia")({
  component: AustralasiaPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const highlights = [
  {
    icon: Users,
    title: "Fellowship Gatherings",
    desc: "Growing network of CMDA alumni in Australia and New Zealand connected through periodic in-person gatherings and online fellowship.",
  },
  {
    icon: Handshake,
    title: "Mission Support",
    desc: "Australasian members contribute to CMDA Nigeria's missions, student scholarships and community health initiatives back home.",
  },
  {
    icon: Heart,
    title: "Prayer & Support",
    desc: "Prayer networks in Australasia interceding for the fellowship in Nigeria and mobilising support for missions and emergency response.",
  },
  {
    icon: Globe,
    title: "Professional Exchange",
    desc: "Opportunities for clinical electives, research collaborations and professional exchanges between Australian institutions and Nigeria.",
  },
];

const stats = [
  { value: "2", label: "Countries (Australia & NZ)" },
  { value: "5+", label: "Regional members" },
  { value: "4+", label: "Cities represented" },
  { value: "Growing", label: "Rapidly expanding network" },
];

const events = [
  { date: "TBA", title: "Australasia Fellowship Gathering", place: "Sydney / Melbourne", type: "Fellowship" },
];

const newsletters = [
  { title: "Global Network Digest", desc: "Quarterly newsletter connecting CMDA alumni worldwide with updates on missions, member achievements and upcoming events." },
  { title: "The Prescription", desc: "Monthly devotional resource connecting Scripture to healthcare practice — available to all CMDA members globally." },
];

function AustralasiaPage() {
  return (
    <>
      <PageHero
        eyebrow="Global Network — Australasia"
        title="Nigerian Christian healthcare professionals in Australia & New Zealand"
        intro="From Sydney to Auckland — a growing fellowship of CMDA alumni connecting through digital fellowship and periodic gatherings."
      />

      {/* Stats */}
      <Section className="paper">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <Reveal key={s.label}>
              <div className="text-center">
                <p className="font-display text-3xl font-extrabold tracking-tight text-cmda-green lg:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs tracking-wide uppercase text-muted-foreground">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Overview */}
      <Section className="bg-muted">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
              <p className="eyebrow text-cmda-green">About this region</p>
            </div>
            <h2 className="display-2 mt-6 text-balance">A growing community down under</h2>
            <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                The Australasia region connects Nigerian-trained healthcare professionals practising
                in Australia and New Zealand with the CMDA Nigeria fellowship.
              </p>
              <p>
                Though one of the newest regions, it is expanding rapidly as more Nigerian healthcare
                professionals settle in the region — carrying the values of faith, excellence and
                compassion in their new home while staying connected to the mission in Nigeria.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Highlights */}
      <Section className="paper">
        <SectionHead
          eyebrow="What we do"
          title="Engaging in Australasia"
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {highlights.map((h) => (
            <Reveal key={h.title}>
              <div className="border border-border bg-background p-6 transition-shadow hover:shadow-card">
                <h.icon className="mb-4 size-8 text-cmda-green" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold tracking-tight text-foreground">{h.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{h.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Events */}
      <Section className="bg-muted">
        <SectionHead
          eyebrow="Upcoming events"
          title="Events in this region"
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {events.map((e) => (
            <Reveal key={e.title}>
              <div className="border border-border bg-background p-6 transition-shadow hover:shadow-card">
                <span className="eyebrow text-cmda-green">{e.type}</span>
                <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-foreground">{e.title}</h3>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="size-4" aria-hidden="true" />{e.date}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4" aria-hidden="true" />{e.place}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Newsletters */}
      <Section className="paper">
        <SectionHead
          eyebrow="Newsletters"
          title="Stay connected"
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {newsletters.map((n) => (
            <Reveal key={n.title}>
              <div className="border border-border bg-background p-6 transition-shadow hover:shadow-card">
                <Newspaper className="mb-3 size-6 text-cmda-green" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold tracking-tight text-foreground">{n.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{n.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-primary-deep text-primary-foreground">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="display-2 text-balance">Are you in Australia or New Zealand?</h2>
          <p className="lede mt-6 text-primary-foreground/75">
            Connect with the growing community of Nigerian Christian healthcare professionals down
            under and keep the mission alive.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/membership" className={cn(buttonVariants({ variant: "gold", size: "lg" }))}>
              Join the Region
            </Link>
            <Link to="/global-network" className={cn(buttonVariants({ variant: "onDark", size: "lg" }))}>
              <ArrowLeft className="size-4" aria-hidden="true" />Back to Global Network
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}