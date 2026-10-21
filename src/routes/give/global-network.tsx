import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { CmsPage } from "@/components/site/CmsPage";
import { GlobalNetworkForm } from "@/components/site/GiveForms";
import { Reveal, Section, SectionHead } from "@/components/site/primitives";
import { CONTACT } from "@/lib/contact";
import { fetchPageBySlug, fetchPageCounters } from "@/sanity/data";

const title = "Donate to CMDA Nigeria Global Network";
const description =
  "Give from anywhere in the world to support CMDA Nigeria's diaspora ministries, regional meetings and global missions.";

export const Route = createFileRoute("/give/global-network")({
  loader: async () => {
    const [page, counters] = await Promise.all([
      fetchPageBySlug({ data: "give-global-network" }),
      fetchPageCounters(),
    ]);
    return { page, counters };
  },
  component: GlobalNetworkGivePage,
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

const areasOfNeed = [
  {
    title: "General Donation",
    desc: "Unrestricted support for the work of the network across every region.",
  },
  {
    title: "Missions",
    desc: "Medical missions reaching underserved communities around the world.",
  },
  {
    title: "Regional Meeting",
    desc: "Regional gatherings that bring professionals together for fellowship, worship and training.",
  },
  {
    title: "Administration",
    desc: "Coordinating chapters, communication and pastoral care across time zones.",
  },
  {
    title: "Building Project",
    desc: "Equipping facilities that serve the network and its member communities.",
  },
  {
    title: "CMDA Nigeria Joint Conference",
    desc: "The annual gathering uniting the fellowship at home and in the diaspora.",
  },
];

const otherOptions = [
  {
    Icon: Phone,
    label: "Zelle",
    value: "give@cmdanigeriaglobal.org",
    href: "mailto:give@cmdanigeriaglobal.org",
    note: `Or send to ${CONTACT.phoneGlobal}`,
  },
  {
    Icon: Mail,
    label: "Cash App",
    value: "$CMDANGLOBAL",
    href: undefined,
    note: "Search for our cashtag in the Cash App.",
  },
  {
    Icon: MapPin,
    label: "Cheques by mail",
    value: "CMDA Nigeria Global Network",
    href: undefined,
    note: CONTACT.globalOffice,
  },
];

function GlobalNetworkGivePage() {
  const { page, counters } = Route.useLoaderData();
  return (
    <CmsPage
      page={page}
      counters={counters}

      eyebrow="Donate"
      title="Donate to CMDA Nigeria Global Network"
      intro="Support our missions, outreaches and projects from anywhere in the world — give once, or become a monthly or annual vision partner."
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
                Make a one-time donation to CMDA Nigeria Global Network or choose to be a recurrent
                donor. You can also choose to be a monthly or annual vision partner.
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
              <div className="card-editorial p-6">
                <p className="eyebrow text-cmda-green">For everyone, everywhere</p>
                <h3 className="mt-6 font-display text-lg font-bold tracking-tight text-foreground">
                  You do not have to be in Nigeria to give
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Members and friends of the network give from North America, Europe, Asia and
                  across Africa — every gift advances the same mission.
                </p>
              </div>
              <div className="card-editorial p-6">
                <p className="eyebrow text-cmda-green">One or more areas</p>
                <h3 className="mt-6 font-display text-lg font-bold tracking-tight text-foreground">
                  Direct your gift where it matters most
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Give to a single area of need or spread your gift across several — tell us your
                  preference when you give.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="donate">
        <SectionHead
          eyebrow="Donation form"
          title="CMDA Global Donation"
          intro="Choose your category of donation, enter your amount and tell us how you would like to pay — our team will follow up to complete your gift."
        />
        <div className="mx-auto mt-16 max-w-3xl">
          <GlobalNetworkForm />
        </div>
      </Section>

      <Section id="areas-of-need" className="bg-muted">
        <SectionHead
          eyebrow="Areas of need"
          title="Six ways your gift can be put to work"
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

      <Section id="other-options">
        <SectionHead
          eyebrow="Other donation options"
          title="Giving from outside Nigeria"
          intro="Zelle, Cash App and cheques — use whichever is easiest from where you live."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {otherOptions.map((option, i) => (
            <Reveal key={option.label} delay={(i % 3) * 90}>
              <div className="card-editorial h-full p-6">
                <span className="flex size-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <option.Icon className="size-5" aria-hidden="true" />
                </span>
                <p className="eyebrow mt-6 text-muted-foreground">{option.label}</p>
                {option.href ? (
                  <a
                    href={option.href}
                    className="mt-2 block font-display text-lg font-bold tracking-tight text-foreground hover:text-primary"
                  >
                    {option.value}
                  </a>
                ) : (
                  <p className="mt-2 font-display text-lg font-bold tracking-tight text-foreground">
                    {option.value}
                  </p>
                )}
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{option.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </CmsPage>
  );
}
