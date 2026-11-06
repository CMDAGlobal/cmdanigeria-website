/**
 * Small helpers for the Prescription newsletter layout. Kept out of the
 * component file so React Fast Refresh sees only components there.
 */

export function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

/** Month and year only — issues are monthly, not daily. */
export function formatIssueMonth(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-NG", { month: "long", year: "numeric" });
}

/** Plain text of one Portable Text block, used for the contents list and read time. */
export function blockText(value: unknown): string {
  const block = asRecord(value);
  if (!block) return "";
  const children = Array.isArray(block["children"]) ? block["children"] : [];
  let text = "";
  for (const raw of children) {
    const span = asRecord(raw);
    if (!span) continue;
    if (typeof span["text"] === "string") text += span["text"];
  }
  return text.trim();
}

export interface NewsletterHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Adds anchor ids to section headings so the contents list can link to them.
 * Returns the enriched blocks plus the heading list in document order.
 */
export function prepareNewsletterBody(value: unknown): {
  body: unknown[];
  headings: NewsletterHeading[];
} {
  if (!Array.isArray(value)) return { body: [], headings: [] };
  const headings: NewsletterHeading[] = [];
  const body: unknown[] = [];
  let position = 0;
  for (const raw of value) {
    const block = asRecord(raw);
    if (!block) continue;
    const style = typeof block["style"] === "string" ? block["style"] : "";
    if (block["_type"] === "block" && (style === "h2" || style === "h3")) {
      const text = blockText(block);
      if (!text) {
        body.push(block);
        continue;
      }
      position += 1;
      const id = `section-${position}`;
      headings.push({ id, text, level: style === "h3" ? 3 : 2 });
      body.push({ ...block, _sectionId: id });
      continue;
    }
    body.push(block);
  }
  return { body, headings };
}

/** Rough read time in minutes (200 words/minute, photos count a little). */
export function readingMinutes(body: unknown[]): number {
  let words = 0;
  for (const raw of body) {
    const block = asRecord(raw);
    if (!block) continue;
    if (block["_type"] === "image") {
      words += 12;
      continue;
    }
    const text = blockText(block);
    if (text) words += text.split(/\s+/).length;
  }
  return Math.max(1, Math.round(words / 200));
}
