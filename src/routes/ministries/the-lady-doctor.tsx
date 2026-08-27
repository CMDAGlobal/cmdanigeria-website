import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, Section, SectionHead } from "@/components/site/primitives";

const title = "The Lady Doctor | CMDA Nigeria";
const description =
  "A platform addressing the life and journey of female medical professionals and students — spiritual growth, career, leadership, family and ministry.";

export const Route = createFileRoute("/ministries/the-lady-doctor")({
  component: LadyDoctorPage,
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
    title: "Spiritual & Holistic Growth",
    desc: "Nurturing the faith and well-being of female healthcare professionals through devotion, prayer and community.",
  },
  {
    title: "Career & Academics",
    desc: "Supporting professional development, mentorship and academic excellence for women in medicine.",
  },
  {
    title: "Leadership",
    desc: "Raising female leaders who influence healthcare institutions and communities with vision and integrity.",
  },
  {
    title: "Family & Ministry",
    desc: "Balancing the demands of medical practice with family life and call to service.",
  },
  {
    title: "Wellness & Lifestyle",
    desc: "Promoting self-care, mental health and work-life balance among female professionals.",
  },
  {
    title: "Missions & Testimonies",
    desc: "Celebrating the impact of women in medical missions and sharing stories of faith in action.",
  },
];

function LadyDoctorPage() {
  return (
    <>
      <PageHero
        eyebrow="The Lady Doctor"
        title="Empowering women in medicine"
        intro="A platform addressing key aspects of the life and journey of female medical professionals and students."
      />

      <Section id="about" className="paper">
        <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
              <p className="eyebrow text-cmda-green">About The Lady Doctor</p>
            </div>
            <h2 className="display-2 mt-6 text-balance">
              Addressing the unique journey of women in healthcare.
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p className="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-extrabold first-letter:text-cmda-green">
                The Lady Doctor is a platform addressing key aspects of the life and journey of
                female medical professionals and students, including spiritual and holistic growth,
                career and academics, leadership, family and ministry, wellness and lifestyle,
                missions, and testimonies.
              </p>
              <p>
                Produced by Lady Doctors and Students for Lady Doctors and Students, it provides
                encouragement, mentorship and community for women navigating the unique challenges
                of medical practice while maintaining their faith and family life.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative">
              <div className="framed">
                <div className="aspect-[4/3] w-full bg-cmda-green/10 flex items-center justify-center">
                  <p className="text-sm text-cmda-green font-semibold">The Lady Doctor Forum</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="pillars" className="bg-muted">
        <SectionHead
          eyebrow="Focus areas"
          title="Six dimensions of the Lady Doctor experience"
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((item, i) => (
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
