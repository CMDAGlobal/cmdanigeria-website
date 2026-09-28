import { defineField } from "sanity";

export const PUBLICATION_STATUSES = [
  { title: "Draft", value: "draft" },
  { title: "Published", value: "published" },
  { title: "Scheduled", value: "scheduled" },
  { title: "Archived", value: "archived" },
] as const;

export type PublicationStatus = "draft" | "published" | "scheduled" | "archived";

export const publicationField = defineField({
  name: "publication",
  title: "Publication status",
  description: "Draft and Archived are hidden from the public site. Scheduled goes live at the time below.",
  type: "string",
  options: { list: [...PUBLICATION_STATUSES], layout: "radio" },
  initialValue: "draft",
});

export const publishAtField = defineField({
  name: "publishAt",
  title: "Publish at",
  description: "Used when the status is Scheduled — the item appears publicly at this time.",
  type: "datetime",
  hidden: ({ parent }) =>
    (parent as { publication?: string } | undefined)?.publication !== "scheduled",
});

export const publicationFields = [publicationField, publishAtField];
