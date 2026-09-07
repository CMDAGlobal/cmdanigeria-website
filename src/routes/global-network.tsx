import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, Section, SectionHead, buttonVariants } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
import {
  Globe,
  Handshake,
  MapPin,
  Users,
  Heart,
  Briefcase,
  CalendarDays,
  Newspaper,
  ArrowUpRight,
} from "lucide-react";
import { fetchRegions } from "@/sanity/data";

const title = "Global Network | CMDA Nigeria";
const description =
  "CMDA Nigeria connects Christian healthcare professionals in over 20 countries — a global network of faith, service and mission.";

export const Route = createFileRoute("/global-network")({
  loader: async () => ({ regions: await fetchRegions() }),
  component: GlobalNetworkPage,
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

const stats = [
  { value: "20+", label: "Countries with CMDA members" },
  { value: "75+", label: "Global network members" },
  { value: "5", label: "Global regions" },
  { value: "20+", label: "Years of diaspora connection" },
];

const events = [
  { date: "TBA 2026", title: "The Americas In-Person Retreat", place: "United States", type: "Retreat" },
  { date: "TBA", title: "UK CMDA Fellowship Gathering", place: "London, UK", type: "Fellowship" },
  { date: "Monthly", title: "Global Prayer & Devotional Call", place: "Online", type: "Prayer" },
  { date: "Annually", title: "CMDA Global Alumni Webinar", place: "Online", type: "Webinar" },
];

const newsletters = [
  { title: "Global Network Digest", desc: "Quarterly newsletter connecting CMDA alumni worldwide with updates on missions, member achievements and upcoming events." },
  { title: "CMDA Annual Report", desc: "Comprehensive overview of the Association's activities including global network contributions and impact." },
  { title: "The Prescription", desc: "Monthly devotional resource connecting Scripture to healthcare practice — available to all CMDA members globally." },
  { title: "Wholeness Magazine", desc: "Flagship publication with articles, news and testimonies from CMDA Nigeria's fellowship — digital access for global members." },
];

const ways = [
  {
    icon: Globe,
    title: "Stay Connected",
    desc: "Join the global alumni network to stay in touch with CMDA Nigeria, receive updates and connect with fellow members worldwide.",
  },
  {
    icon: Handshake,
    title: "Partner With Us",
    desc: "International churches, mission organisations and healthcare groups can partner with CMDA Nigeria for missions, training and resource exchange.",
  },
  {
    icon: MapPin,
    title: "Give Back",
    desc: "Alumni abroad can support scholarships, mission trips, chapter activities and infrastructure projects back home through the Impact Fund.",
  },
  {
    icon: Briefcase,
    title: "Professional Exchange",
    desc: "Access opportunities for clinical electives, research collaborations and professional exchanges between Nigeria and institutions worldwide.",
  },
  {
    icon: Users,
    title: "Mentor Students",
    desc: "Remote mentorship programmes connect global alumni with current CMDA students, providing career guidance and professional development.",
  },
  {
    icon: Heart,
    title: "Pray & Support",
    desc: "Join the global prayer network and receive regular updates on CMDA Nigeria's missions, challenges and breakthroughs.",
  },
];

function GlobalNetworkPage() {
  const { regions } = Route.useLoaderData();
  return (
    <>
      <PageHero
        eyebrow="Global Network"
        title="Connecting Nigerian Christian healthcare professionals worldwide"
        intro="From Lagos to London, Abuja to Atlanta — CMDA Nigeria's global network spans over 20 countries, uniting alumni and partners around faith, service and mission."
      />

      {/* Overview */}
      <Section className="paper">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
              <p className="eyebrow text-cmda-green">Our reach</p>
              <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
            </div>
            <h2 className="display-2 mt-6 text-balance">
              A fellowship that transcends borders
            </h2>
            <p className="lede mt-6 text-muted-foreground">
              CMDA Nigeria's impact extends far beyond the nation's borders. Our alumni serve in
              hospitals, universities and mission fields across the world — carrying the values
              of faith, excellence and compassion wherever they go.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Stats */}
      <Section className="bg-primary-deep text-primary-foreground">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <Reveal key={s.label}>
              <div className="text-center">
                <p className="font-display text-3xl font-extrabold tracking-tight text-cmda-green-light lg:text-4xl">
                  {s.value}
                </p>
                <p className="mt-2 text-xs tracking-wide uppercase text-primary-foreground/60">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Regions */}
      <Section className="bg-muted">
        <SectionHead
          eyebrow="Where we are"
          title="Our global footprint — regions across the world"
          intro="Each region is managed independently — with its own leaders, events, announcements, activities and chapters."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((r) => {
            const slug = r.slug?.current ?? "";
            return (
              <Reveal key={r._id}>
                <Link
                  to="/global-network/$slug"
                  params={{ slug }}
                  className="group flex h-full flex-col border border-border bg-background p-6 transition-all hover:border-cmda-green hover:shadow-card"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-cmda-green">
                      {r.name}
                    </h3>
                    <ArrowUpRight
                      className="size-5 text-cmda-green transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {r.intro ?? r.tagline ?? ""}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-muted-foreground">
                    <span>{r.countries?.length ?? 0} countries</span>
                    <span>{r.chapterCount ?? 0} chapters</span>
                    <span>{r.eventCount ?? 0} events</span>
                  </div>
                  <span className="mt-4 text-sm font-semibold text-cmda-green">
                    Explore region
                  </span>
                </Link>
              </Reveal>
            );
          })}
          <Reveal>
            <div className="flex h-full flex-col items-center justify-center border border-dashed border-cmda-green/40 bg-cmda-green/5 p-6 text-center">
              <MapPin className="mb-3 size-8 text-cmda-green" aria-hidden="true" />
              <h3 className="font-display text-lg font-bold text-foreground">Your region not listed?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Contact us — we may be starting a network in your region soon.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Ways to engage */}
      <Section className="paper">
        <SectionHead
          eyebrow="Get involved"
          title="How to engage from anywhere"
        />
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ways.map((w) => (
            <Reveal key={w.title}>
              <div className="border-t border-cmda-green/40 pt-6">
                <w.icon className="mb-4 size-7 text-cmda-green" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                  {w.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{w.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Upcoming Events */}
      <Section className="bg-muted">
        <SectionHead
          eyebrow="Upcoming events"
          title="Events for global members"
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {events.map((e) => (
            <Reveal key={e.title}>
              <div className="border border-border bg-background p-6 transition-shadow hover:shadow-card">
                <span className="eyebrow text-cmda-green">{e.type}</span>
                <h3 className="mt-3 font-display text-base font-bold tracking-tight text-foreground">
                  {e.title}
                </h3>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {e.date}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4" aria-hidden="true" />
                  {e.place}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Newsletters */}
      <Section className="paper">
        <SectionHead
          eyebrow="Newsletters & publications"
          title="Stay connected from wherever you are"
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {newsletters.map((n) => (
            <Reveal key={n.title}>
              <div className="border border-border bg-background p-6 transition-shadow hover:shadow-card">
                <Newspaper className="mb-3 size-6 text-cmda-green" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                  {n.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{n.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-primary-deep text-primary-foreground">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="display-2 text-balance">Stay connected with CMDA Nigeria</h2>
          <p className="lede mt-6 text-primary-foreground/75">
            Wherever you are in the world, you remain part of the CMDA Nigeria family. Join the
            network, give back and keep the mission alive.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/membership" className={cn(buttonVariants({ variant: "gold", size: "lg" }))}>
              Become a Member
            </Link>
            <Link to="/give" className={cn(buttonVariants({ variant: "onDark", size: "lg" }))}>
              Support the Mission
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}