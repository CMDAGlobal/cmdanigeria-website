import { defineArrayMember, defineField, defineType } from "sanity";
import { armField, galleryImage } from "./objects";

const SECTIONS = [
  { title: "General", value: "general" },
  { title: "About", value: "about" },
  { title: "Membership", value: "membership" },
  { title: "Governance", value: "governance" },
  { title: "Newsroom", value: "newsroom" },
  { title: "Media centre", value: "media" },
  { title: "Contact", value: "contact" },
];

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
    { name: "distribution", title: "Distribution" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description: "Path segment, e.g. about-us. Leave off the leading slash.",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField(armField),
    defineField({
      name: "section",
      title: "Section",
      type: "string",
      options: { list: SECTIONS, layout: "dropdown" },
      initialValue: "general",
    }),
    defineField({
      name: "draft",
      title: "Draft (hide from public)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "regions",
      title: "Applies to region(s)",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "region" }] })],
      hidden: ({ parent }) => (parent as { arm?: string } | undefined)?.arm !== "global",
      group: "distribution",
    }),
    defineField({
      name: "zones",
      title: "Applies to zone(s)",
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
      title: "Applies to chapter(s)",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "chapter" }] })],
      group: "distribution",
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
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      group: "content",
    }),
    defineField({
      name: "gallery",
      title: "Photo / media gallery",
      type: "array",
      of: [defineArrayMember({ type: galleryImage.name })],
      group: "content",
    }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string", group: "seo" }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 2,
      group: "seo",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "section", media: "coverImage" },
  },
});

export default page;
