"use client";

import { createFileRoute } from "@tanstack/react-router";
import { UsersRound } from "lucide-react";

import { ContentModule } from "@/components/admin/ContentModule";

export const Route = createFileRoute("/admin/_layout/leadership")({
  component: LeadershipPage,
  head: () => ({
    meta: [{ title: "Leadership · Admin · CMDA Nigeria" }],
  }),
});

function LeadershipPage() {
  return (
    <ContentModule
      module="leadership"
      studioType="person"
      title="Leadership"
      description="Leaders shown on chapter, zone, region and national pages — names, positions and photos."
      icon={UsersRound}
      permission="leaders.read"
      searchPlaceholder="Search names, positions or chapters"
      emptyMessage="No leaders have been added yet."
      listHeading="All leaders"
      noun="leader"
    />
  );
}
