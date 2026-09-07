import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, Section, SectionHead, buttonVariants } from "@/components/site/primitives";
import { PortableContent } from "@/components/site/portable";
import { cn } from "@/lib/utils";
import type { ZoneDetail } from "@/sanity/types";
import { ChapterCard, GalleryGrid, LeaderCard } from "./cards";

function zoneArm(zone: ZoneDetail): "students" | "doctors" {
  return zone.chapters?.some((chapter) => chapter.arm === "students") ? "students" : "doctors";
}

const armLabels: Record<string, string> = {
  students: "Students' Arm",
  doctors: "Doctors' Arm",
};

function BackLink({ zone }: { zone: ZoneDetail }) {
  const arm = zoneArm(zone);
  return (
    <Section className="pb-0">
      <div className="mx-auto max-w-7xl">
        <Link
          to={arm === "students" ? "/students-arm" : "/doctors-arm"}
          className="inline-flex items-center gap-2 font-display text-sm font-semibold text-cmda-green hover:text-cmda-green-deep"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to {armLabels[arm]}
        </Link>
      </div>
    </Section>
  );
}

function About({ zone }: { zone: ZoneDetail }) {
  if (!zone.overview?.length) return null;
  return (
    <Section className="bg-muted" id="about">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
            <p className="eyebrow text-cmda-green">About this zone</p>
          </div>
          <h2 className="display-2 mt-6 text-balance">{zone.name} — overview</h2>
          <div className="mt-8 text-base leading-relaxed text-muted-foreground">
            <PortableContent value={zone.overview} />
          </div>
          {zone.countries?.length ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {zone.countries.map((country) => (
                <span key={country} className="border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground">
                  {country}
                </span>
              ))}
            </div>
          ) : null}
        </Reveal>
      </div>
    </Section>
  );
}

function Stats({ zone }: { zone: ZoneDetail }) {
  if (!zone.stats?.length) return null;
  return (
    <Section className="paper">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 lg:grid-cols-4">
        {zone.stats.map((stat, index) => (
          <Reveal key={stat.label ?? index}>
            <div className="text-center">
              <p className="font-display text-3xl font-extrabold tracking-tight text-cmda-green lg:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs tracking-wide uppercase text-muted-foreground">{stat.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Leaders({ zone }: { zone: ZoneDetail }) {
  if (!zone.leaders?.length) return null;
  return (
    <Section className="paper" id="leaders">
      <SectionHead eyebrow="Zonal leadership" title="Leaders in this zone" />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {zone.leaders.map((leader) => (
          <LeaderCard key={leader._id} leader={leader} />
        ))}
      </div>
    </Section>
  );
}

function Chapters({ zone }: { zone: ZoneDetail }) {
  if (!zone.chapters?.length) return null;
  return (
    <Section className="bg-muted" id="chapters">
      <SectionHead eyebrow="Chapters" title="Chapters in this zone" />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {zone.chapters.map((chapter) => (
          <ChapterCard key={chapter._id} chapter={chapter} to="/chapters/$slug" params={{ slug: chapter.slug?.current ?? chapter._id }} />
        ))}
      </div>
    </Section>
  );
}

function Gallery({ zone }: { zone: ZoneDetail }) {
  if (!zone.gallery?.length) return null;
  return (
    <Section className="paper" id="media">
      <SectionHead eyebrow="Media" title="Zone gallery" />
      <div className="mt-16">
        <GalleryGrid images={zone.gallery} />
      </div>
    </Section>
  );
}

export function ZonePage({ zone }: { zone: ZoneDetail | null | undefined }) {
  if (!zone) {
    return (
      <Section className="flex min-h-[50vh] items-center py-32">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="display-2 text-balance">Zone not found</h1>
          <p className="lede mt-6 text-muted-foreground">
            The zone you are looking for does not exist or has not been published yet.
          </p>
          <Link to="/doctors-arm" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-8")}>
            <ArrowLeft className="size-4" aria-hidden="true" />Back to Doctors' Arm
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={zone.eyebrow ?? "Zone"}
        title={zone.name}
        intro={zone.intro ?? zone.tagline ?? ""}
      />
      <BackLink zone={zone} />
      <About zone={zone} />
      <Stats zone={zone} />
      <Leaders zone={zone} />
      <Chapters zone={zone} />
      <Gallery zone={zone} />
      <Section className="bg-primary-deep text-primary-foreground">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="display-2 text-balance">Get involved in the {zone.name}</h2>
          <p className="lede mt-6 text-primary-foreground/75">
            Connect with a chapter near you, volunteer for outreach, or reach out to the zonal leadership.
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