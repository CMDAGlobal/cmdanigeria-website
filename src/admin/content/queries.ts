import type { ContentModuleKey } from "./types";

export const CONTENT_QUERIES: Record<ContentModuleKey, string> = {
  chapters: `*[_type == "chapter" && !(_id in path("drafts.**"))] | order(order asc, name asc) {
    "id": _id,
    "title": name,
    "slug": slug.current,
    arm,
    "subtitle": institution,
    "date": establishedAt,
    active,
    "region": region->slug.current,
    "zone": zone->slug.current
  }`,
  regions: `*[_type == "region" && !(_id in path("drafts.**"))] | order(order asc, name asc) {
    "id": _id,
    "title": name,
    "slug": slug.current,
    arm,
    countries,
    "subtitle": tagline,
    intro,
    active
  }`,
  events: `*[_type == "event" && !(_id in path("drafts.**"))] | order(startDate desc) {
    "id": _id,
    title,
    "slug": slug.current,
    arm,
    publication,
    publishAt,
    type,
    startDate,
    mode,
    venue,
    location,
    "regions": regions[]->slug.current,
    "zones": zones[]->slug.current,
    "chapters": chapters[]->slug.current
  }`,
  announcements: `*[_type == "announcement" && !(_id in path("drafts.**"))] | order(pinned desc, publishedAt desc) {
    "id": _id,
    title,
    "slug": slug.current,
    arm,
    publication,
    publishAt,
    category,
    publishedAt,
    pinned,
    "regions": regions[]->slug.current,
    "zones": zones[]->slug.current,
    "chapters": chapters[]->slug.current
  }`,
  news: `*[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    "id": _id,
    title,
    "slug": slug.current,
    arm,
    publication,
    publishAt,
    kind,
    category,
    tags,
    publishedAt,
    draft,
    featured,
    "regions": regions[]->slug.current,
    "zones": zones[]->slug.current,
    "chapters": chapters[]->slug.current
  }`,
  publications: `*[_type == "prescription" && !(_id in path("drafts.**"))] | order(issueDate desc, title asc) {
    "id": _id,
    title,
    "slug": slug.current,
    arm,
    publication,
    publishAt,
    kind,
    issueNumber,
    issueDate,
    author,
    summary,
    url,
    "regions": regions[]->slug.current,
    "zones": zones[]->slug.current,
    "chapters": chapters[]->slug.current
  }`,
  outreaches: `*[_type == "outreach" && !(_id in path("drafts.**"))] | order(coalesce(startsAt, _createdAt) desc) {
    "id": _id,
    title,
    "slug": slug.current,
    arm,
    publication,
    publishAt,
    status,
    startsAt,
    location,
    partner,
    "regions": regions[]->slug.current,
    "zones": zones[]->slug.current,
    "chapters": chapters[]->slug.current
  }`,
  pages: `*[_type == "page" && !(_id in path("drafts.**"))] | order(title asc) {
    "id": _id,
    title,
    "slug": slug.current,
    arm,
    publication,
    publishAt,
    section,
    draft,
    "regions": regions[]->slug.current,
    "zones": zones[]->slug.current,
    "chapters": chapters[]->slug.current
  }`,
};

const ASSET_PROJECTION = `{"id": _id, "url": url}`;
const GALLERY_PROJECTION = `gallery[]{caption, alt, "asset": image.asset->${ASSET_PROJECTION}}`;

export const MEDIA_QUERY = `{
  "chapters": *[_type == "chapter"]{
    "owner": name, "ownerId": _id, arm,
    "region": region->slug.current, "zone": zone->slug.current,
    "cover": logo.asset->${ASSET_PROJECTION},
    ${GALLERY_PROJECTION}
  },
  "regions": *[_type == "region"]{
    "owner": name, "ownerId": _id, arm,
    "regions": [slug.current],
    "cover": heroImage.asset->${ASSET_PROJECTION},
    ${GALLERY_PROJECTION}
  },
  "events": *[_type == "event"]{
    "owner": title, "ownerId": _id, arm,
    "regions": regions[]->slug.current, "zones": zones[]->slug.current, "chapters": chapters[]->slug.current,
    ${GALLERY_PROJECTION}
  },
  "announcements": *[_type == "announcement"]{
    "owner": title, "ownerId": _id, arm,
    "regions": regions[]->slug.current, "zones": zones[]->slug.current, "chapters": chapters[]->slug.current,
    ${GALLERY_PROJECTION}
  },
  "news": *[_type == "post"]{
    "owner": title, "ownerId": _id, arm,
    "regions": regions[]->slug.current, "zones": zones[]->slug.current, "chapters": chapters[]->slug.current,
    "cover": coverImage.asset->${ASSET_PROJECTION},
    ${GALLERY_PROJECTION}
  },
  "publications": *[_type == "prescription"]{
    "owner": title, "ownerId": _id, arm,
    "regions": regions[]->slug.current, "zones": zones[]->slug.current, "chapters": chapters[]->slug.current,
    "cover": coverImage.asset->${ASSET_PROJECTION},
    ${GALLERY_PROJECTION}
  },
  "outreaches": *[_type == "outreach"]{
    "owner": title, "ownerId": _id, arm,
    "regions": regions[]->slug.current, "zones": zones[]->slug.current, "chapters": chapters[]->slug.current,
    "cover": coverImage.asset->${ASSET_PROJECTION},
    ${GALLERY_PROJECTION}
  },
  "pages": *[_type == "page"]{
    "owner": title, "ownerId": _id, arm,
    "regions": regions[]->slug.current, "zones": zones[]->slug.current, "chapters": chapters[]->slug.current,
    "cover": coverImage.asset->${ASSET_PROJECTION},
    ${GALLERY_PROJECTION}
  }
}`;

export const DOCUMENT_COUNT_QUERY = `{
  "person": count(*[_type == "person"]),
  "region": count(*[_type == "region"]),
  "zone": count(*[_type == "zone"]),
  "chapter": count(*[_type == "chapter"]),
  "event": count(*[_type == "event"]),
  "announcement": count(*[_type == "announcement"]),
  "activity": count(*[_type == "activity"]),
  "post": count(*[_type == "post"]),
  "prescription": count(*[_type == "prescription"]),
  "outreach": count(*[_type == "outreach"]),
  "page": count(*[_type == "page"])
}`;

export const STUDIO_TYPE_BY_MODULE: Record<ContentModuleKey, string> = {
  chapters: "chapter",
  regions: "region",
  events: "event",
  news: "post",
  publications: "prescription",
  announcements: "announcement",
  outreaches: "outreach",
  pages: "page",
};

/**
 * One page's section list, with just the columns the dashboard's
 * order/visibility editor shows. Section *content* stays in Studio — only
 * `order` and `visible` are managed from here.
 */
export const PAGE_SECTIONS_QUERY = `*[_type == $type && _id == $id][0]{
  _id,
  "sections": sections[]{
    _key,
    type,
    "label": coalesce(internalName, heading, type),
    "visible": coalesce(visible, true)
  },
  arm,
  regions,
  zones,
  chapters
}`;

/**
 * The raw stored sections, read back before a reorder so the patch rewrites
 * the array with the existing content rather than a projection of it.
 */
export const PAGE_SECTIONS_STORED_QUERY = `*[_type == $type && _id == $id][0].sections`;
