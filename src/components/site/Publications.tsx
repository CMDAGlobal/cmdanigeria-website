import { Camera } from "lucide-react";
import { Reveal, Section, SectionHead } from "./primitives";

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="relative aspect-[3/4] w-full border-2 border-dashed border-gold/40 bg-gold/5">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gold/60">
        <Camera className="size-8" aria-hidden="true" />
        <span className="px-4 text-center text-xs font-semibold tracking-wide uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}

const magazines = [
  {
    title: "Touch Magazine",
    tag: "Annual",
    desc: "An annual publication of the Doctors' arm of CMDA Nigeria, containing news and reports from across various chapters within the nation, future plans and targets of the organisation, and enriching articles targeted at addressing common challenges encountered by Christian medics in their practice.",
    placeholder: "Touch Magazine cover",
  },
  {
    title: "Wholeness Journal",
    tag: "Annual",
    desc: "An annual publication of the Students' arm of CMDA Nigeria, containing news and reports from across various chapters, future plans and targets, and enriching articles targeted at addressing common challenges encountered by Christian medical and dental students in their training.",
    placeholder: "Wholeness Journal cover",
  },
  {
    title: "CMDA-LD Magazine",
    tag: "Biannual",
    desc: "A biannual publication produced by Lady Doctors and Students for Lady Doctors and Students. The magazine addresses key aspects of the life and journey of female medical professionals and students, including spiritual and holistic growth, career and academics, leadership, family and ministry, wellness and lifestyle, missions, and testimonies.",
    placeholder: "CMDA-LD Magazine cover",
  },
  {
    title: "Missions Exploits Magazine",
    tag: "Annual",
    desc: "An annual publication of the Students' arm documenting and celebrating the missions activities and experiences of the Association's student members. It captures the impact of mission outreaches, highlights testimonies and lessons from the field, and shares stories of service, faith, and transformation.",
    placeholder: "Missions Exploits cover",
  },
];

const booksAndReports = [
  {
    title: "Logo Exploration Manual",
    tag: "Training Manual",
    desc: "A training manual aimed at exposing medical and dental students, as well as doctors and dentists, to the essential tools for caring for the whole man. It provides a foundation for understanding the vision of CMDA Nigeria and highlights the core precepts and philosophies for effective practice of the vision.",
    placeholder: "Logo Exploration Manual cover",
  },
  {
    title: "CMDA Annual Report",
    tag: "Annual",
    desc: "A comprehensive overview of the Association's activities, achievements, impact, and progress throughout the year. It highlights key programmes and initiatives across various arms and ministries, including membership engagement, missions, leadership development, student activities, conferences, and outreach programmes. The report also provides an account of the Association's financial stewardship.",
    placeholder: "Annual Report cover",
  },
  {
    title: "Multiply",
    tag: "Book",
    desc: "An 86-page book by Prof. Chima Onoka offering a fresh and thought-provoking perspective on Christian medical mission. It explores the place of personal, God-given vision within CMDA, the relevance of individual calling, the challenge of mission fatigue, and the broader meaning of mission beyond traditional rural outreaches. Reviewed by Dr. Peter Saunders, Dr. Mike Chupp, Dr. Zumnan Gimba, Dr. Chuka Anude, Sen. (Dr.) Ipalibo Banigo, and Prof. Chris Isichei.",
    placeholder: "Multiply book cover",
  },
];

export function PublicationsList() {
  return (
    <Section id="publications" className="paper">
      <SectionHead
        eyebrow="Magazines & journals"
        title="Voices of the fellowship"
        intro="Regular publications keeping CMDA Nigeria's doctors and students informed, encouraged, and equipped."
      />

      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {magazines.map((item) => (
          <Reveal key={item.title}>
            <div className="card-editorial flex h-full flex-col">
              <ImagePlaceholder label={item.placeholder} />
              <div className="flex flex-1 flex-col p-6">
                <span className="eyebrow text-gold">{item.tag}</span>
                <h3 className="mt-3 font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function BooksAndReports() {
  return (
    <Section id="books-reports" className="bg-muted">
      <SectionHead
        eyebrow="Books & reports"
        title="Resources for the journey"
        intro="Training materials, annual reports, and inspiring reads for every CMDA member."
      />

      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {booksAndReports.map((item) => (
          <Reveal key={item.title}>
            <div className="card-editorial flex h-full flex-col">
              <ImagePlaceholder label={item.placeholder} />
              <div className="flex flex-1 flex-col p-6">
                <span className="eyebrow text-gold">{item.tag}</span>
                <h3 className="mt-3 font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
