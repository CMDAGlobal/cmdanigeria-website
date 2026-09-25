"use client";

import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";

import { ContentModule } from "@/components/admin/ContentModule";

export const Route = createFileRoute("/admin/_layout/pages")({
  component: PagesPage,
  head: () => ({
    meta: [{ title: "Pages · Admin · CMDA Nigeria" }],
  }),
});

function PagesPage() {
  return (
    <ContentModule
      module="pages"
      studioType="page"
      title="Pages"
      description="Standalone page content, its section and whether it is published."
      icon={FileText}
      permission="pages.read"
      searchPlaceholder="Search page titles, paths or sections"
      emptyMessage="No pages have been created yet."
      listHeading="All pages"
    />
  );
}
