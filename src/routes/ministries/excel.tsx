import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, Section, SectionHead } from "@/components/site/primitives";

const title = "EXCEL | CMDA Nigeria";
const description =
  "Academic and professional development ministry — helping Christian medical professionals achieve excellence in learning, practice, and service.";

export const Route = createFileRoute("/ministries/excel")({
  component: ExcelPage,
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

const programmes = [
  {
    title: "EXCEL Programme for Students",
    desc: "Academic support and peer learning for medical and dental students across CMDA chapters.",
  },
  {
    title: "Whole Person Medicine Training",
    desc: "Integrating clinical excellence with spiritual insight for holistic patient care.",
  },
  {
    title: "Continuing Medical Education (CME)",
    desc: "Professional development sessions keeping practitioners updated on current research and procedures.",
  },
  {
    title: "The Good Teacher",
    desc: "Training faculty and mentors in values-based teaching and clinical instruction.",
  },
  {
    title: "Developing Health Course",
    desc: "Building competencies in public health, community medicine and health systems leadership.",
  },
  {
    title: "Publications & Library",
    desc: "Access to journals, manuals and educational resources for lifelong learning.",
  },
];

function ExcelPage() {
  return (
    <>
      <PageHero
        eyebrow="EXCEL"
        title="Academic and Professional Development Ministry"
        intro="Helping Christian medical and dental students and practitioners achieve excellence in learning, practice, and service."
      />

      <Section id="about" className="paper">
        <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
              <p className="eyebrow text-cmda-green">About EXCEL</p>
            </div>
            <h2 className="display-2 mt-6 text-balance">
              Academically sound, professionally competent, equipped to serve.
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p className="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-extrabold first-letter:text-cmda-green">
                Through academic support, clinical mentorship, peer learning, and leadership
                development, EXCEL equips members to grow in competence, character, and
                Christ-centred professionalism.
              </p>
              <p>
                Its programmes include the EXCEL Programme for Students, Whole Person Medicine
                Training, Continuing Medical Education (CME), The Good Teacher, Developing Health
                Course, and the Publications & Library.
              </p>
              <p>
                Together, these initiatives promote academic excellence, patient-centred care,
                values-based teaching, lifelong learning, and access to quality educational resources.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative">
              <div className="framed">
                <div className="aspect-[4/3] w-full bg-cmda-green/10 flex items-center justify-center">
                  <p className="text-sm text-cmda-green font-semibold">EXCEL Training Session</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="programmes" className="bg-muted">
        <SectionHead
          eyebrow="Programmes"
          title="Six pathways of academic and professional growth"
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programmes.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 90}>
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
