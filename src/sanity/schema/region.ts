import { defineArrayMember, defineField, defineType } from "sanity";
import {
  contactInfo,
  galleryImage,
  newsletterItem,
  resourceItem,
  socialLinks,
  statItem,
} from "./objects";
import { publicationFields } from "./publication";

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
    defineField({
      name: "name",
      title: "Region name",
      type: "string",
      validation: (r) => r.required(),
    }),
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
      name: "history",
      title: "History",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      group: "content",
    }),
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
    defineField({ ...contactInfo, group: "content" }),
    defineField({ ...socialLinks, group: "content" }),
    defineField({
      name: "resources",
      title: "Resources",
      type: "array",
      of: [defineArrayMember({ type: resourceItem.name })],
      group: "content",
    }),
    defineField({
      name: "active",
      title: "Region is active",
      description:
        "Deactivated regions keep their content in the CMS but are hidden from the public site.",
      type: "boolean",
      initialValue: true,
    }),
    ...publicationFields.map((field) => defineField(field)),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      initialValue: 0,
      group: "content",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "intro", media: "heroImage" },
  },
});

export default region;
