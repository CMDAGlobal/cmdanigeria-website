import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, Section, SectionHead, buttonVariants } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
import { Stethoscope, Heart, Globe, Award, Users, BookOpen, CalendarDays, MapPin, Newspaper } from "lucide-react";

const title = "Doctors' Arm | CMDA Nigeria";
const description =
  "The professional arm of CMDA Nigeria — uniting Christian doctors and dentists for clinical excellence, mentorship, missions and advocacy since 1972.";

export const Route = createFileRoute("/doctors-arm")({
  component: DoctorsArmPage,
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

const pillars = [
  {
    icon: Stethoscope,
    title: "Clinical Excellence",
    desc: "We uphold the highest standards of medical and dental practice, equipping professionals to deliver whole-person care that integrates clinical skill with Christ-like compassion.",
  },
  {
    icon: Heart,
    title: "Mentorship & Discipleship",
    desc: "Senior doctors guide younger colleagues through formal mentorship programmes, hospital fellowships and personal discipleship — shaping professionals who lead with integrity.",
  },
  {
    icon: Globe,
    title: "Missions & Outreach",
    desc: "Through medical missions, rural outreaches and mission trips, doctors serve underserved communities across Nigeria and beyond — bringing healing and hope.",
  },
  {
    icon: Award,
    title: "Professional Development",
    desc: "Continuing medical education, conferences, workshops and journals keep members at the forefront of medical knowledge while grounding practice in Christian values.",
  },
  {
    icon: Users,
    title: "Fellowship & Community",
    desc: "Local chapter meetings, zonal conferences and the national conference provide space for worship, fellowship, accountability and shared mission among peers.",
  },
  {
    icon: BookOpen,
    title: "Advocacy & Ethics",
    desc: "We advocate for policies that protect life, promote access to healthcare and uphold the rights of practitioners to work in accordance with their conscience.",
  },
];

const stats = [
  { value: "1,200+", label: "Doctors & dentists" },
  { value: "50+", label: "Doctor chapters" },
  { value: "36+FCT", label: "States covered" },
  { value: "20+", label: "Countries with CMDA alumni" },
];

const chapters = [
  { zone: "South-South", count: 7, cities: ["Benin City", "Port Harcourt", "Calabar", "Warri"] },
  { zone: "South-West", count: 10, cities: ["Lagos", "Ibadan", "Abeokuta", "Akure"] },
  { zone: "South-East", count: 6, cities: ["Enugu", "Owerri", "Aba", "Awka"] },
  { zone: "North-Central", count: 8, cities: ["Jos", "Abuja", "Ilorin", "Makurdi"] },
  { zone: "North-West", count: 6, cities: ["Kano", "Kaduna", "Sokoto", "Zaria"] },
  { zone: "North-East", count: 5, cities: ["Maiduguri", "Yola", "Bauchi", "Gombe"] },
];

const events = [
  { date: "TBA 2026", title: "National Zonal Conference — Doctors", place: "Nigeria", type: "Conference" },
  { date: "TBA", title: "Joint Conference (Doctors & Students)", place: "Nigeria", type: "Conference" },
  { date: "Monthly", title: "The Prescription — Devotional Series", place: "Online", type: "Devotional" },
];

const newsletters = [
  { title: "Touch Magazine", desc: "Annual publication of the Doctors' arm with news, reports and enriching articles addressing challenges faced by Christian medics in practice." },
  { title: "CMDA-LD Magazine", desc: "Biannual publication for Lady Doctors addressing spiritual growth, career, leadership, family, wellness and missions." },
  { title: "CMDA Annual Report", desc: "Comprehensive overview of the Association's activities, achievements and financial stewardship." },
  { title: "The Prescription", desc: "Monthly devotional resource connecting Scripture to the daily realities of healthcare practice." },
];

function DoctorsArmPage() {
  return (
    <>
      <PageHero
        eyebrow="Doctors' Arm"
        title="Professional fellowship rooted in faith and service"
        intro="Since 8 April 1972, CMDA Nigeria's doctors' arm has united Christian medical and dental professionals around clinical excellence, mentorship, missions and ethical practice."
      />

      {/* Overview */}
      <Section className="paper">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal className="order-2 lg:order-1">
            <div className="relative">
              <div className="framed">
                <img
                  src="/About2.webp"
                  alt="CMDA Nigeria doctors at a conference"
                  loading="lazy"
                  className="aspect-4/5 size-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-4 hidden w-56 bg-primary-deep p-6 text-primary-foreground shadow-elegant sm:block lg:-left-12">
                <p className="font-display text-4xl leading-none font-extrabold text-cmda-green-light">1972</p>
                <p className="mt-3 text-xs leading-relaxed text-primary-foreground/75">
                  The year the Fellowship of Christian Doctors in Nigeria was established
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal className="order-1 lg:order-2" delay={120}>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
                <p className="eyebrow text-cmda-green">Our story</p>
              </div>
              <h2 className="display-2 text-balance">
                From a pioneering vision to a nationwide professional body
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  The Fellowship of Christian Doctors in Nigeria was established on 8 April 1972,
                  following a landmark conference in Ibadan convened by Dr. Akanu Ibiam. The
                  fellowship brought together Christian doctors committed to practising medicine
                  with faith, integrity and compassion.
                </p>
                <p>
                  Over the decades, the doctors' arm has grown to include chapters in every
                  Nigerian state, with members serving in teaching hospitals, general hospitals,
                  private practice, public health and mission fields.
                </p>
                <p>
                  Today, CMDA Nigeria's doctors' arm is a full member of the International
                  Christian Medical and Dental Association (ICMDA), participating in global
                  conferences, mission networks and professional exchanges.
                </p>
              </div>
            </div>
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

      {/* Pillars */}
      <Section className="bg-muted">
        <SectionHead
          eyebrow="What we do"
          title="The pillars of our fellowship"
        />
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <Reveal key={p.title}>
              <div className="border border-border bg-background p-8 transition-shadow hover:shadow-card">
                <p.icon className="mb-4 size-8 text-cmda-green" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Chapters by Zone */}
      <Section className="paper">
        <SectionHead
          eyebrow="Our chapters"
          title="50+ doctor chapters across 6 zones"
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((z) => (
            <Reveal key={z.zone}>
              <div className="border border-border bg-background p-6 transition-shadow hover:shadow-card">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                    {z.zone}
                  </h3>
                  <span className="font-display text-2xl font-extrabold text-cmda-green">
                    {z.count}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">chapters</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {z.cities.map((c) => (
                    <span key={c} className="rounded-none border border-border bg-muted px-2 py-0.5 text-[0.65rem] text-muted-foreground">
                      {c}
                    </span>
                  ))}
                  {z.count > 4 && (
                    <span className="rounded-none border border-border bg-muted px-2 py-0.5 text-[0.65rem] text-muted-foreground">
                      +{z.count - 4} more
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Upcoming Events */}
      <Section className="bg-muted">
        <SectionHead
          eyebrow="Upcoming events"
          title="Events for doctors"
        />
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {events.map((e) => (
            <Reveal key={e.title}>
              <div className="border border-border bg-background p-6 transition-shadow hover:shadow-card">
                <span className="eyebrow text-cmda-green">{e.type}</span>
                <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-foreground">
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
          title="Stay informed and inspired"
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
      <Section className="paper">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="display-2 text-balance">Join the professional fellowship</h2>
          <p className="lede mt-6 text-muted-foreground">
            Whether you are a seasoned consultant or a young doctor just starting out, CMDA
            Nigeria welcomes you to a community of faith, excellence and service.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/membership" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "bg-cmda-green hover:bg-cmda-green-deep")}>
              Become a Member
            </Link>
            <Link to="/contact" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              Contact Us
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
