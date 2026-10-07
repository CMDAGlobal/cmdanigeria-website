import { Link } from "@tanstack/react-router";
import { videoEmbedUrl, visibleSections } from "@/sanity/sections";
import type { Arm, PageCounters, PageSection } from "@/sanity/types";
import { PortableContent } from "./portable";
import { Button, Reveal, Section, SectionHead } from "./primitives";

/** Live counts keyed by arm; `autoFill` sections read from here instead of typed numbers. */
type CounterMap = PageCounters[Arm];

/** "9,700" -> "9,700+" is presentation, so the formatter lives with the renderer. */
function formatCount(value: number | null | undefined, suffix = "+"): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return `${value.toLocaleString("en-NG")}${suffix}`;
}

function Eyebrow({ text }: { text?: string | null | undefined }) {
  if (!text) return null;
  return <p className="text-xs font-semibold tracking-[0.2em] text-cmda-green uppercase">{text}</p>;
}

function CtaLink({
  label,
  href,
}: {
  label?: string | null | undefined;
  href?: string | null | undefined;
}) {
  if (!label || !href) return null;
  if (href.startsWith("/")) {
    return (
      <Link to={href} className="mt-6 inline-block">
        <Button>{label}</Button>
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className="mt-6 inline-block">
      <Button>{label}</Button>
    </a>
  );
}

function Heading({
  text,
  center,
}: {
  text?: string | null | undefined;
  center?: boolean | undefined;
}) {
  if (!text) return null;
  return (
    <h2
      className={`font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl ${
        center ? "text-center" : ""
      }`}
    >
      {text}
    </h2>
  );
}

/* ─── Section renderers ─── */

function HeroSection({ section }: { section: PageSection }) {
  const bg = section.backgroundImage?.asset?.url;
  const heading = section.heading ?? section.internalName ?? "";
  return (
    <section className="relative isolate overflow-hidden bg-cmda-green text-white">
      {bg ? (
        <img
          src={bg}
          alt={section.backgroundImage?.alt ?? ""}
          className="absolute inset-0 -z-10 size-full object-cover opacity-30"
        />
      ) : null}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <Eyebrow text={section.eyebrow} />
        <h1 className="font-display mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          {heading}
        </h1>
        {section.body?.length ? (
          <div className="mt-6 max-w-2xl text-lg leading-relaxed opacity-90">
            <PortableContent value={section.body} />
          </div>
        ) : null}
        <CtaLink label={section.ctaLabel} href={section.ctaHref} />
      </div>
    </section>
  );
}

function RichTextSection({ section }: { section: PageSection }) {
  if (!section.heading && !section.body?.length) return null;
  return (
    <Section>
      <Reveal className={section.width ? "mx-auto max-w-2xl" : ""}>
        <Eyebrow text={section.eyebrow} />
        <Heading text={section.heading} />
        <div className="mt-6 text-base leading-relaxed text-muted-foreground">
          <PortableContent value={section.body} />
        </div>
      </Reveal>
    </Section>
  );
}

function ImageTextSection({ section }: { section: PageSection }) {
  const image = section.image?.asset?.url;
  const copy = (
    <Reveal>
      <Eyebrow text={section.eyebrow} />
      <Heading text={section.heading} />
      <div className="mt-6 text-base leading-relaxed text-muted-foreground">
        <PortableContent value={section.body} />
      </div>
      <CtaLink label={section.ctaLabel} href={section.ctaHref} />
    </Reveal>
  );
  const media = image ? (
    <Reveal>
      <figure>
        <img
          src={image}
          alt={section.imageAlt ?? section.image?.alt ?? ""}
          loading="lazy"
          className="w-full border border-border object-cover"
        />
        {section.imageCaption ? (
          <figcaption className="mt-2 text-center text-xs text-muted-foreground">
            {section.imageCaption}
          </figcaption>
        ) : null}
      </figure>
    </Reveal>
  ) : null;

  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {section.imageSide === "left" ? (
          <>
            {media}
            {copy}
          </>
        ) : (
          <>
            {copy}
            {media}
          </>
        )}
      </div>
    </Section>
  );
}

function StatsSection({ section, counters }: { section: PageSection; counters: CounterMap }) {
  const typed = section.items ?? [];
  const stats =
    typed.length > 0
      ? typed.map((item) => ({ value: item.value ?? "", label: item.label ?? "" }))
      : [
          { value: formatCount(counters?.chapters), label: "Chapters" },
          { value: formatCount(counters?.zones), label: "Zones" },
          { value: formatCount(counters?.people, ""), label: "Members" },
        ];
  if (stats.every((stat) => !stat.value && !stat.label)) return null;

  return (
    <Section className="paper">
      <SectionHead eyebrow={section.eyebrow ?? ""} title={section.heading ?? ""} />
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Reveal key={`${stat.label}-${index}`}>
            <div className="border-l-2 border-cmda-green pl-5">
              <p className="font-display text-4xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function GallerySection({ section }: { section: PageSection }) {
  const images = (section.images ?? []).filter((image) => image?.asset?.url);
  if (images.length === 0) return null;
  return (
    <Section>
      <SectionHead eyebrow={section.eyebrow ?? ""} title={section.heading ?? ""} />
      {section.body?.length ? (
        <div className="mt-4 max-w-2xl text-muted-foreground">
          <PortableContent value={section.body} />
        </div>
      ) : null}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <Reveal key={`${image.asset?._id ?? index}`}>
            <figure>
              <img
                src={image.asset?.url ?? ""}
                alt={image.alt ?? ""}
                loading="lazy"
                className="aspect-[4/3] w-full border border-border object-cover"
              />
              {image.caption ? (
                <figcaption className="mt-2 text-center text-xs text-muted-foreground">
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function VideoSection({ section }: { section: PageSection }) {
  const embed = videoEmbedUrl(section.provider, section.videoId);
  if (!embed) return null;
  return (
    <Section>
      <SectionHead eyebrow={section.eyebrow ?? ""} title={section.heading ?? ""} />
      <Reveal className="mt-10">
        <div className="aspect-video overflow-hidden border border-border bg-black">
          <iframe
            src={embed}
            title={section.heading ?? section.caption ?? "Video"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="size-full"
          />
        </div>
        {section.caption ? (
          <p className="mt-3 text-center text-xs text-muted-foreground">{section.caption}</p>
        ) : null}
      </Reveal>
    </Section>
  );
}

function CtaSection({ section }: { section: PageSection }) {
  if (!section.heading && !section.ctaLabel) return null;
  return (
    <Section>
      <Reveal>
        <div
          className={`px-6 py-14 text-center sm:px-12 ${
            section.tone === "muted" ? "bg-muted/50" : "bg-cmda-green text-white"
          }`}
        >
          <Heading text={section.heading} center />
          {section.body?.length ? (
            <div
              className={`mx-auto mt-4 max-w-2xl ${
                section.tone === "muted" ? "text-muted-foreground" : "opacity-90"
              }`}
            >
              <PortableContent value={section.body} />
            </div>
          ) : null}
          <CtaLink label={section.ctaLabel} href={section.ctaHref} />
        </div>
      </Reveal>
    </Section>
  );
}

const RENDERERS: Record<
  PageSection["_type"],
  (props: { section: PageSection; counters: CounterMap }) => React.ReactElement | null
> = {
  heroSection: ({ section }) => <HeroSection section={section} />,
  richTextSection: ({ section }) => <RichTextSection section={section} />,
  imageTextSection: ({ section }) => <ImageTextSection section={section} />,
  statsSection: ({ section, counters }) => <StatsSection section={section} counters={counters} />,
  gallerySection: ({ section }) => <GallerySection section={section} />,
  videoSection: ({ section }) => <VideoSection section={section} />,
  ctaSection: ({ section }) => <CtaSection section={section} />,
};

export interface PageSectionsProps {
  sections: PageSection[] | null | undefined;
  arm?: Arm | null | undefined;
  counters?: PageCounters | null | undefined;
}

/**
 * Renders a page's ordered sections. Hidden sections are skipped, and an unknown
 * section type is ignored rather than breaking the page.
 */
export function PageSections({ sections, arm, counters }: PageSectionsProps) {
  const list = visibleSections(sections);
  if (list.length === 0) return null;
  const counterMap = (counters ?? { students: {}, doctors: {}, global: {} })[arm ?? "global"] ?? {};

  return (
    <>
      {list.map((section) => {
        const render = RENDERERS[section._type];
        if (!render) return null;
        return <div key={section._key}>{render({ section, counters: counterMap })}</div>;
      })}
    </>
  );
}
