"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAdminSettingsAction,
  getContentModuleAction,
  getMediaLibraryAction,
} from "@/admin/content/server";
import type { ContentModuleKey } from "@/admin/content/types";

export function useContentModule(module: ContentModuleKey) {
  return useQuery({
    queryKey: ["admin-content", module] as const,
    queryFn: () => getContentModuleAction({ data: module }),
    staleTime: 30_000,
    retry: false,
  });
}

export function useMediaLibrary() {
  return useQuery({
    queryKey: ["admin-media"] as const,
    queryFn: () => getMediaLibraryAction(),
    staleTime: 30_000,
    retry: false,
  });
}

export function useAdminSettings() {
  return useQuery({
    queryKey: ["admin-settings"] as const,
    queryFn: () => getAdminSettingsAction(),
    staleTime: 60_000,
    retry: false,
  });
}
