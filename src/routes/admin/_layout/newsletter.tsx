"use client";

import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";

import { ContentModule } from "@/components/admin/ContentModule";
import { useAdminSession } from "@/components/admin/admin-session";
import { isChapterDashboard } from "@/components/admin/nav-items";

export const Route = createFileRoute("/admin/_layout/newsletter")({
  component: NewsletterPage,
  head: () => ({
    meta: [{ title: "Newsletter · Admin · CMDA Nigeria" }],
  }),
});

function NewsletterPage() {
  const session = useAdminSession();
  const chapterOnly = isChapterDashboard(session.data);

  return (
    <ContentModule
      module="publications"
      studioType="prescription"
      title="Newsletter"
      description={
        chapterOnly
          ? "Your chapter's newsletter — write, edit and publish issues for your chapter."
          : "The Prescription newsletter and every other issue, report or book in the public archive."
      }
      icon={Mail}
      permission="publications.read"
      dateHeading="Issue date"
      searchPlaceholder="Search issue titles or slugs"
      emptyMessage={
        chapterOnly
          ? "You haven't created a newsletter issue yet."
          : "No publications have been created yet."
      }
      listHeading={chapterOnly ? "Your chapter's issues" : "All issues"}
      noun="issue"
    />
  );
}
