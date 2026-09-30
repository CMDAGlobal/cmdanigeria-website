import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { PageSections } from "@/components/site/PageSections";
import { WhatWeDo } from "@/components/site/About";
import { shouldRenderBody } from "@/sanity/sections";
import { PortableContent } from "@/components/site/portable";
import { Reveal, Section } from "@/components/site/primitives";
import { fetchPageBySlug, fetchPageCounters } from "@/sanity/data";

const title = "What We Do | CMDA Nigeria";
const description =
  "Leadership development, medical missions, advocacy, student discipleship and whole-person care — the twelve pillars of CMDA Nigeria's work.";

/**
 * Once an editor builds `sections` for the `what-we-do` page in Studio, the CMS
 * render takes over; the hard-coded pillars below remain as the fallback so the
 * page is never blank.
 */
export const Route = createFileRoute("/what-we-do")({
  loader: async () => {
    const [page, counters] = await Promise.all([
      fetchPageBySlug({ data: "what-we-do" }),
      fetchPageCounters(),
    ]);
    return { page, counters };
  },
  component: WhatWeDoPage,
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

function WhatWeDoPage() {
  const { page, counters } = Route.useLoaderData();
  const hasSections = (page?.sections?.length ?? 0) > 0;
  const hasBody = shouldRenderBody(page?.sections, page?.body);

  return (
    <>
      <PageHero
        eyebrow="What we do"
        title={page?.title || "Twelve pillars of ministry across Nigerian healthcare"}
        intro={
          page?.summary ||
          "From bedside evangelism to national health advocacy, our work equips healthcare professionals to serve patients in body, mind and spirit."
        }
      />
      {page && hasSections ? (
        <PageSections sections={page.sections} arm={page.arm} counters={counters} />
      ) : (
        <WhatWeDo />
      )}
      {hasBody ? (
        <Section>
          <Reveal>
            <div className="text-base leading-relaxed text-muted-foreground">
              <PortableContent value={page?.body} />
            </div>
          </Reveal>
        </Section>
      ) : null}
    </>
  );
}
