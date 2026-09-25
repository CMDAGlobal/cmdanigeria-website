"use client";

import { createFileRoute } from "@tanstack/react-router";
import { Settings2 } from "lucide-react";

import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export const Route = createFileRoute("/admin/_layout/settings")({
  component: SettingsModulePage,
  head: () => ({
    meta: [{ title: "Settings · Admin · CMDA Nigeria" }],
  }),
});

function SettingsModulePage() {
  return (
    <ModulePlaceholder
      title="Settings"
      description="Platform-wide configuration and preferences for the admin console."
      icon={Settings2}
      permission="settings.read"
    />
  );
}
