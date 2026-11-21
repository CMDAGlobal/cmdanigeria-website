import { Link } from "@tanstack/react-router";
import { ArrowLeft, Users } from "lucide-react";
import { Reveal, Section, SectionHead, buttonVariants } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
import type { LeaderRecord, LeadershipTeams } from "@/sanity/types";
import { LeaderCard } from "./cards";

function LeadershipSection({
  id,
  leaders,
  title,
  intro,
  tone,
}: {
  id?: string;
  leaders?: LeaderRecord[] | null | undefined;
  title: string;
  intro: string;
  tone: "paper" | "muted";
}) {
  const count = leaders?.length ?? 0;
  const hasLeaders = count > 0;
  return (
    <Section id={id} className={tone === "muted" ? "bg-muted/40" : "paper"}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <SectionHead
          eyebrow="National leadership"
          title={`${title} ${hasLeaders ? `(${count})` : ""}`}
          intro={intro}
        />
      </div>
      {hasLeaders ? (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {leaders!.map((leader) => (
            <LeaderCard key={leader._id} leader={leader} />
          ))}
        </div>
      ) : (
        <Reveal className="mt-12">
          <div className="border border-border/70 bg-card p-10 text-center rounded-2xl shadow-xs">
            <Users className="mx-auto mb-4 size-8 text-cmda-green" aria-hidden="true" />
            <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
              {title}
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Members of this team are listed here once they are added in the admin dashboard.
            </p>
          </div>
        </Reveal>
      )}
    </Section>
  );
}

export function LeadershipPage({ leadership }: { leadership: LeadershipTeams | null | undefined }) {
  const teams = [
    { id: "board-of-trustees", label: "Board of Trustees", count: leadership?.boardOfTrustees?.length ?? 0 },
    { id: "governing-board", label: "Governing Board", count: leadership?.governingBoard?.length ?? 0 },
    { id: "management-team", label: "Management Team", count: leadership?.managementTeam?.length ?? 0 },
    { id: "student-nec", label: "Student NEC", count: leadership?.studentNec?.length ?? 0 },
  ];

  return (
    <>
      {/* Quick Jump Navigation Pill Bar */}
      <section className="sticky top-20 z-20 border-y border-border/60 bg-background/90 px-6 py-3.5 backdrop-blur-md lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center sm:justify-start gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">
            Jump to:
          </span>
          {teams.map((team) => (
            <a
              key={team.id}
              href={`#${team.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground transition-all duration-200 hover:border-cmda-green hover:bg-cmda-green/10 hover:text-cmda-green shadow-xs"
            >
              <span>{team.label}</span>
              {team.count > 0 ? (
                <span className="rounded-full bg-cmda-green/15 px-1.5 py-0.2 text-[10px] font-bold text-cmda-green">
                  {team.count}
                </span>
              ) : null}
            </a>
          ))}
        </div>
      </section>

      <LeadershipSection
        id="board-of-trustees"
        leaders={leadership?.boardOfTrustees}
        title="Board of Trustees"
        intro="The trustees safeguard the association's mandate and hold its heritage, resources and mission in trust."
        tone="muted"
      />
      <LeadershipSection
        id="governing-board"
        leaders={leadership?.governingBoard}
        title="Governing Board"
        intro="The governing board provides strategic oversight, stewardship and accountability for the association."
        tone="paper"
      />
      <LeadershipSection
        id="management-team"
        leaders={leadership?.managementTeam}
        title="Management Team"
        intro="The management team leads the day-to-day operations and coordination of the national secretariat."
        tone="muted"
      />
      <LeadershipSection
        id="student-nec"
        leaders={leadership?.studentNec}
        title="Student NEC"
        intro="The National Executive Committee of the Students' Arm represents medical and dental students across Nigerian universities."
        tone="paper"
      />

      <section className="px-6 py-20 text-center lg:px-10">
        <Link to="/about" className={cn(buttonVariants({ variant: "outline" }))}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Who We Are
        </Link>
      </section>
    </>
  );
}
