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
  order?: number | null;
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