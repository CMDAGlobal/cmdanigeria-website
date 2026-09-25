import { defineArrayMember, defineField, defineType } from "sanity";
import { armField, galleryImage } from "./objects";

const KINDS = [
  { title: "Article", value: "article" },
  { title: "Press release", value: "press_release" },
  { title: "Public statement", value: "statement" },
  { title: "Media coverage", value: "coverage" },
  { title: "Video", value: "video" },
];

export const post = defineType({
  name: "post",
  title: "News item",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "distribution", title: "Distribution" },
    { name: "media", title: "Media" },
  ],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "kind",
      title: "Item type",
      type: "string",
      options: { list: KINDS, layout: "radio" },
      initialValue: "article",
      validation: (r) => r.required(),
    }),
    defineField(armField),
    defineField({ name: "category", title: "Category", type: "string" }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "publishedAt",
      title: "Published date & time",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "draft",
      title: "Draft (hide from public)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "featured",
      title: "Feature on homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "person" }],
    }),
    defineField({
      name: "regions",
      title: "Related region(s)",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "region" }] })],
      hidden: ({ parent }) => (parent as { arm?: string } | undefined)?.arm !== "global",
      group: "distribution",
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
      group: "distribution",
    }),
    defineField({
      name: "chapters",
      title: "Related chapter(s)",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "chapter" }] })],
      group: "distribution",
    }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3, group: "content" }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      group: "content",
    }),
    defineField({ name: "link", title: "External link", type: "url", group: "content" }),
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
    select: { title: "title", subtitle: "kind", media: "coverImage" },
  },
});

export default post;
