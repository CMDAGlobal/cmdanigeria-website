import type { PageSection } from "@/sanity/types";

/**
 * Normalise a pasted video URL or bare ID into an embeddable URL.
 * Accepts `youtu.be/ID`, `youtube.com/watch?v=ID`, `/embed/ID` and bare `ID`.
 */
export function videoEmbedUrl(
  provider: string | null | undefined,
  idOrUrl: string | null | undefined,
): string | null {
  const raw = (idOrUrl ?? "").trim();
  if (!raw) return null;
  const kind = provider === "vimeo" ? "vimeo" : "youtube";

  if (kind === "vimeo") {
    const digits =
      raw.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1] ?? (/^\d+$/.test(raw) ? raw : null);
    return digits ? `https://player.vimeo.com/video/${digits}` : null;
  }

  const id =
    raw.match(
      /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
    )?.[1] ?? (/^[A-Za-z0-9_-]{6,}$/.test(raw) ? raw : null);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

/** Hidden sections are dropped before rendering; `visible` defaults to shown. */
export function visibleSections(sections: PageSection[] | null | undefined): PageSection[] {
  if (!Array.isArray(sections)) return [];
  return sections.filter((section) => section?.visible !== false && section?._type);
}

/** Studio keeps body alongside sections; only render body when no sections exist. */
export function shouldRenderBody(
  sections: PageSection[] | null | undefined,
  body: unknown[] | null | undefined,
): boolean {
  return visibleSections(sections).length === 0 && Array.isArray(body) && body.length > 0;
}
