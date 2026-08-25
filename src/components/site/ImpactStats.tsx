import { useEffect, useState } from "react";
import { Reveal, useInView } from "./primitives";

type Stat = { value: number; suffix?: string; label: string };

const stats: Stat[] = [
  { value: 50, suffix: "+", label: "Years of ministry" },
  { value: 11000, suffix: "+", label: "Members nationwide" },
  { value: 9700, suffix: "+", label: "Student members" },
  { value: 1200, suffix: "+", label: "Doctors & dentists" },
  { value: 55, label: "Student chapters" },
  { value: 50, label: "Doctor chapters" },
  { value: 75, suffix: "+", label: "Global members" },
  { value: 37, label: "States + FCT" },
];

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
    <div className="flex flex-col border-t border-gold/30 pt-8">
      <span className="font-display text-4xl font-extrabold text-gold lg:text-5xl">
        {value.toLocaleString()}
        {stat.suffix}
      </span>
      <span className="eyebrow mt-3 text-primary-foreground/60">{stat.label}</span>
    </div>
  );
}

export function ImpactStats() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="impact-stats" className="relative overflow-hidden bg-primary-deep px-6 py-20 lg:px-10 lg:py-24">
      {/* Background image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-[0.10]"
        style={{ backgroundImage: "url(/whip-transparent-bg.webp)" }}
      />
      <div ref={ref} className="mx-auto w-full max-w-7xl">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gold" aria-hidden="true" />
            <p className="eyebrow text-primary-foreground/60">Our footprint</p>
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
