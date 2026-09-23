import { Link } from "@tanstack/react-router";
import { ArrowLeft, Users } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, Section, SectionHead, buttonVariants } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
import type { LeaderRecord, LeadershipTeams } from "@/sanity/types";
import { LeaderCard } from "./cards";

function LeadershipSection({
  leaders,
  title,
  intro,
  tone,
}: {
  leaders?: LeaderRecord[] | null | undefined;
  title: string;
  intro: string;
  tone: "paper" | "muted";
}) {
  const hasLeaders = Boolean(leaders?.length);
  return (
    <Section className={tone === "muted" ? "bg-muted" : "paper"}>
      <SectionHead eyebrow="National leadership" title={title} intro={intro} />
      {hasLeaders ? (
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {leaders!.map((leader) => (
            <LeaderCard key={leader._id} leader={leader} />
          ))}
        </div>
      ) : (
        <Reveal className="mt-16">
          <div className="border border-border bg-background p-8 text-center">
            <Users className="mx-auto mb-4 size-8 text-cmda-green" aria-hidden="true" />
            <h3 className="font-display text-lg font-bold tracking-tight text-foreground">{title}</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Members of this team are listed here once they are added in the CMS (Studio).
            </p>
          </div>
        </Reveal>
      )}
    </Section>
  );
}

export function LeadershipPage({ leadership }: { leadership: LeadershipTeams | null | undefined }) {
  return (
    <>
      <PageHero
        eyebrow="Who we are"
        title="Our national leadership"
        intro="CMDA Nigeria is guided by trustees, a governing board and a management team, alongside the National Executive Committee of the Students' Arm."
      />
      <LeadershipSection
        leaders={leadership?.boardOfTrustees}
        title="Board of Trustees"
        intro="The trustees safeguard the association's mandate and hold its heritage, resources and mission in trust."
        tone="muted"
      />
      <LeadershipSection
        leaders={leadership?.governingBoard}
        title="Governing Board"
        intro="The governing board provides strategic oversight, stewardship and accountability for the association."
        tone="paper"
      />
      <LeadershipSection
        leaders={leadership?.studentNec}
        title="Student NEC"
        intro="The National Executive Committee of the Students' Arm represents students and dental students across Nigerian universities."
        tone="muted"
      />
      <LeadershipSection
        leaders={leadership?.managementTeam}
        title="Management Team"
        intro="The management team leads the day-to-day operations and coordination of the secretariat."
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