import type { PortableTextBlock } from "@portabletext/types";

export type Arm = "global" | "students" | "doctors";

export interface SanityImage {
  asset?: { url?: string | null; _id?: string | null } | null;
  alt?: string | null;
  caption?: string | null;
}

export interface StatEntry {
  value?: string | null;
  label?: string | null;
}

export interface NewsletterEntry {
  title?: string | null;
  description?: string | null;
  url?: string | null;
}

export interface LeaderRecord {
  _id: string;
  name: string;
  slug?: { current?: string | null } | null;
  position?: string | null;
  chapterRole?: string | null;
  institution?: string | null;
  chapter?: string | null;
  country?: string | null;
  bio?: string | null;
  headshot?: SanityImage | null;
  order?: number | null;
}

export interface ZoneRef {
  _id?: string | null;
  name?: string | null;
  slug?: { current?: string | null } | null;
}

export interface ChapterRecord {
  _id: string;
  name: string;
  slug?: { current?: string | null } | null;
  institution?: string | null;
  location?: string | null;
  country?: string | null;
  arm?: Arm | null;
  establishedAt?: string | null;
  logo?: SanityImage | null;
  zone?: ZoneRef | null;
  order?: number | null;
}

export interface ChapterDetail extends ChapterRecord {
  description?: PortableTextBlock[] | null;
  membership?: StatEntry[] | null;
  exco?: LeaderRecord[] | null;
  events?: EventRecord[] | null;
  gallery?: SanityImage[] | null;
}

export interface ZoneRecord {
  _id: string;
  name: string;
  slug: { current?: string | null } | null;
  arm?: Arm | null;
  eyebrow?: string | null;
  tagline?: string | null;
  intro?: string | null;
  countries?: string[] | null;
  stats?: StatEntry[] | null;
  chapterCount?: number;
  sampleChapters?: ChapterRecord[] | null;
}

export interface ZoneDetail extends ZoneRecord {
  overview?: PortableTextBlock[] | null;
  chapters?: ChapterRecord[] | null;
  leaders?: LeaderRecord[] | null;
  gallery?: SanityImage[] | null;
}

export interface ArmOverview {
  nec?: LeaderRecord[] | null;
  zones?: ZoneRecord[] | null;
  events?: EventRecord[] | null;
  announcements?: AnnouncementRecord[] | null;
}

export interface LeadershipTeams {
  boardOfTrustees?: LeaderRecord[] | null;
  governingBoard?: LeaderRecord[] | null;
  managementTeam?: LeaderRecord[] | null;
  studentNec?: LeaderRecord[] | null;
}

export interface EventRecord {
  _id: string;
  title: string;
  slug?: { current?: string | null } | null;
  type?: string | null;
  arm?: Arm | null;
  startDate?: string | null;
  endDate?: string | null;
  venue?: string | null;
  location?: string | null;
  mode?: string | null;
  registrationUrl?: string | null;
  report?: string | null;
  description?: PortableTextBlock[] | null;
}

export interface ActivityRecord {
  _id: string;
  title: string;
  slug?: { current?: string | null } | null;
  type?: string | null;
  arm?: Arm | null;
  date?: string | null;
  outcome?: string | null;
  description?: PortableTextBlock[] | null;
}

export interface AnnouncementRecord {
  _id: string;
  title: string;
  slug?: { current?: string | null } | null;
  category?: string | null;
  publishedAt?: string | null;
  pinned?: boolean | null;
  link?: string | null;
  body?: PortableTextBlock[] | null;
}

export interface PostRecord {
  _id: string;
  title: string;
  slug?: string | null;
  kind?: string | null;
  arm?: Arm | null;
  category?: string | null;
  tags?: string[] | null;
  publishedAt?: string | null;
  featured?: boolean | null;
  excerpt?: string | null;
  link?: string | null;
  hasBody?: boolean | null;
  cover?: SanityImage | null;
  author?: { name?: string | null } | null;
}

export interface PostDetail extends PostRecord {
  body?: PortableTextBlock[] | null;
}

export interface PrescriptionRecord {
  _id: string;
  title: string;
  slug?: string | null;
  kind?: string | null;
  arm?: Arm | null;
  issueNumber?: number | null;
  issueDate?: string | null;
  author?: string | null;
  summary?: string | null;
  url?: string | null;
  downloadUrl?: string | null;
  hasBody?: boolean | null;
  cover?: SanityImage | null;
}

export interface PrescriptionDetail extends PrescriptionRecord {
  body?: PortableTextBlock[] | null;
}

export type PageSectionType =
  | "heroSection"
  | "richTextSection"
  | "imageTextSection"
  | "statsSection"
  | "gallerySection"
  | "videoSection"
  | "ctaSection";

/** One reorderable, individually hideable block of a page. */
export interface PageSection {
  _key: string;
  _type: PageSectionType;
  visible?: boolean | null;
  internalName?: string | null;
  eyebrow?: string | null;
  heading?: string | null;
  body?: PortableTextBlock[] | null;
  width?: boolean | null;
  backgroundImage?: SanityImage | null;
  image?: SanityImage | null;
  imageSide?: "left" | "right" | null;
  imageAlt?: string | null;
  imageCaption?: string | null;
  autoFill?: boolean | null;
  items?: StatEntry[] | null;
  images?: SanityImage[] | null;
  provider?: "youtube" | "vimeo" | null;
  videoId?: string | null;
  poster?: SanityImage | null;
  caption?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  tone?: "primary" | "muted" | null;
}

export interface PageDocument {
  _id: string;
  title?: string | null;
  slug?: string | null;
  arm?: Arm | null;
  summary?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  coverImage?: SanityImage | null;
  body?: PortableTextBlock[] | null;
  sections?: PageSection[] | null;
}

export interface ArmCounters {
  chapters?: number | null;
  zones?: number | null;
  regions?: number | null;
  people?: number | null;
}

/** Live document counts, used to fill `autoFill` statistics sections. */
export type PageCounters = Record<"students" | "doctors" | "global", ArmCounters>;

export interface RegionListEntry {
  _id: string;
  name: string;
  slug: { current?: string | null } | null;
  eyebrow?: string | null;
  tagline?: string | null;
  intro?: string | null;
  countries?: string[] | null;
  stats?: StatEntry[] | null;
  chapterCount?: number;
  eventCount?: number;
}

export interface RegionDetail extends RegionListEntry {
  heroImage?: SanityImage | null;
  mission?: string | null;
  focus?: string[] | null;
  overview?: PortableTextBlock[] | null;
  leaders?: LeaderRecord[] | null;
  chapters?: ChapterRecord[] | null;
  events?: EventRecord[] | null;
  activities?: ActivityRecord[] | null;
  announcements?: AnnouncementRecord[] | null;
  newsletters?: NewsletterEntry[] | null;
  gallery?: SanityImage[] | null;
}

export interface ChapterCounts {
  students: number;
  doctors: number;
}
