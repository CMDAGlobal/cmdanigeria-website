"use client";

import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

import { ContentModule } from "@/components/admin/ContentModule";

export const Route = createFileRoute("/admin/_layout/students")({
  component: StudentsArmPage,
  head: () => ({
    meta: [{ title: "Students' Arm · Admin · CMDA Nigeria" }],
  }),
});

function StudentsArmPage() {
  return (
    <ContentModule
      module="chapters"
      studioType="chapter"
      title="Students' Arm"
      description="Every CMDA Nigeria students' chapter, with its institution and location."
      icon={GraduationCap}
      permission="chapters.read"
      dateHeading="Established"
      searchPlaceholder="Search students' chapters or institutions"
      emptyMessage="No students' chapters have been created yet."
      listHeading="Students' chapters"
      noun="chapter"
      initialArm="students"
    />
  );
}
