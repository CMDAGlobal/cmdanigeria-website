import { Link } from "@tanstack/react-router";
import { ArrowLeft, Globe2 } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, Section, SectionHead, buttonVariants } from "@/components/site/primitives";
import { PortableContent } from "@/components/site/portable";
import { cn } from "@/lib/utils";
import type { RegionDetail } from "@/sanity/types";
import {
  ActivityCard,
  AnnouncementCard,
  ChapterCard,
  EventCard,
  GalleryGrid,
  LeaderCard,
  NewsletterCard,
} from "./cards";

function Stats({ region }: { region: RegionDetail }) {
  if (!region.stats?.length) return null;
  return (
    <Section className="paper">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 lg:grid-cols-4">
        {region.stats.map((stat, index) => (
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

function Overview({ region }: { region: RegionDetail }) {
  const hasText = Boolean(region.overview?.length) || Boolean(region.mission);
  if (!hasText && !region.countries?.length && !region.focus?.length) return null;
  return (
    <Section className="bg-muted" id="overview">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
            <p className="eyebrow text-cmda-green">About this region</p>
          </div>
          <h2 className="display-2 mt-6 text-balance">{region.name} — overview</h2>
          {region.overview?.length ? (
            <div className="mt-8 text-base leading-relaxed text-muted-foreground">
              <PortableContent value={region.overview} />
            </div>
          ) : null}
          {region.mission ? (
            <p className="mt-6 border-l-4 border-cmda-green pl-6 font-display text-lg font-semibold tracking-tight text-foreground">
              {region.mission}
            </p>
          ) : null}
        </Reveal>
        {region.countries?.length ? (
          <div className="mt-10">
            <p className="eyebrow text-cmda-green">Countries covered</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {region.countries.map((country) => (
                <span
                  key={country}
                  className="border border-cmda-green/30 bg-cmda-green/5 px-3 py-1 text-sm font-semibold text-cmda-green"
                >
                  {country}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        {region.focus?.length ? (
          <div className="mt-10">
            <p className="eyebrow text-cmda-green">Focus areas</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {region.focus.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 border border-border bg-background px-4 py-3 text-sm font-medium text-foreground"
                >
                  <Globe2 className="size-4 shrink-0 text-cmda-green" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </Section>
  );
}

function Leadership({ region }: { region: RegionDetail }) {
  if (!region.leaders?.length) return null;
  return (
    <Section className="paper" id="leadership">
      <SectionHead
        eyebrow="Regional leadership"
        title="Who leads this region"
        intro="A team of committed alumni steering fellowship, missions and connection back to home."
      />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {region.leaders.map((leader) => (
          <LeaderCard key={leader._id} leader={leader} />
        ))}
      </div>
    </Section>
  );
}

function Activities({ region }: { region: RegionDetail }) {
  if (!region.activities?.length) return null;
  return (
    <Section className="bg-muted" id="activities">
      <SectionHead eyebrow="Regional activities" title="What the region is doing" />
      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {region.activities.map((activity) => (
          <ActivityCard key={activity._id} activity={activity} />
        ))}
      </div>
    </Section>
  );
}

function Events({ region }: { region: RegionDetail }) {
  if (!region.events?.length) return null;
  return (
    <Section className="paper" id="events">
      <SectionHead
        eyebrow="Regional events"
        title="Upcoming & past events"
        intro="Events and gatherings specific to this region. Registration links appear when available."
      />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {region.events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </Section>
  );
}

function Announcements({ region }: { region: RegionDetail }) {
  if (!region.announcements?.length) return null;
  return (
    <Section className="bg-muted" id="announcements">
      <SectionHead eyebrow="Regional announcements" title="News & notices" />
      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {region.announcements.map((announcement) => (
          <AnnouncementCard key={announcement._id} announcement={announcement} />
        ))}
      </div>
    </Section>
  );
}

function Chapters({ region }: { region: RegionDetail }) {
  if (!region.chapters?.length) return null;
  return (
    <Section className="paper" id="chapters">
      <SectionHead
        eyebrow="Regional chapters"
        title="Country groups & chapters"
        intro="Click a chapter to explore its leadership, activities and events."
      />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {region.chapters.map((chapter) => (
          <ChapterCard key={chapter._id} chapter={chapter} />
        ))}
      </div>
    </Section>
  );
}

function Publications({ region }: { region: RegionDetail }) {
  if (!region.newsletters?.length) return null;
  return (
    <Section className="bg-muted" id="publications">
      <SectionHead eyebrow="Publications" title="Newsletters & resources" />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {region.newsletters.map((item, index) => (
          <NewsletterCard key={item.title ?? index} item={item} />
        ))}
      </div>
    </Section>
  );
}

function Gallery({ region }: { region: RegionDetail }) {
  if (!region.gallery?.length) return null;
  return (
    <Section className="paper" id="media">
      <SectionHead eyebrow="Media" title="Photo gallery" />
      <div className="mt-16">
        <GalleryGrid images={region.gallery} />
      </div>
    </Section>
  );
}

export function RegionPage({ region }: { region: RegionDetail | null | undefined }) {
  if (!region) {
    return (
      <Section className="flex min-h-[50vh] items-center py-32">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="display-2 text-balance">Region not found</h1>
          <p className="lede mt-6 text-muted-foreground">
            The region you are looking for does not exist or has not been published yet.
          </p>
          <Link to="/global-network" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-8")}>
            <ArrowLeft className="size-4" aria-hidden="true" />Back to Global Network
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={region.eyebrow ?? "Global Network"}
        title={region.tagline ?? region.name}
        intro={region.intro ?? ""}
        image={region.heroImage}
      />
      <Stats region={region} />
      <Overview region={region} />
      <Leadership region={region} />
      <Activities region={region} />
      <Events region={region} />
      <Announcements region={region} />
      <Chapters region={region} />
      <Publications region={region} />
      <Gallery region={region} />
      <Section className="bg-primary-deep text-primary-foreground">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="display-2 text-balance">Get involved in {region.name}</h2>
          <p className="lede mt-6 text-primary-foreground/75">
            {region.tagline ?? "Connect with the region network and keep the mission alive."}
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