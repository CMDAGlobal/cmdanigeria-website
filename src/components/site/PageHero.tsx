export function PageHero({
  eyebrow,
  title,
  intro,
  image,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  image?: { url?: string | null; alt?: string | null } | null | undefined;
}) {
  return (
    <section className="relative overflow-hidden bg-primary-deep px-6 pt-40 pb-24 lg:px-10 lg:pt-48 lg:pb-32">
      {/* editorial texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "88px 88px",
          color: "var(--gold)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-32 size-[34rem] rounded-full bg-secondary/25 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-end">
        <div>
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gold" aria-hidden="true" />
            <p className="eyebrow text-gold">{eyebrow}</p>
          </div>
          <h1 className="display-1 mt-7 max-w-4xl text-balance text-primary-foreground">{title}</h1>
          {image?.url ? (
            <p className="lede mt-6 max-w-3xl border-t border-gold/40 pt-6 text-primary-foreground/75">{intro}</p>
          ) : null}
        </div>
        {image?.url ? (
          <div className="overflow-hidden border border-gold/30 shadow-elegant">
            <img
              src={image.url}
              alt={image.alt ?? ""}
              className="aspect-[4/3] w-full object-cover lg:aspect-[4/3]"
            />
          </div>
        ) : (
          <p className="lede border-t border-gold/40 pt-6 text-primary-foreground/75 lg:border-t lg:pt-8">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
