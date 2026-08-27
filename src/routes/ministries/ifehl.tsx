import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, Section, SectionHead } from "@/components/site/primitives";

const title = "IfEHL | CMDA Nigeria";
const description =
  "Institute for Excellence in Healthcare and Leadership — raising healthcare professionals who lead with compassion, competence, and character.";

export const Route = createFileRoute("/ministries/ifehl")({
  component: IfEhlPage,
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

const highlights = [
  { stat: "350+", label: "Healthcare professionals trained" },
  { stat: "2018", label: "Year launched" },
  { stat: "Global", label: "Alumni network" },
];

const programmes = [
  {
    title: "Basic Leadership Programme",
    desc: "Foundation training in purposeful, ethical, and transformational leadership for healthcare professionals.",
  },
  {
    title: "Advanced Leadership Programme",
    desc: "Deepening leadership competencies for experienced practitioners seeking to influence health systems and policy.",
  },
  {
    title: "Mentorship & Research",
    desc: "Connecting emerging leaders with seasoned mentors and supporting research that drives sustainable change in healthcare.",
  },
  {
    title: "Strategic Collaboration",
    desc: "Building partnerships across hospitals, academia, public health, and global health institutions.",
  },
];

function IfEhlPage() {
  return (
    <>
      <PageHero
        eyebrow="IfEHL"
        title="Institute for Excellence in Healthcare and Leadership"
        intro="Raising healthcare professionals who lead with compassion, competence, and character."
      />

      <Section id="about" className="paper">
        <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
              <p className="eyebrow text-cmda-green">About IfEHL</p>
            </div>
            <h2 className="display-2 mt-6 text-balance">
              Transforming healthcare begins with transforming the healthcare professional.
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p className="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-extrabold first-letter:text-cmda-green">
                Conceived in 2015 and launched in 2018, IfEHL was founded in response to the growing
                need for purposeful, ethical, and transformational leadership within Nigeria's
                healthcare system and beyond.
              </p>
              <p>
                Through values-driven training, mentorship, research, and strategic collaboration, the
                Institute equips healthcare professionals to provide excellent care, influence health
                systems, and drive sustainable change.
              </p>
              <p>
                Since its inception, IfEHL has trained and mentored over 350 healthcare professionals
                through its Basic and Advanced leadership programmes, with alumni serving and making
                an impact across hospitals, academia, public health, policy, and global health
                institutions in Nigeria and around the world.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid grid-cols-3 gap-6">
              {highlights.map((h) => (
                <div key={h.label} className="border border-border bg-background p-6 text-center transition-shadow hover:shadow-card">
                  <p className="font-display text-3xl font-extrabold text-cmda-green">{h.stat}</p>
                  <p className="mt-2 text-xs font-semibold tracking-wide uppercase text-muted-foreground">{h.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="programmes" className="bg-muted">
        <SectionHead
          eyebrow="Programmes"
          title="Building leaders for the future of healthcare"
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {programmes.map((item, i) => (
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
