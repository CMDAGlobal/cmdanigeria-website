"use client";

import { createFileRoute } from "@tanstack/react-router";
import { HeartHandshake } from "lucide-react";

import { ModulePlaceholder } from "@/components/admin/ModulePlaceholder";

export const Route = createFileRoute("/admin/_layout/outreaches")({
  component: OutreachesModulePage,
  head: () => ({
    meta: [{ title: "Outreaches · Admin · CMDA Nigeria" }],
  }),
});

function OutreachesModulePage() {
  return (
    <ModulePlaceholder
      title="Outreaches"
      description="Coordinate community outreaches and humanitarian campaigns across the association."
      icon={HeartHandshake}
      permission="outreaches.read"
    />
  );
}
