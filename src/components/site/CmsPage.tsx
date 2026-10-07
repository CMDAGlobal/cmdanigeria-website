import type { ReactNode } from "react";

import { PageHero } from "@/components/site/PageHero";
import { PageSections } from "@/components/site/PageSections";
import { PortableContent } from "@/components/site/portable";
import { Reveal, Section } from "@/components/site/primitives";
import { shouldRenderBody } from "@/sanity/sections";
import type { PageCounters, PageDocument, SanityImage } from "@/sanity/types";

type CmsPageProps = {
  page: PageDocument | null | undefined;
  counters?: PageCounters | null | undefined;
  eyebrow: string;
  title: string;
  intro: string;
  image?: SanityImage | null;
  /** Hard-coded content used until an editor builds `sections` for this page. */
  children?: ReactNode;
};

/**
 * Shared shell for website pages listed in the dashboard's Pages module: once a
 * page has CMS sections the Studio-built layout renders, otherwise the route's
 * own markup is shown. Admins are never expected to edit the fallback copy.
 */
export function CmsPage({ page, counters, eyebrow, title, intro, image, children }: CmsPageProps) {
  const hasSections = (page?.sections?.length ?? 0) > 0;
  const hasBody = shouldRenderBody(page?.sections, page?.body);

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={hasSections && page?.title ? page.title : title}
        intro={hasSections && page?.summary ? page.summary : intro}
        image={hasSections ? (page?.coverImage ?? image) : image}
      />
      {hasSections ? (
        <PageSections sections={page?.sections} arm={page?.arm} counters={counters} />
      ) : (
        children
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
