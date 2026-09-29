"use client";

import { createFileRoute } from "@tanstack/react-router";
import { Stethoscope } from "lucide-react";

import { ContentModule } from "@/components/admin/ContentModule";

export const Route = createFileRoute("/admin/_layout/doctors")({
  component: DoctorsArmPage,
  head: () => ({
    meta: [{ title: "Doctors' Arm · Admin · CMDA Nigeria" }],
  }),
});

function DoctorsArmPage() {
  return (
    <ContentModule
      module="chapters"
      studioType="chapter"
      title="Doctors' Arm"
      description="Every CMDA Nigeria doctors' and dentists' chapter, with its institution and location."
      icon={Stethoscope}
      permission="chapters.read"
      dateHeading="Established"
      searchPlaceholder="Search doctors' chapters or institutions"
      emptyMessage="No doctors' chapters have been created yet."
      listHeading="Doctors' chapters"
      noun="chapter"
      initialArm="doctors"
    />
  );
}
