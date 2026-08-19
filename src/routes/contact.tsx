import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Button, Reveal, Section } from "@/components/site/primitives";

const title = "Contact CMDA Nigeria | National Secretariat";
const description =
  "Reach the CMDA Nigeria National Secretariat in Abuja for membership, partnership, media and chapter enquiries.";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const details = [
  {
    Icon: MapPin,
    label: "National Office",
    value: "Wholeness House, Gwagwalada, FCT, Nigeria",
  },
  {
    Icon: MapPin,
    label: "Liaison Office",
    value: "F104, Hospital Chapel, National Hospital Abuja",
  },
  {
    Icon: MapPin,
    label: "Global Office",
    value: "1928 Woodlawn Drive, Woodlawn, Maryland 21207, USA",
  },
  { Icon: Phone, label: "CMDA Nigeria", value: "+234 (809) 153 3339" },
  { Icon: Phone, label: "CMDA Nigeria Global", value: "+1 (443) 527 4199" },
  { Icon: Clock, label: "Open hours", value: "8:00am – 5:00pm (Mon–Fri)" },
  { Icon: Mail, label: "Email", value: "info@cmdanigeria.org" },
];


function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We would love to hear from you"
        intro="Whether you are joining the fellowship, partnering on a mission or making a media enquiry, our secretariat team is ready to help."
      />
      <Section>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <Reveal>
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Get in touch</h2>
            <ul className="mt-8 space-y-6">
              {details.map(({ Icon, label, value }) => (
                <li key={label} className="flex gap-4">
                  <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="eyebrow text-muted-foreground">{label}</p>
                    <p className="mt-1 font-display text-base font-bold">{value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <form
              className="rounded-xl border border-border bg-card p-8"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Contact form"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="contact-name" label="Full name" />
                <Field id="contact-email" label="Email address" type="email" />
              </div>
              <div className="mt-5">
                <Field id="contact-subject" label="Subject" />
              </div>
              <div className="mt-5">
                <label htmlFor="contact-message" className="text-sm font-semibold">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  required
                  className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                />
              </div>
              <Button type="submit" className="mt-6 w-full">
                Send message
              </Button>
            </form>
          </Reveal>
        </div>
      </Section>
    </>
  );
}

function Field({ id, label, type = "text" }: { id: string; label: string; type?: string }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        className="mt-2 h-11 w-full rounded-md border border-input bg-background px-4 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      />
    </div>
  );
}
