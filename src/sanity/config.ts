export function readEnv(name: string): string | undefined {
  const processEnv =
    typeof process !== "undefined"
      ? ((process.env as Record<string, string | undefined> | undefined)?.[name] as string | undefined)
      : undefined;
  if (processEnv) return processEnv;
  const metaEnv = (import.meta as { env?: Record<string, string | undefined> }).env;
  return metaEnv?.[name];
}

export const sanityProjectId = (): string | undefined => readEnv("SANITY_PROJECT_ID");
export const sanityDataset = (): string => readEnv("SANITY_DATASET") ?? "production";
export const sanityApiVersion = (): string =>
  readEnv("SANITY_API_VERSION") ?? "2026-01-01";
export const sanityReadToken = (): string | undefined => readEnv("SANITY_READ_TOKEN");
export const sanityTag = (): string | undefined => readEnv("SANITY_TAG");

export const isSanityConfigured = (): boolean => Boolean(sanityProjectId());