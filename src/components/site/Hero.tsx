import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { buttonVariants } from "./primitives";
import { cn } from "@/lib/utils";

const heroImages = [
  "/Hero Scrolling image/DSC_0378.webp",
  "/Hero Scrolling image/DSC_0021.webp",
  "/Hero Scrolling image/DSC_0410.webp",
  "/Hero Scrolling image/DSC_0402.webp",
  "/Hero Scrolling image/DSC_0823.webp",
  "/Hero Scrolling image/DSC_0680.webp",
  "/Hero Scrolling image/DSC_0993.webp",
  "/Hero Scrolling image/DSC_0652.webp",
  "/Hero Scrolling image/DSC_0835.webp",
  "/Hero Scrolling image/DSC_0551.webp",
  "/Hero Scrolling image/IMG-10.webp",
  "/Hero Scrolling image/IMG-12.webp",
  "/Hero Scrolling image/IMG-13.webp",
  "/Hero Scrolling image/JNC (31 of 46).webp",
  "/Hero Scrolling image/JNC (15 of 20).webp",
  "/Hero Scrolling image/IMG_6469.webp",
  "/Hero Scrolling image/IMG-8.webp",
  "/Hero Scrolling image/JNC (6 of 46).webp",
  "/Hero Scrolling image/JNC (33 of 35).webp",
  "/Hero Scrolling image/JNC (32 of 47).webp",
  "/Hero Scrolling image/JNC PICS (24 of 91).webp",
  "/Hero Scrolling image/jnc p sesssion_58.webp",
  "/Hero Scrolling image/_MG_1170.webp",
];

const columns = [
  {
    speed: 52,
    direction: "up" as const,
    offset: "mt-0",
    images: heroImages.slice(0, 8),
  },
  {
    speed: 38,
    direction: "down" as const,
    offset: "mt-[-4rem]",
    images: heroImages.slice(8, 16),
  },
  {
    speed: 64,
    direction: "up" as const,
    offset: "mt-[-8rem]",
    images: heroImages.slice(16, 23),
  },
];

const rotating = ["the whole man", "spirit, soul & body", "Nigeria & beyond", "the underserved"];

const marks = [
  { value: "1972", label: "Founded" },
  { value: "36+FCT", label: "States reached" },
  { value: "11,000+", label: "Members" },
  { value: "75+", label: "Global network" },
];

function useMarquee(
  direction: "up" | "down",
  speed: number,
) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let raf: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const halfHeight = el.scrollHeight / 2;
      if (halfHeight === 0) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const pxPerSec = halfHeight / speed;
      offsetRef.current += pxPerSec * dt;

      if (offsetRef.current >= halfHeight) {
        offsetRef.current -= halfHeight;
      }

      const y = direction === "up" ? -offsetRef.current : -(halfHeight - offsetRef.current);
      el.style.transform = `translate3d(0, ${y}px, 0)`;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [direction, speed]);

  return trackRef;
}

function MarqueeColumn({
  col,
  ci,
}: {
  col: (typeof columns)[number];
  ci: number;
}) {
  const trackRef = useMarquee(col.direction, col.speed);

  return (
    <div className={cn("relative overflow-hidden", col.offset)}>
      <div ref={trackRef} className={cn("flex flex-col gap-3 sm:gap-4")}>
        {[...col.images, ...col.images].map((src, i) => (
          <figure
            key={`${ci}-${i}`}
            className="relative shrink-0 overflow-hidden border border-border/70 bg-card"
          >
            <img
              src={src}
              alt=""
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
  );
}

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const [word, setWord] = useState(0);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setWord((w) => (w + 1) % rotating.length), 3600);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="paper relative overflow-x-hidden border-b border-border">
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
            {mounted &&
              columns.map((col, ci) => (
                <MarqueeColumn key={ci} col={col} ci={ci} />
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
