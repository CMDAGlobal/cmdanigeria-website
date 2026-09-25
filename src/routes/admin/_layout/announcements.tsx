"use client";

import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";

import { ContentModule } from "@/components/admin/ContentModule";

export const Route = createFileRoute("/admin/_layout/announcements")({
  component: AnnouncementsPage,
  head: () => ({
    meta: [{ title: "Announcements · Admin · CMDA Nigeria" }],
  }),
});

function AnnouncementsPage() {
  return (
    <ContentModule
      module="announcements"
      studioType="announcement"
      title="Announcements"
      description="Notices for members, pinned items and time-sensitive circulars."
      icon={Megaphone}
      permission="announcements.read"
      dateHeading="Published"
      searchPlaceholder="Search announcements or categories"
      emptyMessage="No announcements have been posted yet."
      listHeading="All announcements"
    />
  );
}
