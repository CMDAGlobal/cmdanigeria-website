import { defineArrayMember, defineField, defineType } from "sanity";
import { armField, galleryImage } from "./objects";

export const activity = defineType({
  name: "activity",
  title: "Activity",
  type: "document",
  groups: [{ name: "content", title: "Content", default: true }],
  fields: [
    defineField({ name: "title", title: "Activity title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "type",
      title: "Activity type",
      type: "string",
      options: {
        list: [
          { title: "Outreach", value: "outreach" },
          { title: "Medical mission", value: "mission" },
          { title: "Meeting", value: "meeting" },
          { title: "Conference", value: "conference" },
          { title: "Project", value: "project" },
          { title: "Training", value: "training" },
          { title: "Community health", value: "health" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField(armField),
    defineField({ name: "date", title: "Date / period", type: "date" }),
    defineField({
      name: "regions",
      title: "Related region(s)",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "region" }] })],
      hidden: ({ parent }) => (parent as { arm?: string } | undefined)?.arm !== "global",
    }),
    defineField({
      name: "zones",
      title: "Related zone(s)",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "zone" }] })],
      hidden: ({ parent }) => (parent as { arm?: string } | undefined)?.arm !== "doctors",
    }),
    defineField({
      name: "chapters",
      title: "Related chapter(s)",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "chapter" }] })],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      group: "content",
    }),
    defineField({ name: "outcome", title: "Outcome / result", type: "text" }),
    defineField({
      name: "gallery",
      title: "Photo / media gallery",
      type: "array",
      of: [defineArrayMember({ type: galleryImage.name })],
    }),
  ],
  preview: { select: { title: "title", subtitle: "type" } },
});

export default activity;