import { defineArrayMember, defineField, defineType } from "sanity";
import { armField, galleryImage } from "./objects";
import { publicationFields } from "./publication";

const KINDS = [
  { title: "Prescription (newsletter)", value: "prescription" },
  { title: "Newsletter", value: "newsletter" },
  { title: "Journal / report", value: "journal" },
  { title: "Book", value: "book" },
];

export const prescription = defineType({
  name: "prescription",
  title: "Prescription",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "distribution", title: "Distribution" },
    { name: "media", title: "Media" },
    { name: "downloads", title: "Downloads" },
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
      title: "Publication type",
      type: "string",
      options: { list: KINDS, layout: "radio" },
      initialValue: "prescription",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "issueNumber",
      title: "Issue number",
      description: "Shown as “#65” in the archive title and archive filter.",
      type: "number",
      validation: (rule) => rule.integer().min(1),
    }),
    defineField({
      name: "issueDate",
      title: "Issue date",
      description: "Used to order the archive — usually the month the issue went out.",
      type: "date",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      description: "Shown in the issue byline — e.g. “CMDA Nigeria” or the editor's name.",
      type: "string",
      validation: (rule) => rule.max(120),
    }),
    defineField(armField),
    ...publicationFields.map((field) => defineField(field)),
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
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3, group: "content" }),
    defineField({
      name: "body",
      title: "Body",
      description:
        "The full issue, written here in Studio. The dashboard edits the issue details only, so headings, links and inline images are never overwritten.",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative text",
              type: "string",
              validation: (rule) => rule.max(200),
            }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        }),
      ],
      group: "content",
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      group: "media",
    }),
    defineField({
      name: "coverAlt",
      title: "Cover alt text",
      description: "Describes the cover for screen readers and when the image fails to load.",
      type: "string",
      validation: (rule) => rule.max(200),
      group: "media",
    }),
    defineField({
      name: "gallery",
      title: "Photo / media gallery",
      type: "array",
      of: [defineArrayMember({ type: galleryImage.name })],
      group: "media",
    }),
    defineField({
      name: "url",
      title: "Reading link",
      description: "Link to the issue hosted elsewhere. Optional — most issues are read on this site.",
      type: "url",
      group: "downloads",
    }),
    defineField({
      name: "file",
      title: "Issue file",
      description:
        "PDF or document for downloadable issues such as the Wholeness Journal book of abstracts. Optional.",
      type: "file",
      options: { accept: ".pdf,.doc,.docx" },
      group: "downloads",
    }),
  ],
  preview: {
    select: { title: "title", issueNumber: "issueNumber", issueDate: "issueDate", media: "coverImage" },
    prepare({ title, issueNumber, issueDate, media }) {
      const month = issueDate
        ? new Date(issueDate).toLocaleDateString("en-NG", { month: "short", year: "numeric" })
        : "No date";
      return {
        title: title ?? "Untitled issue",
        subtitle: issueNumber ? `#${issueNumber} · ${month}` : month,
        media,
      };
    },
  },
});

export default prescription;
