"use client";

import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";

import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export const Route = createFileRoute("/admin/_layout/chapters")({
  component: ChaptersModulePage,
  head: () => ({
    meta: [{ title: "Chapters · Admin · CMDA Nigeria" }],
  }),
});

function ChaptersModulePage() {
  return (
    <ModulePlaceholder
      title="Chapters"
      description="Manage CMDA Nigeria chapters, their leaders and chapter-level content."
      icon={Building2}
      permission="chapters.read"
    />
  );
}
