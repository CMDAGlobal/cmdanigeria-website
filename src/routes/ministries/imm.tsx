import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { CmsPage } from "@/components/site/CmsPage";
import { fetchPageBySlug, fetchPageCounters } from "@/sanity/data";
import { buttonVariants, Reveal, Section, SectionHead } from "@/components/site/primitives";
import { cn } from "@/lib/utils";

const title = "IMM | CMDA Nigeria";
const description =
  "Institute of Medical Missions — raising Christian healthcare professionals who advance God's Kingdom through medical missions.";

export const Route = createFileRoute("/ministries/imm")({
  loader: async () => {
    const [page, counters] = await Promise.all([
      fetchPageBySlug({ data: "imm" }),
      fetchPageCounters(),
    ]);
    return { page, counters };
  },
  component: ImmPage,
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
  const { page, counters } = Route.useLoaderData();
  return (
    <CmsPage
      page={page}
      counters={counters}

      eyebrow="IMM"
      title="Institute of Medical Missions"
      intro="Raising Christian healthcare professionals who advance God's Kingdom through medical missions."
    >
      <Section id="about" className="paper">
        <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
              <p className="eyebrow text-cmda-green">About IMM</p>
            </div>
            <h2 className="display-2 mt-6 text-balance">
              Mobilizing, training, and mentoring for missions.
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p className="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-extrabold first-letter:text-cmda-green">
                IMM was established in 2006 to mobilize, train, and mentor doctors, medical students
                and health workers to understand, support and commit themselves to missions work
                across various platforms within and beyond Nigeria.
              </p>
              <p>
                The training opportunities offered by the Institute are implemented using an
                interactive adult learning approach (andragogy). Participants are exposed to highly
                engaging faculty members who have practical life experiences in missions.
              </p>
              <p>
                The Foundation Course in Medical Missions which last one week is formational, and
                goes beyond the traditional approaches of merely disseminating information and
                imparting knowledge.
              </p>
            </div>
            <a
              href="https://immafrica.com"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "primary" }), "mt-8")}
            >
              See more
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative">
              <div className="framed">
                <div className="flex aspect-[4/3] w-full items-center justify-center bg-cmda-green/10 p-12">
                  <img
                    src="/logos/imm.png"
                    alt="Institute of Medical Missions (IMM) logo"
                    loading="lazy"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="pillars" className="bg-muted">
        <SectionHead eyebrow="Our pillars" title="Building a generation of disciple-makers" />
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
    </CmsPage>
  );
}
