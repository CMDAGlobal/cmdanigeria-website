import { createServerFn } from "@tanstack/react-start";
import type {
  ContentDocInput,
  ContentModuleKey,
  ContentModulePayload,
  ContentMutationResult,
  CreateContentInput,
  MediaPayload,
  SetPublicationInput,
  SettingsPayload,
  UpdateContentInput,
} from "./types";

export type {
  ContentDocInput,
  ContentItem,
  ContentModuleKey,
  ContentModulePayload,
  ContentMutationResult,
  ContentStat,
  ContentStatus,
  CreateContentInput,
  MediaAsset,
  MediaPayload,
  SetPublicationInput,
  SettingsPayload,
  StatusTone,
  UpdateContentInput,
} from "./types";

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
