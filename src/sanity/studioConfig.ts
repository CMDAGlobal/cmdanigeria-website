import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schema";
import { readEnv } from "./config";

export const studioConfig = defineConfig({
  name: "cmda-nigeria",
  title: "CMDA Nigeria",
  projectId: readEnv("VITE_SANITY_PROJECT_ID") ?? readEnv("SANITY_PROJECT_ID") ?? "",
  dataset: readEnv("VITE_SANITY_DATASET") ?? readEnv("SANITY_DATASET") ?? "production",
  basePath: "/studio",
  plugins: [deskTool(), visionTool()],
  schema: { types: schemaTypes },
});