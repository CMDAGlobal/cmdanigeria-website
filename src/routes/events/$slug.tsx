import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Clock, MapPin, Users, Video } from "lucide-react";
import { format, parseISO } from "date-fns";

import { PageHero } from "@/components/site/PageHero";
import { Reveal, Section, buttonVariants } from "@/components/site/primitives";
import { PortableContent } from "@/components/site/portable";
import { formatDate, modeLabel, typeLabel } from "@/components/site/org/cards";
import { eventPlace } from "@/components/site/Events";
import { fetchEvent } from "@/sanity/data";
import { cn } from "@/lib/utils";

const siteTitle = "Event | CMDA Nigeria";
const siteDescription = "Conferences, retreats, outreaches and gatherings from CMDA Nigeria.";

export const Route = createFileRoute("/events/$slug")({
  loader: async ({ params }) => ({ event: await fetchEvent({ data: params.slug }) }),
  component: EventDetailPage,
  head: ({ loaderData }) => {
    const event = loaderData?.event;
    const title = event ? `${event.title} | CMDA Nigeria Events` : siteTitle;
    const place = event ? eventPlace(event) : "";
    const description = place ? `${typeLabel(event?.type)} — ${place}` : siteDescription;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
});

function formatTime(value?: string | null): string | null {
  if (!value) return null;
  try {
    return format(parseISO(value), "h:mm a");
  } catch {
    return null;
  }
}

function EventDetailPage() {
  const { event } = Route.useLoaderData();

  if (!event) {
    return (
      <>
        <PageHero
          eyebrow="Events"
          title="Event not found"
          intro="This event may have been unpublished or the address may be incorrect."
        />
        <Section className="paper">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Link to="/events" className={cn(buttonVariants({ variant: "primary" }))}>
              Back to all events
            </Link>
          </Reveal>
        </Section>
      </>
    );
  }

  const date = formatDate(event.startDate);
  const endDate = formatDate(event.endDate);
  const startTime = formatTime(event.startDate);
  const endTime = formatTime(event.endDate);
  const coverUrl = event.cover?.asset?.url;
  const hasDescription = Boolean(event.description?.length);

  return (
    <>
      <PageHero eyebrow={typeLabel(event.type)} title={event.title} intro={eventPlace(event)} />
      <Section className="paper">
        <article className="mx-auto max-w-3xl">
          <Reveal>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cmda-green hover:text-cmda-green-deep"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              All events
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border pb-6 text-sm text-muted-foreground">
              {date ? (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {date}
                  {endDate && endDate !== date ? ` – ${endDate}` : ""}
                </span>
              ) : null}
              {startTime ? (
                <span className="inline-flex items-center gap-2">
                  <Clock className="size-4" aria-hidden="true" />
                  {startTime}
                  {endTime ? ` – ${endTime}` : ""}
                </span>
              ) : null}
              {event.mode ? (
                <span className="inline-flex items-center gap-2">
                  {event.mode === "virtual" ? (
                    <Video className="size-4" aria-hidden="true" />
                  ) : (
                    <MapPin className="size-4" aria-hidden="true" />
                  )}
                  {modeLabel(event.mode)}
                </span>
              ) : null}
              {event.organizer ? (
                <span className="inline-flex items-center gap-2">
                  <Users className="size-4" aria-hidden="true" />
                  {event.organizer}
                </span>
              ) : null}
            </div>

            {coverUrl ? (
              <img
                src={coverUrl}
                alt={event.cover?.alt ?? event.title}
                className="mt-8 aspect-video w-full border border-border object-cover"
              />
            ) : null}

            {event.mode !== "virtual" ? (
              <p className="mt-6 text-sm text-muted-foreground">
                <MapPin className="mr-1 inline size-4" aria-hidden="true" />
                {eventPlace(event)}
              </p>
            ) : null}

            <div className="mt-8 text-base leading-relaxed text-foreground">
              {hasDescription ? (
                <PortableContent value={event.description} />
              ) : (
                <p className="text-muted-foreground">
                  Details for this event will be announced soon.
                </p>
              )}
            </div>

            {event.registrationUrl ? (
              <div className="mt-10 border-t border-border pt-6">
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "primary" }))}
                >
                  <CalendarDays className="size-4" aria-hidden="true" />
                  Register for this event
                </a>
              </div>
            ) : null}

            {event.report ? (
              <div className="mt-10 border-t border-border pt-6">
                <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
                  Event report
                </h2>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {event.report}
                </p>
              </div>
            ) : null}
          </Reveal>
        </article>
      </Section>
    </>
  );
}
