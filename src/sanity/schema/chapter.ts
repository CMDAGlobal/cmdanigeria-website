import { defineArrayMember, defineField, defineType } from "sanity";
import {
  armField,
  contactInfo,
  galleryImage,
  resourceItem,
  socialLinks,
  statItem,
} from "./objects";
import { publicationFields } from "./publication";

export const chapter = defineType({
  name: "chapter",
  title: "Chapter",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "people", title: "Leadership" },
    { name: "media", title: "Media" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Chapter name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "institution", title: "Institution / school", type: "string" }),
    defineField({ name: "location", title: "Location (city/state)", type: "string" }),
    defineField({ name: "country", title: "Country", type: "string" }),
    defineField(armField),
    defineField({
      name: "region",
      title: "Region",
      type: "reference",
      to: [{ type: "region" }],
      hidden: ({ parent }) => (parent as { arm?: string } | undefined)?.arm !== "global",
    }),
    defineField({
      name: "zone",
      title: "Zone",
      type: "reference",
      to: [{ type: "zone" }],
      hidden: ({ parent }) => {
        const arm = (parent as { arm?: string } | undefined)?.arm;
        return arm !== "students" && arm !== "doctors";
      },
    }),
    defineField({
      name: "description",
      title: "Chapter description",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      group: "content",
    }),
    defineField({
      name: "history",
      title: "History",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      group: "content",
    }),
    defineField({ name: "mission", title: "Mission / objectives", type: "text", group: "content" }),
    defineField({ name: "establishedAt", title: "Established (date)", type: "date" }),
    defineField({
      name: "logo",
      title: "Chapter logo / photo",
      type: "image",
      options: { hotspot: true },
      group: "media",
    }),
    defineField({
      name: "exco",
      title: "Executive committee",
      description: "Persons whose `memberOfChapter` points at this chapter are shown here.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "person" }] })],
      group: "people",
    }),
    defineField({
      name: "membership",
      title: "Membership statistics",
      type: "array",
      of: [defineArrayMember({ type: statItem.name })],
      group: "content",
    }),
    defineField({
      name: "gallery",
      title: "Photo / media gallery",
      type: "array",
      of: [defineArrayMember({ type: galleryImage.name })],
      group: "media",
    }),
    defineField(contactInfo),
    defineField(socialLinks),
    defineField({
      name: "resources",
      title: "Resources",
      type: "array",
      of: [defineArrayMember({ type: resourceItem.name })],
      group: "content",
    }),
    defineField({
      name: "active",
      title: "Chapter is active",
      description:
        "Deactivated chapters keep their content in the CMS but are hidden from the public site.",
      type: "boolean",
      initialValue: true,
    }),
    ...publicationFields.map((field) => defineField(field)),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "name", subtitle: "institution", media: "logo" },
  },
});

export default chapter;
