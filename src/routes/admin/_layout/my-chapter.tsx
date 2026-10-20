"use client";

import { createFileRoute } from "@tanstack/react-router";

import { MyChapterWorkspace } from "@/components/admin/MyChapterWorkspace";

export const Route = createFileRoute("/admin/_layout/my-chapter")({
  component: MyChapterPage,
  head: () => ({
    meta: [{ title: "My Chapter · Admin · CMDA Nigeria" }],
  }),
});

function MyChapterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">My Chapter</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your chapter's public page, content and membership statistics.
        </p>
      </div>
      <MyChapterWorkspace />
    </div>
  );
}
