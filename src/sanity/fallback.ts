import type { PortableTextBlock } from "@portabletext/types";
import type {
  AnnouncementRecord,
  Arm,
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
  arm: "students" | "doctors";
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
    arm: "students",
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
    arm: "students",
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
    arm: "students",
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

const doctorZones: FallbackZone[] = [
  {
    _id: "fallback-zone-ss",
    slug: "south-south",
    name: "South-South Zone",
    arm: "doctors",
    eyebrow: "Doctors' Arm — South-South Zone",
    tagline: "The South-South Zone",
    intro:
      "The South-South zone connects doctor chapters across the Niger Delta and southern coast, from Benin City and Port Harcourt to Calabar and Uyo.",
    stats: [
      { value: "7", label: "Doctor chapters" },
      { value: "400+", label: "Active members" },
      { value: "8+", label: "States represented" },
      { value: "1", label: "Annual zonal retreat" },
    ],
    chapters: [
      chapter("CMDA Benin City", "University of Benin Teaching Hospital"),
      chapter("CMDA Port Harcourt", "University of Port Harcourt Teaching Hospital"),
      chapter("CMDA Calabar", "University of Calabar Teaching Hospital"),
      chapter("CMDA Warri", "Central Hospital, Warri"),
      chapter("CMDA Uyo", "University of Uyo Teaching Hospital"),
      chapter("CMDA Yenagoa", "Federal Medical Centre, Yenagoa"),
      chapter("CMDA Asaba", "Federal Medical Centre, Asaba"),
    ],
  },
  {
    _id: "fallback-zone-sw",
    slug: "south-west",
    name: "South-West Zone",
    arm: "doctors",
    eyebrow: "Doctors' Arm — South-West Zone",
    tagline: "The South-West Zone",
    intro:
      "The South-West zone is the largest, spanning Lagos, Ibadan, Abeokuta and Akure with vibrant doctor chapters and an annual zonal conference.",
    stats: [
      { value: "10", label: "Doctor chapters" },
      { value: "1,200+", label: "Active members" },
      { value: "6+", label: "States represented" },
      { value: "1", label: "Annual zonal conference" },
    ],
    chapters: [
      chapter("CMDA Lagos", "Lagos University Teaching Hospital"),
      chapter("CMDA Ikeja", "Lagos State University Teaching Hospital"),
      chapter("CMDA Ibadan", "University College Hospital, Ibadan"),
      chapter("CMDA Abeokuta", "Federal Medical Centre, Abeokuta"),
      chapter("CMDA Akure", "University of Medical Sciences Teaching Hospital"),
      chapter("CMDA Ile-Ife", "Obafemi Awolowo University Teaching Hospital"),
      chapter("CMDA Osogbo", "Ladoke Akintola University of Technology Teaching Hospital"),
      chapter("CMDA Ogbomoso", "Baptist Medical Centre, Ogbomoso"),
      chapter("CMDA Ado-Ekiti", "Ekiti State University Teaching Hospital"),
      chapter("CMDA Ijebu-Ode", "Olabisi Onabanjo University Teaching Hospital"),
    ],
  },
  {
    _id: "fallback-zone-se",
    slug: "south-east",
    name: "South-East Zone",
    arm: "doctors",
    eyebrow: "Doctors' Arm — South-East Zone",
    tagline: "The South-East Zone",
    intro:
      "The South-East zone unites doctor chapters across Enugu, Onitsha, Awka, Owerri and the wider Igbo heartland.",
    stats: [
      { value: "6", label: "Doctor chapters" },
      { value: "500+", label: "Active members" },
      { value: "5+", label: "States represented" },
      { value: "1", label: "Annual zonal conference" },
    ],
    chapters: [
      chapter("CMDA Enugu", "University of Nigeria Teaching Hospital"),
      chapter("CMDA Onitsha", "Nnamdi Azikiwe University Teaching Hospital"),
      chapter("CMDA Aba", "Living Word Mission Hospital, Aba"),
      chapter("CMDA Awka", "Chukwuemeka Odumegwu Ojukwu University Teaching Hospital"),
      chapter("CMDA Owerri", "Imo State University Teaching Hospital"),
      chapter("CMDA Abakaliki", "Ebonyi State University Teaching Hospital"),
    ],
  },
  {
    _id: "fallback-zone-nc",
    slug: "north-central",
    name: "North-Central Zone",
    arm: "doctors",
    eyebrow: "Doctors' Arm — North-Central Zone",
    tagline: "The North-Central Zone",
    intro:
      "The North-Central zone ties together doctor chapters from Jos and Abuja to Ilorin and Makurdi, including the Federal Capital Territory.",
    stats: [
      { value: "8", label: "Doctor chapters" },
      { value: "600+", label: "Active members" },
      { value: "8", label: "States & FCT represented" },
      { value: "1", label: "Annual zonal conference" },
    ],
    chapters: [
      chapter("CMDA Jos", "Jos University Teaching Hospital"),
      chapter("CMDA Abuja", "University of Abuja Teaching Hospital"),
      chapter("CMDA Ilorin", "University of Ilorin Teaching Hospital"),
      chapter("CMDA Makurdi", "Benue State University Teaching Hospital"),
      chapter("CMDA Lokoja", "Federal Medical Centre, Lokoja"),
      chapter("CMDA Minna", "Ibrahim Badamasi Babangida Specialist Hospital"),
      chapter("CMDA Lafia", "Federal Medical Centre, Lafia"),
      chapter("CMDA Keffi", "Federal Medical Centre, Keffi"),
    ],
  },
  {
    _id: "fallback-zone-nw",
    slug: "north-west",
    name: "North-West Zone",
    arm: "doctors",
    eyebrow: "Doctors' Arm — North-West Zone",
    tagline: "The North-West Zone",
    intro:
      "The North-West zone covers doctor chapters in Kano, Kaduna, Zaria, Sokoto and the wider north-western region.",
    stats: [
      { value: "6", label: "Doctor chapters" },
      { value: "400+", label: "Active members" },
      { value: "6", label: "States represented" },
      { value: "1", label: "Annual zonal conference" },
    ],
    chapters: [
      chapter("CMDA Kano", "Aminu Kano Teaching Hospital"),
      chapter("CMDA Kaduna", "Barau Dikko Teaching Hospital"),
      chapter("CMDA Zaria", "Ahmadu Bello University Teaching Hospital"),
      chapter("CMDA Sokoto", "Usmanu Danfodiyo University Teaching Hospital"),
      chapter("CMDA Katsina", "Federal Teaching Hospital, Katsina"),
      chapter("CMDA Birnin Kebbi", "Federal Medical Centre, Birnin Kebbi"),
    ],
  },
  {
    _id: "fallback-zone-ne",
    slug: "north-east",
    name: "North-East Zone",
    arm: "doctors",
    eyebrow: "Doctors' Arm — North-East Zone",
    tagline: "The North-East Zone",
    intro:
      "The North-East zone connects doctor chapters in Maiduguri, Yola, Bauchi, Gombe and Potiskum serving communities across the region.",
    stats: [
      { value: "5", label: "Doctor chapters" },
      { value: "250+", label: "Active members" },
      { value: "5", label: "States represented" },
      { value: "1", label: "Annual zonal gathering" },
    ],
    chapters: [
      chapter("CMDA Maiduguri", "University of Maiduguri Teaching Hospital"),
      chapter("CMDA Yola", "Federal Medical Centre, Yola"),
      chapter("CMDA Bauchi", "Abubakar Tafawa Balewa University Teaching Hospital"),
      chapter("CMDA Gombe", "Federal Teaching Hospital, Gombe"),
      chapter("CMDA Potiskum", "Federal Medical Centre, Potiskum"),
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

const doctorEvents: EventRecord[] = [
  {
    _id: "fallback-event-doc-1",
    title: "National Zonal Conference — Doctors",
    slug: { current: "national-zonal-conference-doctors" },
    type: "conference",
    arm: "doctors",
    startDate: "2026-11-20T09:00:00.000Z",
    endDate: "2026-11-22T18:00:00.000Z",
    location: "Nigeria",
    mode: "inperson",
    description: pt(
      "The flagship gathering of the Doctors' Arm — worship, continuing medical education, fellowship and strategic planning with doctor leaders from across Nigeria.",
    ),
  },
  {
    _id: "fallback-event-doc-2",
    title: "Joint Conference (Doctors & Students)",
    slug: { current: "joint-conference-doctors-students" },
    type: "conference",
    arm: "doctors",
    startDate: "2027-03-12T09:00:00.000Z",
    location: "Nigeria",
    mode: "inperson",
    description: pt(
      "A shared gathering bringing together the Doctors' and Students' Arms for worship, mentorship, training and fellowship.",
    ),
  },
  {
    _id: "fallback-event-doc-3",
    title: "The Prescription — Devotional Series",
    slug: { current: "prescription-devotional-series" },
    type: "devotional",
    arm: "doctors",
    startDate: null,
    location: "Online",
    mode: "online",
    description: pt(
      "A monthly devotional series connecting Scripture to the daily realities of healthcare practice.",
    ),
  },
];

export function fallbackStudentsArm(): ArmOverview {
  return overviewFromZones("students", studentZones, studentEvents);
}

export function fallbackDoctorsArm(): ArmOverview {
  return overviewFromZones("doctors", doctorZones, doctorEvents);
}

function overviewFromZones(arm: Arm, zones: FallbackZone[], events: EventRecord[]): ArmOverview {
  return {
    nec: [],
    zones: zones.map((zone) => {
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
          _id: `fallback-${arm}-${item.slug}`,
          name: item.name,
          slug: { current: item.slug },
          institution: item.institution,
          country: "Nigeria",
          arm,
        })),
      };
      return entry as unknown as ZoneRecord;
    }),
    events,
    announcements: [],
  };
}

const allZones = [...studentZones, ...doctorZones];

export function getFallbackChapter(slug: string): ChapterDetail | undefined {
  for (const zone of allZones) {
    const found = zone.chapters.find((item) => item.slug === slug);
    if (!found) continue;
    const armLabel = zone.arm === "students" ? "Students' Arm" : "Doctors' Arm";
    return {
      _id: `fallback-${zone.arm}-${found.slug}`,
      name: found.name,
      slug: { current: found.slug },
      institution: found.institution,
      country: "Nigeria",
      arm: zone.arm,
      zone: { _id: zone._id, name: zone.name, slug: { current: zone.slug } },
      description: pt(
        `Welcome to the ${found.name} chapter of CMDA Nigeria's ${armLabel}, hosted at ${found.institution}. The chapter gathers members for regular fellowship, Bible studies, prayer, community health outreach and professional development.`,
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
  const zone = allZones.find((item) => item.slug === slug);
  if (!zone) return undefined;
  const { chapters, ...rest } = zone;
  return {
    ...rest,
    slug: { current: zone.slug },
    overview: pt(zone.intro),
    leaders: [],
    gallery: [],
    chapters: chapters.map((item) => ({
      _id: `fallback-${zone.arm}-${item.slug}`,
      name: item.name,
      slug: { current: item.slug },
      institution: item.institution,
      country: "Nigeria",
      arm: zone.arm,
    })),
  } as ZoneDetail;
}