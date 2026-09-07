import { defineArrayMember, defineField, defineType } from "sanity";
import { armField, contactInfo, socialLinks } from "./objects";

export const person = defineType({
  name: "person",
  title: "Person / Leader",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Full name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "headshot", title: "Headshot", type: "image", options: { hotspot: true } }),
    defineField({ name: "position", title: "Position / title", type: "string" }),
    defineField({ name: "chapterRole", title: "Chapter role (e.g. President, Secretary)", type: "string" }),
    defineField({
      name: "isNational",
      title: "National / NEC member",
      description: "Shows this person in the National Executive Committee (NEC) section of their arm.",
      type: "boolean",
      initialValue: false,
      hidden: ({ parent }) => {
        const arm = (parent as { arm?: string } | undefined)?.arm;
        return arm !== "students" && arm !== "doctors";
      },
    }),
    defineField({ name: "institution", title: "Institution", type: "string" }),
    defineField({ name: "chapter", title: "Chapter", type: "string" }),
    defineField({ name: "country", title: "Country / State", type: "string" }),
    defineField({ name: "bio", title: "Short bio", type: "text" }),
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
      name: "memberOfChapter",
      title: "Member of chapter",
      type: "reference",
      to: [{ type: "chapter" }],
    }),
    defineField(contactInfo),
    defineField(socialLinks),
    defineField({ name: "order", title: "Display order", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "name", media: "headshot", subtitle: "position" },
  },
});

export default person;