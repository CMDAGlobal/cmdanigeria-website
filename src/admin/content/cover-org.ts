import { getOrgOptions } from "./org";
import type { CoverOrg } from "./cover";

/** Loads the organisation-unit index used by the write-coverage checks. */
export async function loadCoverOrg(): Promise<CoverOrg> {
  const org = await getOrgOptions();
  return {
    chapterArms: new Map(org.chapters.map((entry) => [entry.slug, entry.arm])),
    zoneArms: new Map(org.zones.map((entry) => [entry.slug, entry.arm])),
    regionSlugs: new Set(org.regions.map((entry) => entry.slug)),
  };
}
