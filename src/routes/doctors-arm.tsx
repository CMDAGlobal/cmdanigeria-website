import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, Section, SectionHead, buttonVariants } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
import { Stethoscope, Heart, Globe, Award, Users, BookOpen } from "lucide-react";

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
  { value: "36+FCT", label: "States with active chapters" },
  { value: "50+", label: "Years of professional fellowship" },
  { value: "20+", label: "Countries with CMDA alumni" },
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
                <p className="font-display text-4xl leading-none font-extrabold text-gold">1972</p>
                <p className="mt-3 text-xs leading-relaxed text-primary-foreground/75">
                  The year the Fellowship of Christian Doctors in Nigeria was established
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal className="order-1 lg:order-2" delay={120}>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-gold" aria-hidden="true" />
                <p className="eyebrow text-primary">Our story</p>
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
                <p className="font-display text-3xl font-extrabold tracking-tight text-gold lg:text-4xl">
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
                <p.icon className="mb-4 size-8 text-primary" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
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
            <Link to="/membership" className={cn(buttonVariants({ variant: "primary", size: "lg" }))}>
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
