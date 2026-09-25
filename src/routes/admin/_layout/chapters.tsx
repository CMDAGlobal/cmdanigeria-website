"use client";

import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";

import { ContentModule } from "@/components/admin/ContentModule";

export const Route = createFileRoute("/admin/_layout/chapters")({
  component: ChaptersPage,
  head: () => ({
    meta: [{ title: "Chapters · Admin · CMDA Nigeria" }],
  }),
});

function ChaptersPage() {
  return (
    <ContentModule
      module="chapters"
      studioType="chapter"
      title="Chapters"
      description="Every CMDA Nigeria chapter, with its institution, location and arm."
      icon={Building2}
      permission="chapters.read"
      dateHeading="Established"
      searchPlaceholder="Search chapters, institutions or slugs"
      emptyMessage="No chapters have been created yet."
      listHeading="All chapters"
    />
  );
}
