import { CalendarDays, MapPin, Users } from "lucide-react";

import { buttonVariants, Reveal, Section, SectionHead } from "@/components/site/primitives";
import { outreachDateLabel, outreachStatusLabel } from "@/components/site/outreach-labels";
import type { OutreachRecord } from "@/sanity/types";
import { cn } from "@/lib/utils";

/**
 * Public listing for published outreaches: the What We Do programme page is
 * their home on the site, so every campaign a dashboard editor publishes
 * (national, regional, zonal or chapter-scoped) has a public surface here.
 */
export function Outreaches({ outreaches }: { outreaches?: OutreachRecord[] | null }) {
  const list = outreaches ?? [];
  if (list.length === 0) return null;

  return (
    <Section id="outreaches" className="paper">
      <SectionHead
        eyebrow="Outreaches"
        title="Medical outreaches and mission campaigns"
        intro="Campaigns published from chapters, zones, regions and the national team — join one or support it."
      />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((outreach, i) => {
          const status = outreachStatusLabel(outreach.status);
          const detail = outreach.goal || outreach.summary;
          return (
            <Reveal key={outreach._id} delay={(i % 3) * 90}>
              <article className="card-editorial flex h-full flex-col p-8">
                {status ? <span className="eyebrow text-secondary">{status}</span> : null}
                <h3
                  className={cn(
                    "font-display text-lg font-bold tracking-tight text-foreground",
                    status && "mt-3",
                  )}
                >
                  {outreach.title}
                </h3>
                <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
                  {outreachDateLabel(outreach)}
                </p>
                {outreach.location ? (
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4 shrink-0" aria-hidden="true" />
                    {outreach.location}
                  </p>
                ) : null}
                {outreach.partner ? (
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="size-4 shrink-0" aria-hidden="true" />
                    {outreach.partner}
                  </p>
                ) : null}
                {detail ? (
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {detail}
                  </p>
                ) : null}
                {outreach.registrationUrl ? (
                  <a
                    href={outreach.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      buttonVariants({ variant: "primary", size: "sm" }),
                      "mt-6 self-start bg-cmda-green hover:bg-cmda-green-deep",
                    )}
                    aria-label={`Get involved in ${outreach.title}`}
                  >
                    Get involved
                  </a>
                ) : null}
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
