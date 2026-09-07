import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, Section, SectionHead, buttonVariants } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
import { BookOpen, Heart, Users, Stethoscope, GraduationCap, Globe, CalendarDays, MapPin, Newspaper } from "lucide-react";

const title = "Students' Arm | CMDA Nigeria";
const description =
  "The student fellowship of CMDA Nigeria — equipping medical and dental students for faith, excellence and service since 1981.";

export const Route = createFileRoute("/students-arm")({
  component: StudentsArmPage,
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
    icon: BookOpen,
    title: "Academic Excellence",
    desc: "We believe that academic and professional excellence glorifies God. Our programmes help students achieve their best in medical and dental training.",
  },
  {
    icon: Heart,
    title: "Spiritual Growth",
    desc: "Through fellowship meetings, Bible studies, prayer groups and retreats, students deepen their relationship with Christ and learn to integrate faith into practice.",
  },
  {
    icon: Users,
    title: "Community & Mentorship",
    desc: "Senior students and faculty mentors guide younger members, creating a culture of accountability, encouragement and lifelong professional relationships.",
  },
  {
    icon: Stethoscope,
    title: "Clinical Exposure",
    desc: "Hospital evangelism, community health outreaches and rural missions give students hands-on experience in compassionate, whole-person care.",
  },
  {
    icon: GraduationCap,
    title: "Leadership Development",
    desc: "From chapter executives to national coordinators, students learn to lead with integrity, serve with humility and organise with excellence.",
  },
  {
    icon: Globe,
    title: "Mission & Outreach",
    desc: "We deploy student teams to underserved communities across Nigeria, providing free medical care, health education and the hope of the Gospel.",
  },
];

const chapters = [
  { zone: "South-South", count: 8, schools: ["University of Benin", "University of Port Harcourt", "Ambrose Alli University"] },
  { zone: "South-West", count: 10, schools: ["University of Lagos", "Obafemi Awolowo University", "University of Ibadan"] },
  { zone: "South-East", count: 7, schools: ["University of Nigeria Nsukka", "Nnamdi Azikiwe University", "Imo State University"] },
  { zone: "North-Central", count: 8, schools: ["University of Jos", "University of Ilorin", "Benue State University"] },
  { zone: "North-West", count: 6, schools: ["Ahmadu Bello University", "Bayero University", "Usmanu Danfodiyo University"] },
  { zone: "North-East", count: 5, schools: ["University of Maiduguri", "Modibbo Adama University", "Taraba State University"] },
];

const stats = [
  { value: "9,700+", label: "Active student members" },
  { value: "55+", label: "Student chapters" },
  { value: "36+FCT", label: "States covered" },
  { value: "60+", label: "Universities represented" },
];

const events = [
  { date: "20–23 Aug 2026", title: "National Conference — Students", place: "Benin City, Edo State", type: "Conference" },
  { date: "TBA", title: "Zonal Prayer & Missions Conference", place: "Various Zones", type: "Conference" },
  { date: "TBA", title: "EXCEL National Training Week", place: "TBA", type: "Training" },
];

const newsletters = [
  { title: "Wholeness Journal", desc: "Annual academic and devotional journal featuring peer-reviewed articles, reflections, and chapter reports from across Nigeria." },
  { title: "Wholeness Magazine", desc: "Flagship publication with news, reports, enriching articles and future plans for CMDA student members." },
  { title: "Missions Exploits", desc: "Annual publication documenting the missions activities and experiences of student members." },
  { title: "Chapter Newsletters", desc: "Regular newsletters from local chapters sharing fellowship updates, testimonies and prayer points." },
];

function StudentsArmPage() {
  return (
    <>
      <PageHero
        eyebrow="Students' Arm"
        title="Building faith, excellence and service in the next generation"
        intro="Since 1981, CMDA Nigeria's student fellowship has grown into one of the largest Christian medical student movements in the world — shaping doctors who practise with conviction, compassion and skill."
      />

      {/* Overview */}
      <Section className="paper">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
                <p className="eyebrow text-cmda-green">Our story</p>
              </div>
              <h2 className="display-2 text-balance">
                From 17 chapters to a nationwide movement
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  The medical students' movement was founded in 1981 as the Intercollegiate
                  Christian Medical and Dental Association — Students Section (ICMDA-SS). Within a
                  decade it had become the largest student body of its kind in the world.
                </p>
                <p>
                  In 1985, students produced the first edition of their journal after securing a
                  loan of ₦30,000. The journal was launched at the annual conference in Port
                  Harcourt, which attracted more than 600 participants from 17 university teaching
                  hospitals.
                </p>
                <p>
                  Today, the student arm spans over 60 chapters across Nigerian universities,
                  with 9,700+ active members engaged in academic excellence, spiritual growth,
                  clinical outreach and leadership development.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative">
              <div className="framed">
                <img
                  src="/About1.webp"
                  alt="CMDA Nigeria students in fellowship"
                  loading="lazy"
                  className="aspect-4/5 size-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-4 hidden w-56 bg-primary-deep p-6 text-primary-foreground shadow-elegant sm:block lg:-right-12">
                <p className="font-display text-4xl leading-none font-extrabold text-cmda-green-light">9,700+</p>
                <p className="mt-3 text-xs leading-relaxed text-primary-foreground/75">
                  Active student members across Nigeria
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

      {/* Highlights */}
      <Section className="bg-muted">
        <SectionHead
          eyebrow="What we do"
          title="Equipping students for faith and practice"
        />
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h) => (
            <Reveal key={h.title}>
              <div className="border border-border bg-background p-8 transition-shadow hover:shadow-card">
                <h.icon className="mb-4 size-8 text-cmda-green" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                  {h.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{h.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Chapters by Zone */}
      <Section className="paper">
        <SectionHead
          eyebrow="Our chapters"
          title="55+ student chapters across 6 zones"
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
                  {z.schools.map((s) => (
                    <span key={s} className="rounded-none border border-border bg-muted px-2 py-0.5 text-[0.65rem] text-muted-foreground">
                      {s}
                    </span>
                  ))}
                  {z.count > 3 && (
                    <span className="rounded-none border border-border bg-muted px-2 py-0.5 text-[0.65rem] text-muted-foreground">
                      +{z.count - 3} more
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
          title="Events for students"
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
      <Section className="bg-primary-deep text-primary-foreground">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="display-2 text-balance">Ready to join the fellowship?</h2>
          <p className="lede mt-6 text-primary-foreground/75">
            Connect with a CMDA chapter at your university and start your journey of faith,
            excellence and service.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/membership" className={cn(buttonVariants({ variant: "gold", size: "lg" }))}>
              Become a Member
            </Link>
            <Link to="/contact" className={cn(buttonVariants({ variant: "onDark", size: "lg" }))}>
              Contact Us
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
