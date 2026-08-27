import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, Section, SectionHead } from "@/components/site/primitives";

const title = "Saline Training | CMDA Nigeria";
const description =
  "Practical clinical skills training programme equipping students and young doctors with hands-on competencies for compassionate, whole-person patient care.";

export const Route = createFileRoute("/ministries/saline-training")({
  component: SalineTrainingPage,
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

const skills = [
  {
    title: "Clinical Skills Workshop",
    desc: "Hands-on practice in history-taking, physical examination, and clinical procedures.",
  },
  {
    title: "Emergency Care Training",
    desc: "First aid, resuscitation and acute care competencies for medical and dental students.",
  },
  {
    title: "Patient Communication",
    desc: "Developing empathy, active listening and clear communication for whole-person care.",
  },
  {
    title: "Rural & Community Medicine",
    desc: "Preparing students to deliver quality care in underserved and resource-limited settings.",
  },
];

function SalineTrainingPage() {
  return (
    <>
      <PageHero
        eyebrow="Saline Training"
        title="Practical clinical skills for compassionate care"
        intro="Equipping students and young doctors with hands-on competencies for whole-person patient care."
      />

      <Section id="about" className="paper">
        <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
              <p className="eyebrow text-cmda-green">About Saline Training</p>
            </div>
            <h2 className="display-2 mt-6 text-balance">
              Bridging the gap between knowledge and practice.
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p className="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-extrabold first-letter:text-cmda-green">
                Saline Training is a practical clinical skills training programme equipping students
                and young doctors with hands-on competencies for compassionate, whole-person patient
                care.
              </p>
              <p>
                Through simulation-based learning, bedside teaching and community-based practice,
                participants develop the clinical confidence and communication skills they need to
                serve patients with excellence and compassion.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative">
              <div className="framed">
                <div className="aspect-[4/3] w-full bg-cmda-green/10 flex items-center justify-center">
                  <p className="text-sm text-cmda-green font-semibold">Saline Training Workshop</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="skills" className="bg-muted">
        <SectionHead
          eyebrow="Core skills"
          title="Four areas of hands-on competency"
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {skills.map((item, i) => (
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
