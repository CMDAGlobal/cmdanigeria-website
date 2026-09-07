import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { Reveal, Section, SectionHead } from "@/components/site/primitives";
import type {
  AnnouncementRecord,
  EventRecord,
  LeaderRecord,
  ZoneRecord,
} from "@/sanity/types";
import { AnnouncementCard, EventCard, LeaderCard } from "./cards";

export function ArmNec({
  nec,
  eyebrow,
  title,
  intro,
}: {
  nec?: LeaderRecord[] | null | undefined;
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  if (!nec?.length) return null;
  return (
    <Section className="bg-muted" id="nec">
      <SectionHead
        eyebrow={eyebrow ?? "National Executive Committee (NEC)"}
        title={title}
        intro={intro ?? "Names are managed from the CMS."}
      />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {nec.map((leader) => (
          <LeaderCard key={leader._id} leader={leader} />
        ))}
      </div>
    </Section>
  );
}

export function ArmZones({
  zones,
  title,
  intro,
}: {
  zones?: ZoneRecord[] | null | undefined;
  title: string;
  intro?: string;
}) {
  if (!zones?.length) return null;
  return (
    <Section className="paper">
      <SectionHead eyebrow="Our chapters" title={title} intro={intro} />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {zones.map((zone) => (
          <Reveal key={zone._id}>
            <div className="flex h-full flex-col border border-border bg-background p-6 transition-shadow hover:shadow-card">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                  <Link
                    to="/zones/$slug"
                    params={{ slug: zone.slug?.current ?? zone._id }}
                    className="transition-colors hover:text-cmda-green"
                  >
                    {zone.name}
                  </Link>
                </h3>
                <span className="font-display text-2xl font-extrabold text-cmda-green">
                  {zone.chapterCount ?? 0}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">chapters</p>
              {zone.intro ? <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{zone.intro}</p> : null}
              {zone.sampleChapters?.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {zone.sampleChapters.map((chapter) => (
                    <Link
                      key={chapter._id}
                      to="/chapters/$slug"
                      params={{ slug: chapter.slug?.current ?? chapter._id }}
                      className="group inline-flex items-center gap-1 border border-border bg-muted px-2 py-0.5 text-[0.7rem] font-medium text-muted-foreground transition-colors hover:border-cmda-green hover:text-cmda-green"
                    >
                      {chapter.name}
                      <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                    </Link>
                  ))}
                  {(zone.chapterCount ?? 0) > 8 ? (
                    <span className="rounded-none border border-border bg-muted px-2 py-0.5 text-[0.7rem] text-muted-foreground">
                      +{(zone.chapterCount ?? 0) - 8} more
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function ArmEvents({
  events,
  eyebrow,
  title,
}: {
  events?: EventRecord[] | null | undefined;
  eyebrow?: string;
  title: string;
}) {
  return (
    <Section className="bg-muted">
      <SectionHead eyebrow={eyebrow ?? "Upcoming events"} title={title} />
      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {events?.length ? (
          events.map((event) => <EventCard key={event._id} event={event} />)
        ) : (
          <Reveal className="lg:col-span-3">
            <div className="border border-border bg-background p-8 text-center">
              <CalendarDays className="mx-auto mb-4 size-8 text-cmda-green" aria-hidden="true" />
              <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                No upcoming events yet
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Events will be published here by the national office as they are announced.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </Section>
  );
}

export function ArmAnnouncements({
  announcements,
  eyebrow,
  title,
}: {
  announcements?: AnnouncementRecord[] | null | undefined;
  eyebrow?: string;
  title: string;
}) {
  if (!announcements?.length) return null;
  return (
    <Section className="paper">
      <SectionHead eyebrow={eyebrow ?? "Announcements"} title={title} />
      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {announcements.map((announcement) => (
          <AnnouncementCard key={announcement._id} announcement={announcement} />
        ))}
      </div>
    </Section>
  );
}