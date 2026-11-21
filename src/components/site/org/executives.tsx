import { User } from "lucide-react";
import { Reveal, Section, SectionHead } from "@/components/site/primitives";
import { Avatar } from "./cards";
import type { ExecutiveSlot } from "./executive-positions";

function ExecutiveCard({ slot }: { slot: ExecutiveSlot }) {
  const leader = slot.leader;
  const detail = leader
    ? [leader.institution, leader.chapter, leader.country].filter(Boolean).join(" · ")
    : "";
  const hasImage = Boolean(leader?.headshot?.asset?.url);

  return (
    <Reveal className="h-full">
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-cmda-green/50 hover:shadow-xl hover:ring-2 hover:ring-cmda-green/10">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-muted/80 via-muted/40 to-muted/90">
          {hasImage ? (
            <>
              <img
                src={leader!.headshot!.asset!.url!}
                alt={leader?.headshot?.alt ?? leader?.name ?? "Leader"}
                loading="lazy"
                className="size-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </>
          ) : (
            <div
              aria-hidden="true"
              className="relative flex size-full flex-col items-center justify-center p-6 text-center select-none"
            >
              <div className="flex size-16 items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/60 text-muted-foreground shadow-xs">
                <User className="size-8" />
              </div>
              <span className="mt-3 text-xs font-medium text-muted-foreground">
                {leader ? "CMDA Nigeria" : "To be announced"}
              </span>
            </div>
          )}

          {leader?.chapter ? (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full border border-border/50 bg-background/85 px-2.5 py-1 text-[11px] font-semibold text-foreground/90 shadow-xs backdrop-blur-md">
              <span className="max-w-[140px] truncate">{leader.chapter}</span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-cmda-green line-clamp-1">
              {slot.position}
            </p>
            <h3 className="mt-1.5 font-display text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-cmda-green sm:text-lg">
              {leader?.name ?? "To be announced"}
            </h3>
            {detail && !leader?.chapter ? (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{detail}</p>
            ) : null}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-[11px] text-muted-foreground">
            <span className="truncate">{leader?.institution ?? leader?.country ?? "Executive Council"}</span>
            <span className="shrink-0 font-medium text-cmda-green opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              CMDA
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/**
 * One tier of the Students' Executive Committee: every listed position is shown
 * in protocol order, filled from the CMS where a leader exists and rendered as
 * a photo/name placeholder where it does not.
 */
export function ExecutiveBlock({
  eyebrow,
  title,
  intro,
  slots,
  tone = "muted",
  id,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  slots: ExecutiveSlot[];
  tone?: "muted" | "paper";
  id?: string;
}) {
  if (!slots.length) return null;
  return (
    <Section className={tone === "muted" ? "bg-muted" : "paper"} {...(id ? { id } : {})}>
      <SectionHead eyebrow={eyebrow} title={title} intro={intro} />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {slots.map((slot, index) => (
          <ExecutiveCard key={`${slot.position}-${index}`} slot={slot} />
        ))}
      </div>
    </Section>
  );
}
