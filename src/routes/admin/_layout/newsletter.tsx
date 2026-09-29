"use client";

import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";

import { ContentModule } from "@/components/admin/ContentModule";

export const Route = createFileRoute("/admin/_layout/newsletter")({
  component: NewsletterPage,
  head: () => ({
    meta: [{ title: "Newsletter · Admin · CMDA Nigeria" }],
  }),
});

function NewsletterPage() {
  return (
    <ContentModule
      module="publications"
      studioType="prescription"
      title="Newsletter"
      description="The Prescription newsletter and every other issue, report or book in the public archive."
      icon={Mail}
      permission="publications.read"
      dateHeading="Issue date"
      searchPlaceholder="Search issue titles or slugs"
      emptyMessage="No publications have been created yet."
      listHeading="All issues"
      noun="issue"
    />
  );
}
