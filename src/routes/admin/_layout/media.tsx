"use client";

import { createFileRoute } from "@tanstack/react-router";
import { Images } from "lucide-react";

import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export const Route = createFileRoute("/admin/_layout/media")({
  component: MediaModulePage,
  head: () => ({
    meta: [{ title: "Media Library · Admin · CMDA Nigeria" }],
  }),
});

function MediaModulePage() {
  return (
    <ModulePlaceholder
      title="Media library"
      description="Central asset library for images and media uploaded across the platform."
      icon={Images}
      permission="media.read"
    />
  );
}
