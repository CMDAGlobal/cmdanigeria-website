import { describe, expect, it } from "vitest";

import { outreachDateLabel, outreachStatusLabel } from "./outreach-labels";

describe("outreachStatusLabel", () => {
  it("maps the schema statuses to display labels", () => {
    expect(outreachStatusLabel("planned")).toBe("Planned");
    expect(outreachStatusLabel("active")).toBe("Active");
    expect(outreachStatusLabel("completed")).toBe("Completed");
    expect(outreachStatusLabel("cancelled")).toBe("Cancelled");
  });

  it("is case- and whitespace-tolerant", () => {
    expect(outreachStatusLabel("  Planned ")).toBe("Planned");
    expect(outreachStatusLabel("ACTIVE")).toBe("Active");
  });

  it("returns null for missing or unknown statuses", () => {
    expect(outreachStatusLabel(undefined)).toBeNull();
    expect(outreachStatusLabel(null)).toBeNull();
    expect(outreachStatusLabel("")).toBeNull();
    expect(outreachStatusLabel("on-hold")).toBeNull();
  });
});

describe("outreachDateLabel", () => {
  it("announces when there is no usable start date", () => {
    expect(outreachDateLabel({})).toBe("Date to be announced");
    expect(outreachDateLabel({ startsAt: null })).toBe("Date to be announced");
    expect(outreachDateLabel({ startsAt: "not-a-date" })).toBe("Date to be announced");
    expect(outreachDateLabel({ startsAt: "" })).toBe("Date to be announced");
  });

  it("formats a single-day outreach", () => {
    expect(outreachDateLabel({ startsAt: "2026-03-12T09:00:00Z" })).toBe("12 Mar 2026");
  });

  it("collapses ranges inside one month", () => {
    expect(
      outreachDateLabel({ startsAt: "2026-03-12T09:00:00Z", endsAt: "2026-03-15T17:00:00Z" }),
    ).toBe("12–15 Mar 2026");
  });

  it("keeps both dates when the range crosses months", () => {
    expect(
      outreachDateLabel({ startsAt: "2026-02-28T09:00:00Z", endsAt: "2026-03-03T17:00:00Z" }),
    ).toBe("28 Feb 2026 – 3 Mar 2026");
  });

  it("falls back to the start date when the end date is unusable", () => {
    expect(outreachDateLabel({ startsAt: "2026-03-12T09:00:00Z", endsAt: "broken" })).toBe(
      "12 Mar 2026",
    );
  });
});
