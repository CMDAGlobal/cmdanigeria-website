import { PortableText, type PortableTextComponents } from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-4 first:mt-0">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-8 font-display text-2xl font-bold tracking-tight text-foreground">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 font-display text-lg font-bold tracking-tight text-foreground">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-4 border-cmda-green pl-6 italic">{children}</blockquote>
    ),
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
};

export function PortableContent({ value }: { value: unknown }) {
  if (!value || !Array.isArray(value) || value.length === 0) return null;
  return <PortableText value={value as Parameters<typeof PortableText>[0]["value"]} components={components} />;
}