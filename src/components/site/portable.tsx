import { PortableText, type PortableTextComponents } from "@portabletext/react";

/** Image blocks carry `{ asset: { url }, alt, caption }` from the projection. */
interface BodyImageValue {
  asset?: { url?: string | null } | null;
  alt?: string | null;
  caption?: string | null;
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-4 first:mt-0">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-8 font-display text-2xl font-bold tracking-tight text-foreground">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 font-display text-lg font-bold tracking-tight text-foreground">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-5 font-display text-base font-bold tracking-tight text-foreground">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-4 border-cmda-green pl-6 italic">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 list-disc space-y-2 pl-6 marker:text-cmda-green">{children}</ul>
    ),
    number: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="font-semibold text-cmda-green underline underline-offset-4 hover:text-cmda-green-deep"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      const { asset, alt, caption } = (value ?? {}) as BodyImageValue;
      const url = asset?.url;
      if (!url) return null;
      return (
        <figure className="mt-8">
          <img
            src={url}
            alt={alt ?? ""}
            loading="lazy"
            className="w-full border border-border object-cover"
          />
          {caption ? (
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">{caption}</figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export function PortableContent({ value }: { value: unknown }) {
  if (!value || !Array.isArray(value) || value.length === 0) return null;
  return <PortableText value={value as Parameters<typeof PortableText>[0]["value"]} components={components} />;
}
