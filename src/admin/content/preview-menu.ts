import type { PublicationKey } from "./mappers";

export interface PreviewMenuState {
  /** Whether the dropdown should render a preview/open item at all. */
  show: boolean;
  label: string;
  /** Public URL for live pages; Studio intent URL for drafts. */
  href: string | null;
  /** Open in a new tab. */
  external: boolean;
}

const STUDIO = "/studio";

function studioEditUrl(studioType: string, id: string): string {
  return `${STUDIO}/intent/edit/id=${encodeURIComponent(id)}&type=${encodeURIComponent(studioType)}`;
}

/**
 * What the admin dropdown's preview item should do for a given publication
 * status. Published items link to the live public page; anything else deep-
 * links into Studio so the editor can see the draft as-authored. Items with
 * no public URL and no Studio id get no item.
 */
export function previewMenuState(
  status: PublicationKey | null | undefined,
  publicUrl: string | null | undefined,
  studioType: string | null | undefined,
  itemId: string | null | undefined,
): PreviewMenuState {
  if (status === "published" && publicUrl) {
    return { show: true, label: "View live page", href: publicUrl, external: true };
  }
  if (studioType && itemId) {
    return {
      show: true,
      label: status === "published" ? "Open in Studio" : "Preview draft in Studio",
      href: studioEditUrl(studioType, itemId),
      external: true,
    };
  }
  if (publicUrl) {
    return { show: true, label: "View page", href: publicUrl, external: true };
  }
  return { show: false, label: "", href: null, external: true };
}
