"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContentAction,
  deleteContentAction,
  deleteSanityAssetAction,
  getAdminSettingsAction,
  getContentDocAction,
  getContentModuleAction,
  getContentScopeOptionsAction,
  getMediaLibraryAction,
  getPageSectionsAction,
  getMyChapterAction,
  listLibraryAssetsAction,
  listSanityAssetsAction,
  replaceSanityAssetAction,
  setPublicationAction,
  setPageSectionsAction,
  updateContentAction,
  uploadSanityAssetAction,
} from "@/admin/content/server";
import type {
  AssetListPayload,
  AssetMutationResult,
  ContentDocInput,
  ContentDocPayload,
  ContentModuleKey,
  ContentMutationResult,
  ContentScopeOptionsPayload,
  CreateContentInput,
  LibraryAssetsInput,
  PageSectionsPayload,
  ReplaceAssetInput,
  SetPageSectionsInput,
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

export function useMyChapter(enabled: boolean) {
  return useQuery({
    queryKey: ["admin-my-chapter"] as const,
    queryFn: () => getMyChapterAction(),
    staleTime: 60_000,
    retry: false,
    enabled,
  });
}

function useInvalidateContent(module: ContentModuleKey) {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-content", module] });
    void queryClient.invalidateQueries({ queryKey: ["admin-my-chapter"] });
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

export function usePageSections(id: string | null, enabled: boolean) {
  return useQuery<PageSectionsPayload>({
    queryKey: ["admin-page-sections", id] as const,
    queryFn: () => getPageSectionsAction({ data: { module: "pages", id: id as string } }),
    enabled: enabled && id !== null,
    staleTime: 15_000,
    retry: false,
  });
}

export function useSetPageSections() {
  const queryClient = useQueryClient();
  return useMutation<ContentMutationResult, Error, SetPageSectionsInput>({
    mutationFn: (input) => setPageSectionsAction({ data: input }),
    onSuccess: (_result, input) => {
      void queryClient.invalidateQueries({ queryKey: ["admin-page-sections", input.id] });
      void queryClient.invalidateQueries({ queryKey: ["admin-content", "pages"] });
    },
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
    queryFn: () => listSanityAssetsAction({ data: { kind } }),
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}

export function useLibraryAssets(input: LibraryAssetsInput, enabled: boolean) {
  return useQuery<AssetListPayload>({
    queryKey: ["admin-library-assets", input.kind ?? "all", input.search ?? ""] as const,
    queryFn: () => listLibraryAssetsAction({ data: input }),
    enabled,
    staleTime: 30_000,
    retry: false,
  });
}

function useInvalidateAssets() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-assets"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-library-assets"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-media"] });
  };
}

export function useUploadSanityAsset(module: ContentModuleKey | null) {
  const invalidate = useInvalidateAssets();
  return useMutation<UploadAssetResult, Error, UploadAssetInput>({
    mutationFn: (input) => uploadSanityAssetAction({ data: module ? { ...input, module } : input }),
    onSuccess: invalidate,
  });
}

export function useReplaceSanityAsset() {
  const invalidate = useInvalidateAssets();
  return useMutation<UploadAssetResult, Error, ReplaceAssetInput>({
    mutationFn: (input) => replaceSanityAssetAction({ data: input }),
    onSuccess: invalidate,
  });
}

export function useDeleteSanityAsset() {
  const invalidate = useInvalidateAssets();
  return useMutation<AssetMutationResult, Error, { id: string }>({
    mutationFn: (input) => deleteSanityAssetAction({ data: input }),
    onSuccess: invalidate,
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
