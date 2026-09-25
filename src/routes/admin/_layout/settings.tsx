"use client";

import { createFileRoute } from "@tanstack/react-router";

import { AdminSettings } from "@/components/admin/AdminSettings";

export const Route = createFileRoute("/admin/_layout/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [{ title: "Settings · Admin · CMDA Nigeria" }],
  }),
});

function SettingsPage() {
  return <AdminSettings />;
}
