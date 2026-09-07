import type { PortableTextBlock } from "@portabletext/types";
import type {
  AnnouncementRecord,
  ArmOverview,
  ChapterDetail,
  EventRecord,
  RegionDetail,
  RegionListEntry,
  StatEntry,
  ZoneDetail,
  ZoneRecord,
} from "./types";

function pt(...paragraphs: string[]): PortableTextBlock[] {
  return paragraphs.map((text) => ({
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", text, marks: [] }],
  }));
}

type FallbackRegion = Omit<RegionDetail, "_id" | "slug"> & {
  _id: string;
  slug: string;
};

const regions: FallbackRegion[] = [
  {
    _id: "fallback-americas",
    slug: "americas-caribbean",
    name: "The Americas / Caribbean",
    eyebrow: "Global Network — The Americas / Caribbean",
    tagline: "Nigerian Christian healthcare professionals in the Americas",
    intro:
      "From New York to Toronto to the Caribbean — a thriving network of CMDA alumni serving, mentoring and giving back.",
    countries: ["United States", "Canada"],
    stats: [
      { value: "2+", label: "Countries & territories" },
      { value: "30+", label: "Regional members" },
      { value: "6+", label: "Cities with gatherings" },
      { value: "1", label: "Annual in-person retreat" },
    ],
    overview: pt(
      "The Americas and Caribbean region connects Nigerian-trained doctors, dentists and healthcare professionals practising in the United States and Canada with the CMDA Nigeria fellowship. Members engage in regular gatherings, mentorship programmes and mission partnerships that keep them connected to home.",
      "The region holds an annual in-person retreat that brings together members from across the continent for worship, fellowship, strategic planning and reconnection with the Nigerian mission.",
    ),
    activities: [
      {
        _id: "a1",
        title: "Alumni Networks",
        type: "meeting",
        description: pt(
          "Active alumni chapters across the United States and Canada hosting regular fellowship gatherings, mentorship circles and professional networking events.",
        ),
      },
      {
        _id: "a2",
        title: "Mission Partnerships",
        type: "mission",
        description: pt(
          "Regional members partner with CMDA Nigeria for medical missions, funding support and logistics for outreach programmes back home.",
        ),
      },
      {
        _id: "a3",
        title: "Prayer & Support",
        type: "other",
        description: pt(
          "Dedicated prayer networks interceding for the fellowship in Nigeria and mobilising support for students, missions and emergency response.",
        ),
      },
      {
        _id: "a4",
        title: "Professional Connections",
        type: "training",
        description: pt(
          "Opportunities for clinical electives, research collaborations and professional exchange between US/Canadian institutions and Nigeria.",
        ),
      },
    ],
    events: [
      {
        _id: "e1",
        title: "The Americas In-Person Retreat",
        type: "retreat",
        startDate: null,
        endDate: null,
        venue: "United States",
        location: "United States",
        mode: "inperson",
      },
      {
        _id: "e2",
        title: "Americas Prayer Call",
        type: "prayer",
        startDate: null,
        endDate: null,
        venue: "Online",
        location: "Online",
        mode: "virtual",
      },
    ],
    newsletters: [
      {
        title: "Global Network Digest",
        description:
          "Quarterly newsletter connecting CMDA alumni worldwide with updates on missions, member achievements and upcoming events.",
      },
      {
        title: "CMDA Annual Report",
        description:
          "Comprehensive overview of the Association's activities including global network contributions and impact.",
      },
    ],
  },
  {
    _id: "fallback-ukeurope",
    slug: "uk-europe",
    name: "UK / Europe",
    eyebrow: "Global Network — UK / Europe",
    tagline: "Nigerian Christian healthcare professionals in the UK & Europe",
    intro:
      "From London to Berlin — a fellowship of CMDA alumni serving across the NHS and European healthcare systems.",
    countries: ["United Kingdom", "Germany"],
    stats: [
      { value: "10+", label: "Countries across Europe" },
      { value: "20+", label: "Regional members" },
      { value: "6+", label: "UK cities with members" },
      { value: "NHS", label: "Where many members serve" },
    ],
    overview: pt(
      "The UK/Europe region connects Nigerian-trained doctors, dentists and healthcare professionals practising in the United Kingdom and across the European continent with the CMDA Nigeria fellowship.",
      "Many members serve within the NHS and European hospitals, and the region maintains strong ties to the home fellowship through prayer networks, mentoring and regular gatherings.",
    ),
    activities: [
      {
        _id: "a1",
        title: "NHS Fellowship",
        type: "meeting",
        description: pt(
          "A vibrant community of CMDA members engaged in NHS practice, hosting regular fellowships, mentoring circles and professional networking across UK cities.",
        ),
      },
      {
        _id: "a2",
        title: "Mission Support",
        type: "mission",
        description: pt(
          "European-based alumni contribute to resource exchange, funding and logistics supporting CMDA Nigeria's missions and student initiatives.",
        ),
      },
      {
        _id: "a3",
        title: "Prayer & Support",
        type: "other",
        description: pt(
          "Prayer networks across the UK and Europe interceding for the fellowship in Nigeria and mobilising support for missions and emergency response.",
        ),
      },
      {
        _id: "a4",
        title: "Research & Exchange",
        type: "training",
        description: pt(
          "Opportunities for research collaborations, clinical electives and professional exchanges between European institutions and Nigeria.",
        ),
      },
    ],
    events: [
      {
        _id: "e1",
        title: "UK CMDA Fellowship Gathering",
        type: "fellowship",
        startDate: null,
        endDate: null,
        venue: "London, UK",
        location: "London, UK",
        mode: "inperson",
      },
      {
        _id: "e2",
        title: "UK Prayer & Devotional Call",
        type: "prayer",
        startDate: null,
        endDate: null,
        venue: "Online",
        location: "Online",
        mode: "virtual",
      },
    ],
    newsletters: [
      {
        title: "Global Network Digest",
        description:
          "Quarterly newsletter connecting CMDA alumni worldwide with updates on missions, member achievements and upcoming events.",
      },
      {
        title: "The Prescription",
        description:
          "Monthly devotional resource connecting Scripture to healthcare practice — available to all CMDA members globally.",
      },
    ],
  },
  {
    _id: "fallback-middleeast",
    slug: "middle-east",
    name: "Middle East",
    eyebrow: "Global Network — Middle East",
    tagline: "Nigerian Christian healthcare professionals in the Gulf",
    intro:
      "From Dubai to Riyadh — a growing fellowship of CMDA alumni serving, supporting and giving back from the Middle East.",
    countries: ["UAE", "Saudi Arabia"],
    stats: [
      { value: "6+", label: "Gulf countries" },
      { value: "15+", label: "Regional members" },
      { value: "5+", label: "Cities represented" },
      { value: "100%", label: "Connected to home mission" },
    ],
    overview: pt(
      "The Middle East region connects Nigerian-trained healthcare professionals practising across the Gulf states with the CMDA Nigeria fellowship.",
      "Despite the distance from home, members maintain strong community ties, regular fellowship and active participation in the mission through giving, prayer and mentoring programmes that reach back into Nigeria.",
    ),
    activities: [
      {
        _id: "a1",
        title: "Gulf Fellowship",
        type: "meeting",
        description: pt(
          "Nigerian Christian healthcare professionals in the Gulf maintain regular fellowship, mutual support and professional networking across UAE, Saudi Arabia and beyond.",
        ),
      },
      {
        _id: "a2",
        title: "Diaspora Giving",
        type: "project",
        description: pt(
          "Members in the Middle East contribute to mission initiatives, parent projects and student scholarships through the Impact Fund.",
        ),
      },
      {
        _id: "a3",
        title: "Prayer & Support",
        type: "other",
        description: pt(
          "Prayer networks in the Gulf interceding for the fellowship in Nigeria and mobilising support for missions and emergency response.",
        ),
      },
      {
        _id: "a4",
        title: "Mission Initiatives",
        type: "mission",
        description: pt(
          "Supporting and financing medical missions, outreach programmes and community health projects back home in Nigeria.",
        ),
      },
    ],
    events: [
      {
        _id: "e1",
        title: "Gulf Prayer & Fellowship Call",
        type: "fellowship",
        startDate: null,
        endDate: null,
        venue: "Online",
        location: "Online",
        mode: "virtual",
      },
    ],
    newsletters: [
      {
        title: "Global Network Digest",
        description:
          "Quarterly newsletter connecting CMDA alumni worldwide with updates on missions, member achievements and upcoming events.",
      },
      {
        title: "CMDA Annual Report",
        description:
          "Comprehensive overview of the Association's activities including global network contributions and impact.",
      },
    ],
  },
  {
    _id: "fallback-australasia",
    slug: "australasia",
    name: "Australasia",
    eyebrow: "Global Network — Australasia",
    tagline: "Nigerian Christian healthcare professionals in Australia & New Zealand",
    intro:
      "From Sydney to Auckland — a growing fellowship of CMDA alumni connecting through digital fellowship and periodic gatherings.",
    countries: ["Australia", "New Zealand"],
    stats: [
      { value: "2", label: "Countries (Australia & NZ)" },
      { value: "5+", label: "Regional members" },
      { value: "4+", label: "Cities represented" },
      { value: "Growing", label: "Rapidly expanding network" },
    ],
    overview: pt(
      "The Australasia region connects Nigerian-trained healthcare professionals practising in Australia and New Zealand with the CMDA Nigeria fellowship.",
      "Though one of the newest regions, it is expanding rapidly as more Nigerian healthcare professionals settle in the region — carrying the values of faith, excellence and compassion in their new home while staying connected to the mission in Nigeria.",
    ),
    activities: [
      {
        _id: "a1",
        title: "Fellowship Gatherings",
        type: "meeting",
        description: pt(
          "Growing network of CMDA alumni in Australia and New Zealand connected through periodic in-person gatherings and online fellowship.",
        ),
      },
      {
        _id: "a2",
        title: "Mission Support",
        type: "mission",
        description: pt(
          "Australasian members contribute to CMDA Nigeria's missions, student scholarships and community health initiatives back home.",
        ),
      },
      {
        _id: "a3",
        title: "Prayer & Support",
        type: "other",
        description: pt(
          "Prayer networks in Australasia interceding for the fellowship in Nigeria and mobilising support for missions and emergency response.",
        ),
      },
      {
        _id: "a4",
        title: "Professional Exchange",
        type: "training",
        description: pt(
          "Opportunities for clinical electives, research collaborations and professional exchanges between Australian institutions and Nigeria.",
        ),
      },
    ],
    events: [
      {
        _id: "e1",
        title: "Australasia Fellowship Gathering",
        type: "fellowship",
        startDate: null,
        endDate: null,
        venue: "Sydney / Melbourne",
        location: "Sydney / Melbourne",
        mode: "inperson",
      },
    ],
    newsletters: [
      {
        title: "Global Network Digest",
        description:
          "Quarterly newsletter connecting CMDA alumni worldwide with updates on missions, member achievements and upcoming events.",
      },
      {
        title: "The Prescription",
        description:
          "Monthly devotional resource connecting Scripture to healthcare practice — available to all CMDA members globally.",
      },
    ],
  },
  {
    _id: "fallback-africa",
    slug: "africa",
    name: "Africa",
    eyebrow: "Global Network — Africa",
    tagline: "Nigerian Christian healthcare professionals across Africa",
    intro:
      "From Accra to Nairobi to Johannesburg — CMDA alumni serving, teaching and ministering across the continent.",
    countries: ["Nigeria", "Ghana"],
    stats: [
      { value: "10+", label: "African countries" },
      { value: "15+", label: "Regional members" },
      { value: "5+", label: "Mission partnerships" },
      { value: "1", label: "Shared continental vision" },
    ],
    overview: pt(
      "The Africa region connects Nigerian-trained healthcare professionals serving beyond Nigeria to their fellow Christians across the continent.",
      "Beyond the borders of Nigeria, CMDA alumni serve in hospitals, universities, public health programmes and rural mission stations — carrying the values of whole-person care and Christian witness throughout Africa and sharing resources with sister CMDA chapters across the region.",
    ),
    activities: [
      {
        _id: "a1",
        title: "Pan-African Fellowship",
        type: "meeting",
        description: pt(
          "Nigerian CMDA alumni serving in hospitals, universities, public health programmes and mission stations across the African continent.",
        ),
      },
      {
        _id: "a2",
        title: "Regional Collaboration",
        type: "project",
        description: pt(
          "Partnerships with other national CMDA chapters across Africa for joint training, missions coordination and resource sharing.",
        ),
      },
      {
        _id: "a3",
        title: "Prayer & Support",
        type: "other",
        description: pt(
          "Prayer networks across the continent interceding for the fellowship in Nigeria and the wider region.",
        ),
      },
      {
        _id: "a4",
        title: "African Missions",
        type: "mission",
        description: pt(
          "Cross-border mission teams and community health projects reaching underserved communities across Africa.",
        ),
      },
    ],
    events: [
      {
        _id: "e1",
        title: "Africa Region Fellowship Gathering",
        type: "fellowship",
        startDate: null,
        endDate: null,
        venue: "TBA",
        location: "TBA",
        mode: "inperson",
      },
      {
        _id: "e2",
        title: "Africa Prayer & Devotional Call",
        type: "prayer",
        startDate: null,
        endDate: null,
        venue: "Online",
        location: "Online",
        mode: "virtual",
      },
    ],
    newsletters: [
      {
        title: "Global Network Digest",
        description:
          "Quarterly newsletter connecting CMDA alumni worldwide with updates on missions, member achievements and upcoming events.",
      },
      {
        title: "CMDA Annual Report",
        description:
          "Comprehensive overview of the Association's activities including global network contributions and impact.",
      },
    ],
  },
];

export function fallbackRegionList(): RegionListEntry[] {
  return regions.map(({ _id, name, slug, eyebrow, tagline, intro, countries, stats, events }) => {
    const entry: Record<string, unknown> = {
      _id,
      name,
      slug: { current: slug },
      chapterCount: 0,
      eventCount: events?.length ?? 0,
    };
    const optional = { eyebrow, tagline, intro, countries, stats };
    for (const [key, value] of Object.entries(optional)) {
      if (value !== undefined) entry[key] = value;
    }
    return entry as unknown as RegionListEntry;
  });
}

export function getFallbackRegion(slug: string): RegionDetail | undefined {
  const region = regions.find((r) => r.slug === slug);
  if (!region) return undefined;
  const { slug: s, ...rest } = region;
  return { ...rest, slug: { current: s } };
}

interface FallbackChapter {
  slug: string;
  name: string;
  institution: string;
}

interface FallbackZone {
  _id: string;
  slug: string;
  name: string;
  eyebrow: string;
  tagline: string;
  intro: string;
  stats: StatEntry[];
  chapters: FallbackChapter[];
}

function chapter(name: string, institution: string): FallbackChapter {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return { slug, name, institution };
}

const studentZones: FallbackZone[] = [
  {
    _id: "fallback-zone-east",
    slug: "eastern",
    name: "Eastern Zone",
    eyebrow: "Students' Arm — Eastern Zone",
    tagline: "The Eastern Zone",
    intro:
      "The Eastern Zone unites student chapters across eastern Nigeria's teaching hospitals and universities, fostering fellowship, mentorship and medical missions.",
    stats: [
      { value: "13", label: "Student chapters" },
      { value: "9,700+", label: "Student members" },
      { value: "10+", label: "Universities represented" },
      { value: "1", label: "Annual zonal conference" },
    ],
    chapters: [
      chapter("AEFUTH", "Alex Ekwueme Federal University Teaching Hospital"),
      chapter("COOUTH", "Chukwuemeka Odumegwu Ojukwu University Teaching Hospital"),
      chapter("EBSUTH", "Ebonyi State University Teaching Hospital"),
      chapter("ESUTH", "Enugu State University Teaching Hospital"),
      chapter("GUTH", "Gregory University Teaching Hospital"),
      chapter("IMSUTH", "Imo State University Teaching Hospital"),
      chapter("NDUTH", "Niger Delta University Teaching Hospital"),
      chapter("NAUTH", "Nnamdi Azikiwe University Teaching Hospital"),
      chapter("UNTH", "University of Nigeria Teaching Hospital"),
      chapter("UCTH", "University of Calabar Teaching Hospital"),
      chapter("UUTH", "University of Uyo Teaching Hospital"),
      chapter("UPTH", "University of Port Harcourt Teaching Hospital"),
      chapter("RSUTH", "Rivers State University Teaching Hospital"),
    ],
  },
  {
    _id: "fallback-zone-west",
    slug: "western",
    name: "Western Zone",
    eyebrow: "Students' Arm — Western Zone",
    tagline: "The Western Zone",
    intro:
      "The Western Zone covers student chapters across western Nigeria, from Lagos and Ibadan to Benin and Ilorin, with vibrant fellowship and outreach networks.",
    stats: [
      { value: "16", label: "Student chapters" },
      { value: "9,700+", label: "Student members" },
      { value: "12+", label: "Universities represented" },
      { value: "1", label: "Annual zonal conference" },
    ],
    chapters: [
      chapter("ABUADTH", "Afe Babalola University Teaching Hospital"),
      chapter("AAU/ISTH", "Ambrose Alli University / Irrua Specialist Teaching Hospital"),
      chapter("BUTH", "Bowen University Teaching Hospital"),
      chapter("DELSUTH", "Delta State University Teaching Hospital"),
      chapter("EKSUTH", "Ekiti State University Teaching Hospital"),
      chapter("IUTH", "Igbinedion University Teaching Hospital"),
      chapter("UNIMEDTH", "University of Medical Sciences Teaching Hospital"),
      chapter("LASUTH", "Lagos State University Teaching Hospital"),
      chapter("LUTH", "Lagos University Teaching Hospital"),
      chapter("LTH", "Lautech Teaching Hospital"),
      chapter("OAUTH", "Obafemi Awolowo University Teaching Hospital"),
      chapter("OOUTH", "Olabisi Onabanjo University Teaching Hospital"),
      chapter("UNIOSUNTH", "Osun State University Teaching Hospital"),
      chapter("UCH", "University College Hospital, Ibadan"),
      chapter("UBTH", "University of Benin Teaching Hospital"),
      chapter("UITH", "University of Ilorin Teaching Hospital"),
    ],
  },
  {
    _id: "fallback-zone-north",
    slug: "northern",
    name: "Northern Zone",
    eyebrow: "Students' Arm — Northern Zone",
    tagline: "The Northern Zone",
    intro:
      "The Northern Zone connects student chapters across northern Nigeria, from Abuja and Jos to Kano and Maiduguri, serving communities through health and hope.",
    stats: [
      { value: "11", label: "Student chapters" },
      { value: "9,700+", label: "Student members" },
      { value: "9+", label: "Universities represented" },
      { value: "1", label: "Annual zonal conference" },
    ],
    chapters: [
      chapter("ABUTH", "Ahmadu Bello University Teaching Hospital"),
      chapter("ATBUTH", "Abubakar Tafawa Balewa University Teaching Hospital"),
      chapter("AKTH", "Aminu Kano University Teaching Hospital"),
      chapter("BDTH-KASU", "Barau-Dikko University Teaching Hospital"),
      chapter("BHUTH", "Bingham University Teaching Hospital"),
      chapter("BSUTH", "Benue State University Teaching Hospital"),
      chapter("GSUTH", "Gombe State University Teaching Hospital"),
      chapter("JUTH", "Jos University Teaching Hospital"),
      chapter("UATH", "University of Abuja Teaching Hospital"),
      chapter("UDUTH", "Usmanu Danfodiyo University Teaching Hospital"),
      chapter("UMTH", "University of Maiduguri Teaching Hospital"),
    ],
  },
];

const studentEvents: EventRecord[] = [
  {
    _id: "fallback-event-stu-1",
    title: "National Conference — Students",
    slug: { current: "national-conference-students" },
    type: "conference",
    arm: "students",
    startDate: "2026-08-20T09:00:00.000Z",
    endDate: "2026-08-23T18:00:00.000Z",
    location: "Benin City, Edo State",
    mode: "inperson",
    description: pt(
      "The flagship gathering of CMDA Nigeria's student movement — worship, training, fellowship and strategic planning with student leaders from across Nigeria.",
    ),
  },
  {
    _id: "fallback-event-stu-2",
    title: "Zonal Prayer & Missions Conference",
    slug: { current: "zonal-prayer-missions-conference" },
    type: "conference",
    arm: "students",
    startDate: "2027-01-15T09:00:00.000Z",
    location: "Various Zones",
    mode: "inperson",
    description: pt(
      "Each zone comes together for prayer, missions mobilisation and community health outreach.",
    ),
  },
  {
    _id: "fallback-event-stu-3",
    title: "EXCEL National Training Week",
    slug: { current: "excel-national-training-week" },
    type: "training",
    arm: "students",
    startDate: "2027-05-10T09:00:00.000Z",
    mode: "hybrid",
    description: pt(
      "Equipping student leaders in evangelism, character, excellence, academics and leadership.",
    ),
  },
];

export function fallbackStudentsArm(): ArmOverview {
  return {
    nec: [],
    zones: studentZones.map((zone) => {
      const entry: Record<string, unknown> = {
        _id: zone._id,
        name: zone.name,
        slug: { current: zone.slug },
        eyebrow: zone.eyebrow,
        tagline: zone.tagline,
        intro: zone.intro,
        stats: zone.stats,
        chapterCount: zone.chapters.length,
        sampleChapters: zone.chapters.map((item) => ({
          _id: `fallback-${item.slug}`,
          name: item.name,
          slug: { current: item.slug },
          institution: item.institution,
          country: "Nigeria",
          arm: "students",
        })),
      };
      return entry as unknown as ZoneRecord;
    }),
    events: studentEvents,
    announcements: [],
  };
}

export function getFallbackChapter(slug: string): ChapterDetail | undefined {
  for (const zone of studentZones) {
    const found = zone.chapters.find((item) => item.slug === slug);
    if (!found) continue;
    return {
      _id: `fallback-${found.slug}`,
      name: found.name,
      slug: { current: found.slug },
      institution: found.institution,
      country: "Nigeria",
      arm: "students",
      zone: { _id: zone._id, name: zone.name, slug: { current: zone.slug } },
      description: pt(
        `Welcome to the ${found.name} chapter of CMDA Nigeria's Students' Arm, hosted at ${found.institution}. The chapter gathers students for weekly fellowship, Bible studies, prayer, community health outreach and academic support.`,
      ),
      membership: [],
      exco: [],
      events: [],
      gallery: [],
    };
  }
  return undefined;
}

export function getFallbackZone(slug: string): ZoneDetail | undefined {
  const zone = studentZones.find((item) => item.slug === slug);
  if (!zone) return undefined;
  const { chapters, ...rest } = zone;
  return {
    ...rest,
    slug: { current: zone.slug },
    overview: pt(zone.intro),
    leaders: [],
    gallery: [],
    chapters: chapters.map((item) => ({
      _id: `fallback-${item.slug}`,
      name: item.name,
      slug: { current: item.slug },
      institution: item.institution,
      country: "Nigeria",
      arm: "students",
    })),
  } as ZoneDetail;
}