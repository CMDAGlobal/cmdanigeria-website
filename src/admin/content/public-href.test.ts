import { describe, expect, it } from "vitest";

import { publicHref } from "./public-href";

describe("publicHref", () => {
  it("maps detail-page modules to their public routes", () => {
    expect(publicHref("events", "annual-conference")).toBe("/events/annual-conference");
    expect(publicHref("news", "new-president")).toBe("/news/new-president");
    expect(publicHref("publications", "prescription-march-2026")).toBe(
      "/publications/prescription-march-2026",
    );
    expect(publicHref("chapters", "luth")).toBe("/chapters/luth");
    expect(publicHref("regions", "west-africa")).toBe("/global-network/west-africa");
    expect(publicHref("pages", "about-us")).toBe("/about-us");
    expect(publicHref("outreaches", "medical-mission")).toBe("/what-we-do#outreaches");
  });

  it("returns null for modules with no standalone public page", () => {
    expect(publicHref("announcements", "circular-1")).toBeNull();
    expect(publicHref("leadership", "ada-okonkwo")).toBeNull();
  });

  it("returns null without a slug", () => {
    expect(publicHref("events", null)).toBeNull();
    expect(publicHref("news", undefined)).toBeNull();
    expect(publicHref("news", "")).toBeNull();
  });
});
