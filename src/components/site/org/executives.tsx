import { User } from "lucide-react";
import { Reveal, Section, SectionHead } from "@/components/site/primitives";
import { Avatar } from "./cards";
import type { ExecutiveSlot } from "./executive-positions";

function ExecutiveCard({ slot }: { slot: ExecutiveSlot }) {
  const leader = slot.leader;
  const detail = leader
    ? [leader.institution, leader.chapter, leader.country].filter(Boolean).join(" · ")
    : "";
  return (
    <Reveal className="h-full">
      <div className="flex h-full flex-col border border-border bg-background p-6 transition-shadow hover:shadow-card">
        {leader ? (
          <Avatar
            image={leader.headshot}
            name={leader.name}
            className="mx-auto aspect-[4/5] w-full max-w-40 object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="mx-auto flex aspect-[4/5] w-full max-w-40 items-center justify-center border border-dashed border-border bg-muted text-muted-foreground"
          >
            <User className="size-10" />
          </div>
        )}
        <div className="mt-5 text-center">
          <h3 className="font-display text-base font-bold tracking-tight text-foreground">
            {leader?.name ?? "To be announced"}
          </h3>
          <p className="mt-1 text-sm font-semibold text-cmda-green">{slot.position}</p>
          {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
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
