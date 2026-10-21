import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { CmsPage } from "@/components/site/CmsPage";
import { Button, Reveal, Section, buttonVariants } from "@/components/site/primitives";
import { fetchPageBySlug, fetchPageCounters } from "@/sanity/data";

const title = "Donate as a Non-Member | CMDA Nigeria";
const description =
  "Partner with CMDA Nigeria through a gift — share your details and our team will reach out with giving details for the areas you wish to support.";

export const Route = createFileRoute("/give/non-members")({
  loader: async () => {
    const [page, counters] = await Promise.all([
      fetchPageBySlug({ data: "give-non-members" }),
      fetchPageCounters(),
    ]);
    return { page, counters };
  },
  component: NonMembersGivePage,
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

function NonMembersGivePage() {
  const { page, counters } = Route.useLoaderData();
  const [submitted, setSubmitted] = useState(false);

  return (
    <CmsPage
      page={page}
      counters={counters}

      eyebrow="Donate"
      title="Donate as a non-member"
      intro="You do not have to be a member to partner with our work — tell us who you are and what you would like to support, and our team will get in touch with giving details."
    >
      <Section>
        <Reveal className="mx-auto max-w-2xl">
          {submitted ? (
            <div
              className="rounded-xl border border-border bg-card p-10 text-center"
              role="status"
              aria-live="polite"
            >
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-cmda-green text-primary-foreground">
                <Check className="size-7" aria-hidden="true" />
              </span>
              <h2 className="mt-6 font-display text-2xl font-extrabold sm:text-3xl">
                Thank you for your generosity!
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                We have received your details. A member of our team will contact you shortly with
                giving details for the area you would like to support.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link to="/give" className={buttonVariants({ variant: "primary" })}>
                  Back to give options
                </Link>
                <button
                  type="button"
                  className={buttonVariants({ variant: "outline" })}
                  onClick={() => setSubmitted(false)}
                >
                  Submit another response
                </button>
              </div>
            </div>
          ) : (
            <form
              className="rounded-xl border border-border bg-card p-8"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
              aria-label="Non-member donation form"
            >
              <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
                Tell us how you would like to give
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Fill in your details and our secretariat will follow up with the giving information
                for your chosen area of need.
              </p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field id="non-member-name" label="Full name" autoComplete="name" />
                <Field
                  id="non-member-email"
                  label="Email address"
                  type="email"
                  autoComplete="email"
                />
                <Field id="non-member-phone" label="Phone number" type="tel" autoComplete="tel" />
                <Field
                  id="non-member-institution"
                  label="Institution"
                  autoComplete="organization"
                />
              </div>
              <div className="mt-5">
                <label htmlFor="non-member-purpose" className="text-sm font-semibold">
                  Purpose of donation
                </label>
                <textarea
                  id="non-member-purpose"
                  rows={4}
                  required
                  placeholder="e.g. Wholeness Missions outreach in the north"
                  className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                />
              </div>
              <Button type="submit" className="mt-6 w-full">
                Submit
              </Button>
            </form>
          )}
        </Reveal>
      </Section>
    </CmsPage>
  );
}

function Field({
  id,
  label,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        autoComplete={autoComplete}
        className="mt-2 h-11 w-full rounded-md border border-input bg-background px-4 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      />
    </div>
  );
}
