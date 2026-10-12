import { defineArrayMember, defineField, defineType } from "sanity";
import { armField, galleryImage } from "./objects";
import { publicationFields } from "./publication";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  groups: [{ name: "content", title: "Content", default: true }],
  fields: [
    defineField({
      name: "title",
      title: "Event title",
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
    defineField({
      name: "type",
      title: "Event type",
      type: "string",
      options: {
        list: [
          { title: "Conference", value: "conference" },
          { title: "Fellowship", value: "fellowship" },
          { title: "Prayer", value: "prayer" },
          { title: "Training", value: "training" },
          { title: "Outreach / mission", value: "outreach" },
          { title: "Retreat", value: "retreat" },
          { title: "Webinar", value: "webinar" },
          { title: "Meeting", value: "meeting" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField(armField),
    ...publicationFields.map((field) => defineField(field)),
    defineField({
      name: "startDate",
      title: "Start date & time",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({ name: "endDate", title: "End date & time", type: "datetime" }),
    defineField({ name: "venue", title: "Venue", type: "string" }),
    defineField({ name: "location", title: "Location (city/state/country)", type: "string" }),
    defineField({
      name: "mode",
      title: "Mode",
      type: "string",
      options: {
        list: [
          { title: "In-person", value: "inperson" },
          { title: "Virtual", value: "virtual" },
          { title: "Hybrid", value: "hybrid" },
        ],
        layout: "radio",
      },
    }),
    defineField({ name: "registrationUrl", title: "Registration link", type: "url" }),
    defineField({ name: "organizer", title: "Organizer", type: "string" }),
    defineField({
      name: "featured",
      title: "Featured event",
      description: "Show this event ahead of others in listings.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "report", title: "Event report / recap", type: "text" }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "coverAlt", title: "Cover image alt text", type: "string" }),
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
      hidden: ({ parent }) => {
        const arm = (parent as { arm?: string } | undefined)?.arm;
        return arm !== "students" && arm !== "doctors";
      },
    }),
    defineField({
      name: "chapters",
      title: "Related chapter(s)",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "chapter" }] })],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      group: "content",
    }),
    defineField({
      name: "gallery",
      title: "Photo / media gallery",
      type: "array",
      of: [defineArrayMember({ type: galleryImage.name })],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "startDate", media: "coverImage" },
  },
});

export default event;
