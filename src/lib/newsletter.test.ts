import { describe, expect, it } from "vitest";

import { blockText, formatIssueMonth, prepareNewsletterBody, readingMinutes } from "./newsletter";

const heading = (text: string, style = "h2") => ({
  _type: "block",
  style,
  markDefs: [],
  children: [{ _type: "span", text, marks: [] }],
});

const paragraph = (text: string) => ({
  _type: "block",
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", text, marks: [] }],
});

describe("newsletter layout helpers", () => {
  it("formats a month and year, and rejects bad dates", () => {
    expect(formatIssueMonth("2026-11-01")).toBe("November 2026");
    expect(formatIssueMonth("not a date")).toBeNull();
    expect(formatIssueMonth(null)).toBeNull();
  });

  it("numbers section headings and leaves other blocks alone", () => {
    const body = [
      paragraph("Intro"),
      heading("A word from the President"),
      paragraph("Text"),
      heading("From the field", "h3"),
      { _type: "image", asset: { url: "/photo.webp" } },
    ];
    const { body: prepared, headings } = prepareNewsletterBody(body);

    expect(headings).toEqual([
      { id: "section-1", text: "A word from the President", level: 2 },
      { id: "section-2", text: "From the field", level: 3 },
    ]);
    expect(prepared[1]).toMatchObject({ _sectionId: "section-1" });
    expect(prepared[3]).toMatchObject({ _sectionId: "section-2" });
    expect(prepared[0]).toEqual(body[0]);
    expect(prepared[4]).toEqual(body[4]);
  });

  it("skips empty headings and tolerates junk input", () => {
    const { headings } = prepareNewsletterBody([heading("   "), null, "nope", 42]);
    expect(headings).toEqual([]);
    expect(prepareNewsletterBody(undefined)).toEqual({ body: [], headings: [] });
  });

  it("flattens spans to text", () => {
    expect(
      blockText({
        _type: "block",
        children: [
          { _type: "span", text: "Grace " },
          { _type: "span", text: "and truth" },
        ],
      }),
    ).toBe("Grace and truth");
    expect(blockText(null)).toBe("");
  });

  it("estimates at least one minute, counting images", () => {
    expect(readingMinutes([])).toBe(1);
    const words = Array.from({ length: 600 }, () => "word").join(" ");
    expect(readingMinutes([paragraph(words)])).toBe(3);
  });
});
