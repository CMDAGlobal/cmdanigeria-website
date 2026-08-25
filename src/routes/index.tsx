import { createFileRoute, Link } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { ImpactStats } from "@/components/site/ImpactStats";
import { WhoWeAre } from "@/components/site/About";
import { Ministries } from "@/components/site/Ministries";
import { ReasonsToJoin } from "@/components/site/ReasonsToJoin";

import { Reveal, Section, buttonVariants } from "@/components/site/primitives";
import { cn } from "@/lib/utils";

const title = "CMDA Nigeria | Christian Medical and Dental Association";
const description =
  "CMDA Nigeria equips Christian doctors, dentists and medical students for whole-person care — with clinical excellence, compassion and integrity across Nigeria and beyond.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NGO",
          name: "Christian Medical and Dental Association of Nigeria",
          alternateName: "CMDA Nigeria",
          description,
          foundingDate: "1972",
          address: { "@type": "PostalAddress", addressCountry: "NG", addressLocality: "Abuja" },
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <>
      <Hero />
      <ImpactStats />
      <WhoWeAre />
      <Ministries />
      <ReasonsToJoin />
      <Section className="relative overflow-hidden bg-primary-deep text-primary-foreground">
        {/* Background image */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.12]"
          style={{ backgroundImage: "url(/cmda-wholeness-mission-bg.webp)" }}
        />

        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
            <p className="eyebrow text-gold">Get involved</p>
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
          </div>
          <h2 className="display-2 mt-6 text-balance">
            Join the fellowship, or help send one more healthcare worker
          </h2>
          <p className="lede mt-6 text-primary-foreground/75">
            Membership opens the door to mentorship, missions and continuing education. Giving keeps
            our outreaches moving into underserved communities.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/membership"
              className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
            >
              Become a Member
            </Link>
            <Link to="/give" className={cn(buttonVariants({ variant: "gold", size: "lg" }))}>
              Donate Today
            </Link>
            <Link to="/what-we-do" className={cn(buttonVariants({ variant: "onDark", size: "lg" }))}>
              What We Do
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
