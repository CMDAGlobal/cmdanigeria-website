import { createServerFn } from "@tanstack/react-start";
import { getClient } from "./client";
import {
  fallbackDoctorsArm,
  fallbackLeadership,
  fallbackRegionList,
  fallbackStudentsArm,
  getFallbackChapter,
  getFallbackRegion,
  getFallbackZone,
} from "./fallback";
import {
  armAnnouncementsQuery,
  armEventsQuery,
  chapterCountsQuery,
  chapterQuery,
  eventListQuery,
  leadershipQuery,
  necQuery,
  pageBySlugQuery,
  pageCountersQuery,
  postDetailQuery,
  postListQuery,
  prescriptionDetailQuery,
  prescriptionListQuery,
  regionListQuery,
  regionQuery,
  zoneQuery,
  zonesQuery,
} from "./queries";
import type {
  AnnouncementRecord,
  Arm,
  ArmOverview,
  ChapterCounts,
  ChapterDetail,
  EventRecord,
  LeaderRecord,
  LeadershipTeams,
  PageCounters,
  PageDocument,
  PostDetail,
  PostRecord,
  PrescriptionDetail,
  PrescriptionRecord,
  RegionDetail,
  RegionListEntry,
  ZoneDetail,
  ZoneRecord,
} from "./types";

export const fetchRegions = createServerFn({ method: "GET", strict: false }).handler(
  async (): Promise<RegionListEntry[]> => {
    const client = getClient();
    if (!client) return fallbackRegionList();
    try {
      const regions = await client.fetch<RegionListEntry[] | null>(regionListQuery);
      return regions ?? [];
    } catch (error) {
      console.error("[sanity] fetchRegions failed", error);
      return fallbackRegionList();
    }
  },
);

export const fetchRegion = createServerFn({ method: "GET", strict: false })
  .validator((slug: string) => slug)
  .handler(async ({ data }): Promise<RegionDetail | null> => {
    const client = getClient();
    if (!client) return getFallbackRegion(data) ?? null;
    try {
      const region = await client.fetch<RegionDetail | null>(regionQuery, { slug: data });
      if (!region) return getFallbackRegion(data) ?? null;
      return region;
    } catch (error) {
      console.error("[sanity] fetchRegion failed", error);
      return getFallbackRegion(data) ?? null;
    }
  });

export const fetchArmOverview = createServerFn({ method: "GET", strict: false })
  .validator((arm: Arm) => arm)
  .handler(async ({ data }): Promise<ArmOverview> => {
    const client = getClient();
    if (!client) return data === "students" ? fallbackStudentsArm() : fallbackDoctorsArm();
    try {
      const [nec, zones, events, announcements] = await Promise.all([
        client.fetch<LeaderRecord[] | null>(necQuery, { arm: data }),
        client.fetch<ZoneRecord[] | null>(zonesQuery, { arm: data }),
        client.fetch<EventRecord[] | null>(armEventsQuery, { arm: data }),
        client.fetch<AnnouncementRecord[] | null>(armAnnouncementsQuery, { arm: data }),
      ]);
      return {
        nec: nec ?? [],
        zones: (zones ?? []).filter((zone) => (zone.chapterCount ?? 0) > 0),
        events: events ?? [],
        announcements: announcements ?? [],
      };
    } catch (error) {
      console.error(`[sanity] fetchArmOverview failed for ${data}`, error);
      return { zones: [], nec: [], events: [], announcements: [] };
    }
  });

export const fetchArmStats = createServerFn({ method: "GET", strict: false })
  .validator((arm: Arm) => arm)
  .handler(async ({ data }): Promise<PageCounters[Arm]> => {
    const client = getClient();
    if (!client) return {};
    try {
      const counters = await client.fetch<PageCounters>(pageCountersQuery);
      return counters?.[data] ?? {};
    } catch (error) {
      console.error(`[sanity] fetchArmStats failed for ${data}`, error);
      return {};
    }
  });

export const fetchChapter = createServerFn({ method: "GET", strict: false })
  .validator((slug: string) => slug)
  .handler(async ({ data }): Promise<ChapterDetail | null> => {
    const client = getClient();
    if (!client) return getFallbackChapter(data) ?? null;
    try {
      const chapter = await client.fetch<ChapterDetail | null>(chapterQuery, { slug: data });
      if (!chapter) return getFallbackChapter(data) ?? null;
      return chapter;
    } catch (error) {
      console.error("[sanity] fetchChapter failed", error);
      return getFallbackChapter(data) ?? null;
    }
  });

export const fetchZone = createServerFn({ method: "GET", strict: false })
  .validator((slug: string) => slug)
  .handler(async ({ data }): Promise<ZoneDetail | null> => {
    const client = getClient();
    if (!client) return getFallbackZone(data) ?? null;
    try {
      const zone = await client.fetch<ZoneDetail | null>(zoneQuery, { slug: data });
      if (!zone) return getFallbackZone(data) ?? null;
      return zone;
    } catch (error) {
      console.error("[sanity] fetchZone failed", error);
      return getFallbackZone(data) ?? null;
    }
  });

export const fetchLeadership = createServerFn({ method: "GET", strict: false }).handler(
  async (): Promise<LeadershipTeams> => {
    const client = getClient();
    if (!client) return fallbackLeadership();
    try {
      const teams = await client.fetch<LeadershipTeams | null>(leadershipQuery);
      return teams ?? fallbackLeadership();
    } catch (error) {
      console.error("[sanity] fetchLeadership failed", error);
      return fallbackLeadership();
    }
  },
);

export const fetchPosts = createServerFn({ method: "GET", strict: false }).handler(
  async (): Promise<PostRecord[]> => {
    const client = getClient();
    if (!client) return [];
    try {
      const posts = await client.fetch<PostRecord[] | null>(postListQuery);
      return posts ?? [];
    } catch (error) {
      console.error("[sanity] fetchPosts failed", error);
      return [];
    }
  },
);

export const fetchPost = createServerFn({ method: "GET", strict: false })
  .validator((slug: string) => slug)
  .handler(async ({ data }): Promise<PostDetail | null> => {
    const client = getClient();
    if (!client) return null;
    try {
      return (await client.fetch<PostDetail | null>(postDetailQuery, { slug: data })) ?? null;
    } catch (error) {
      console.error("[sanity] fetchPost failed", error);
      return null;
    }
  });

export const fetchPrescriptions = createServerFn({ method: "GET", strict: false }).handler(
  async (): Promise<PrescriptionRecord[]> => {
    const client = getClient();
    if (!client) return [];
    try {
      const issues = await client.fetch<PrescriptionRecord[] | null>(prescriptionListQuery);
      return issues ?? [];
    } catch (error) {
      console.error("[sanity] fetchPrescriptions failed", error);
      return [];
    }
  },
);

export const fetchPrescription = createServerFn({ method: "GET", strict: false })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<PrescriptionDetail | null> => {
    const client = getClient();
    if (!client || !slug) return null;
    try {
      return await client.fetch<PrescriptionDetail | null>(prescriptionDetailQuery, { slug });
    } catch (error) {
      console.error("[sanity] fetchPrescription failed", error);
      return null;
    }
  });

export const fetchPageBySlug = createServerFn({ method: "GET", strict: false })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<PageDocument | null> => {
    const client = getClient();
    if (!client || !slug) return null;
    try {
      return await client.fetch<PageDocument | null>(pageBySlugQuery, { slug });
    } catch (error) {
      console.error("[sanity] fetchPageBySlug failed", error);
      return null;
    }
  });

export const fetchPageCounters = createServerFn({ method: "GET", strict: false }).handler(
  async (): Promise<PageCounters> => {
    const client = getClient();
    if (!client) return { students: {}, doctors: {}, global: {} };
    try {
      return (
        (await client.fetch<PageCounters>(pageCountersQuery)) ?? {
          students: {},
          doctors: {},
          global: {},
        }
      );
    } catch (error) {
      console.error("[sanity] fetchPageCounters failed", error);
      return { students: {}, doctors: {}, global: {} };
    }
  },
);

export const fetchEvents = createServerFn({ method: "GET", strict: false }).handler(
  async (): Promise<EventRecord[]> => {
    const client = getClient();
    if (!client) return [];
    try {
      const events = await client.fetch<EventRecord[] | null>(eventListQuery);
      return events ?? [];
    } catch (error) {
      console.error("[sanity] fetchEvents failed", error);
      return [];
    }
  },
);

export const fetchChapterCounts = createServerFn({ method: "GET", strict: false }).handler(
  async (): Promise<ChapterCounts | null> => {
    const client = getClient();
    if (!client) return null;
    try {
      const counts = await client.fetch<ChapterCounts | null>(chapterCountsQuery);
      if (!counts || typeof counts.students !== "number" || typeof counts.doctors !== "number") {
        return null;
      }
      return counts;
    } catch (error) {
      console.error("[sanity] fetchChapterCounts failed", error);
      return null;
    }
  },
);
