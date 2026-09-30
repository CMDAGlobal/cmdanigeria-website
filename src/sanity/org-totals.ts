/**
 * Organisation-wide totals that have no authoritative home in the CMS yet.
 *
 * Chapter, zone and region counts are derived from Sanity on every request —
 * see `pageCountersQuery`. Membership roll-ups cannot be, because a member is
 * not a `person` document with an `arm`; chapters hold `membership` stat rows
 * instead, which are free-text and not reliably summable.
 *
 * Until editors manage these in the dashboard, they stay explicit constants
 * here so there is exactly one place to change them. Moving them into the CMS is
 * tracked as follow-up work: give the arm `page` documents a membership stat
 * section, then delete this file.
 */
export const ORG_TOTALS = {
  studentMembers: 9_700,
  doctorMembers: 1_200,
  foundingYear: 1972,
  statesAndFct: 37,
  globalMembers: 75,
} as const;

/** Count to display, or null when the CMS returned nothing usable. */
export function liveCount(value: number | null | undefined): string | null {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) return null;
  return value.toLocaleString("en-NG");
}
