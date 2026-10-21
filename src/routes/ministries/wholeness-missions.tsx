import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { CmsPage } from "@/components/site/CmsPage";
import { fetchPageBySlug, fetchPageCounters } from "@/sanity/data";
import { buttonVariants, Reveal, Section, SectionHead } from "@/components/site/primitives";
import { cn } from "@/lib/utils";

const title = "Wholeness Missions | CMDA Nigeria";
const description =
  "Whole-person care projects addressing body, mind and spirit in communities across Nigeria.";

export const Route = createFileRoute("/ministries/wholeness-missions")({
  loader: async () => {
    const [page, counters] = await Promise.all([
      fetchPageBySlug({ data: "wholeness-missions" }),
      fetchPageCounters(),
    ]);
    return { page, counters };
  },
  component: WholenessMissionsPage,
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

const scope = [
  {
    title: "Outreaches",
    desc: "Health, healing and support taken to communities within and outside Nigeria.",
    items: [
      "Hospital evangelism",
      "Rural medical missions",
      "Urban missions",
      "Health campaigns",
      "Paediatric missions",
      "Special missions",
    ],
  },
  {
    title: "Missions Awareness & Resources",
    desc: "Building the burden and capacity for missions across every chapter.",
    items: [
      "Missions resources — Missions Exploits Magazine, tracts, and literature",
      "Missions support, correspondence, and links",
      "Missions awareness, seminars, and workshops",
    ],
  },
  {
    title: "In-reaches",
    desc: "Caring for the physical and spiritual welfare of CMDA members themselves.",
    items: [
      "Operation Convert your coursemate/colleague (CYC)",
      "Reaching out to workplace colleagues",
    ],
  },
];

function WholenessMissionsPage() {
  const { page, counters } = Route.useLoaderData();
  return (
    <CmsPage
      page={page}
      counters={counters}

      eyebrow="Wholeness Missions"
      title="Leading his people to Light."
      intro="The mission arm of CMDA Nigeria — providing health, healing, and support to individuals, households, and communities within and outside Nigeria."
    >
      <Section id="about" className="paper">
        <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
              <p className="eyebrow text-cmda-green">About Wholeness Missions</p>
            </div>
            <h2 className="display-2 mt-6 text-balance">
              Caring for the whole man — spirit, soul and body.
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p className="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-extrabold first-letter:text-cmda-green">
                Wholeness Missions is the mission arm of the Christian Medical and Dental
                Association of Nigeria (CMDA Nigeria) through which members, partners, and
                collaborators provide health, healing, and support to individuals, households, and
                communities within and outside Nigeria.
              </p>
              <p>
                This is achieved through the mission's outreaches, missions awareness, resources,
                and in-reaches to members, in line with CMDA Nigeria's vision of caring for the
                whole man: spirit, soul, and body.
              </p>
              <p>
                Missions in CMDA Nigeria is as old as the organization. From its inception under the
                leadership of the Late Sir, Dr. Eze Akanu Ibiam, the First National President of
                CMDA Nigeria, members were constantly mobilized for outreaches — rural outreaches,
                hospital evangelism, and more. The term 'Wholeness Missions' was adopted for all
                mission activities of CMDA Nigeria in 2018, with a directorate at the National
                Office ensuring effective implementation.
              </p>
            </div>
            <a
              href="https://cmdanigeria.org/what-we-do/wholeness-missions/"
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
                <div className="aspect-[4/3] w-full bg-cmda-green/10 flex items-center justify-center">
                  <p className="text-sm text-cmda-green font-semibold">
                    Wholeness Missions Outreach
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="scope" className="bg-muted">
        <SectionHead
          eyebrow="What we do"
          title="The famous ten"
          intro="The Wholeness Missions' famous ten forms the bedrock of our activities."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {scope.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 90}>
              <div className="border border-border bg-background p-6 transition-shadow hover:shadow-card h-full">
                <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                  {item.items.map((sub) => (
                    <li key={sub} className="flex gap-2">
                      <span
                        className="mt-2 size-1 shrink-0 rounded-full bg-cmda-green"
                        aria-hidden="true"
                      />
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </CmsPage>
  );
}
