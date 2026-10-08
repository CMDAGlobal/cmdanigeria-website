import { describe, expect, it } from "vitest";
import type { EventRecord, StatEntry } from "@/sanity/types";
import {
  PLACEHOLDER_STATS,
  UPCOMING_EVENTS_LIMIT,
  chapterStats,
  upcomingEvents,
} from "./chapter-stats";

const NOW = Date.parse("2026-06-15T12:00:00.000Z");

function event(overrides: Partial<EventRecord> & { _id: string }): EventRecord {
  return { title: `Event ${overrides._id}`, ...overrides };
}

describe("chapterStats", () => {
  it("falls back to the placeholder pair when nothing is entered", () => {
    for (const input of [null, undefined, [], [{ value: "120" }]]) {
      const rows = chapterStats(input);
      expect(rows).toEqual(PLACEHOLDER_STATS);
      expect(rows).toHaveLength(2);
    }
  });

  it("uses the admin's rows, filling blank values with a dash", () => {
    const input: StatEntry[] = [
      { label: "Membership strength", value: "120" },
      { label: "Outreaches held this year", value: "" },
      { label: "Fellowship meetings", value: "48" },
    ];
    expect(chapterStats(input)).toEqual([
      { label: "Membership strength", value: "120" },
      { label: "Outreaches held this year", value: "—" },
      { label: "Fellowship meetings", value: "48" },
    ]);
  });

  it("drops rows that have no label to render", () => {
    expect(chapterStats([{ value: "120" }, { label: "  ", value: "5" }])).toEqual(
      PLACEHOLDER_STATS,
    );
  });
});

describe("upcomingEvents", () => {
  it("drops events that have already finished", () => {
    const events = [
      event({ _id: "past", startDate: "2026-05-01T10:00:00.000Z" }),
      event({ _id: "old", startDate: "2025-12-31T10:00:00.000Z" }),
    ];
    expect(upcomingEvents(events, NOW)).toEqual([]);
  });

  it("keeps future events and orders them nearest first", () => {
    const events = [
      event({ _id: "later", startDate: "2026-08-01T10:00:00.000Z" }),
      event({ _id: "soon", startDate: "2026-06-20T10:00:00.000Z" }),
    ];
    expect(upcomingEvents(events, NOW).map((entry) => entry._id)).toEqual(["soon", "later"]);
  });

  it("keeps an event that started moments ago, matching EventCard's badge", () => {
    const events = [event({ _id: "today", startDate: "2026-06-14T20:00:00.000Z" })];
    expect(upcomingEvents(events, NOW).map((entry) => entry._id)).toEqual(["today"]);
  });

  it("keeps undated events but lists them last", () => {
    const events = [
      event({ _id: "undated" }),
      event({ _id: "soon", startDate: "2026-06-20T10:00:00.000Z" }),
    ];
    expect(upcomingEvents(events, NOW).map((entry) => entry._id)).toEqual(["soon", "undated"]);
  });

  it("caps the list so one chapter cannot fill the page", () => {
    const events = Array.from({ length: UPCOMING_EVENTS_LIMIT + 3 }, (_, index) =>
      event({
        _id: `e${index}`,
        startDate: new Date(NOW + (index + 1) * 86_400_000).toISOString(),
      }),
    );
    expect(upcomingEvents(events, NOW)).toHaveLength(UPCOMING_EVENTS_LIMIT);
  });

  it("handles a missing or malformed list", () => {
    expect(upcomingEvents(null, NOW)).toEqual([]);
    expect(
      upcomingEvents([event({ _id: "bad", startDate: "not-a-date" })], NOW).map((e) => e._id),
    ).toEqual(["bad"]);
  });
});
