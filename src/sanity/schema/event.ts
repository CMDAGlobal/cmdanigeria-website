import { defineArrayMember, defineField, defineType } from "sanity";
import { armField, galleryImage } from "./objects";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  groups: [{ name: "content", title: "Content", default: true }],
  fields: [
    defineField({ name: "title", title: "Event title", type: "string", validation: (r) => r.required() }),
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
    defineField({ name: "startDate", title: "Start date & time", type: "datetime", validation: (r) => r.required() }),
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
    defineField({ name: "report", title: "Event report / recap", type: "text" }),
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
    select: { title: "title", subtitle: "startDate" },
  },
});

export default event;