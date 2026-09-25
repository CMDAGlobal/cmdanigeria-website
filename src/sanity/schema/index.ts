import type { SchemaTypeDefinition } from "sanity";
import { announcement } from "./announcement";
import { activity } from "./activity";
import { chapter } from "./chapter";
import { event } from "./event";
import { outreach } from "./outreach";
import { page } from "./page";
import { contactInfo, galleryImage, newsletterItem, socialLinks, statItem } from "./objects";
import { person } from "./person";
import { post } from "./post";
import { region } from "./region";
import { zone } from "./zone";

export const schemaTypes: SchemaTypeDefinition[] = [
  person,
  region,
  zone,
  chapter,
  event,
  announcement,
  activity,
  post,
  outreach,
  page,
  galleryImage,
  statItem,
  contactInfo,
  newsletterItem,
  socialLinks,
];
