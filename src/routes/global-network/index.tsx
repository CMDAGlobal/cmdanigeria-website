import { createFileRoute, Link } from "@tanstack/react-router";
import { CmsPage } from "@/components/site/CmsPage";
import { Reveal, Section, SectionHead, buttonVariants } from "@/components/site/primitives";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { fetchRegions, fetchPageBySlug } from "@/sanity/data";

const title = "Global Network | CMDA Nigeria";
const description =
  "The Global Network of doctors of Nigerian descent — five regions: The Americas & Caribbean, UK/Europe, Middle East, Australasia and Africa.";

export const Route = createFileRoute("/global-network/")({
  loader: async () => ({
    page: await fetchPageBySlug({ data: "global-network" }),
    regions: await fetchRegions(),
  }),
  component: GlobalNetworkPage,
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

function GlobalNetworkPage() {
  const { regions, page } = Route.useLoaderData();
  return (
    <CmsPage
      page={page}
      stackSections
      eyebrow="Global Network"
      title="Connecting Nigerian Christian healthcare professionals worldwide"
      intro="The Global Network is a network of doctors of Nigerian descent who trained in Nigeria and were members of CMDA Nigeria — then NCCMDS."
    >
      {/* Regions */}
      <Section className="bg-muted">
        <SectionHead
          eyebrow="Where we are"
          title="Our regions across the world"
          intro="Each region is managed independently — with its own leaders, events, announcements, activities and chapters."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((r) => {
            const slug = r.slug?.current ?? "";
            return (
              <Reveal key={r._id}>
                <Link
                  to="/global-network/$slug"
                  params={{ slug }}
                  className="group flex h-full flex-col border border-border bg-background p-6 transition-all hover:border-cmda-green hover:shadow-card"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-cmda-green">
                      {r.name}
                    </h3>
                    <ArrowUpRight
                      className="size-5 text-cmda-green transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {r.intro ?? r.tagline ?? ""}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-muted-foreground">
                    <span>{r.countries?.length ?? 0} countries</span>
                    <span>{r.chapterCount ?? 0} chapters</span>
                    <span>{r.eventCount ?? 0} events</span>
                  </div>
                  <span className="mt-4 text-sm font-semibold text-cmda-green">Explore region</span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-primary-deep text-primary-foreground">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="display-2 text-balance">Stay connected with CMDA Nigeria</h2>
          <p className="lede mt-6 text-primary-foreground/75">
            Wherever you are in the world, you remain part of the CMDA Nigeria family. Join the
            network, give back and keep the mission alive.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/membership" className={cn(buttonVariants({ variant: "gold", size: "lg" }))}>
              Become a Member
            </Link>
            <Link to="/give" className={cn(buttonVariants({ variant: "onDark", size: "lg" }))}>
              Support the Mission
            </Link>
          </div>
        </Reveal>
      </Section>
    </CmsPage>
  );
}
