import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { CmsPage } from "@/components/site/CmsPage";
import { fetchPageBySlug, fetchPageCounters } from "@/sanity/data";
import { buttonVariants, Reveal, Section } from "@/components/site/primitives";
import { cn } from "@/lib/utils";

const title = "Impact Fund | CMDA Nigeria";
const description =
  "CMDA Nigeria's strategic endowment — securing the future of medical missions, leadership development and healthcare training for generations to come.";

export const Route = createFileRoute("/impact-fund")({
  loader: async () => {
    const [page, counters] = await Promise.all([
      fetchPageBySlug({ data: "impact-fund" }),
      fetchPageCounters(),
    ]);
    return { page, counters };
  },
  component: ImpactFundPage,
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

function ImpactFundPage() {
  const { page, counters } = Route.useLoaderData();
  return (
    <CmsPage
      page={page}
      counters={counters}

      eyebrow="Impact Fund"
      title="Securing the future of our mission"
      intro="A strategic endowment built for generations to come — so life-changing medical missions, leadership development and healthcare training continue without interruption."
    >
      <Section id="about" className="paper">
        <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
              <p className="eyebrow text-cmda-green">About the Impact Fund</p>
            </div>
            <h2 className="display-2 mt-6 text-balance">
              A lasting legacy of Christ-centred healthcare.
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p className="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-extrabold first-letter:text-cmda-green">
                The Impact Fund is CMDA Nigeria's strategic endowment initiative designed to secure
                the future of our mission and expand our impact for generations to come. By building
                a sustainable financial foundation, the Fund ensures that life-changing medical
                missions, leadership development, healthcare training, staff support, and
                infrastructure development continue to thrive without interruption.
              </p>
              <p>
                The Fund supports key initiatives such as medical outreaches, capacity-building
                programmes including IMM, IfEHL, Whole Person Medicine, SALINE, and BLS training,
                the development of strategic facilities, and the growth of the next generation of
                Christian healthcare leaders.
              </p>
              <p>
                Our goal is to raise ₦1 billion through the collective generosity of members,
                families, churches, organizations, and partners who share our vision. Contributions
                can be made individually or jointly, in full or by instalments, with every gift
                helping to build a lasting legacy of Christ-centred healthcare ministry.
              </p>
              <p>
                To ensure long-term sustainability, the Fund will be prudently invested in secure
                government-backed instruments, generating returns that will continually support CMDA
                Nigeria's mission.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative">
              <div className="framed">
                <div className="flex aspect-[4/3] w-full items-center justify-center bg-cmda-green/10 p-12">
                  <img
                    src="/logos/impact-fund.png"
                    alt="CMDA Nigeria Impact Fund logo"
                    loading="lazy"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-primary-deep text-primary-foreground">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-gold">Give to the Fund</p>
          <h2 className="display-2 mt-6 text-balance">Help us raise ₦1 billion</h2>
          <p className="lede mt-6 text-primary-foreground/75">
            Contributions can be made individually or jointly, in full or by instalments — every
            gift builds a lasting legacy of Christ-centred healthcare ministry.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="https://impact.cmdanigeria.org/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "gold", size: "lg" }))}
            >
              Visit the Impact Fund portal
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </Section>
    </CmsPage>
  );
}
