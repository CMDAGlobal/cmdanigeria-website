import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, Section, SectionHead } from "@/components/site/primitives";

const title = "Wholeness Missions | CMDA Nigeria";
const description =
  "Whole-person care projects addressing body, mind and spirit in communities across Nigeria.";

export const Route = createFileRoute("/ministries/wholeness-missions")({
  component: WholenessMissionsPage,
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

const approaches = [
  {
    title: "Medical Outreaches",
    desc: "Free health screenings, consultations and treatments in underserved communities across Nigeria.",
  },
  {
    title: "Health Education",
    desc: "Community workshops on disease prevention, nutrition, mental health and healthy living.",
  },
  {
    title: "Spiritual Outreach",
    desc: "Gospel presentations, prayer ministry and follow-up discipleship for whole-person transformation.",
  },
  {
    title: "Community Development",
    desc: "Long-term partnerships with communities for sustainable health and social impact.",
  },
];

function WholenessMissionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Wholeness Missions"
        title="Whole-person care for every community"
        intro="Addressing body, mind and spirit in communities across Nigeria."
      />

      <Section id="about" className="paper">
        <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
              <p className="eyebrow text-cmda-green">About Wholeness Missions</p>
            </div>
            <h2 className="display-2 mt-6 text-balance">
              Caring for the whole person — spirit, soul and body.
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p className="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-extrabold first-letter:text-cmda-green">
                Wholeness Missions is CMDA Nigeria's flagship community health initiative,
                bringing medical professionals together to provide compassionate, Christ-centred
                care to underserved communities.
              </p>
              <p>
                Through medical outreaches, health education, spiritual outreach and community
                development, Wholeness Missions addresses the physical, emotional and spiritual
                needs of communities across Nigeria.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative">
              <div className="framed">
                <div className="aspect-[4/3] w-full bg-cmda-green/10 flex items-center justify-center">
                  <p className="text-sm text-cmda-green font-semibold">Wholeness Missions Outreach</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="approaches" className="bg-muted">
        <SectionHead
          eyebrow="Our approach"
          title="Four dimensions of whole-person care"
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {approaches.map((item, i) => (
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
