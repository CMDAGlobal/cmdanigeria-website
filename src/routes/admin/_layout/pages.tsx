"use client";

import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";

import { ContentModule } from "@/components/admin/ContentModule";
import { WebsitePages } from "@/components/admin/WebsitePages";

export const Route = createFileRoute("/admin/_layout/pages")({
  component: PagesPage,
  head: () => ({
    meta: [{ title: "Website Pages · Admin · CMDA Nigeria" }],
  }),
});

function PagesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">Website Pages</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Every public route and its edit target, plus the full CMS page documents.
        </p>
      </div>
      <WebsitePages />
      <ContentModule
        module="pages"
        studioType="page"
        title="Page documents"
        description="CMS page documents backing /$slug routes — publication lifecycle and sections."
        icon={FileText}
        permission="pages.read"
        searchPlaceholder="Search page titles, paths or sections"
        emptyMessage="No pages have been created yet."
        listHeading="All page documents"
        noun="page"
      />
    </div>
  );
}
