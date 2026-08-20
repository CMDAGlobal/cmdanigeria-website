import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Reveal, Section } from "./primitives";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────
 * Expandable section
 * ────────────────────────────────────────────── */

function Expandable({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className={cn(!open && "max-h-44 overflow-hidden relative")}>
        {children}
        {!open && (
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        )}
      </div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-4 inline-flex items-center gap-2 rounded-none border border-gold/40 px-4 py-2 text-xs font-semibold tracking-wide uppercase text-gold transition-colors hover:bg-gold hover:text-gold-foreground"
        aria-expanded={open}
      >
        {open ? "Show less" : "Read more"}
        <ChevronDown
          className={cn("size-3.5 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────────
 * Editorial era block
 * ────────────────────────────────────────────── */

function EraBlock({
  year,
  title,
  children,
  accent = false,
}: {
  year: string;
  title: string;
  children: ReactNode;
  accent?: boolean;
}) {
  return (
    <Reveal>
      <div
        className={cn(
          "border-t border-border py-12 md:py-16",
          accent && "bg-primary-deep/[0.03]",
        )}
      >
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[10rem_1fr] md:gap-12">
          <div>
            <span className="block font-display text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
              {year}
            </span>
          </div>
          <div className="space-y-5">
            <h3 className="font-display text-xl font-bold tracking-tight text-foreground md:text-2xl">
              {title}
            </h3>
            <div className="space-y-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              {children}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ──────────────────────────────────────────────
 * History timeline — exported component
 * ────────────────────────────────────────────── */

export function HistoryTimeline() {
  return (
    <Section id="history" className="paper">
      <div className="mx-auto max-w-5xl">
        {/* Intro */}
        <Reveal>
          <p className="lede mx-auto max-w-3xl text-center text-muted-foreground">
            From the pioneering work of Christian medical practitioners to a nationwide movement —
            the history of CMDA Nigeria spans more than five decades of faith, sacrifice, and
            service.
          </p>
        </Reveal>

        {/* Era blocks */}
        <EraBlock year="1500s–1900s" title="The historical foundation">
          <p>
            For more than 500 years, the medical profession has provided fertile ground for the
            development of guilds and associations of doctors established to promote professional and
            specialist interests. In Britain, the 16th and 17th centuries witnessed the emergence
            of institutions such as the Royal College of Physicians of London (1551), the Royal
            College of Physicians of Edinburgh (1681), the Royal College of Surgeons of Edinburgh
            (1505), and the Royal College of Surgeons of London (1540).
          </p>
          <Expandable>
            <p>
              Distinctively Christian medical fellowships and associations emerged more prominently
              in the 20th century. These included the Christian Medical Societies (1837–1874), the
              Medical Prayer Union and Movement (1919–1939), and the Christian Medical Fellowship,
              established in 1949.
            </p>
            <p>
              The Christian Medical Fellowship was established with the objectives of uniting
              Christian doctors in their common loyalty to Jesus Christ, encouraging the deepening of
              Christian faith, promoting high standards of Christian and professional conduct,
              strengthening Christian witness within medical schools and hospitals, and supporting
              Christian medical missionaries around the world.
            </p>
          </Expandable>
        </EraBlock>

        <EraBlock
          year="1906–1957"
          title="The beginning of Christian medical fellowship in Nigeria"
          accent
        >
          <p>
            The development of Christian medical fellowship in Nigeria is closely associated with the
            pioneering work of Francis Akanu Ibiam, later known as His Royal Highness Eze Sir Dr.
            Akanu Ibiam. Born in 1906 into a farming family in Unwana, he received his early
            education at Hope Waddell Training Institute in Calabar and King's College, Lagos. He
            later qualified in medicine from the University of St Andrews, Scotland, in 1936.
          </p>
          <Expandable>
            <p>
              Inspired by the Scottish mission work witnessed during his training, Akanu Ibiam
              committed to serving as a medical missionary in Nigeria — a commitment involving
              considerable personal sacrifice, including a relatively low salary, limited facilities
              in rural communities, and inadequate transportation compared with the resources
              available to expatriate colleagues.
            </p>
            <p>
              The first medical appointment was at Itu, followed by the establishment of a new
              hospital in Abiriba, where medical practice continued from 1936 to 1945. In 1939,
              Endora Olayinka Sasegbon joined the work and later became his wife. Akanu Ibiam
              subsequently served as Medical Superintendent at Itu (1945–1952) and at Uburu before
              becoming Principal of Hope Waddell Training Institute. He was later appointed Chairman
              of the Governing Council of University College Ibadan (1958) and Governor of the
              Eastern Region of Nigeria (1960).
            </p>
            <p>
              During his period of medical service, Akanu Ibiam organised fellowship groups among
              healthcare workers. In 1957, the Hospital Christian Fellowship (HCF) was formally
              launched, becoming well established among doctors and nurses, particularly in the
              eastern part of Nigeria.
            </p>
          </Expandable>
        </EraBlock>

        <EraBlock year="1972" title="The birth of the Fellowship of Christian Doctors in Nigeria">
          <p>
            A major milestone occurred from 6–9 April 1972, when the Nigerian Voluntary Agencies
            Medical Services Committee successfully organised a conference at the Institute of
            Church and Society, Samonda, Ibadan. The theme was "Christian Challenge in Medical
            Practice."
          </p>
          <Expandable>
            <p>
              Akanu Ibiam led prominent Christian medical practitioners, including Professor J. B.
              Akingba of LUTH, Dr. D. Mulligan of Wesley Guild Hospital, Ilesa, Sir Dr. Mary Nolan
              of Minna, Dr. Ralph Schram of ABU Zaria, Dr. Dayo Ejiwumi of LUTH, Dr. Sam
              Oloruntoba of Ilorin, Dr. Victor Fatunla of Saki, and Dr. J. I. Durodola of UCH, in
              delivering thought-provoking presentations and participating in discussions on various
              dimensions of Christian medical service.
            </p>
            <p>
              At the conclusion of the opening address, Akanu Ibiam called for the formation of two
              separate bodies: one organisation that would bring together Christian healthcare workers
              generally and another specifically for medical doctors. The first organisation became the
              Christian Health Association of Nigeria (CHAN), while the doctors' organisation was
              named the Fellowship of Christian Doctors in Nigeria (FCDN).
            </p>
            <p>
              On 8 April 1972, the Fellowship of Christian Doctors in Nigeria was established. Akanu
              Ibiam was elected President, Dr. James Durodola of UCH became Secretary, and Dr. S. O.
              Oloruntoba of Ilorin became Treasurer. Other members of the Executive Committee
              included Dr. Joe B. Akingba of LUTH, Dr. C. A. Pearson of Ilesa, and Dr. S. Tor
              Agbidiye, then a clinical student.
            </p>
          </Expandable>
        </EraBlock>

        <EraBlock
          year="1974–1986"
          title="Growth, challenges, and international recognition"
          accent
        >
          <p>
            In keeping with the vision, active groups emerged in several centres, particularly within
            teaching hospitals. In November 1974, Dr. Bode Akintade and Dr. Ralph Schram undertook a
            nationwide fact-finding tour sponsored by the Christian Medical Commission in Geneva. The
            tour had a significant impact on existing groups and encouraged the establishment of new
            ones.
          </p>
          <Expandable>
            <p>
              The early development of FCDN was accompanied by several challenges: frequent changes of
              address among doctors, limited awareness, competing commitments within other Christian
              organisations, demanding professional responsibilities, the absence of successors when
              leaders relocated, and inadequate numbers of Travelling Secretaries.
            </p>
            <p>
              Nigeria began participating in the quadrennial international conferences of the
              International Christian Medical and Dental Association (ICMDA) in 1982, beginning with
              the 7th World Congress in Bangalore, India. At the 8th World Congress in Mexico in 1986,
              where eight Nigerian representatives attended, the Fellowship of Christian Doctors in
              Nigeria was accepted as a full member of ICMDA.
            </p>
          </Expandable>
        </EraBlock>

        <EraBlock year="1981–1985" title="The medical students' fellowship">
          <p>
            The medical students' movement represented another important component of the
            development of Christian medical fellowship in Nigeria. Founded in 1981, the student
            body, known as ICMDA-SS or NCCMDA, experienced significant growth across medical schools
            throughout Nigeria.
          </p>
          <Expandable>
            <p>
              In 1985, the student body produced the first edition of its journal after securing a
              loan of ₦30,000. The journal was launched in Port Harcourt during the annual conference,
              which attracted more than 600 participants from 17 university teaching hospitals. Within
              ten years of its establishment, the NCCMDS had become the largest student body of its
              kind in the world.
            </p>
            <p>
              The growth of the student fellowship highlighted the importance of providing appropriate
              support and mentorship to medical students and establishing a vibrant professional
              fellowship capable of receiving and engaging student members after graduation.
            </p>
          </Expandable>
        </EraBlock>

        <EraBlock
          year="1999–2008"
          title="Leadership eras and institutional development"
          accent
        >
          <p>
            A significant development occurred in April 1999 with the visit of U.S. Emeritus
            Professor Wayne Elfor and Dr. Tim Kelton of CMDS/EMS Canada. The visit included a tour
            of 18 medical schools across Nigeria and agreement to sponsor delegates to the subsequent
            national conference.
          </p>
          <Expandable>
            <p>
              The period from 2004 to 2008 marked another phase under the leadership of Dr. Asemota
              Osemwen, characterised by exemplary leadership, personal sacrifice, and selfless
              service. These qualities contributed significantly to the progress recorded within the
              Association.
            </p>
            <p>
              As fellowship activities expanded, efforts were made to provide a more stable
              administrative structure, including office accommodation at Idominasi in Osun State and
              essential facilities. Securing volunteers became increasingly difficult due to frequent
              professional relocations, migration of doctors overseas, and recurrent strikes within
              Nigerian institutions.
            </p>
          </Expandable>
        </EraBlock>

        <EraBlock year="Today" title="The continuing history of CMDA Nigeria">
          <p>
            The history of CMDA Nigeria is a history of people, events, vision, sacrifice, service,
            and commitment to Christian witness within the medical profession. From the pioneering
            medical missionary service of Akanu Ibiam, through the establishment of the Hospital
            Christian Fellowship, the NVAMSC, and the Fellowship of Christian Doctors in Nigeria in
            1972, the movement has continued to develop through successive generations.
          </p>
          <p>
            The establishment and growth of local fellowship groups, national conferences,
            international partnerships, student ministries, leadership structures, and participation
            in ICMDA contributed to the gradual development of the organisation. The history of CMDA
            Nigeria represents an ongoing story of Christian doctors and students seeking to integrate
            faith, professional excellence, service, leadership, and compassionate healthcare — with
            each generation contributing to the fulfilment of its calling.
          </p>
        </EraBlock>
      </div>
    </Section>
  );
}
