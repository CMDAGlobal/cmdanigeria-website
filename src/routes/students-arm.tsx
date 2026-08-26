import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, Section, SectionHead, buttonVariants } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
import { BookOpen, Heart, Users, Stethoscope, GraduationCap, Globe } from "lucide-react";

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

const timeline = [
  { year: "1981", event: "Student fellowship established as ICMDA-SS (NCCMDA)" },
  { year: "1985", event: "First student journal published; 600+ participants at the Port Harcourt conference" },
  { year: "1990s", event: "Became the largest Christian medical student body in the world" },
  { year: "2000s", event: "Expanded to over 60 student chapters across Nigerian universities" },
  { year: "Today", event: "9,700+ active student members in chapters nationwide" },
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
                <span className="h-px w-10 bg-gold" aria-hidden="true" />
                <p className="eyebrow text-primary">Our story</p>
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
                <p className="font-display text-4xl leading-none font-extrabold text-gold">9,700+</p>
                <p className="mt-3 text-xs leading-relaxed text-primary-foreground/75">
                  Active student members across Nigeria
                </p>
              </div>
            </div>
          </Reveal>
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
                <h.icon className="mb-4 size-8 text-primary" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                  {h.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{h.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Timeline */}
      <Section className="paper">
        <SectionHead
          eyebrow="Our journey"
          title="Key milestones"
        />
        <div className="mx-auto mt-16 max-w-3xl">
          {timeline.map((t, i) => (
            <Reveal key={t.year}>
              <div className="flex gap-6 border-b border-border py-6">
                <span className="shrink-0 font-display text-lg font-extrabold text-primary">
                  {t.year}
                </span>
                <p className="text-base leading-relaxed text-muted-foreground">{t.event}</p>
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
