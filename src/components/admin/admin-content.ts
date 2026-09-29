"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContentAction,
  deleteContentAction,
  getAdminSettingsAction,
  getContentDocAction,
  getContentModuleAction,
  getContentScopeOptionsAction,
  getMediaLibraryAction,
  listSanityAssetsAction,
  setPublicationAction,
  updateContentAction,
  uploadSanityAssetAction,
} from "@/admin/content/server";
import type {
  AssetListPayload,
  ContentDocInput,
  ContentDocPayload,
  ContentModuleKey,
  ContentMutationResult,
  ContentScopeOptionsPayload,
  CreateContentInput,
  SetPublicationInput,
  UpdateContentInput,
  UploadAssetInput,
  UploadAssetResult,
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

export function useContentDoc(module: ContentModuleKey, id: string | null, enabled: boolean) {
  return useQuery<ContentDocPayload>({
    queryKey: ["admin-content-doc", module, id] as const,
    queryFn: () => getContentDocAction({ data: { module, id: id as string } }),
    enabled: enabled && id !== null,
    staleTime: 15_000,
    retry: false,
  });
}

export function useContentScopeOptions(enabled: boolean) {
  return useQuery<ContentScopeOptionsPayload>({
    queryKey: ["admin-scope-options"] as const,
    queryFn: () => getContentScopeOptionsAction(),
    enabled,
    staleTime: 60_000,
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

export function useSanityAssets(kind: "image" | "file", enabled: boolean) {
  return useQuery<AssetListPayload>({
    queryKey: ["admin-assets", kind] as const,
    queryFn: () => listSanityAssetsAction({ data: kind }),
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}

export function useUploadSanityAsset(module: ContentModuleKey) {
  const queryClient = useQueryClient();
  return useMutation<UploadAssetResult, Error, UploadAssetInput>({
    mutationFn: (input) => uploadSanityAssetAction({ data: input }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-assets"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-media"] });
    },
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
