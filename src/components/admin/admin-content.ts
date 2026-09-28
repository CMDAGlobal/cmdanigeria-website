"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContentAction,
  deleteContentAction,
  getAdminSettingsAction,
  getContentModuleAction,
  getMediaLibraryAction,
  setPublicationAction,
  updateContentAction,
} from "@/admin/content/server";
import type {
  ContentDocInput,
  ContentModuleKey,
  ContentMutationResult,
  CreateContentInput,
  SetPublicationInput,
  UpdateContentInput,
} from "@/admin/content/types";

export function useContentModule(module: ContentModuleKey) {
  return useQuery({
    queryKey: ["admin-content", module] as const,
    queryFn: () => getContentModuleAction({ data: module }),
    staleTime: 30_000,
    retry: false,
  });
}

function useInvalidateContent(module: ContentModuleKey) {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-content", module] });
    void queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-media"] });
  };
}

export function useCreateContent(module: ContentModuleKey) {
  const invalidate = useInvalidateContent(module);
  return useMutation<ContentMutationResult, Error, CreateContentInput>({
    mutationFn: (input) => createContentAction({ data: input }),
    onSuccess: invalidate,
  });
}

export function useUpdateContent(module: ContentModuleKey) {
  const invalidate = useInvalidateContent(module);
  return useMutation<ContentMutationResult, Error, UpdateContentInput>({
    mutationFn: (input) => updateContentAction({ data: input }),
    onSuccess: invalidate,
  });
}

export function useDeleteContent(module: ContentModuleKey) {
  const invalidate = useInvalidateContent(module);
  return useMutation<ContentMutationResult, Error, ContentDocInput>({
    mutationFn: (input) => deleteContentAction({ data: input }),
    onSuccess: invalidate,
  });
}

export function useSetPublication(module: ContentModuleKey) {
  const invalidate = useInvalidateContent(module);
  return useMutation<ContentMutationResult, Error, SetPublicationInput>({
    mutationFn: (input) => setPublicationAction({ data: input }),
    onSuccess: invalidate,
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
