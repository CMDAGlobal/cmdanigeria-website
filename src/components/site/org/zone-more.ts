/**
 * Chapters a zone card has not listed yet — the count behind the "+N more"
 * chip on the Students' and Doctors' arm pages. The sample slice and the
 * chapter count come from separate queries, so the remainder is derived from
 * what is actually on screen, never assumed.
 */
export function remainingChapters(
  chapterCount: number | null | undefined,
  shown: number | null | undefined,
): number {
  return Math.max((chapterCount ?? 0) - (shown ?? 0), 0);
}
