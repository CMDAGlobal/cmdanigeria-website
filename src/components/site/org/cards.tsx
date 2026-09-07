import { Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { ArrowUpRight, CalendarDays, MapPin, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { PortableContent } from "@/components/site/portable";
import { Reveal } from "@/components/site/primitives";
import type {
  ActivityRecord,
  AnnouncementRecord,
  ChapterRecord,
  EventRecord,
  LeaderRecord,
  NewsletterEntry,
  SanityImage,
} from "@/sanity/types";

export function typeLabel(type?: string | null): string {
  const labels: Record<string, string> = {
    conference: "Conference",
    fellowship: "Fellowship",
    prayer: "Prayer",
    training: "Training",
    outreach: "Outreach",
    mission: "Medical mission",
    retreat: "Retreat",
    webinar: "Webinar",
    meeting: "Meeting",
    project: "Project",
    health: "Community health",
    other: "Other",
  };
  return type ? labels[type] ?? type : "Event";
}

export function formatDate(value?: string | null): string | null {
  if (!value) return null;
  try {
    return format(parseISO(value), "d MMM yyyy");
  } catch {
    return null;
  }
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({
  image,
  name,
  className,
}: {
  image?: SanityImage | null | undefined;
  name: string;
  className?: string;
}) {
  if (image?.asset?.url) {
    return (
      <img
        src={image.asset.url}
        alt={image.alt ?? name}
        loading="lazy"
        className={cn("object-cover", className)}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center bg-primary font-display font-bold text-primary-foreground",
        className,
      )}
    >
      {initials(name)}
    </div>
  );
}

export function LeaderCard({ leader }: { leader: LeaderRecord }) {
  const role = leader.position ?? leader.chapterRole ?? "Leader";
  const detail = [leader.institution, leader.chapter, leader.country].filter(Boolean).join(" · ");
  return (
    <Reveal className="h-full">
      <div className="flex h-full flex-col border border-border bg-background p-6 transition-shadow hover:shadow-card">
        <Avatar
          image={leader.headshot}
          name={leader.name}
          className="mx-auto aspect-[4/5] w-full max-w-40 object-cover"
        />
        <div className="mt-5 text-center">
          <h3 className="font-display text-base font-bold tracking-tight text-foreground">{leader.name}</h3>
          <p className="mt-1 text-sm font-semibold text-cmda-green">{role}</p>
          {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
          {leader.bio ? (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{leader.bio}</p>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
}

export function EventCard({ event }: { event: EventRecord }) {
  const date = formatDate(event.startDate);
  const location = [event.venue, event.location].filter(Boolean).join(" · ");
  const upcoming = !event.startDate
    ? true
    : (() => {
        try {
          return parseISO(event.startDate).getTime() >= Date.now() - 1000 * 60 * 60 * 24;
        } catch {
          return true;
        }
      })();
  return (
    <Reveal className="h-full">
      <div className="flex h-full flex-col border border-border bg-background p-6 transition-shadow hover:shadow-card">
        <div className="flex items-center justify-between gap-4">
          <span className="eyebrow text-cmda-green">{typeLabel(event.type)}</span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide",
              upcoming ? "bg-cmda-green/10 text-cmda-green" : "bg-muted text-muted-foreground",
            )}
          >
            {upcoming ? "Upcoming" : "Past"}
          </span>
        </div>
        <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-foreground">{event.title}</h3>
        {event.description?.length ? (
          <div className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            <PortableContent value={event.description} />
          </div>
        ) : null}
        <div className="mt-5 space-y-1.5 text-sm text-muted-foreground">
          {date ? (
            <p className="flex items-center gap-2">
              <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
              {date}
              {event.endDate ? ` – ${formatDate(event.endDate)}` : ""}
            </p>
          ) : null}
          {location ? (
            <p className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              {location}
            </p>
          ) : null}
        </div>
        {(event.registrationUrl || event.report) && (
          <div className="mt-5 flex items-center gap-4 border-t border-border pt-4">
            {event.registrationUrl ? (
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-sm font-semibold text-cmda-green hover:text-cmda-green-deep"
              >
                Register ↗
              </a>
            ) : null}
            {event.report ? (
              <span className="text-xs text-muted-foreground" title="Event report">
                Report available
              </span>
            ) : null}
          </div>
        )}
      </div>
    </Reveal>
  );
}

export function ActivityCard({ activity }: { activity: ActivityRecord }) {
  return (
    <Reveal className="h-full">
      <div className="flex h-full flex-col border border-border bg-background p-6 transition-shadow hover:shadow-card">
        <span className="eyebrow text-cmda-green">{typeLabel(activity.type)}</span>
        <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-foreground">{activity.title}</h3>
        {activity.description?.length ? (
          <div className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            <PortableContent value={activity.description} />
          </div>
        ) : null}
        {activity.outcome ? (
          <p className="mt-4 border-t border-border pt-3 text-xs font-medium text-muted-foreground">
            Outcome: {activity.outcome}
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}

export function AnnouncementCard({ announcement }: { announcement: AnnouncementRecord }) {
  const date = formatDate(announcement.publishedAt);
  return (
    <Reveal className="h-full">
      <article className="flex h-full flex-col border border-border bg-background p-6 transition-shadow hover:shadow-card">
        <div className="flex items-center gap-3">
          {announcement.category ? (
            <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-gold">
              {announcement.category}
            </span>
          ) : null}
          {announcement.pinned ? (
            <span className="text-[0.65rem] font-bold uppercase tracking-wide text-cmda-green">Pinned</span>
          ) : null}
        </div>
        <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-foreground">
          {announcement.title}
        </h3>
        {date ? <p className="mt-1 text-xs text-muted-foreground">{date}</p> : null}
        {announcement.body?.length ? (
          <div className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            <PortableContent value={announcement.body} />
          </div>
        ) : null}
        {announcement.link ? (
          <a
            href={announcement.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 font-display text-sm font-semibold text-cmda-green hover:text-cmda-green-deep"
          >
            Read more <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        ) : null}
      </article>
    </Reveal>
  );
}

export function ChapterCard({
  chapter,
  to,
  params,
}: {
  chapter: ChapterRecord;
  to?: "/chapters/$slug";
  params?: { slug: string };
}) {
  const subtitle = [chapter.institution, chapter.location, chapter.country].filter(Boolean).join(" · ");
  const card = (
    <div className="flex h-full flex-col border border-border bg-background p-6 transition-all hover:border-cmda-green hover:shadow-card">
      <div className="flex items-start justify-between gap-4">
        <Avatar
          image={chapter.logo}
          name={chapter.name}
          className="size-14 shrink-0 rounded-none border border-border object-cover"
        />
        <ArrowUpRight className="size-5 shrink-0 text-cmda-green" aria-hidden="true" />
      </div>
      <h3 className="mt-4 font-display text-base font-bold tracking-tight text-foreground">{chapter.name}</h3>
      {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      {chapter.establishedAt ? (
        <p className="mt-2 text-xs text-muted-foreground">Est. {chapter.establishedAt}</p>
      ) : null}
    </div>
  );
  return (
    <Reveal className="h-full">
      {to ? (
        <Link to={to} params={params as { slug: string }} className="block h-full">
          {card}
        </Link>
      ) : (
        card
      )}
    </Reveal>
  );
}

export function NewsletterCard({ item }: { item: NewsletterEntry }) {
  return (
    <Reveal className="h-full">
      <div className="flex h-full flex-col border border-border bg-background p-6 transition-shadow hover:shadow-card">
        <Newspaper className="mb-3 size-6 text-cmda-green" aria-hidden="true" />
        <h3 className="font-display text-lg font-bold tracking-tight text-foreground">{item.title}</h3>
        {item.description ? (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        ) : null}
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 font-display text-sm font-semibold text-cmda-green hover:text-cmda-green-deep"
          >
            Open <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </Reveal>
  );
}

export function GalleryGrid({ images }: { images?: SanityImage[] | null }) {
  if (!images || images.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {images.map((image, index) => (
        <Reveal key={image.asset?._id ?? `g-${index}`} delay={index * 40}>
          <figure className="group relative overflow-hidden border border-border">
            {image.asset?.url ? (
              <img
                src={image.asset.url}
                alt={image.alt ?? ""}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : null}
            {image.caption ? (
              <figcaption className="absolute inset-x-0 bottom-0 bg-primary-deep/80 px-3 py-2 text-xs text-primary-foreground backdrop-blur">
                {image.caption}
              </figcaption>
            ) : null}
          </figure>
        </Reveal>
      ))}
    </div>
  );
}