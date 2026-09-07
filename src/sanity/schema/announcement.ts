import { defineArrayMember, defineField, defineType } from "sanity";
import { armField } from "./objects";

export const announcement = defineType({
  name: "announcement",
  title: "Announcement",
  type: "document",
  groups: [{ name: "content", title: "Content", default: true }],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField(armField),
    defineField({ name: "category", title: "Category", type: "string" }),
    defineField({ name: "publishedAt", title: "Published date", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "pinned", title: "Pin to top", type: "boolean", initialValue: false }),
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
      name: "body",
      title: "Body",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      validation: (r) => r.required(),
      group: "content",
    }),
    defineField({ name: "link", title: "External link", type: "url" }),
  ],
  preview: { select: { title: "title", subtitle: "publishedAt" } },
});

export default announcement;