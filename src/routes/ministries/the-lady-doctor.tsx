import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/site/CmsPage";
import { fetchPageBySlug, fetchPageCounters } from "@/sanity/data";
import { Reveal, Section, SectionHead } from "@/components/site/primitives";

const title = "Lady Doctors & Students | CMDA Nigeria";
const description =
  "CMDA-Lady Doctors/Students (CMDA-LD/LS) — empowering godly women of global impact and influence to transform the health sector.";

export const Route = createFileRoute("/ministries/the-lady-doctor")({
  loader: async () => {
    const [page, counters] = await Promise.all([
      fetchPageBySlug({ data: "the-lady-doctor" }),
      fetchPageCounters(),
    ]);
    return { page, counters };
  },
  component: LadyDoctorPage,
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

const mandates = [
  {
    title: "Empower women in the health sector",
    desc: "Empowering women in the health sector to maximize their talents for the glory of Jesus.",
  },
  {
    title: "Foster a godly community",
    desc: "Fostering a community of godly ladies bonded by shared gospel values.",
  },
  {
    title: "Transform lives and societies",
    desc: "Transforming lives, societies, and communities through our skills and services.",
  },
];

function LadyDoctorPage() {
  const { page, counters } = Route.useLoaderData();
  return (
    <CmsPage
      page={page}
      counters={counters}

      eyebrow="CMDA-LD/LS"
      title="CMDA Lady Doctors & Students"
      intro="Empowering godly women of global impact and influence to transform the health sector."
    >
      <Section id="about" className="paper">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
              <p className="eyebrow text-cmda-green">About CMDA-LD/LS</p>
            </div>
            <h2 className="display-2 mt-6 text-balance">
              An off-shoot of CMDA Nigeria, for godly women in healthcare.
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p className="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-extrabold first-letter:text-cmda-green">
                The CMDA-Lady Doctors/Students (CMDA-LD/LS) community is an off-shoot of CMDA
                NIGERIA.
              </p>
              <p>
                Our vision is to empower godly women of global impact and influence to transform the
                health sector.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="mandates" className="bg-muted">
        <SectionHead
          eyebrow="Our mission"
          title="Three core mandates"
          intro="The core mandates of our mission carry the weight of everything we do."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {mandates.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 90}>
              <div className="border border-border bg-background p-6 transition-shadow hover:shadow-card h-full">
                <span className="numeral text-cmda-green">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="leadership">
        <SectionHead
          eyebrow="Leadership"
          title="Lady Doctors Leadership"
          intro="Leadership details for the CMDA-LD/LS community will be published here soon."
        />
        <div className="mx-auto mt-12 flex min-h-40 max-w-3xl items-center justify-center border border-dashed border-border bg-muted/50 p-12">
          <p className="text-sm text-muted-foreground">Leadership profiles coming soon.</p>
        </div>
      </Section>
    </CmsPage>
  );
}
