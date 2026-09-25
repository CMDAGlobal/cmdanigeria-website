"use client";

import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";

import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export const Route = createFileRoute("/admin/_layout/pages")({
  component: PagesModulePage,
  head: () => ({
    meta: [{ title: "Pages · Admin · CMDA Nigeria" }],
  }),
});

function PagesModulePage() {
  return (
    <ModulePlaceholder
      title="Pages"
      description="Edit content for the public-facing pages of the CMDA Nigeria website."
      icon={FileText}
      permission="pages.read"
    />
  );
}
