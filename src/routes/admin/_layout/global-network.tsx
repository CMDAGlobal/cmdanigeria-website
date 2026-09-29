"use client";

import { createFileRoute } from "@tanstack/react-router";
import { Globe2 } from "lucide-react";

import { ContentModule } from "@/components/admin/ContentModule";

export const Route = createFileRoute("/admin/_layout/global-network")({
  component: GlobalNetworkPage,
  head: () => ({
    meta: [{ title: "Global Network · Admin · CMDA Nigeria" }],
  }),
});

function GlobalNetworkPage() {
  return (
    <ContentModule
      module="regions"
      studioType="region"
      title="Global Network"
      description="The regions CMDA Nigeria works with, with their countries, mission and focus areas."
      icon={Globe2}
      permission="regions.read"
      searchPlaceholder="Search regions, countries or slugs"
      emptyMessage="No regions have been created yet."
      listHeading="All regions"
      noun="region"
    />
  );
}
