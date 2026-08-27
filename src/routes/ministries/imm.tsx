import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, Section, SectionHead } from "@/components/site/primitives";

const title = "IMM | CMDA Nigeria";
const description =
  "Institute of Medical Missions — raising Christian healthcare professionals who advance God's Kingdom through medical missions.";

export const Route = createFileRoute("/ministries/imm")({
  component: ImmPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const pillars = [
  {
    title: "Mission-Focused Training",
    desc: "Equipping healthcare professionals with the skills and mindset for impactful service in underserved communities.",
  },
  {
    title: "Mentorship & Research",
    desc: "Guiding emerging missionaries through proven mentors and supporting research that improves mission outcomes.",
  },
  {
    title: "Strategic Partnerships",
    desc: "Collaborating with churches, NGOs, and global health organisations to expand the reach of medical missions.",
  },
  {
    title: "Disciple-Making Movement",
    desc: "Building a generation of healthcare workers who see their practice as a platform for the Great Commission.",
  },
];

function ImmPage() {
  return (
    <>
      <PageHero
        eyebrow="IMM"
        title="Institute of Medical Missions"
        intro="Raising Christian healthcare professionals who advance God's Kingdom through medical missions."
      />

      <Section id="about" className="paper">
        <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
              <p className="eyebrow text-cmda-green">About IMM</p>
            </div>
            <h2 className="display-2 mt-6 text-balance">
              More than a training institute — a growing movement.
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p className="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-extrabold first-letter:text-cmda-green">
                Established in 2006, following a vision to rekindle the missionary passion among
                Christian health professionals, IMM equips doctors, dentists, nurses, pharmacists,
                and other healthcare workers to integrate faith with professional practice and serve
                communities with compassion, excellence, and the love of Christ.
              </p>
              <p>
                Through mission-focused training, mentorship, research, and strategic partnerships,
                IMM prepares healthcare professionals for impactful service in Nigeria and across the
                world.
              </p>
              <p>
                IMM is a growing movement committed to building a generation of disciple-makers who
                see healthcare as a platform for fulfilling the Great Commission and transforming
                lives through holistic, Christ-centred care.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative">
              <div className="framed">
                <div className="aspect-[4/3] w-full bg-cmda-green/10 flex items-center justify-center">
                  <p className="text-sm text-cmda-green font-semibold">IMM Missions Deployment</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="pillars" className="bg-muted">
        <SectionHead
          eyebrow="Our pillars"
          title="Building a generation of disciple-makers"
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {pillars.map((item, i) => (
            <Reveal key={item.title} delay={(i % 2) * 90}>
              <div className="border border-border bg-background p-6 transition-shadow hover:shadow-card h-full">
                <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
