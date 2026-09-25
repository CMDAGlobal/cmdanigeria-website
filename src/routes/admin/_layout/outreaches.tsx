"use client";

import { createFileRoute } from "@tanstack/react-router";
import { HeartHandshake } from "lucide-react";

import { ContentModule } from "@/components/admin/ContentModule";

export const Route = createFileRoute("/admin/_layout/outreaches")({
  component: OutreachesPage,
  head: () => ({
    meta: [{ title: "Outreaches · Admin · CMDA Nigeria" }],
  }),
});

function OutreachesPage() {
  return (
    <ContentModule
      module="outreaches"
      studioType="outreach"
      title="Outreaches"
      description="Outreach campaigns, community health work and partner-led missions."
      icon={HeartHandshake}
      permission="outreaches.read"
      dateHeading="Starts"
      searchPlaceholder="Search campaigns, partners or locations"
      emptyMessage="No outreach campaigns have been created yet."
      listHeading="All campaigns"
    />
  );
}
