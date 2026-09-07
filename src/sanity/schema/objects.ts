import { defineArrayMember, defineField, defineType } from "sanity";

export const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery image",
  type: "object",
  fields: [
    defineField({ name: "image", type: "image", title: "Image", options: { hotspot: true } }),
    defineField({ name: "caption", type: "string", title: "Caption" }),
    defineField({ name: "alt", type: "string", title: "Alt text" }),
  ],
  preview: {
    select: { media: "image", title: "caption" },
  },
});

export const statItem = defineType({
  name: "statItem",
  title: "Statistic",
  type: "object",
  fields: [
    defineField({ name: "value", type: "string", title: "Value (e.g. 40, 9,700+)" }),
    defineField({ name: "label", type: "string", title: "Label" }),
  ],
  preview: {
    select: { title: "value", subtitle: "label" },
  },
});

export const contactInfo = defineType({
  name: "contactInfo",
  title: "Contact information",
  type: "object",
  fields: [
    defineField({ name: "email", type: "string", title: "Email" }),
    defineField({ name: "phone", type: "string", title: "Phone" }),
    defineField({ name: "address", type: "string", title: "Address" }),
  ],
});

export const newsletterItem = defineType({
  name: "newsletterItem",
  title: "Newsletter / publication",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", title: "Title" }),
    defineField({ name: "description", type: "text", title: "Description" }),
    defineField({ name: "url", type: "url", title: "External link" }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});

export const socialLinks = defineType({
  name: "socialLinks",
  title: "Social links",
  type: "object",
  fields: ["instagram", "x", "facebook", "whatsapp"].map((name) =>
    defineField({ name, type: "url", title: name.charAt(0).toUpperCase() + name.slice(1) }),
  ),
});

export const armField = defineField({
  name: "arm",
  title: "Arm",
  type: "string",
  options: {
    list: [
      { title: "Global Network", value: "global" },
      { title: "Students' Arm", value: "students" },
      { title: "Doctors' Arm", value: "doctors" },
    ],
    layout: "radio",
  },
  initialValue: "global",
});