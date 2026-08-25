import { GraduationCap, HandHeart, Megaphone, Sparkles, Users, Compass } from "lucide-react";
import { Reveal, Section, SectionHead } from "./primitives";

const reasons = [
  {
    icon: Users,
    title: "Shared Values",
    desc: "CMDA Nigeria is made up of healthcare professionals who share a commitment to the teachings of Jesus Christ and the values of the Christian faith. By joining, you connect with like-minded colleagues and find a supportive community.",
  },
  {
    icon: GraduationCap,
    title: "Professional Development",
    desc: "We offer continuing medical education, professional development and networking — helping members stay abreast of current research, updates and procedures while connecting with stakeholders across healthcare.",
  },
  {
    icon: HandHeart,
    title: "Service Opportunities",
    desc: "Members serve their communities through medical missions, outreaches and volunteer projects — bringing a sense of purpose and fulfilment beyond the routine of medical practice.",
  },
  {
    icon: Sparkles,
    title: "Spiritual Support",
    desc: "Healthcare professionals often face fatigue and burnout. We provide prayer groups, counselling, mentorship and support groups so members can integrate their faith into practice and cope with its challenges.",
  },
  {
    icon: Megaphone,
    title: "Advocacy",
    desc: "As a body of Christian professionals, we advocate for policies that protect the sanctity of human life, promote access to healthcare for all, and let practitioners work in accordance with their conscience.",
  },
  {
    icon: Compass,
    title: "Leadership & Mentorship",
    desc: "We comprehensively equip students and doctors to become leaders who mobilise, build and influence their communities for Christ — and transform the health sector through every phase of life and career.",
  },
];

export function ReasonsToJoin() {
  return (
    <Section id="reasons-to-join" className="relative overflow-hidden paper">
      {/* Background image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.06]"
        style={{ backgroundImage: "url(/bg-5.webp)" }}
      />
      <SectionHead
        eyebrow="Why join"
        title="6 reasons to join CMDA Nigeria"
        intro="God made man — spirit, soul and body — and He has called us Christians in the medical and dental disciplines to be proficient in caring for the whole man (1 Thess. 5:23b). CMDA Nigeria seeks to establish a Christian witness through medical and dental doctors and students in every community in Nigeria and beyond."
      />

      <ol className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((item, i) => (
          <Reveal key={item.title} delay={(i % 3) * 90}>
            <li className="card-editorial flex h-full flex-col p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-11 items-center justify-center border border-border text-primary">
                  <item.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="numeral">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-8 font-display text-lg font-bold">{item.title}</h3>
              <span className="mt-4 block h-px w-10 bg-gold" aria-hidden="true" />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
