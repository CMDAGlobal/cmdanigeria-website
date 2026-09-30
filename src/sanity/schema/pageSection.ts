import { defineArrayMember, defineField, defineType } from "sanity";
import { galleryImage } from "./objects";

/**
 * A page section is an ordered, individually hideable block of page content.
 * Array order in Studio is the render order (drag to reorder), and `visible`
 * lets an editor publish an unfinished section without deleting it.
 */
const visibilityField = defineField({
  name: "visible",
  title: "Show this section",
  description: "Untick to hide the section on the live page without deleting it.",
  type: "boolean",
  initialValue: true,
});

const sectionListItem = defineArrayMember({
  name: "items",
  title: "Items",
  type: "array",
  of: [
    defineArrayMember({
      name: "stat",
      title: "Stat",
      type: "object",
      fields: [
        defineField({ name: "value", title: "Value", type: "string" }),
        defineField({ name: "label", title: "Label", type: "string" }),
      ],
      preview: {
        select: { title: "value", subtitle: "label" },
        prepare: ({ title, subtitle }) => ({ title: title || "—", subtitle }),
      },
    }),
  ],
});

const commonFields = (group = "content") => [
  defineField({ name: "internalName", title: "Internal label", type: "string", group }),
  defineField({
    name: "eyebrow",
    title: "Eyebrow",
    description: "Small kicker above the heading, e.g. “Our story”.",
    type: "string",
  }),
  defineField({ name: "heading", title: "Heading", type: "string" }),
  defineField({
    name: "body",
    title: "Body",
    type: "array",
    of: [defineArrayMember({ type: "block" })],
  }),
  visibilityField,
];

const ctaFields = [
  defineField({ name: "ctaLabel", title: "Button label", type: "string" }),
  defineField({ name: "ctaHref", title: "Button link", type: "string" }),
];

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  fields: [
    ...commonFields(),
    defineField({
      name: "backgroundImage",
      title: "Background image",
      type: "image",
      options: { hotspot: true },
    }),
    ...ctaFields,
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "internalName",
      media: "backgroundImage",
      visible: "visible",
    },
    prepare: ({ title, subtitle, media, visible }) => ({
      title: title || "Hero",
      subtitle: visible === false ? `${subtitle ?? ""} (hidden)`.trim() : subtitle,
      media,
    }),
  },
});

export const richTextSection = defineType({
  name: "richTextSection",
  title: "Text",
  type: "object",
  fields: [
    ...commonFields(),
    defineField({ name: "width", title: "Narrow column", type: "boolean" }),
  ],
  preview: {
    select: { title: "heading", subtitle: "internalName", visible: "visible" },
    prepare: ({ title, subtitle, visible }) => ({
      title: title || "Text",
      subtitle: visible === false ? `${subtitle ?? ""} (hidden)`.trim() : subtitle,
    }),
  },
});

export const imageTextSection = defineType({
  name: "imageTextSection",
  title: "Image + text",
  type: "object",
  fields: [
    ...commonFields(),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "imageSide",
      title: "Image side",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
        ],
      },
      initialValue: "right",
    }),
    defineField({ name: "imageAlt", title: "Image alt text", type: "string" }),
    defineField({ name: "imageCaption", title: "Image caption", type: "string" }),
    ...ctaFields,
  ],
  preview: {
    select: { title: "heading", subtitle: "internalName", media: "image", visible: "visible" },
    prepare: ({ title, subtitle, media, visible }) => ({
      title: title || "Image + text",
      subtitle: visible === false ? `${subtitle ?? ""} (hidden)`.trim() : subtitle,
      media,
    }),
  },
});

export const statsSection = defineType({
  name: "statsSection",
  title: "Statistics",
  type: "object",
  fields: [
    ...commonFields(),
    defineField({
      name: "autoFill",
      title: "Fill from live data",
      description:
        "Show real counts from the CMS (chapters, members, zones) instead of typing numbers.",
      type: "boolean",
      initialValue: false,
    }),
    sectionListItem,
  ],
  preview: {
    select: { title: "heading", subtitle: "internalName", visible: "visible" },
    prepare: ({ title, subtitle, visible }) => ({
      title: title || "Statistics",
      subtitle: visible === false ? `${subtitle ?? ""} (hidden)`.trim() : subtitle,
    }),
  },
});

export const gallerySection = defineType({
  name: "gallerySection",
  title: "Gallery",
  type: "object",
  fields: [
    ...commonFields(),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [defineArrayMember({ type: galleryImage.name })],
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "internalName", media: "images.0", visible: "visible" },
    prepare: ({ title, subtitle, media, visible }) => ({
      title: title || "Gallery",
      subtitle: visible === false ? `${subtitle ?? ""} (hidden)`.trim() : subtitle,
      media,
    }),
  },
});

export const videoSection = defineType({
  name: "videoSection",
  title: "Video",
  type: "object",
  fields: [
    ...commonFields(),
    defineField({
      name: "provider",
      title: "Provider",
      type: "string",
      options: {
        list: [
          { title: "YouTube", value: "youtube" },
          { title: "Vimeo", value: "vimeo" },
        ],
      },
      initialValue: "youtube",
    }),
    defineField({
      name: "videoId",
      title: "Video ID or URL",
      description: "Paste the YouTube/Vimeo URL, or just the ID. Both work.",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "poster",
      title: "Poster image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
  ],
  preview: {
    select: { title: "heading", subtitle: "videoId", media: "poster", visible: "visible" },
    prepare: ({ title, subtitle, media, visible }) => ({
      title: title || "Video",
      subtitle: visible === false ? `${subtitle ?? ""} (hidden)`.trim() : subtitle,
      media,
    }),
  },
});

export const ctaSection = defineType({
  name: "ctaSection",
  title: "Call to action",
  type: "object",
  fields: [
    ...commonFields(),
    ...ctaFields,
    defineField({
      name: "tone",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Muted", value: "muted" },
        ],
      },
      initialValue: "primary",
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "internalName", visible: "visible" },
    prepare: ({ title, subtitle, visible }) => ({
      title: title || "Call to action",
      subtitle: visible === false ? `${subtitle ?? ""} (hidden)`.trim() : subtitle,
    }),
  },
});

/** Registered in document order; Studio's array order drives the page order. */
export const PAGE_SECTION_TYPES = [
  heroSection,
  richTextSection,
  imageTextSection,
  statsSection,
  gallerySection,
  videoSection,
  ctaSection,
];
