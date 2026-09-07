import { defineArrayMember, defineField, defineType } from "sanity";
import { galleryImage, newsletterItem, statItem } from "./objects";

export const region = defineType({
  name: "region",
  title: "Region",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "people", title: "Leadership" },
    { name: "media", title: "Media" },
  ],
  fields: [
    defineField({ name: "name", title: "Region name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
      group: "content",
    }),
    defineField({ name: "eyebrow", title: "Eyebrow text (hero)", type: "string" }),
    defineField({ name: "tagline", title: "Hero title", type: "string" }),
    defineField({ name: "intro", title: "Hero intro", type: "text" }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      group: "media",
    }),
    defineField({
      name: "countries",
      title: "Countries covered",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "content",
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      group: "content",
    }),
    defineField({ name: "mission", title: "Mission", type: "text", group: "content" }),
    defineField({
      name: "focus",
      title: "Focus areas",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "content",
    }),
    defineField({
      name: "stats",
      title: "Statistics",
      type: "array",
      of: [defineArrayMember({ type: statItem.name })],
      group: "content",
    }),
    defineField({
      name: "newsletters",
      title: "Newsletters / publications",
      type: "array",
      of: [defineArrayMember({ type: newsletterItem.name })],
      group: "content",
    }),
    defineField({
      name: "gallery",
      title: "Photo / media gallery",
      type: "array",
      of: [defineArrayMember({ type: galleryImage.name })],
      group: "media",
    }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 0, group: "content" }),
  ],
  preview: {
    select: { title: "name", subtitle: "intro", media: "heroImage" },
  },
});

export default region;