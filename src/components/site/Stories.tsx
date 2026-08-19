import { useState } from "react";
import { Reveal, Section, SectionHead } from "./primitives";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────
 * Categories & data
 * ────────────────────────────────────────────── */

const categories = [
  "Documentaries",
  "Mission Stories",
  "Chapter Stories",
  "Student Stories",
  "Patient Stories",
  "Doctor Stories",
] as const;

type Category = (typeof categories)[number];

type Story = {
  title: string;
  location?: string;
  body: string;
};

const missionStories: Story[] = [
  {
    title: "A Legacy of Transformation: How CMDA has Impacted ABUTH",
    location: "ABUTH",
    body: `In the heart of Ahmadu Bello University Teaching Hospital (ABUTH), the Christian Medical and Dental Association (CMDA) has been more than just an association — it has been a family, a guiding light, and a force for excellence. Over the years, its impact has echoed through the lives of students and doctors, shaping them into not just skilled clinicians but also compassionate healers and unwavering disciples of Christ.

CMDA's influence extends beyond personal testimonies. It has fostered a culture of academic excellence, ethical leadership, medical missions, and service to humanity.

Academic Excellence and Mentorship: Peer-led tutorials, group discussions and mentorship programmes have helped many members excel in exams.

Medical Missions & Outreach: Missions outreaches including distribution of free clothes and sanitary items to young girls, and bringing the gospel to the underserved, are among many medical outreaches embarked on as a chapter.

Prayer & Bible Study: Chapter prayer meetings and Bible study sessions have continuously strengthened faith and resilience in the demanding sphere of medical school.

There are countless others whose lives have been transformed. As this movement grows, it continues to raise a generation of doctors who are not just excellent in skill, but also in character and faith. CMDA is more than an association; it is a legacy of faith, excellence and service — one life at a time.`,
  },
  {
    title: "The After-Conference Experience",
    location: "UBTH",
    body: `The 6th Joint Conference had concluded, and we had all been thoroughly blessed. We departed Bingham University with a deep sense that our lives had been impacted and would never remain the same. What we did not know was how quickly we would begin to impact the lives of others.

On our journey back home, we encountered a traffic jam. A trailer had overturned and blocked the road. We had been praying before we reached this point and continued to do so. Some passers-by took videos of us as we prayed, saying, "Na now you remember Jesus," seemingly mocking our faith. Nevertheless, we pressed on, and by the grace of God, the bus successfully passed through.

While we waited by the roadside for one of our fellow buses, an instruction came that we should go into a nearby village and preach the Gospel. We went into the village and spent about 30 minutes sharing the Gospel. When the buses caught up, one refused to start. Those of us who had returned from the mini-evangelism outreach joined hands and prayed over the bus. Within five minutes, the bus started. The villagers witnessed the entire event — a powerful demonstration of God's faithfulness.

The journey back was truly an experience of the power of God. People were healed, some were baptized in the Holy Spirit with evidence of speaking in tongues. There were clear words of prophecy and wisdom shared among us. Truly, the impact of a conference does not end when the conference concludes. Sometimes, the real impact begins on the journey home.`,
  },
  {
    title: "To the End of the Earth",
    location: "UCTH",
    body: `Rural missions can be challenging. You leave the comfort of your home and your comfortable bed, making your temporary home in classrooms and sleeping on floors. Yet, the beauty of missions lies in how quickly lives can be transformed through the knowledge of Christ.

In our last outreach, we visited the Oban community — a beautiful community surrounded by high hills and picturesque villages. The outreach lasted for three days, from 7th to 9th November 2024. During the course of the outreach, we ministered to children, young people, and older adults.

The power of God was manifest. People were baptized in the Holy Spirit and manifested the gifts of the Spirit. We prayed for the sick, and they were healed. We laid hands on the blind, and they received their sight. We were witnesses to God's power and privileged to be His agents of impact. What especially made our hearts leap with joy was witnessing people come to Christ — people who had lost hope and faith, who were hungering and thirsting, finding the Bread of Life and the Fountain of Living Waters.

Rural medical missions are a reminder that we are instruments of impact and an opportunity for us to encounter Christ afresh.`,
  },
  {
    title: "Impacted to Impact",
    location: "ABSUTH",
    body: `After attending numerous conferences and having beautiful encounters and experiences, we were excited to attend the 6th Joint Conference once again. What made this conference particularly intriguing was its theme — IMPACT. This was the conference everyone had been anticipating. Everyone was ready to be transformed.

We arrived late on the first day. Rather than dwelling on our regret for missing the opening moments, our hearts remained open to the session we walked into. It was a night we would never forget. The words of the speaker, Engr. Femi Reins, ignited something within us — more than just a spark, it was an inferno. That night, we knew the journey, every mile of it, had been worth it.

Many more sessions opened the eyes of our understanding. Countless testimonies of impact stirred our hearts and ignited an even greater passion within us. We left the conference knowing that God was counting on us — a privilege, yet also a profound responsibility.

On our way back, we reminisced about the various sessions. We returned to school determined to seize every opportunity to make an impact. Indeed, it was a conference we would never forget.`,
  },
  {
    title: "Impact Beyond the Conference",
    location: "OAUTHC",
    body: `The 6th JNC experience was truly a beautiful, enlightening, and edifying one for OAUTHC. It was a supernatural encounter that began even before the JNC itself. We prayed for financial resources, and miraculously, funds began to pour in, ensuring that everyone who attended was provided for.

Throughout the meetings, we were tremendously blessed — from one impactful session to another, through inspiring testimonies and insightful academic talks. We were stirred to deepen our devotion, reminded of our assignment to reach the world with the Gospel, and encouraged to glorify God even in our academics. We were fed by the Word and even physically, and we must say that, on both accounts, we ate well.

As we bid farewell to Bingham University, we expected a smooth journey home. However, our bus was involved in an accident — it tumbled twice. Yet, miraculously, not a single person was injured. Not even a scratch. Even after our bus was rendered unusable, God made provision for our safe return.

The JNC not only impacted us, but the events before and after the conference reminded us that the God we serve remains faithful and is still a miracle-working God.`,
  },
  {
    title: "COOUTH Impact Story",
    location: "COOUTH",
    body: `Every CMDA conference is impactful. If we were to pause and enumerate the countless impacts inspired by these conferences, we would simply get tired of writing. I clearly remember the EZPMC Conference. It was so impactful that the testimonies remained on the lips of those who attended long after the conference ended.

From the expository sessions, our thoughts were reshaped, and we gained a deeper understanding that medicine is beyond just a profession. We were enlightened on how a doctor can be "a pastor in the hospital." This profoundly impacted the way we viewed the purpose of studying medicine. Members understood why they needed to be proficient, deepening their hunger for excellence.

The praise and worship sessions were a blast. They moved members whom we had thought were always glued to their seats to get up and dance like David danced. Spirit-filled music is truly powerful!

Co-hosting the conference also developed our skills in proper programme planning and execution. The experience exposed us to the realities of planning and significantly strengthened skills which have continued to be useful to the chapter. It deepened our faith and taught us to depend on God for strength.`,
  },
  {
    title: "Our Impact Story",
    location: "UPTH",
    body: `In March 2024, the CMDA Students' Arm, UPTH Chapter, embarked on a mission trip to Emerikpoko Community in Abua-Odua Local Government Area of Rivers State.

The inhabitants warmly welcomed us. Our activities included house-to-house evangelism, evening crusades, medical outreach, gift distribution, and community service.

The medical outreach was anchored by our Doctors' Arm. Free consultations were provided, vital signs were checked, medications were administered, dental procedures were carried out at no cost, and welfare materials were distributed. The children were taught from the Scriptures and engaged in interactive sessions. We held a Bible study session with ministers in the community. The youths were engaged in skill-acquisition training, while adults were enlightened on personal hygiene and practical ways to prevent malaria.

In addition, the chapter drilled a borehole for the Emerikpoko community, as the inhabitants previously had no access to a reliable source of clean water. This brought immense joy to the community.

After our departure, we received testimonies of restored peace and joy. The people continue to reach out to us, and we have not stopped giving thanks to God. It was a truly impactful mission, reminding us that when we serve with compassion, we can bring hope, healing, and lasting change.`,
  },
];

const studentStories: Story[] = [
  {
    title: "Bro. S.",
    location: "ABUTH",
    body: `CMDA has played a significant role in shaping different aspects of my life, most notably my spiritual and academic growth. When I started medical school, I was a loner who believed that studying hard was all I needed to succeed. This mindset carried me through my first year, but by my second year, I found it impossible to cope alone. In my frustration, I realized I needed a support system — a family.

Fortunately, I discovered the CMDA family within my class. I attended my first CMDA fellowship in my second year, and that decision changed my life. Through CMDA, I gained more than just friends — I found brothers and sisters. With the guidance and encouragement from senior colleagues, and the strength gained from CMDA's exam prayers, I was able to excel in my second-year exams. I only wish I had joined CMDA from the very first day I stepped into medical school.`,
  },
  {
    title: "Sis. I.",
    location: "ABUTH",
    body: `I was once shy, timid, and always avoided the spotlight. I preferred to stay in the background, convinced that leadership and public speaking were for others, not for me. But CMDA became the catalyst for my transformation. Through the leadership opportunities it provided, I discovered the hidden treasures God had placed within me — abilities I never knew I had.

With each responsibility, I grew in confidence, learning to lead, inspire, and serve with boldness. What I once feared became an avenue for growth, and the platform I had avoided for so long became the stage where God refined me.`,
  },
  {
    title: "Bro. K.",
    location: "ABUTH",
    body: `CMDA Missions changed my perspective on medicine. Reaching out to people in need taught me that being a Christian medic is not just about treating diseases but caring for the whole person — spirit, soul and body. Medicine, under the umbrella of CMDA, is more than a profession; it is a calling to serve humanity with excellence and compassion.`,
  },
  {
    title: "Months After the 6th JNC",
    location: "EBSUTH",
    body: `It was just like a regular Sunday — quiet, with nothing particularly spectacular about it. The only difference was that we had paediatric evangelism scheduled for the day. I was tired and had already made up my mind not to go. But there was no way I could deny the nudge I felt to go.

We reached the wards and shared God's Word at every single bed. We distributed balloons to the children, played with them, spoke to their mothers, and encouraged their hearts. When we reached the last bed, we found a five-month-old baby. As we left, I kept feeling a nudge to go back up. The mother was there. We spoke with her and discovered that she had no money to continue her child's treatment and was on the verge of losing her son and perhaps her faith.

We prayed with her and encouraged her heart. We contributed an amount that was enough to cover her treatment and other related expenses. She couldn't believe it. All she could say was, "Thank you." Together, we helped save a boy's life.

I realized that this was truly what impact looked like: sharing, serving, and shining God's light into the lives of those in darkness, while making a lasting difference.`,
  },
  {
    title: "Tutorial Brought Me Into CMDA",
    location: "EBSUTH",
    body: `In 2014, we were offered admission to study Medicine and Surgery. I already had it all planned out — how I was going to be the happening guy on campus. For a fresher, it was normal to come to school early and fight for a seat. Among the many fellowships that came to woo us, one particular group stood out. They called themselves CMDA. They spoke with so much passion about caring for the whole man — spirit, soul, and body.

One cool evening, I saw some freshers gathered for a tutorial and decided to step in. The tutor fired a question at me. I had just crammed what she asked, so I poured forth the answer. Everyone turned and looked at me. The next day, I learned the tutorial would be held at the CMDA Secretariat. That was how I discovered the tutorial was organized by CMDA.

I found my way to their Secretariat and encountered what turned out to be my class election. I became the Class Financial Secretary. From that day, there was no looking back. I went on to serve in 11 different offices and participated in not less than 18 conferences.

Today, I can boast of being a believer, courtesy of this vision. Through the several clouds of witnesses, CMDA showed me love, cared for me, and taught me discipline and competence. Now, I am a doctor, ready to practice this vision.`,
  },
];

const doctorStories: Story[] = [
  {
    title: "CMDA Is the Potter's House",
    location: "Dr. Abimbola Aboluwarin",
    body: `I joined CMDA–Students when I was in 100L in the university. It was a haven that God used to build me up in my personal relationship with Him. I already had an idea of how medicine is a powerful tool to bring men closer to God, but the vision became personified for me in CMDA through the avenues provided for us to be built — conferences, village outreaches, hospital evangelism, and other mission outreaches.

The Institute of Medical Missions is also one of the most impactful programmes I have attended. I met many people in CMDA and built lasting friendships and relationships. Indeed the household of CMDA is the potter's house where God moulds medical professionals into whom they should be in His purpose.`,
  },
  {
    title: "I Found My Place in Ministry",
    location: "Dr. Pfongkazah Daniel Didamson",
    body: `My involvement in the Institute of Medical Missions and medical outreaches as a student stimulated in me, by the Holy Spirit, the desire to help the needy. While I was still in school, God gave me a ministry called Christ Helping Hands Forum. My wife Dr Gloria and I have developed the ministry with the help of the Holy Spirit to function in areas like sponsoring students in school, paying hospital bills of indigent patients, organizing musical concerts and film shows, and conducting medical outreaches — just the way it's done in CMDA.

I am grateful to God for using us to bring souls to His kingdom while we care for the whole man — spirit, soul, and body.`,
  },
  {
    title: "A Training Ground",
    location: "Dr. Adebisi Adeoti",
    body: `CMDA has been an all-round training ground for me. It exposed me to a culture of excellence, honour, and respect for alumni, and senior and junior colleagues alike. I remember vividly the signed & sealed invitation letter to my very first conference, delivered by the then coordinator himself.

CMDA taught me to strike a balance between my academics and spiritual life. I enjoyed the strong support system of senior colleagues, tutoring and mentoring me at every instance of exams. I got a platform to hone my skills, build confidence, outgrow my self-perceived language barrier, and go all out to reach people for Christ during our village outreaches.

Finally, CMDA, being a family, has blessed me with life-long friends who have become brothers and sisters.`,
  },
  {
    title: "Transforming Experiences",
    location: "Dr. Taiwo Akinsanmi",
    body: `CMDA greatly impacted my life in many ways while I was in medical school, and one of them is that I got to meet someone whose life challenged me. I wasn't born again as in 2008 when I met Bro. Alayande Joel (now a doctor). His way of life so much encouraged me that, shortly after meeting him, I had to give my life to Christ. It was Bro. Joel's life that first preached Christ to me.

Another turning point in my life, brought about by CMDA, was the May 2013 Prayer and Missions Conference. My life was distinctively touched, and that encounter has played a pivotal role in my journey with God.

Indeed, CMDA is a place where destinies are being moulded, and men are being raised to do the work of God and live for God in this crooked and perverse generation.`,
  },
  {
    title: "The Pottery Experience: Imbibing an Art of Compassion",
    location: "Anonymous",
    body: `My journey with CMDA began during my housemanship at Nnamdi Azikiwe University Teaching Hospital (NAUTH). I was reprimanded by a senior registrar for not preparing patients for surgery; this made me realize the importance of being proactive.

As I settled into a routine of ward rounds and seminars, I heard about CMDA for the first time. My unit consultant, Dr. Ugwu, instructed me to write a letter to the CMDA secretary regarding a patient's case. I was curious about the organization and learned that it was a body of doctors dedicated to caring for the whole person — spirit, soul, and body.

I was impressed by Dr. Ugwu's compassion, work ethic, and sincerity, which inspired me to join CMDA. Through him, I saw Christianity in a new light and realized that patient care was not just about intellectual heroism but also about empathy and kindness. The CMDA members' response to my patient's case, including visits and support, left a lasting impression on me.`,
  },
  {
    title: "My IfEHL Testimony",
    location: "Dr. Gift Amlabu",
    body: `IfEHL helped re-align my focus in life. During and after IfEHL, God put an unusual desire to seize every opportunity to carry out Heaven's expectations of me. After IfEHL, I began to think and do more with my life and I'm working daily to do all God will have me do on earth. Indeed, I feel a lot more useful on earth. I can't thank God enough for my IfEHL experience.`,
  },
  {
    title: "Testimonies & Personal Decisions",
    location: "Dr. Abdulraman T. Fofie — IfEHL 2019",
    body: `Two days before coming to IfEHL, the Lord had instructed my heart through Esther 4:1-end. I had a need for my eyes to be opened to see how God sees. It was clear to my heart that it was a prerequisite for launching into what His desire for my life.

In IfEHL, I got clarity about God's purpose for my life. I thought I had understood what the vision of CMDA was all about until IfEHL proved me wrong. In IfEHL, practical examples were set before my eyes, of elders who have tested and proven God's faithfulness. Nothing is indeed impossible.

Personal Decisions:
• I am arising with a personal resolve to know God's perspective about a matter before taking any action.
• I have resolved never to please or impress any man. I have only one that I must please — God.
• I have resolved not to pursue money but God's heart.
• I decided to deliberately seek and mentor others.
• I'm not in competition with anybody.

Vision: Grassroots medicine, research and financing. Development of cancer research centres.`,
  },
  {
    title: "From Training to Transformation",
    location: "Dr. Kings Jason Chukwudebelu",
    body: `"Train up a child in the way he should go, and when he is old…" We know the rest of the verse. As a child (young medical student), I had lots of myths, truths, expectations, and disappointments all mixed up in my mind. Lots of adjustments had to be made; I didn't like classrooms, long lectures, and corporate dress codes. Just like the golden words, CMDA seemed to be waiting for infants like us at Newborn (Year One).

Coming from a Christian background, it was easy to love an association that had colleagues who were Christ-centered people. However, I soon realized CMDA was more than church services. Which one is "Rural Outreach"? Which one is "As a representative of Christ, you shouldn't be missing classes; you should dress well."

CMDA IMSUTH was very big on conduct. I thought they were too much until I went to conferences and listened to some campus heroes of the past. What was inspiring these men and women? I started adopting those values, and soon they started making impressions. From conduct to revelations — they were not rules; they were values borne from a deep sense of identity and responsibility.

In my practice today as a doctor, Rural Outreach of those days trained a selfless person who can mingle with people — the educated, non-formally educated, rich, and lower financial class. I learned how to survive anywhere. If you slept inside a bus during outreaches because of souls, you can abound and abase.

CMDA also taught me discipline. How can it be said that the class music coordinator was disqualified for an exam because of 75% attendance? Such discipline affected my work ethic — completing ward rounds, documentation, paying attention to details.

Oh yes, I won't forget how I saw people stand up for no malpractice, even when their colleagues ridiculed them. It made me bolder to defend what the Scriptures stand for. In CMDA, God has lots of remnants. This is my story!

Four years later, I am now a member of CMDA Nigeria, striving to embody the organization's values of character, compassion, and competence. Although medical practice in Nigeria comes with challenges, the fellowship among CMDA members encourages me to persevere. I am grateful for CMDA's impact on my life, bringing me to a consciousness of stewardship for Jesus in the healthcare space.`,
  },
];

const emptyCategories: Category[] = ["Documentaries", "Chapter Stories", "Patient Stories"];

/* ──────────────────────────────────────────────
 * Story card
 * ────────────────────────────────────────────── */

function StoryCard({ story }: { story: Story }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = story.body.length > 500;
  const displayText = isLong && !expanded ? story.body.slice(0, 500) + "…" : story.body;

  return (
    <Reveal>
      <div className="card-editorial-dark flex h-full flex-col p-8">
        <div className="flex items-center gap-3">
          <span className="eyebrow text-gold">{story.location ?? "CMDA"}</span>
        </div>
        <h3 className="mt-4 font-display text-xl leading-snug font-bold">{story.title}</h3>
        <div className="mt-4 flex-1 space-y-4 text-sm leading-relaxed text-primary-foreground/70">
          {displayText.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        {isLong && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-4 text-left text-sm font-semibold text-gold transition-colors hover:text-gold/80"
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : "Read the full story"}
          </button>
        )}
      </div>
    </Reveal>
  );
}

/* ──────────────────────────────────────────────
 * Empty state
 * ────────────────────────────────────────────── */

function EmptyState({ category }: { category: string }) {
  return (
    <Reveal>
      <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-primary-foreground/15 bg-primary-foreground/5 py-20 text-center">
        <p className="font-display text-lg font-bold text-primary-foreground/50">
          {category} coming soon
        </p>
        <p className="mt-2 text-sm text-primary-foreground/35">
          We're gathering stories. Check back soon.
        </p>
      </div>
    </Reveal>
  );
}

/* ──────────────────────────────────────────────
 * Main exported component
 * ────────────────────────────────────────────── */

const storyData: Record<Category, Story[]> = {
  Documentaries: [],
  "Mission Stories": missionStories,
  "Chapter Stories": [],
  "Student Stories": studentStories,
  "Patient Stories": [],
  "Doctor Stories": doctorStories,
};

export function ImpactStories() {
  const [active, setActive] = useState<Category>("Mission Stories");
  const stories = storyData[active];
  const isEmpty = emptyCategories.includes(active);

  return (
    <Section id="impact-stories" className="bg-primary-deep text-primary-foreground">
      <SectionHead
        tone="dark"
        eyebrow="Stories of impact"
        title="Behind every number is a name"
        intro="Mission, student, doctor and patient stories from across the federation and the global network."
      />

      {/* Category tabs */}
      <div className="mt-12 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              "px-4 py-2 text-sm font-semibold transition-all duration-300",
              active === cat
                ? "bg-gold text-gold-foreground"
                : "border border-primary-foreground/20 text-primary-foreground/60 hover:border-gold/50 hover:text-primary-foreground",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stories grid */}
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isEmpty ? (
          <div className="md:col-span-2 lg:col-span-3">
            <EmptyState category={active} />
          </div>
        ) : (
          stories.map((story) => (
            <StoryCard key={story.title} story={story} />
          ))
        )}
      </div>
    </Section>
  );
}
