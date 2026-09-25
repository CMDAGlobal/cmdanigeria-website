import { defineArrayMember, defineField, defineType } from "sanity";
import { armField, galleryImage } from "./objects";

const STATUSES = [
  { title: "Planned", value: "planned" },
  { title: "Active", value: "active" },
  { title: "Completed", value: "completed" },
  { title: "Cancelled", value: "cancelled" },
];

export const outreach = defineType({
  name: "outreach",
  title: "Outreach",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "delivery", title: "Delivery" },
    { name: "media", title: "Media" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Campaign title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField(armField),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: STATUSES, layout: "radio" },
      initialValue: "planned",
    }),
    defineField({ name: "startsAt", title: "Start date & time", type: "datetime" }),
    defineField({ name: "endsAt", title: "End date & time", type: "datetime" }),
    defineField({ name: "location", title: "Location (city/state/country)", type: "string" }),
    defineField({ name: "partner", title: "Partner organisation", type: "string" }),
    defineField({ name: "contact", title: "Contact person", type: "string" }),
    defineField({
      name: "goal",
      title: "Goal",
      type: "string",
      description: "Short statement of the intended outcome.",
    }),
    defineField({
      name: "regions",
      title: "Related region(s)",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "region" }] })],
      hidden: ({ parent }) => (parent as { arm?: string } | undefined)?.arm !== "global",
      group: "delivery",
    }),
    defineField({
      name: "zones",
      title: "Related zone(s)",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "zone" }] })],
      hidden: ({ parent }) => {
        const arm = (parent as { arm?: string } | undefined)?.arm;
        return arm !== "students" && arm !== "doctors";
      },
      group: "delivery",
    }),
    defineField({
      name: "chapters",
      title: "Related chapter(s)",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "chapter" }] })],
      group: "delivery",
    }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3, group: "content" }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      group: "content",
    }),
    defineField({
      name: "registrationUrl",
      title: "Registration / donate link",
      type: "url",
      group: "content",
    }),
    defineField({ name: "report", title: "Outcome report", type: "text", group: "content" }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      group: "media",
    }),
    defineField({
      name: "gallery",
      title: "Photo / media gallery",
      type: "array",
      of: [defineArrayMember({ type: galleryImage.name })],
      group: "media",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "status", media: "coverImage" },
  },
});

export default outreach;
