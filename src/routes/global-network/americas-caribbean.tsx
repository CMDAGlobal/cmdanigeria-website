import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, Section, SectionHead, buttonVariants } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
import { Globe, Handshake, Users, Heart, CalendarDays, MapPin, Newspaper, ArrowLeft } from "lucide-react";

const title = "The Americas / Caribbean Region | CMDA Nigeria Global Network";
const description =
  "The Americas and Caribbean region of CMDA Nigeria's Global Network — connecting Nigerian Christian healthcare professionals in the US, Canada and the Caribbean.";

export const Route = createFileRoute("/global-network/americas-caribbean")({
  component: AmericasCaribbeanPage,
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
    title: "Alumni Networks",
    desc: "Active alumni chapters across the United States and Canada hosting regular fellowship gatherings, mentorship circles and professional networking events.",
  },
  {
    icon: Handshake,
    title: "Mission Partnerships",
    desc: "Regional members partner with CMDA Nigeria for medical missions, funding support and logistics for outreach programmes back home.",
  },
  {
    icon: Heart,
    title: "Prayer & Support",
    desc: "Dedicated prayer networks interceding for the fellowship in Nigeria and mobilising support for students, missions and emergency response.",
  },
  {
    icon: Globe,
    title: "Professional Connections",
    desc: "Opportunities for clinical electives, research collaborations and professional exchange between US/Canadian institutions and Nigeria.",
  },
];

const stats = [
  { value: "2+", label: "Countries & territories" },
  { value: "30+", label: "Regional members" },
  { value: "6+", label: "Cities with gatherings" },
  { value: "1", label: "Annual in-person retreat" },
];

const events = [
  { date: "TBA 2026", title: "The Americas In-Person Retreat", place: "United States", type: "Retreat" },
  { date: "Monthly", title: "Americas Prayer Call", place: "Online", type: "Prayer" },
];

const newsletters = [
  { title: "Global Network Digest", desc: "Quarterly newsletter connecting CMDA alumni worldwide with updates on missions, member achievements and upcoming events." },
  { title: "CMDA Annual Report", desc: "Comprehensive overview of the Association's activities including global network contributions and impact." },
];

function AmericasCaribbeanPage() {
  return (
    <>
      <PageHero
        eyebrow="Global Network — The Americas / Caribbean"
        title="Nigerian Christian healthcare professionals in the Americas"
        intro="From New York to Toronto to the Caribbean — a thriving network of CMDA alumni serving, mentoring and giving back."
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
            <h2 className="display-2 mt-6 text-balance">A vibrant community across North America</h2>
            <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                The Americas and Caribbean region connects Nigerian-trained doctors, dentists and
                healthcare professionals practising in the United States and Canada with the CMDA
                Nigeria fellowship. Members engage in regular gatherings, mentorship programmes and
                mission partnerships that keep them connected to home.
              </p>
              <p>
                The region holds an annual in-person retreat that brings together members from
                across the continent for worship, fellowship, strategic planning and reconnection
                with the Nigerian mission.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Highlights */}
      <Section className="paper">
        <SectionHead
          eyebrow="What we do"
          title="Engaging in the Americas"
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
          <h2 className="display-2 text-balance">Are you in the Americas?</h2>
          <p className="lede mt-6 text-primary-foreground/75">
            Join a community of Nigerian Christian healthcare professionals who are thriving abroad
            while staying connected to the mission at home.
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