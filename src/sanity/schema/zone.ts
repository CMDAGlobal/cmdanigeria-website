import { defineArrayMember, defineField, defineType } from "sanity";
import { galleryImage, statItem } from "./objects";

export const zone = defineType({
  name: "zone",
  title: "Zone",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
  ],
  fields: [
    defineField({ name: "name", title: "Zone name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "eyebrow", title: "Eyebrow text", type: "string" }),
    defineField({ name: "tagline", title: "Hero title", type: "string" }),
    defineField({ name: "intro", title: "Hero intro", type: "text" }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      group: "content",
    }),
    defineField({
      name: "countries",
      title: "Countries / states",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "content",
    }),
    defineField({
      name: "stats",
      title: "Statistics",
      type: "array",
      of: [defineArrayMember({ type: "statItem" })],
      group: "content",
    }),
    defineField({
      name: "gallery",
      title: "Photo / media gallery",
      type: "array",
      of: [defineArrayMember({ type: galleryImage.name })],
      group: "media",
    }),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "name", subtitle: "tagline" } },
});

export default zone;