import type { LeaderRecord } from "@/sanity/types";

/**
 * Officer titles for the three tiers of the Students' Executive Committee, in
 * protocol order. Titles are hard-coded (they are structure, not content);
 * names and photos come from the CMS `person` documents.
 */
export const NATIONAL_EXECUTIVE_POSITIONS = [
  "National President (NP)",
  "National General Secretary (NGS)",
  "National Financial Secretary (NFS)",
  "National Academic Secretary (NAS)",
  "National Editor-in-Chief (NEiC)",
  "National Prayer Secretary (NPS)",
  "National Missions Secretary (NMS)",
  "Eastern Zonal Coordinator (EZC)",
  "Northern Zonal Coordinator (NZC)",
  "Western Zonal Coordinator (WZC)",
  "National Ex-Officio",
] as const;

export const CHAPTER_EXECUTIVE_POSITIONS = [
  "School President",
  "School General Secretary",
  "School Financial Secretary",
  "School Academic Secretary",
  "School Missions and Hospital Evangelism Secretary",
  "School Prayer Secretary",
  "School Editor-in-Chief",
  "School Ex officio",
] as const;

export const CLASS_EXECUTIVE_POSITIONS = [
  "Class Coordinator",
  "Class General Secretary",
  "Class Academic Secretary",
  "Class Missions Secretary",
  "Class Prayer Secretary",
  "Class Financial Secretary",
] as const;

export interface ExecutiveSlot {
  position: string;
  leader?: LeaderRecord;
}

/** "National President (NP)" and "national president" compare as the same role. */
function normalizeRole(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Fills each group's positions from one shared pool of leaders.
 *
 * Pass one matches a leader's `position`/`chapterRole` exactly; pass two lets a
 * short role fill a longer title ("President" → "School President") on a word
 * boundary. Every leader is consumed at most once, so the same person cannot
 * appear in two blocks, and anyone matching no position comes back as `extras`
 * rather than being hidden.
 */
export function matchExecutives(
  groups: Array<{ positions: readonly string[] }>,
  leaders?: LeaderRecord[] | null,
): { groups: Array<{ slots: ExecutiveSlot[] }>; extras: ExecutiveSlot[] } {
  const pool = (leaders ?? []).filter((leader): leader is LeaderRecord => Boolean(leader?._id));
  const taken = new Set<string>();
  const filled = groups.map((group) => ({
    slots: group.positions.map((position) => ({ position }) as ExecutiveSlot),
  }));
  const available = () => pool.filter((leader) => !taken.has(leader._id));

  const claim = (slot: ExecutiveSlot, leader: LeaderRecord) => {
    slot.leader = leader;
    taken.add(leader._id);
  };

  for (const group of filled) {
    for (const slot of group.slots) {
      const target = normalizeRole(slot.position);
      const found = available().find(
        (leader) =>
          normalizeRole(leader.position) === target || normalizeRole(leader.chapterRole) === target,
      );
      if (found) claim(slot, found);
    }
  }

  for (const group of filled) {
    for (const slot of group.slots) {
      if (slot.leader) continue;
      const target = normalizeRole(slot.position);
      const found = available().find((leader) =>
        [normalizeRole(leader.position), normalizeRole(leader.chapterRole)]
          .filter(Boolean)
          .some((role) => target === role || target.endsWith(` ${role}`)),
      );
      if (found) claim(slot, found);
    }
  }

  return {
    groups: filled,
    extras: available().map((leader) => ({
      position: leader.position ?? leader.chapterRole ?? "Leader",
      leader,
    })),
  };
}
