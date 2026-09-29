"use client";

import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

import { ContentModule } from "@/components/admin/ContentModule";

export const Route = createFileRoute("/admin/_layout/blog")({
  component: BlogPage,
  head: () => ({
    meta: [{ title: "Blog · Admin · CMDA Nigeria" }],
  }),
});

function BlogPage() {
  return (
    <ContentModule
      module="news"
      studioType="post"
      title="Blog"
      description="Long-form articles written by members of the fellowship."
      icon={BookOpen}
      permission="news.read"
      dateHeading="Published"
      searchPlaceholder="Search article headlines or categories"
      emptyMessage="No blog articles have been created yet."
      listHeading="All articles"
      noun="article"
      kindFilter="article"
    />
  );
}
