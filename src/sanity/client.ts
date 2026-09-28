import { createClient, type SanityClient } from "@sanity/client";
import {
  isSanityConfigured,
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
  sanityReadToken,
  sanityWriteToken,
} from "./config";

let cachedClient: SanityClient | null = null;
let cachedWriteClient: SanityClient | null = null;

export function getClient(): SanityClient | null {
  const projectId = sanityProjectId();
  if (!projectId || !isSanityConfigured()) return null;
  if (cachedClient) return cachedClient;
  const token = sanityReadToken();
  const config: {
    projectId: string;
    dataset: string;
    apiVersion: string;
    useCdn: false;
    stega: false;
    token?: string;
  } = {
    projectId,
    dataset: sanityDataset(),
    apiVersion: sanityApiVersion(),
    useCdn: false,
    stega: false,
  };
  if (token) config.token = token;
  cachedClient = createClient(config);
  return cachedClient;
}

/**
 * Client with the write token — required for dashboard-driven content
 * mutations. Returns null when `SANITY_WRITE_TOKEN` is not configured.
 */
export function getWriteClient(): SanityClient | null {
  const projectId = sanityProjectId();
  const token = sanityWriteToken();
  if (!projectId || !token) return null;
  if (cachedWriteClient) return cachedWriteClient;
  cachedWriteClient = createClient({
    projectId,
    dataset: sanityDataset(),
    apiVersion: sanityApiVersion(),
    useCdn: false,
    stega: false,
    token,
  });
  return cachedWriteClient;
}

export type { SanityClient };
