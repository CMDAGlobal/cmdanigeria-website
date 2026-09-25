"use client";

import { createFileRoute } from "@tanstack/react-router";

import { MediaLibrary } from "@/components/admin/MediaLibrary";

export const Route = createFileRoute("/admin/_layout/media")({
  component: MediaPage,
  head: () => ({
    meta: [{ title: "Media Library · Admin · CMDA Nigeria" }],
  }),
});

function MediaPage() {
  return <MediaLibrary />;
}
