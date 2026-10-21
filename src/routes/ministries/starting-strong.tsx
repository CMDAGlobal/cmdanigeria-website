import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/site/CmsPage";
import { fetchPageBySlug, fetchPageCounters } from "@/sanity/data";
import { Reveal, Section, SectionHead } from "@/components/site/primitives";

const title = "Starting Strong | CMDA Nigeria";
const description =
  "A monthly mentorship and capacity-building program equipping young doctors with the knowledge, skills, and insights they need to navigate their careers successfully.";

export const Route = createFileRoute("/ministries/starting-strong")({
  loader: async () => {
    const [page, counters] = await Promise.all([
      fetchPageBySlug({ data: "starting-strong" }),
      fetchPageCounters(),
    ]);
    return { page, counters };
  },
  component: StartingStrongPage,
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.page?.seoTitle || title },
      { name: "description", content: loaderData?.page?.seoDescription || description },
      { property: "og:title", content: loaderData?.page?.seoTitle || title },
      { property: "og:description", content: loaderData?.page?.seoDescription || description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const challenges = [
  {
    title: "Career Uncertainty",
    desc: "While medical school provides clinical knowledge, it often does not equip young doctors with the clarity needed to navigate various career pathways, both within and outside traditional clinical practice.",
  },
  {
    title: "Workplace Challenges & Burnout",
    desc: "The early years of medical practice come with long hours, high patient loads, and significant emotional and physical stress. Without proper guidance, many young doctors experience burnout and disillusionment.",
  },
  {
    title: "Financial Illiteracy",
    desc: "Many young doctors enter the workforce without a clear understanding of personal finance, investments, and wealth management. Poor financial decisions in the early years can have long-term consequences.",
  },
  {
    title: "Faith & Ethical Dilemmas",
    desc: "Maintaining a strong spiritual life while navigating the pressures of the medical profession can be difficult. Ethical dilemmas and workplace pressures often make it challenging to integrate faith into professional life.",
  },
  {
    title: "Lack of Mentorship & Community",
    desc: "Many young doctors struggle with loneliness and uncertainty due to a lack of structured mentorship and a supportive community of experienced professionals who have walked the path before them.",
  },
];

const aims = [
  "Guide young doctors in making informed career decisions by exposing them to diverse opportunities within and beyond clinical medicine.",
  "Equip them with financial literacy skills so they can manage their income wisely, invest early, and build sustainable financial futures.",
  "Promote work-life balance and mental wellness by providing practical strategies to prevent burnout and maintain a fulfilling professional and personal life.",
  "Strengthen Christian identity in medical practice by addressing ethical concerns, workplace challenges, and ways to be a light in the profession.",
  "Foster a strong mentorship culture where young doctors can learn from experienced professionals and be part of a supportive network.",
];

function StartingStrongPage() {
  const { page, counters } = Route.useLoaderData();
  return (
    <CmsPage
      page={page}
      counters={counters}

      eyebrow="Starting Strong"
      title="Navigating the early years with clarity and confidence"
      intro="A monthly mentorship and capacity-building program equipping young doctors with the knowledge, skills, and insights they need to navigate their careers successfully."
    >
      <Section id="about" className="paper">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
              <p className="eyebrow text-cmda-green">About Starting Strong</p>
            </div>
            <h2 className="display-2 mt-6 text-balance">More than a program — a movement.</h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p className="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-extrabold first-letter:text-cmda-green">
                Starting Strong is a monthly mentorship and capacity-building program designed to
                equip young doctors with the knowledge, skills, and insights they need to navigate
                their careers successfully.
              </p>
              <p>
                Our mission is to expose these early-career medical professionals to a wide range of
                career pathways, helping them navigate their professional journeys with clarity and
                confidence. Each session features seasoned professionals sharing practical guidance
                on diverse career pathways, financial literacy, work-life balance, and more.
              </p>
              <p>
                Under the auspices of CMDA Nigeria, this program aims to equip young doctors to
                become competent professionals, wise decision-makers, financially literate
                individuals, and strong Christian witnesses in their respective fields — rooted in
                the vision that God created man spirit, soul, and body.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="reality" className="bg-muted">
        <SectionHead
          eyebrow="The reality"
          title="The transition no one fully prepares you for"
          intro="The transition from medical school to professional life is one of the most challenging phases in a young doctor's journey. Many graduate with academic excellence but find themselves unprepared for the realities of the medical profession."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((item, i) => (
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

      <Section id="vision">
        <SectionHead
          eyebrow="The vision"
          title="Spiritually strong, professionally excellent, financially stable"
          intro="Through monthly mentorship sessions, expert-led discussions, and real-life testimonies, Starting Strong aims to:"
        />
        <div className="mx-auto mt-12 max-w-3xl space-y-5 text-base leading-relaxed text-muted-foreground">
          {aims.map((aim) => (
            <p key={aim}>{aim}</p>
          ))}
          <p className="text-foreground">
            Through this initiative, we envision a future where every young doctor in Nigeria and
            beyond steps into their career with clarity, confidence, and purpose — ready to serve,
            shine, and transform lives.
          </p>
        </div>
      </Section>
    </CmsPage>
  );
}
