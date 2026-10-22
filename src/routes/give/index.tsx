import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CmsPage } from "@/components/site/CmsPage";
import { fetchPageBySlug, fetchPageCounters } from "@/sanity/data";
import { Giving } from "@/components/site/Events";
import { Reveal, Section, SectionHead } from "@/components/site/primitives";

const title = "Give | CMDA Nigeria";
const description =
  "Support medical missions, student scholarships and emergency relief through CMDA Nigeria — with transparent reporting on every naira received.";

export const Route = createFileRoute("/give/")({
  loader: async () => {
    const [page, counters] = await Promise.all([
      fetchPageBySlug({ data: "give" }),
      fetchPageCounters(),
    ]);
    return { page, counters };
  },
  component: GivePage,
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

type Category =
  | {
      title: string;
      desc: string;
      to: "/give/doctors-students" | "/give/global-network" | "/give/non-members";
    }
  | { title: string; desc: string; href: string; logo: string };

const categories: Category[] = [
  {
    title: "CMDA Nigeria Doctors & Students",
    desc: "Support missions, outreaches and projects across CMDA Nigeria — giving from within the fellowship of doctors, dentists and students.",
    to: "/give/doctors-students",
  },
  {
    title: "CMDA Nigeria Global Network",
    desc: "Give from anywhere in the world to strengthen diaspora ministries, regional meetings and global missions.",
    to: "/give/global-network",
  },
  {
    title: "Non-Members",
    desc: "Not a member yet? Partner with our work through a gift and tell us what you would love to support.",
    to: "/give/non-members",
  },
  {
    title: "Impact Fund",
    desc: "Long-term investment in scholarships, mission hospitals and healthcare infrastructure across Nigeria.",
    href: "https://impact.cmdanigeria.org/",
    logo: "/logos/impact-fund.png",
  },
];

const cardClass = "group card-editorial block h-full p-8";

function categoryBody(category: Category, external: boolean, index: number) {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow text-cmda-green">{String(index + 1).padStart(2, "0")}</p>
        {external ? (
          <ArrowUpRight
            className="size-5 text-muted-foreground transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
            aria-hidden="true"
          />
        ) : (
          <ArrowRight
            className="size-5 text-muted-foreground transition-transform duration-500 group-hover:translate-x-1 group-hover:text-primary"
            aria-hidden="true"
          />
        )}
      </div>
      {"logo" in category ? (
        <div className="mt-6 flex h-24 items-center">
          <img
            src={category.logo}
            alt=""
            loading="lazy"
            className="max-h-24 w-auto max-w-full object-contain"
          />
        </div>
      ) : null}
      <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-foreground">
        {category.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{category.desc}</p>
      <p className="mt-6 text-sm font-semibold text-primary">
        {external ? "Open portal" : "Donate"}
      </p>
    </>
  );
}

function GivePage() {
  const { page, counters } = Route.useLoaderData();
  return (
    <CmsPage
      page={page}
      counters={counters}

      eyebrow="Give"
      title="Send healthcare where the need is greatest"
      intro="Every gift funds outreaches, scholarships and mission hospitals — and every naira is accounted for in our published reports."
    >
      <Section id="categories">
        <SectionHead
          eyebrow="Ways to give"
          title="Choose a category to support"
          intro="Pick the area you would like to give to and see the specific needs your gift can meet."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {categories.map((category, i) => (
            <Reveal key={category.title} delay={(i % 2) * 90}>
              {"to" in category ? (
                <Link to={category.to} className={cardClass}>
                  {categoryBody(category, false, i)}
                </Link>
              ) : (
                <a
                  href={category.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClass}
                >
                  {categoryBody(category, true, i)}
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </Section>
      <Giving />
    </CmsPage>
  );
}
