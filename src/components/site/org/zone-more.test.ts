import { describe, expect, it } from "vitest";
import { remainingChapters } from "./zone-more";

describe("remainingChapters", () => {
  it("counts the chapters the zone card has not listed", () => {
    expect(remainingChapters(21, 16)).toBe(5);
    expect(remainingChapters(13, 8)).toBe(5);
  });

  it("stays empty when every chapter is already on screen", () => {
    expect(remainingChapters(13, 13)).toBe(0);
    expect(remainingChapters(16, 16)).toBe(0);
    expect(remainingChapters(7, 7)).toBe(0);
  });

  it("never goes negative when the sample outgrows the count", () => {
    expect(remainingChapters(5, 8)).toBe(0);
  });

  it("treats missing numbers as nothing hidden", () => {
    expect(remainingChapters(undefined, 8)).toBe(0);
    expect(remainingChapters(null, null)).toBe(0);
    expect(remainingChapters(10, undefined)).toBe(10);
  });
});
