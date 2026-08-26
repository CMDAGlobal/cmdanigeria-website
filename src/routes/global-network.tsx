import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, Section, SectionHead, buttonVariants } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
import { Globe, Handshake, MapPin, Users, Heart, Briefcase } from "lucide-react";

const title = "Global Network | CMDA Nigeria";
const description =
  "CMDA Nigeria connects Christian healthcare professionals in over 20 countries — a global network of faith, service and mission.";

export const Route = createFileRoute("/global-network")({
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

const regions = [
  {
    region: "North America",
    countries: ["United States", "Canada"],
    desc: "CMDA alumni networks in the US and Canada provide mentorship, mission partnerships and professional connections for Nigerian-trained doctors practising abroad.",
  },
  {
    region: "United Kingdom",
    countries: ["United Kingdom"],
    desc: "A vibrant community of CMDA members in the UK engaged in NHS practice, mission support and ongoing connection with the home fellowship.",
  },
  {
    region: "Africa",
    countries: ["Nigeria", "Ghana", "South Africa", "Kenya"],
    desc: "Beyond Nigeria, CMDA alumni serve across the African continent in hospitals, universities, public health programmes and rural mission stations.",
  },
  {
    region: "Middle East & Asia",
    countries: ["UAE", "Saudi Arabia", "India"],
    desc: "Nigerian Christian healthcare professionals in the Gulf and Asia maintain fellowship and support mission initiatives from their stations abroad.",
  },
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
              <span className="h-px w-10 bg-gold" aria-hidden="true" />
              <p className="eyebrow text-primary">Our reach</p>
              <span className="h-px w-10 bg-gold" aria-hidden="true" />
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

      {/* Regions */}
      <Section className="bg-muted">
        <SectionHead
          eyebrow="Where we are"
          title="Our global footprint"
        />
        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {regions.map((r) => (
            <Reveal key={r.region}>
              <div className="border border-border bg-background p-8 transition-shadow hover:shadow-card">
                <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
                  {r.region}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.countries.map((c) => (
                    <span
                      key={c}
                      className="rounded-none border border-gold/30 bg-gold/5 px-3 py-1 text-xs font-semibold text-gold"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
              </div>
            </Reveal>
          ))}
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
              <div className="border-t border-gold/40 pt-6">
                <w.icon className="mb-4 size-7 text-primary" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                  {w.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{w.desc}</p>
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
