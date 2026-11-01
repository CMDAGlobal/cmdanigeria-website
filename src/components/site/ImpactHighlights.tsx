import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Reveal, Section, SectionHead } from "./primitives";

type Impact = {
  figure: string;
  title: string;
  desc: string;
  alt: string;
  images: string[];
};

// Drop 4 photos per impact in public/gallery/impact/ using these names.
const impacts: Impact[] = [
  {
    figure: "150+",
    title: "Medical outreaches yearly",
    desc: "Free clinics, rural missions and health screenings bringing whole-person care to underserved communities across Nigeria.",
    alt: "CMDA Nigeria medical outreach",
    images: [
      "/gallery/wholeness-missions/motor-park-03.webp",
      "/gallery/wholeness-missions/motor-park-06.webp",
      "/gallery/wholeness-missions/motor-park-08.webp",
      "/gallery/wholeness-missions/motor-park-10.webp",
    ],
  },
  {
    figure: "350+",
    title: "Doctors trained at IfEHL",
    desc: "Healthcare professionals equipped to lead with compassion, competence and character through IfEHL's Basic and Advanced leadership programmes.",
    alt: "IfEHL leadership training session",
    images: [
      "/gallery/ifehl/ifehl-01.webp",
      "/gallery/ifehl/ifehl-02.webp",
      "/gallery/ifehl/ifehl-04.webp",
      "/gallery/ifehl/ifehl-09.webp",
    ],
  },
  {
    figure: "20,000+",
    title: "Students mentored yearly",
    desc: "Student members supported through fellowship, academic excellence, mentorship and leadership development in chapters nationwide.",
    alt: "CMDA Nigeria students being mentored",
    images: [
      "/gallery/students/students-02.webp",
      "/gallery/students/students-05.webp",
      "/gallery/students/students-07.webp",
      "/gallery/students/students-12.webp",
    ],
  },
  {
    figure: "2,000+",
    title: "Doctors & students trained yearly at IMM",
    desc: "Mission-focused training that prepares doctors, dentists, nurses, pharmacists and students for impactful service through the Institute of Medical Missions.",
    alt: "IMM mission training",
    images: [
      "/gallery/impact/imm-1.webp",
      "/gallery/impact/imm-2.webp",
      "/gallery/impact/imm-3.webp",
      "/gallery/impact/imm-4.webp",
    ],
  },
  {
    figure: "150+",
    title: "Communities reached yearly",
    desc: "Towns and inner-city communities served with healthcare, health education and the hope of the Gospel — year after year.",
    alt: "Community reached by CMDA Nigeria",
    images: [
      "/gallery/impact/communities-1.webp",
      "/gallery/impact/communities-2.webp",
      "/gallery/impact/communities-3.webp",
      "/gallery/impact/communities-4.webp",
    ],
  },
];

/**
 * Lightweight gallery: four photos cross-fade on a timer with dot controls.
 * Images that fail to load are dropped, so the frame works while photos are
 * still being added to public/gallery/impact/.
 */
function ImpactCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [available, setAvailable] = useState(images);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setAvailable(images);
    setIndex(0);
  }, [images]);

  useEffect(() => {
    if (paused || available.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % available.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [paused, available.length]);

  useEffect(() => {
    if (index >= available.length) setIndex(0);
  }, [index, available.length]);

  const drop = (src: string) => {
    setAvailable((list) => list.filter((item) => item !== src));
  };

  if (available.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center border border-dashed border-cmda-green/40 bg-cmda-green/5 p-6 text-center">
        <p className="text-sm font-medium text-muted-foreground">Photos coming soon</p>
      </div>
    );
  }

  return (
    <div
      className="group/carousel relative overflow-hidden border border-border bg-muted"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[4/3]">
        {available.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${alt} ${i + 1} of ${available.length}`}
            loading="lazy"
            onError={() => drop(src)}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
              i === index ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
      </div>
      {available.length > 1 ? (
        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-primary-deep/55 py-2.5 transition-opacity duration-300">
          {available.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Show photo ${i + 1} of ${available.length}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index
                  ? "w-5 bg-gold"
                  : "w-1.5 bg-primary-foreground/60 hover:bg-primary-foreground",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ImpactHighlights() {
  return (
    <Section id="impact-highlights" className="paper">
      <SectionHead
        eyebrow="What we achieve"
        title="A brief about the impact we make"
        intro="Every year, across ministries and regions — lives, communities and futures changed by CMDA Nigeria."
      />
      <div className="mt-16 space-y-16 lg:space-y-20">
        {impacts.map((impact, i) => (
          <Reveal key={impact.title} delay={(i % 2) * 90}>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
                <ImpactCarousel images={impact.images} alt={impact.alt} />
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : undefined}>
                <p className="font-display text-5xl font-extrabold tracking-tight text-cmda-green lg:text-6xl">
                  {impact.figure}
                </p>
                <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground">
                  {impact.title}
                </h3>
                <p className="mt-4 border-t border-cmda-green/30 pt-4 text-base leading-relaxed text-muted-foreground">
                  {impact.desc}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
