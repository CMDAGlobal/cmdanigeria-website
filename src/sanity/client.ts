import { createClient, type SanityClient } from "@sanity/client";
import {
  isSanityConfigured,
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
  sanityReadToken,
} from "./config";

let cachedClient: SanityClient | null = null;

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

export type { SanityClient };