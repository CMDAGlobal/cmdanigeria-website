import { createServerFn } from "@tanstack/react-start";
import { getClient } from "./client";
import { fallbackRegionList, getFallbackRegion } from "./fallback";
import { regionListQuery, regionQuery } from "./queries";
import type { RegionDetail, RegionListEntry } from "./types";

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