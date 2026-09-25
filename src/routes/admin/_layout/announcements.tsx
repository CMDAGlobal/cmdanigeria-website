"use client";

import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";

import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export const Route = createFileRoute("/admin/_layout/announcements")({
  component: AnnouncementsModulePage,
  head: () => ({
    meta: [{ title: "Announcements · Admin · CMDA Nigeria" }],
  }),
});

function AnnouncementsModulePage() {
  return (
    <ModulePlaceholder
      title="Announcements"
      description="Share time-sensitive notices and communications with chapters and arms."
      icon={Megaphone}
      permission="announcements.read"
    />
  );
}
