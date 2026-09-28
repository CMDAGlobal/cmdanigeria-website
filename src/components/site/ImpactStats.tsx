import { useEffect, useState } from "react";
import { Reveal, useInView } from "./primitives";
import type { ChapterCounts } from "@/sanity/types";

type Stat = { value: number; suffix?: string; label: string };

const FOUNDING_YEAR = 1972;

// Marketing totals kept as editable constants (no authoritative source in the CMS yet).
const MEMBERS_NATIONWIDE = 11_000;
const STUDENT_MEMBERS = 9_700;
const DOCTORS_DENTISTS = 1_200;
const GLOBAL_MEMBERS = 75;
const STATES_AND_FCT = 37;
const FALLBACK_STUDENT_CHAPTERS = 55;
const FALLBACK_DOCTOR_CHAPTERS = 50;

const YEARS_OF_MINISTRY = new Date().getFullYear() - FOUNDING_YEAR;

function buildStats(chapters?: ChapterCounts | null): Stat[] {
  return [
    { value: YEARS_OF_MINISTRY, suffix: "+", label: "Years of ministry" },
    { value: MEMBERS_NATIONWIDE, suffix: "+", label: "Members nationwide" },
    { value: STUDENT_MEMBERS, suffix: "+", label: "Student members" },
    { value: DOCTORS_DENTISTS, suffix: "+", label: "Doctors & dentists" },
    { value: chapters?.students ?? FALLBACK_STUDENT_CHAPTERS, label: "Student chapters" },
    { value: chapters?.doctors ?? FALLBACK_DOCTOR_CHAPTERS, label: "Doctor chapters" },
    { value: GLOBAL_MEMBERS, suffix: "+", label: "Global members" },
    { value: STATES_AND_FCT, label: "States + FCT" },
  ];
}

function useCounter(target: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1600;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active]);

  return value;
}

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const value = useCounter(stat.value, active);
  return (
    <div className="flex flex-col border-t border-cmda-green/40 pt-8">
      <span className="font-display text-4xl font-extrabold text-gold lg:text-5xl">
        {value.toLocaleString()}
        {stat.suffix}
      </span>
      <span className="eyebrow mt-3 text-primary-foreground/60">{stat.label}</span>
    </div>
  );
}

export function ImpactStats({ chapters }: { chapters?: ChapterCounts | null }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const stats = buildStats(chapters);

  return (
    <section
      id="impact-stats"
      className="relative overflow-hidden bg-primary-deep px-6 py-20 lg:px-10 lg:py-24"
    >
      {/* Background image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.10]"
        style={{ backgroundImage: "url(/whip-transparent-bg.webp)" }}
      />
      <div ref={ref} className="mx-auto w-full max-w-7xl">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-cmda-green" aria-hidden="true" />
            <p className="eyebrow text-cmda-green-light">Our footprint</p>
          </div>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-extrabold text-primary-foreground sm:text-4xl">
            A national movement with a global reach
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-x-10 gap-y-12 md:grid-cols-4">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} active={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
