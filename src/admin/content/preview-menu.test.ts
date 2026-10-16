import { describe, expect, it } from "vitest";
import { previewMenuState } from "./preview-menu";

describe("previewMenuState", () => {
  it("links published items to their live public page", () => {
    const state = previewMenuState("published", "/events/conf", "event", "evt-1");
    expect(state).toEqual({
      show: true,
      label: "View live page",
      href: "/events/conf",
      external: true,
    });
  });

  it("deep-links drafts into Studio instead of a dead public URL", () => {
    const state = previewMenuState("draft", "/events/conf", "event", "evt-1");
    expect(state.show).toBe(true);
    expect(state.label).toBe("Preview draft in Studio");
    expect(state.href).toContain("/studio/intent/edit/");
    expect(state.href).toContain("id=evt-1");
    expect(state.href).toContain("type=event");
  });

  it("treats scheduled and archived like drafts for the label", () => {
    expect(previewMenuState("scheduled", null, "post", "p-1").label).toBe(
      "Preview draft in Studio",
    );
    expect(previewMenuState("archived", null, "post", "p-1").label).toBe("Preview draft in Studio");
  });

  it("falls back to a bare public URL when there is no Studio id", () => {
    const state = previewMenuState("draft", "/news/x", null, null);
    expect(state).toEqual({
      show: true,
      label: "View page",
      href: "/news/x",
      external: true,
    });
  });

  it("hides the item when there is nothing to open", () => {
    expect(previewMenuState("draft", null, null, null).show).toBe(false);
    expect(previewMenuState(null, null, null, null).show).toBe(false);
    expect(previewMenuState(undefined, undefined, undefined, undefined).show).toBe(false);
  });

  it("still opens Studio for published items missing a public URL", () => {
    const state = previewMenuState("published", null, "region", "r-1");
    expect(state.label).toBe("Open in Studio");
    expect(state.href).toContain("type=region");
  });
});
