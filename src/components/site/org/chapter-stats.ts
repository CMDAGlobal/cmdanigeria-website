import { parseISO } from "date-fns";
import type { EventRecord, StatEntry } from "@/sanity/types";

/** Shown on chapters where no admin has entered statistics yet. */
export const PLACEHOLDER_STATS: readonly Required<StatEntry>[] = [
  { label: "Membership strength", value: "—" },
  { label: "Outreaches held this year", value: "—" },
];

/**
 * Statistics are typed by the chapter admin in the dashboard — never computed.
 * Rows without a label cannot be rendered, so they are dropped; a row with a
 * label but no value shows the dash. Chapters with no rows fall back to the
 * placeholder pair so every chapter page carries the strip.
 */
export function chapterStats(membership?: StatEntry[] | null): StatEntry[] {
  const rows = (membership ?? []).filter((row) => !!row?.label?.trim());
  if (!rows.length) return PLACEHOLDER_STATS.map((row) => ({ ...row }));
  return rows.map((row) => ({
    label: row.label?.trim() ?? "",
    value: row.value?.trim() || "—",
  }));
}

export const UPCOMING_EVENTS_LIMIT = 6;

const DAY_MS = 24 * 60 * 60 * 1000;

function eventTime(event: EventRecord): number {
  if (!event.startDate) return Number.POSITIVE_INFINITY;
  const time = parseISO(event.startDate).getTime();
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
}

/**
 * The chapter's upcoming events, nearest first. Uses the same day of grace as
 * `EventCard`'s Upcoming badge so a card never claims an event the section hid;
 * undated events stay visible, and the list is capped so one busy chapter
 * cannot take over the page.
 */
export function upcomingEvents(events?: EventRecord[] | null, now = Date.now()): EventRecord[] {
  return (events ?? [])
    .filter((event) => eventTime(event) >= now - DAY_MS)
    .sort((a, b) => eventTime(a) - eventTime(b))
    .slice(0, UPCOMING_EVENTS_LIMIT);
}
