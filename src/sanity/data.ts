import { createServerFn } from "@tanstack/react-start";
import { getClient } from "./client";
import {
  fallbackRegionList,
  fallbackStudentsArm,
  getFallbackChapter,
  getFallbackRegion,
} from "./fallback";
import {
  armAnnouncementsQuery,
  armEventsQuery,
  chapterQuery,
  necQuery,
  regionListQuery,
  regionQuery,
  zonesQuery,
} from "./queries";
import type {
  AnnouncementRecord,
  Arm,
  ArmOverview,
  ChapterDetail,
  EventRecord,
  LeaderRecord,
  RegionDetail,
  RegionListEntry,
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
    if (!client) return data === "students" ? fallbackStudentsArm() : { zones: [], nec: [], events: [], announcements: [] };
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