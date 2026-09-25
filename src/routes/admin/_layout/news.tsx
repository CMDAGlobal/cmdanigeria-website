"use client";

import { createFileRoute } from "@tanstack/react-router";
import { Newspaper } from "lucide-react";

import { ContentModule } from "@/components/admin/ContentModule";

export const Route = createFileRoute("/admin/_layout/news")({
  component: NewsPage,
  head: () => ({
    meta: [{ title: "News · Admin · CMDA Nigeria" }],
  }),
});

function NewsPage() {
  return (
    <ContentModule
      module="news"
      studioType="post"
      title="News"
      description="Articles, press releases, public statements and media coverage for the newsroom."
      icon={Newspaper}
      permission="news.read"
      dateHeading="Published"
      searchPlaceholder="Search headlines, categories or slugs"
      emptyMessage="No news items have been published yet."
      listHeading="All news items"
    />
  );
}
