"use client";

import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";

import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export const Route = createFileRoute("/admin/_layout/events")({
  component: EventsModulePage,
  head: () => ({
    meta: [{ title: "Events · Admin · CMDA Nigeria" }],
  }),
});

function EventsModulePage() {
  return (
    <ModulePlaceholder
      title="Events"
      description="Create and manage events across CMDA Nigeria’s arms and chapters."
      icon={CalendarDays}
      permission="events.read"
    />
  );
}
