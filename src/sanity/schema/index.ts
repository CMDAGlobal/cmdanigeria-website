import type { SchemaTypeDefinition } from "sanity";
import { announcement } from "./announcement";
import { activity } from "./activity";
import { chapter } from "./chapter";
import { event } from "./event";
import { outreach } from "./outreach";
import { page } from "./page";
import { PAGE_SECTION_TYPES } from "./pageSection";
import {
  contactInfo,
  galleryImage,
  newsletterItem,
  resourceItem,
  socialLinks,
  statItem,
} from "./objects";
import { person } from "./person";
import { post } from "./post";
import { prescription } from "./prescription";
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
  prescription,
  outreach,
  page,
  ...PAGE_SECTION_TYPES,
  galleryImage,
  statItem,
  contactInfo,
  newsletterItem,
  resourceItem,
  socialLinks,
];
