"use client";

import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";

import { ContentModule } from "@/components/admin/ContentModule";

export const Route = createFileRoute("/admin/_layout/events")({
  component: EventsPage,
  head: () => ({
    meta: [{ title: "Events · Admin · CMDA Nigeria" }],
  }),
});

function EventsPage() {
  return (
    <ContentModule
      module="events"
      studioType="event"
      title="Events"
      description="Conferences, fellowships, training and outreach activities across the network."
      icon={CalendarDays}
      permission="events.read"
      dateHeading="Starts"
      searchPlaceholder="Search events, venues or slugs"
      emptyMessage="No events have been scheduled yet."
      listHeading="All events"
    />
  );
}
