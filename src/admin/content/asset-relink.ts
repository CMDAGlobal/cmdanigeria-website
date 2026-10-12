/**
 * Deep-walks a document and rewires every Sanity reference whose `_ref` matches
 * `oldId` to `newId`. Used by library-level replace: upload a new asset, point
 * every document that used the old file at the new one, then drop the old
 * asset. Pure so it can be unit-tested.
 */
export function swapAssetRef<T>(value: T, oldId: string, newId: string): T {
  if (Array.isArray(value)) {
    return value.map((entry) => swapAssetRef(entry, oldId, newId)) as unknown as T;
  }
  if (value !== null && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (obj["_type"] === "reference" && obj["_ref"] === oldId) {
      return { ...obj, _ref: newId } as unknown as T;
    }
    const out: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(obj)) {
      out[key] = swapAssetRef(entry, oldId, newId);
    }
    return out as unknown as T;
  }
  return value;
}

/** Top-level keys whose deep content changed after a reference swap. */
export function changedTopLevelKeys(
  original: Record<string, unknown>,
  updated: Record<string, unknown>,
): string[] {
  const keys: string[] = [];
  for (const key of Object.keys(updated)) {
    if (key.startsWith("_")) continue;
    if (JSON.stringify(original[key]) !== JSON.stringify(updated[key])) keys.push(key);
  }
  return keys;
}
