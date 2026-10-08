import { Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, Section, SectionHead, buttonVariants } from "@/components/site/primitives";
import { PortableContent } from "@/components/site/portable";
import { cn } from "@/lib/utils";
import type { ChapterDetail } from "@/sanity/types";
import { EventCard, GalleryGrid, LeaderCard } from "./cards";
import { chapterStats, upcomingEvents } from "./chapter-stats";
import {
  CHAPTER_EXECUTIVE_POSITIONS,
  CLASS_EXECUTIVE_POSITIONS,
  matchExecutives,
} from "./executive-positions";
import { ExecutiveBlock } from "./executives";
import { ContactSection, NewsSection, ResourcesSection } from "./UnitSections";

const armLabels: Record<string, string> = {
  global: "Global Network",
  students: "Students' Arm",
  doctors: "Doctors' Arm",
};

function BackLink({ chapter }: { chapter: ChapterDetail }) {
  const to =
    chapter.arm === "doctors"
      ? "/doctors-arm"
      : chapter.arm === "global"
        ? "/global-network"
        : "/students-arm";
  const label = armLabels[chapter.arm ?? ""] ?? "Chapters";
  return (
    <Section className="pb-0">
      <div className="mx-auto max-w-7xl">
        <Link
          to={to}
          className="inline-flex items-center gap-2 font-display text-sm font-semibold text-cmda-green hover:text-cmda-green-deep"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to {label}
        </Link>
      </div>
    </Section>
  );
}

function About({ chapter }: { chapter: ChapterDetail }) {
  const hasDescription = !!chapter.description?.length;
  const hasHistory = !!chapter.history?.length;
  const hasMission = typeof chapter.mission === "string" && chapter.mission.trim().length > 0;
  if (!hasDescription && !hasHistory && !hasMission) return null;
  return (
    <Section className="bg-muted" id="about">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
            <p className="eyebrow text-cmda-green">About this chapter</p>
          </div>
          <h2 className="display-2 mt-6 text-balance">{chapter.name} — overview</h2>
          {hasDescription && (
            <div className="mt-8 text-base leading-relaxed text-muted-foreground">
              <PortableContent value={chapter.description} />
            </div>
          )}
          {hasMission && (
            <div className="mt-10 rounded-xl border-l-4 border-cmda-green bg-background p-6">
              <h3 className="font-display text-xl font-bold text-foreground">
                Mission &amp; objectives
              </h3>
              <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                {chapter.mission}
              </p>
            </div>
          )}
          {hasHistory && (
            <div className="mt-10">
              <h3 className="font-display text-xl font-bold text-foreground">History</h3>
              <div className="mt-4 text-base leading-relaxed text-muted-foreground">
                <PortableContent value={chapter.history} />
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </Section>
  );
}

/**
 * Every chapter carries the strip: values come from the stats the chapter admin
 * enters in the dashboard, and chapters without rows show the placeholder pair
 * rather than disappearing.
 */
function Stats({ chapter }: { chapter: ChapterDetail }) {
  const stats = chapterStats(chapter.membership);
  return (
    <Section className="paper" id="stats">
      <SectionHead eyebrow="Chapter statistics" title="At a glance" />
      <div
        className={cn(
          "mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-8",
          stats.length > 2 ? "lg:grid-cols-4" : "lg:grid-cols-2",
        )}
      >
        {stats.map((stat, index) => (
          <Reveal key={`${stat.label ?? index}`}>
            <div className="text-center">
              <p className="font-display text-3xl font-extrabold tracking-tight text-cmda-green lg:text-4xl">
                {stat.value || "—"}
              </p>
              <p className="mt-1 text-xs tracking-wide uppercase text-muted-foreground">
                {stat.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Exco({ chapter }: { chapter: ChapterDetail }) {
  if (!chapter.exco?.length) return null;
  return (
    <Section className="paper" id="exco">
      <SectionHead
        eyebrow="Executive committee"
        title="Chapter leadership"
        intro="The officers steering fellowship, missions and excellence at this chapter."
      />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {chapter.exco.map((leader) => (
          <LeaderCard key={leader._id} leader={leader} />
        ))}
      </div>
    </Section>
  );
}

/**
 * Student chapters show the two lower tiers of the Students' Executive
 * Committee: every listed office is rendered in order, filled from the
 * chapter's CMS leaders where they exist and as photo/name placeholders where
 * they do not. Leaders matching neither list are appended to the chapter block
 * so nobody attached to the chapter is hidden.
 */
function StudentsExecutives({ chapter }: { chapter: ChapterDetail }) {
  const result = matchExecutives(
    [{ positions: CHAPTER_EXECUTIVE_POSITIONS }, { positions: CLASS_EXECUTIVE_POSITIONS }],
    chapter.exco,
  );
  const chapterSlots = [...(result.groups[0]?.slots ?? []), ...result.extras];
  return (
    <>
      <ExecutiveBlock
        id="exco"
        tone="muted"
        eyebrow="Executive committee"
        title="Chapter executive committee"
        intro="The officers steering fellowship, missions and excellence at this chapter."
        slots={chapterSlots}
      />
      <ExecutiveBlock
        tone="paper"
        eyebrow="Class executives"
        title="Class executive committee"
        intro="Class officers coordinating academics, missions and prayer for each class."
        slots={result.groups[1]?.slots ?? []}
      />
    </>
  );
}

/** Always shown: the chapter's upcoming events, or a check-back-later panel. */
function Events({ chapter }: { chapter: ChapterDetail }) {
  const upcoming = upcomingEvents(chapter.events);
  return (
    <Section className="bg-muted" id="events">
      <SectionHead
        eyebrow="Events & activities"
        title="Upcoming events at this chapter"
        intro="Fellowship meetings, outreaches and trainings scheduled for this chapter."
      />
      {upcoming.length ? (
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <Reveal className="mt-16">
          <div className="mx-auto max-w-2xl border border-dashed border-border bg-background p-10 text-center">
            <CalendarDays className="mx-auto size-8 text-cmda-green" aria-hidden="true" />
            <h3 className="mt-4 font-display text-xl font-bold text-foreground">
              No upcoming events yet
            </h3>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Events and activities for this chapter will be listed here as soon as they are
              scheduled.
            </p>
            <Link
              to="/events"
              className="mt-5 inline-flex font-display text-sm font-semibold text-cmda-green hover:text-cmda-green-deep"
            >
              Browse all CMDA Nigeria events →
            </Link>
          </div>
        </Reveal>
      )}
    </Section>
  );
}

function Gallery({ chapter }: { chapter: ChapterDetail }) {
  if (!chapter.gallery?.length) return null;
  return (
    <Section className="paper" id="media">
      <SectionHead eyebrow="Media" title="Chapter gallery" />
      <div className="mt-16">
        <GalleryGrid images={chapter.gallery} />
      </div>
    </Section>
  );
}

export function ChapterPage({ chapter }: { chapter: ChapterDetail | null | undefined }) {
  if (!chapter) {
    return (
      <Section className="flex min-h-[50vh] items-center py-32">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="display-2 text-balance">Chapter not found</h1>
          <p className="lede mt-6 text-muted-foreground">
            The chapter you are looking for does not exist or has not been published yet.
          </p>
          <Link
            to="/students-arm"
            className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-8")}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to Students' Arm
          </Link>
        </div>
      </Section>
    );
  }

  const subtitle = [chapter.institution, chapter.location, chapter.country]
    .filter(Boolean)
    .join(" · ");
  return (
    <>
      <PageHero
        eyebrow={`${armLabels[chapter.arm ?? ""] ?? "Chapter"}${chapter.zone?.name ? ` — ${chapter.zone.name}` : ""}`}
        title={chapter.name}
        intro={subtitle}
        image={chapter.logo}
      />
      <BackLink chapter={chapter} />
      <About chapter={chapter} />
      <Stats chapter={chapter} />
      {chapter.arm === "students" ? (
        <StudentsExecutives chapter={chapter} />
      ) : (
        <Exco chapter={chapter} />
      )}
      <Events chapter={chapter} />
      <NewsSection news={chapter.news} title={`${chapter.name} news`} />
      <Gallery chapter={chapter} />
      <ResourcesSection resources={chapter.resources} title="Chapter resources" />
      <ContactSection contact={chapter.contactInfo} social={chapter.socialLinks} />
      <Section className="bg-primary-deep text-primary-foreground">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="display-2 text-balance">Get involved at {chapter.name}</h2>
          <p className="lede mt-6 text-primary-foreground/75">
            Join the chapter fellowship, volunteer for outreach, or reach out to the executive
            committee.
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
