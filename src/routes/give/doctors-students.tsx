import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import { CmsPage } from "@/components/site/CmsPage";
import { DonationForm } from "@/components/site/GiveForms";
import { Reveal, Section, SectionHead, buttonVariants } from "@/components/site/primitives";
import { CONTACT } from "@/lib/contact";
import { fetchPageBySlug, fetchPageCounters } from "@/sanity/data";

const title = "Donate to CMDA Nigeria | Doctors & Students";
const description =
  "Support CMDA Nigeria missions, outreaches and projects — see the areas of need your gift can meet across the fellowship.";

export const Route = createFileRoute("/give/doctors-students")({
  loader: async () => {
    const [page, counters] = await Promise.all([
      fetchPageBySlug({ data: "give-doctors-students" }),
      fetchPageCounters(),
    ]);
    return { page, counters };
  },
  component: DoctorsStudentsGivePage,
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

const givingWays = [
  {
    title: "Give once",
    desc: "A one-time donation to support missions, outreaches and projects happening right now.",
  },
  {
    title: "Give recurrently",
    desc: "Choose to be a recurrent donor and keep the work going throughout the year.",
  },
  {
    title: "Vision partner",
    desc: "Commit as a monthly or annual vision partner and plan your impact ahead.",
  },
];

const areasOfNeed = [
  {
    title: "General Donation",
    desc: "Unrestricted support for the daily work of the fellowship across the nation.",
  },
  {
    title: "National Secretariat",
    desc: "Sustaining the team serving chapters and states from the secretariat in Abuja.",
  },
  {
    title: "Building Project",
    desc: "Completing and equipping the national secretariat complex at Wholeness House.",
  },
  {
    title: "Wholeness Missions",
    desc: "Medical outreaches bringing healing, health and hope to underserved communities.",
  },
  {
    title: "Wholeness Journal",
    desc: "Publishing faith-informed research and reflections on whole-person care.",
  },
  {
    title: "Institute of Medical Missions",
    desc: "Training healthcare professionals for medical missions at home and beyond.",
  },
  {
    title: "IfEHL",
    desc: "Leadership formation for healthcare professionals who lead with excellence.",
  },
  {
    title: "Touch Magazine",
    desc: "Our flagship publication telling stories of faith, medicine and service.",
  },
  {
    title: "CMDA Nigeria Joint Conference",
    desc: "The annual gathering of the doctors' and students' arms of the fellowship.",
  },
];

function DoctorsStudentsGivePage() {
  const { page, counters } = Route.useLoaderData();
  const [giveTab, setGiveTab] = useState<"donate" | "pledge">("donate");
  const tabClass = (active: boolean) =>
    `px-6 py-3 font-display text-xs font-bold uppercase tracking-widest transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
      active
        ? "bg-cmda-green text-white shadow-card"
        : "border border-foreground/20 bg-card text-foreground hover:border-cmda-green hover:text-cmda-green"
    }`;

  return (
    <CmsPage
      page={page}
      counters={counters}

      eyebrow="Donate"
      title="Donate to CMDA Nigeria"
      intro="Support our missions, outreaches and projects — give once, give regularly, or become a monthly or annual vision partner."
    >
      <Section>
        <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
              <p className="eyebrow text-cmda-green">Make donations</p>
            </div>
            <h2 className="display-2 mt-6 text-balance">Make donations to support our cause</h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                Make a one-time donation to CMDA Nigeria or choose to be a recurrent donor. You can
                also choose to be a monthly or annual vision partner.
              </p>
              <p>
                Your generosity will help us achieve our goal of nurturing a global community of
                healthcare professionals who have been equipped to provide compassionate,
                patient-centred healthcare service and bring healing, health and hope to their
                communities and around the world.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-5">
              {givingWays.map((way) => (
                <div key={way.title} className="card-editorial p-6">
                  <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                    {way.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{way.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="areas-of-need" className="bg-muted">
        <SectionHead
          eyebrow="Areas of need"
          title="Nine ways your gift can be put to work"
          intro="You can give to one or more areas of need — mention your preference when you make your gift."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areasOfNeed.map((area, i) => (
            <Reveal key={area.title} delay={(i % 3) * 90}>
              <div className="card-editorial h-full p-6">
                <p className="eyebrow text-cmda-green">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-6 font-display text-lg font-bold tracking-tight text-foreground">
                  {area.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{area.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="donate">
        <div className="mx-auto max-w-3xl">
          <div
            role="tablist"
            aria-label="Donation options"
            className="flex flex-wrap gap-3 border-b border-border pb-4"
          >
            <button
              type="button"
              role="tab"
              id="give-donate-tab"
              aria-selected={giveTab === "donate"}
              aria-controls="give-donate-panel"
              onClick={() => setGiveTab("donate")}
              className={tabClass(giveTab === "donate")}
            >
              Donate now
            </button>
            <button
              type="button"
              role="tab"
              id="give-pledge-tab"
              aria-selected={giveTab === "pledge"}
              aria-controls="give-pledge-panel"
              onClick={() => setGiveTab("pledge")}
              className={tabClass(giveTab === "pledge")}
            >
              Pledge / pay later
            </button>
          </div>
          <div
            id="give-donate-panel"
            role="tabpanel"
            aria-labelledby="give-donate-tab"
            hidden={giveTab !== "donate"}
            className="mt-8"
          >
            <DonationForm variant="donation" />
          </div>
          <div
            id="give-pledge-panel"
            role="tabpanel"
            aria-labelledby="give-pledge-tab"
            hidden={giveTab !== "pledge"}
            className="mt-8"
          >
            <p className="mb-6 text-base leading-relaxed text-muted-foreground">
              Kindly fill the pledge form below if you are not ready to make payment immediately.
            </p>
            <DonationForm variant="pledge" />
          </div>
        </div>
      </Section>

      <Section id="in-kind" className="bg-muted">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
            <p className="eyebrow text-cmda-green">In-kind donations</p>
            <span className="h-px w-10 bg-cmda-green" aria-hidden="true" />
          </div>
          <h2 className="display-2 mt-6 text-balance">Prefer to give in kind?</h2>
          <p className="lede mt-6 text-muted-foreground">
            We accept donations of medical equipment, materials and supplies. Call the secretariat
            or send us an email and we will arrange a handover with you.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="tel:+2348091533339" className={buttonVariants({ variant: "primary" })}>
              <Phone className="size-4" aria-hidden="true" />
              {CONTACT.phone}
            </a>
            <a href={`mailto:${CONTACT.email}`} className={buttonVariants({ variant: "outline" })}>
              <Mail className="size-4" aria-hidden="true" />
              {CONTACT.email}
            </a>
          </div>
        </Reveal>
      </Section>
    </CmsPage>
  );
}
