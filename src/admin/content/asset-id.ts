/**
 * Asset ids are system-generated (`image-…` / `file-…`). Accepted characters
 * only — this is a sanity check before the id reaches a GROQ parameter or a
 * delete call. Pure so it can be unit-tested without the Sanity client.
 */
export function parseAssetId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const id = value.trim();
  if (id.length < 5 || id.length > 128) return null;
  if (!/^(image|file)-[A-Za-z0-9_.-]+$/.test(id)) return null;
  return id;
}
