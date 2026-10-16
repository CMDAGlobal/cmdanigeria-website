import { createServerFn } from "@tanstack/react-start";
import type {
  AssetListPayload,
  AssetMutationResult,
  ContentDocInput,
  ContentDocPayload,
  ContentModuleKey,
  ContentModulePayload,
  ContentMutationResult,
  ContentScopeOptionsPayload,
  CreateContentInput,
  DashboardStatsPayload,
  DeleteAssetInput,
  LibraryAssetsInput,
  MediaPayload,
  MyChapterPayload,
  PageSectionsPayload,
  ReplaceAssetInput,
  SetPageSectionsInput,
  SetPublicationInput,
  SettingsPayload,
  UpdateContentInput,
  UploadAssetInput,
  UploadAssetResult,
} from "./types";

export type {
  AssetListEntry,
  AssetListPayload,
  AssetMutationResult,
  ContentDocAsset,
  ContentDocInput,
  ContentDocPayload,
  ContentItem,
  ContentModuleKey,
  ContentModulePayload,
  ContentMutationResult,
  ContentScopeOptionsPayload,
  ContentStat,
  ContentStatus,
  CreateContentInput,
  DashboardContentStats,
  DashboardStatsPayload,
  DashboardUserStats,
  DeleteAssetInput,
  LibraryAssetsInput,
  MediaAsset,
  MediaPayload,
  MyChapterPayload,
  MyChapterStat,
  PageSectionOrder,
  PageSectionRow,
  PageSectionsPayload,
  ReplaceAssetInput,
  ScopeUnitOptionPayload,
  SetPageSectionsInput,
  SetPublicationInput,
  SettingsPayload,
  StatusTone,
  UpdateContentInput,
  UploadAssetInput,
  UploadAssetResult,
} from "./types";

export const getDashboardStatsAction = createServerFn({ method: "GET", strict: false }).handler(
  async (): Promise<DashboardStatsPayload> => {
    const { getDashboardStats } = await import("./actions");
    return getDashboardStats();
  },
);

export const getContentModuleAction = createServerFn({ method: "GET", strict: false })
  .validator((module: ContentModuleKey) => module)
  .handler(async ({ data: module }): Promise<ContentModulePayload> => {
    const { getContentModule } = await import("./actions");
    return getContentModule(module);
  });

export const getMediaLibraryAction = createServerFn({ method: "GET", strict: false }).handler(
  async (): Promise<MediaPayload> => {
    const { getMediaLibrary } = await import("./actions");
    return getMediaLibrary();
  },
);

export const getMyChapterAction = createServerFn({ method: "GET", strict: false }).handler(
  async (): Promise<MyChapterPayload> => {
    const { getMyChapter } = await import("./actions");
    return getMyChapter();
  },
);

export const getContentDocAction = createServerFn({ method: "GET", strict: false })
  .validator((data: ContentDocInput) => data)
  .handler(async ({ data }): Promise<ContentDocPayload> => {
    const { getContentDoc } = await import("./actions");
    return getContentDoc(data);
  });

export const getPageSectionsAction = createServerFn({ method: "GET", strict: false })
  .validator((data: ContentDocInput) => data)
  .handler(async ({ data }): Promise<PageSectionsPayload> => {
    const { getPageSections } = await import("./actions");
    return getPageSections(data);
  });

export const getContentScopeOptionsAction = createServerFn({
  method: "GET",
  strict: false,
}).handler(async (): Promise<ContentScopeOptionsPayload> => {
  const { getContentScopeOptions } = await import("./actions");
  return getContentScopeOptions();
});

export const getAdminSettingsAction = createServerFn({ method: "GET", strict: false }).handler(
  async (): Promise<SettingsPayload> => {
    const { getAdminSettings } = await import("./actions");
    return getAdminSettings();
  },
);

export const createContentAction = createServerFn({ method: "POST", strict: false })
  .validator((data: CreateContentInput) => data)
  .handler(async ({ data }): Promise<ContentMutationResult> => {
    const { createContent } = await import("./mutations");
    return createContent(data);
  });

export const updateContentAction = createServerFn({ method: "POST", strict: false })
  .validator((data: UpdateContentInput) => data)
  .handler(async ({ data }): Promise<ContentMutationResult> => {
    const { updateContent } = await import("./mutations");
    return updateContent(data);
  });

export const deleteContentAction = createServerFn({ method: "POST", strict: false })
  .validator((data: ContentDocInput) => data)
  .handler(async ({ data }): Promise<ContentMutationResult> => {
    const { deleteContent } = await import("./mutations");
    return deleteContent(data);
  });

export const setPublicationAction = createServerFn({ method: "POST", strict: false })
  .validator((data: SetPublicationInput) => data)
  .handler(async ({ data }): Promise<ContentMutationResult> => {
    const { setPublicationStatus } = await import("./mutations");
    return setPublicationStatus(data);
  });

export const sendPublicationAction = createServerFn({ method: "POST", strict: false })
  .validator((data: ContentDocInput) => data)
  .handler(async ({ data }): Promise<ContentMutationResult> => {
    const { sendPublication } = await import("./mutations");
    return sendPublication(data);
  });

export const setPageSectionsAction = createServerFn({ method: "POST", strict: false })
  .validator((data: SetPageSectionsInput) => data)
  .handler(async ({ data }): Promise<ContentMutationResult> => {
    const { setPageSections } = await import("./mutations");
    return setPageSections(data);
  });

export const listSanityAssetsAction = createServerFn({ method: "GET", strict: false })
  .validator((data: { kind: "image" | "file"; search?: string; limit?: number }) => data)
  .handler(async ({ data }): Promise<AssetListPayload> => {
    const { listSanityAssets } = await import("./assets");
    return listSanityAssets(data.kind, data.search, data.limit);
  });

export const listLibraryAssetsAction = createServerFn({ method: "GET", strict: false })
  .validator((data: LibraryAssetsInput) => data)
  .handler(async ({ data }): Promise<AssetListPayload> => {
    const { listLibraryAssets } = await import("./assets");
    return listLibraryAssets(data);
  });

export const uploadSanityAssetAction = createServerFn({ method: "POST", strict: false })
  .validator((data: UploadAssetInput) => data)
  .handler(async ({ data }): Promise<UploadAssetResult> => {
    const { uploadSanityAsset } = await import("./assets");
    return uploadSanityAsset(data);
  });

export const replaceSanityAssetAction = createServerFn({ method: "POST", strict: false })
  .validator((data: ReplaceAssetInput) => data)
  .handler(async ({ data }): Promise<UploadAssetResult> => {
    const { replaceSanityAsset } = await import("./assets");
    return replaceSanityAsset(data);
  });

export const deleteSanityAssetAction = createServerFn({ method: "POST", strict: false })
  .validator((data: DeleteAssetInput) => data)
  .handler(async ({ data }): Promise<AssetMutationResult> => {
    const { deleteSanityAsset } = await import("./assets");
    return deleteSanityAsset(data);
  });
