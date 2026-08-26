import { Reveal, Section, SectionHead } from "./primitives";

const mediaResources = [
  {
    title: "Starting Strong 1 & 2",
    desc: "Foundation resources equipping new members and fresh graduates with the spiritual, professional and personal anchors they need to thrive from day one.",
  },
  {
    title: "Spotlight",
    desc: "A regular feature highlighting individuals, chapters and projects making an impact across CMDA Nigeria — celebrating faith in action.",
  },
  {
    title: "Monthly Webinars",
    desc: "Online learning sessions covering clinical topics, leadership, missions and faith integration, open to all CMDA members and guests.",
  },
  {
    title: "The Prescription",
    desc: "A devotional and reflection resource connecting Scripture to the daily realities of healthcare practice, offered to members for spiritual nourishment.",
  },
  {
    title: "CMDA Podcast",
    desc: "Conversations, testimonies and teaching from CMDA Nigeria leaders, alumni and guests — available on popular podcast platforms.",
  },
];

export function MediaResources() {
  return (
    <Section id="media-resources" className="bg-muted">
      <SectionHead
        eyebrow="Media & resources"
        title="Tools for growth, learning and spiritual nourishment"
      />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mediaResources.map((item, i) => (
          <Reveal key={item.title} delay={(i % 3) * 90}>
            <div className="border border-border bg-background p-6 transition-shadow hover:shadow-card h-full">
              <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
