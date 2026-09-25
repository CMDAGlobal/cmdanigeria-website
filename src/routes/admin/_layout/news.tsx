"use client";

import { createFileRoute } from "@tanstack/react-router";
import { Newspaper } from "lucide-react";

import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export const Route = createFileRoute("/admin/_layout/news")({
  component: NewsModulePage,
  head: () => ({
    meta: [{ title: "News · Admin · CMDA Nigeria" }],
  }),
});

function NewsModulePage() {
  return (
    <ModulePlaceholder
      title="News"
      description="Publish and manage news articles and updates for the CMDA Nigeria website."
      icon={Newspaper}
      permission="news.read"
    />
  );
}
