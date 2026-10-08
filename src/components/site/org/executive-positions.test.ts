import { describe, expect, it } from "vitest";
import type { LeaderRecord } from "@/sanity/types";
import {
  CHAPTER_EXECUTIVE_POSITIONS,
  CLASS_EXECUTIVE_POSITIONS,
  NATIONAL_EXECUTIVE_POSITIONS,
  matchExecutives,
} from "./executive-positions";

function leader(overrides: Partial<LeaderRecord> & { _id: string }): LeaderRecord {
  return { name: `Leader ${overrides._id}`, ...overrides };
}

describe("executive position lists", () => {
  it("keeps the three tiers at their protocol sizes with no duplicates", () => {
    expect(NATIONAL_EXECUTIVE_POSITIONS).toHaveLength(11);
    expect(CHAPTER_EXECUTIVE_POSITIONS).toHaveLength(8);
    expect(CLASS_EXECUTIVE_POSITIONS).toHaveLength(6);
    for (const list of [
      NATIONAL_EXECUTIVE_POSITIONS,
      CHAPTER_EXECUTIVE_POSITIONS,
      CLASS_EXECUTIVE_POSITIONS,
    ]) {
      expect(new Set(list).size).toBe(list.length);
    }
  });
});

describe("matchExecutives", () => {
  it("renders every position as a placeholder when there are no leaders", () => {
    const result = matchExecutives([{ positions: CHAPTER_EXECUTIVE_POSITIONS }], null);
    const slots = result.groups[0]?.slots ?? [];
    expect(slots).toHaveLength(8);
    expect(slots.every((slot) => slot.leader === undefined)).toBe(true);
    expect(result.extras).toEqual([]);
  });

  it("matches a full title including its abbreviation", () => {
    const np = leader({ _id: "np", position: "National President (NP)" });
    const result = matchExecutives([{ positions: NATIONAL_EXECUTIVE_POSITIONS }], [np]);
    const slots = result.groups[0]?.slots ?? [];
    expect(slots[0]?.leader?._id).toBe("np");
    expect(slots.filter((slot) => slot.leader)).toHaveLength(1);
    expect(result.extras).toEqual([]);
  });

  it("fills a longer title from a short chapter role", () => {
    const president = leader({ _id: "pres", chapterRole: "President" });
    const result = matchExecutives([{ positions: CHAPTER_EXECUTIVE_POSITIONS }], [president]);
    expect(result.groups[0]?.slots[0]?.leader?._id).toBe("pres");
    expect(result.groups[0]?.slots[1]?.leader).toBeUndefined();
  });

  it("only matches a role on a word boundary", () => {
    const fragment = leader({ _id: "frag", chapterRole: "ary" });
    const result = matchExecutives([{ positions: CLASS_EXECUTIVE_POSITIONS }], [fragment]);
    expect((result.groups[0]?.slots ?? []).some((slot) => slot.leader)).toBe(false);
    expect(result.extras).toHaveLength(1);
  });

  it("never uses one leader for two positions", () => {
    const only = leader({ _id: "one", chapterRole: "Secretary" });
    const result = matchExecutives(
      [{ positions: ["School General Secretary"] }, { positions: ["Class General Secretary"] }],
      [only],
    );
    expect(result.groups[0]?.slots[0]?.leader?._id).toBe("one");
    expect(result.groups[1]?.slots[0]?.leader).toBeUndefined();
    expect(result.extras).toEqual([]);
  });

  it("fills both tiers from one chapter roster without overlap", () => {
    const roster = [
      leader({ _id: "a", chapterRole: "President" }),
      leader({ _id: "b", chapterRole: "Class Coordinator" }),
      leader({ _id: "c", chapterRole: "Patron" }),
    ];
    const result = matchExecutives(
      [{ positions: CHAPTER_EXECUTIVE_POSITIONS }, { positions: CLASS_EXECUTIVE_POSITIONS }],
      roster,
    );
    expect(result.groups[0]?.slots[0]?.leader?._id).toBe("a");
    expect(result.groups[1]?.slots[0]?.leader?._id).toBe("b");
    expect(result.extras.map((slot) => slot.leader?._id)).toEqual(["c"]);
  });

  it("returns an unmatched leader as an extra with its own title", () => {
    const patron = leader({ _id: "patron", position: "Chapter Patron" });
    const result = matchExecutives([{ positions: CHAPTER_EXECUTIVE_POSITIONS }], [patron]);
    expect(result.extras).toHaveLength(1);
    expect(result.extras[0]?.position).toBe("Chapter Patron");
    expect(result.extras[0]?.leader?._id).toBe("patron");
  });

  it("treats blank roles as no role at all", () => {
    const blank = leader({ _id: "blank", position: "", chapterRole: "" });
    const result = matchExecutives([{ positions: NATIONAL_EXECUTIVE_POSITIONS }], [blank]);
    expect((result.groups[0]?.slots ?? []).some((slot) => slot.leader)).toBe(false);
    expect(result.extras).toHaveLength(1);
  });
});
