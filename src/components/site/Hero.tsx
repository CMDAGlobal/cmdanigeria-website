import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroMission from "@/assets/hero-mission.jpg";
import studentsPrayer from "@/assets/students-prayer.jpg";
import conference from "@/assets/conference.jpg";
import storyOutreach from "@/assets/story-outreach.jpg";
import storyClinic from "@/assets/story-clinic.jpg";
import storyTraining from "@/assets/story-training.jpg";
import { buttonVariants } from "./primitives";
import { cn } from "@/lib/utils";

/**
 * Three vertical columns of imagery that scroll continuously at different
 * speeds and directions, creating a layered editorial collage. Each column
 * duplicates its own list so the marquee loops with no visible reset.
 */
const columns = [
  {
    speed: "52s",
    direction: "up" as const,
    offset: "mt-0",
    images: [
      { src: heroMission, alt: "Christian doctors caring for patients at a CMDA Nigeria medical outreach" },
      { src: storyOutreach, alt: "CMDA Nigeria volunteers at a rural community health outreach" },
      { src: conference, alt: "Delegates at a CMDA Nigeria national conference" },
    ],
  },
  {
    speed: "38s",
    direction: "down" as const,
    offset: "mt-[-4rem]",
    images: [
      { src: studentsPrayer, alt: "Medical and dental students praying together at a CMDA fellowship" },
      { src: storyClinic, alt: "A Christian physician consulting with a patient in a mission clinic" },
      { src: storyTraining, alt: "Clinical skills training session for Nigerian healthcare workers" },
    ],
  },
  {
    speed: "64s",
    direction: "up" as const,
    offset: "mt-[-8rem]",
    images: [
      { src: storyTraining, alt: "Continuing medical education workshop hosted by CMDA Nigeria" },
      { src: conference, alt: "Worship at the CMDA Nigeria annual national conference" },
      { src: storyOutreach, alt: "Free medical screening at a CMDA Nigeria outreach" },
    ],
  },
];

const rotating = ["the whole man", "spirit, soul & body", "Nigeria & beyond", "the underserved"];

const marks = [
  { value: "1972", label: "Founded" },
  { value: "36+FCT", label: "States reached" },
  { value: "11,000+", label: "Members" },
  { value: "75+", label: "Global network" },
];

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const [word, setWord] = useState(0);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setWord((w) => (w + 1) % rotating.length), 3600);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="paper relative overflow-hidden border-b border-border">
      {/* Faint plum wash bleeding in from the collage side */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-linear-to-l from-primary/8 to-transparent lg:block"
      />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-14 px-6 pt-32 pb-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:px-10 lg:pt-40 lg:pb-28">
        {/* ---------- Editorial column ---------- */}
        <div className="relative z-10 flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <span className="h-px w-14 bg-gold" aria-hidden="true" />
            <p className="eyebrow text-primary">Christian Medical &amp; Dental Association</p>
          </div>

          <h1 className="display-1 mt-8 text-balance">
            <span className="block">Healing hands.</span>
            <span className="block text-primary">Faithful hearts.</span>
            <span className="mt-3 block font-display text-[0.42em] leading-tight font-semibold tracking-[-0.01em] text-muted-foreground">
              Caring for{" "}
              <span className="relative inline-block align-baseline">
                <span
                  key={word}
                  className={cn("inline-block text-foreground", mounted && "animate-slide-up")}
                >
                  {rotating[word]}
                </span>
                <span
                  className="absolute inset-x-0 -bottom-1 h-px bg-gold"
                  aria-hidden="true"
                />
              </span>
            </span>
          </h1>

          <p className="lede mt-8 max-w-lg text-muted-foreground">
            For over five decades CMDA Nigeria has equipped Christian doctors, dentists and students
            to practise with clinical excellence, Christ-like compassion and unwavering integrity —
            in teaching hospitals, rural clinics and mission fields across the nation.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/membership" className={cn(buttonVariants({ variant: "editorial", size: "lg" }))}>
              Become a Member
            </Link>
            <Link to="/give" className={cn(buttonVariants({ variant: "editorialGold", size: "lg" }))}>
              Support the Mission
            </Link>
          </div>

          {/* Credential ledger */}
          <dl className="mt-14 grid max-w-xl grid-cols-2 border-t border-border sm:grid-cols-4">
            {marks.map((m) => (
              <div key={m.label} className="border-b border-border py-5 pr-4 sm:border-b-0">
                <dt className="font-display text-xl font-extrabold tracking-tight text-primary sm:text-2xl">
                  {m.value}
                </dt>
                <dd className="eyebrow mt-2 text-[0.62rem] text-muted-foreground">{m.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ---------- Moving collage ---------- */}
        <div className="relative -mx-6 h-[26rem] overflow-hidden sm:h-[34rem] lg:mx-0 lg:h-[42rem]">
          <div className="grid h-full grid-cols-3 gap-3 sm:gap-4">
            {columns.map((col, ci) => (
              <div key={ci} className={cn("relative overflow-hidden", col.offset)}>
                <div
                  className={cn(
                    "flex flex-col gap-3 sm:gap-4",
                    mounted && (col.direction === "up" ? "animate-marquee-up" : "animate-marquee-down"),
                  )}
                  style={{ animationDuration: col.speed }}
                >
                  {[...col.images, ...col.images].map((img, i) => (
                    <figure
                      key={`${ci}-${i}`}
                      className="relative shrink-0 overflow-hidden border border-border/70 bg-card"
                    >
                      <img
                        src={img.src}
                        alt={i < col.images.length ? img.alt : ""}
                        aria-hidden={i >= col.images.length}
                        loading={ci === 0 && i === 0 ? "eager" : "lazy"}
                        className="aspect-3/4 size-full object-cover"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-primary-deep/10 mix-blend-multiply"
                      />
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Feathered edges so the motion dissolves rather than clipping */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-background to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background to-transparent"
          />

          {/* Floating editorial caption plate */}
          <div className="absolute right-4 bottom-6 z-10 max-w-[16rem] border border-gold/70 bg-card p-5 shadow-elegant sm:bottom-10">
            <p className="eyebrow text-gold-foreground">Since 1972</p>
            <p className="mt-3 font-display text-sm leading-snug font-semibold text-foreground">
              A nationwide fellowship of healthcare professionals serving Christ through medicine.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
