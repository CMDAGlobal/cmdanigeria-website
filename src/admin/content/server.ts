import { createServerFn } from "@tanstack/react-start";
import type {
  ContentModuleKey,
  ContentModulePayload,
  MediaPayload,
  SettingsPayload,
} from "./types";

export type {
  ContentItem,
  ContentModuleKey,
  ContentModulePayload,
  ContentStat,
  ContentStatus,
  MediaAsset,
  MediaPayload,
  SettingsPayload,
  StatusTone,
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
