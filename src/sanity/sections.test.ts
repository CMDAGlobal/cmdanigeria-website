import { describe, expect, it } from "vitest";
import { shouldRenderBody, videoEmbedUrl, visibleSections } from "./sections";
import type { PageSection } from "./types";

const section = (over: Partial<PageSection>): PageSection => ({
  _key: "k",
  _type: "richTextSection",
  ...over,
});

describe("videoEmbedUrl", () => {
  it("accepts bare IDs", () => {
    expect(videoEmbedUrl("youtube", "dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
    expect(videoEmbedUrl("vimeo", "76979871")).toBe("https://player.vimeo.com/video/76979871");
  });

  it("accepts pasted YouTube URLs of every common shape", () => {
    const expected = "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ";
    for (const url of [
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://youtube.com/watch?v=dQw4w9WgXcQ&t=30s",
      "https://youtu.be/dQw4w9WgXcQ",
      "https://youtu.be/dQw4w9WgXcQ?t=30",
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/shorts/dQw4w9WgXcQ",
    ]) {
      expect(videoEmbedUrl("youtube", url), url).toBe(expected);
    }
  });

  it("accepts pasted Vimeo URLs", () => {
    expect(videoEmbedUrl("vimeo", "https://vimeo.com/76979871")).toBe(
      "https://player.vimeo.com/video/76979871",
    );
    expect(videoEmbedUrl("vimeo", "https://player.vimeo.com/video/76979871")).toBe(
      "https://player.vimeo.com/video/76979871",
    );
  });

  it("refuses junk rather than emitting a broken iframe", () => {
    for (const bad of ["", "   ", "not a url", null, undefined, "https://example.com/x"]) {
      expect(videoEmbedUrl("youtube", bad)).toBeNull();
    }
    expect(videoEmbedUrl("vimeo", "https://youtube.com/watch?v=dQw4w9WgXcQ")).toBeNull();
  });

  it("defaults to YouTube when the provider is missing", () => {
    expect(videoEmbedUrl(null, "dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
  });
});

describe("visibleSections", () => {
  it("keeps sections with no explicit flag", () => {
    expect(
      visibleSections([section({}), section({ visible: null }), section({ visible: true })]),
    ).toHaveLength(3);
  });

  it("drops hidden sections and keeps order", () => {
    const list = [
      section({ _key: "a" }),
      section({ _key: "b", visible: false }),
      section({ _key: "c" }),
    ];
    expect(visibleSections(list).map((s) => s._key)).toEqual(["a", "c"]);
  });

  it("tolerates null and empty input", () => {
    expect(visibleSections(null)).toEqual([]);
    expect(visibleSections(undefined)).toEqual([]);
    expect(visibleSections([])).toEqual([]);
  });
});

describe("shouldRenderBody", () => {
  const body = [{ _type: "block" }];

  it("renders body only when there are no visible sections", () => {
    expect(shouldRenderBody([], body)).toBe(true);
    expect(shouldRenderBody(null, body)).toBe(true);
  });

  it("lets sections win over legacy body copy", () => {
    expect(shouldRenderBody([section({})], body)).toBe(false);
  });

  it("falls back to body when every section is hidden", () => {
    expect(shouldRenderBody([section({ visible: false })], body)).toBe(true);
  });

  it("renders nothing when there is neither", () => {
    expect(shouldRenderBody([], null)).toBe(false);
    expect(shouldRenderBody([], [])).toBe(false);
    expect(shouldRenderBody(null, null)).toBe(false);
  });
});
