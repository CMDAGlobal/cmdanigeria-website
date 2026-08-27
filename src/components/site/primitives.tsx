import { cva, type VariantProps } from "class-variance-authority";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "group/btn inline-flex items-center justify-center gap-2 rounded-none font-display text-sm font-semibold tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-deep shadow-card",
        gold: "bg-gold text-gold-foreground hover:brightness-105 shadow-card",
        outline:
          "border border-foreground/20 bg-transparent text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground",
        onDark:
          "border border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground backdrop-blur hover:bg-primary-foreground hover:text-primary-deep",
        ghost: "text-foreground hover:bg-accent",
        editorial: "bg-primary text-primary-foreground shadow-elegant hover:bg-primary-deep",
        editorialGold:
          "border border-gold bg-transparent text-primary-deep hover:bg-gold hover:text-gold-foreground",
        editorialDeep: "bg-primary-deep text-primary-foreground hover:brightness-125",
      },

      size: {
        md: "h-11 px-5",
        lg: "h-13 px-7 text-base",
        sm: "h-9 px-4",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("px-6 py-24 md:py-32 lg:px-10", className)}>
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}

/**
 * Shared editorial section header: gold rule + eyebrow, oversized display
 * heading, optional lede and trailing action. Used on every page so the
 * rhythm of the site is consistent.
 */
export function SectionHead({
  eyebrow,
  title,
  intro,
  action,
  tone = "light",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <Reveal className="max-w-3xl">
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
          <p className={cn("eyebrow", tone === "dark" ? "text-cmda-green-light" : "text-cmda-green")}>{eyebrow}</p>
        </div>
        <h2 className="display-2 mt-6 text-balance">{title}</h2>
        {intro ? (
          <p
            className={cn(
              "lede mt-6",
              tone === "dark" ? "text-primary-foreground/75" : "text-muted-foreground",
            )}
          >
            {intro}
          </p>
        ) : null}
      </Reveal>
      {action ? (
        <Reveal delay={120} className="shrink-0">
          {action}
        </Reveal>
      ) : null}
    </div>
  );
}


export function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", inView && "reveal-in", className)}
    >
      {children}
    </div>
  );
}
