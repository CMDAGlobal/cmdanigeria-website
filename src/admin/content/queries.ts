import type { ContentModuleKey } from "./types";

const ZONE_PROJECTION = `{
  "slug": slug.current,
  "region": region->slug.current
}`;

export const CONTENT_QUERIES: Record<ContentModuleKey, string> = {
  chapters: `*[_type == "chapter"] | order(order asc, name asc) {
    "id": _id,
    "title": name,
    "slug": slug.current,
    arm,
    "subtitle": institution,
    "date": establishedAt,
    "region": region->slug.current,
    "zone": zone->${ZONE_PROJECTION}
  }`,
  events: `*[_type == "event"] | order(startDate desc) {
    "id": _id,
    title,
    "slug": slug.current,
    arm,
    type,
    startDate,
    mode,
    venue,
    location,
    "regions": regions[]->slug.current,
    "zones": zones[]->${ZONE_PROJECTION},
    "chapters": chapters[]->slug.current
  }`,
  announcements: `*[_type == "announcement"] | order(pinned desc, publishedAt desc) {
    "id": _id,
    title,
    "slug": slug.current,
    arm,
    category,
    publishedAt,
    pinned,
    "regions": regions[]->slug.current,
    "zones": zones[]->${ZONE_PROJECTION},
    "chapters": chapters[]->slug.current
  }`,
  news: `*[_type == "post"] | order(publishedAt desc) {
    "id": _id,
    title,
    "slug": slug.current,
    arm,
    kind,
    category,
    tags,
    publishedAt,
    draft,
    featured,
    "regions": regions[]->slug.current,
    "zones": zones[]->${ZONE_PROJECTION},
    "chapters": chapters[]->slug.current
  }`,
  outreaches: `*[_type == "outreach"] | order(coalesce(startsAt, _createdAt) desc) {
    "id": _id,
    title,
    "slug": slug.current,
    arm,
    status,
    startsAt,
    location,
    partner,
    "regions": regions[]->slug.current,
    "zones": zones[]->${ZONE_PROJECTION},
    "chapters": chapters[]->slug.current
  }`,
  pages: `*[_type == "page"] | order(title asc) {
    "id": _id,
    title,
    "slug": slug.current,
    arm,
    section,
    draft,
    "regions": regions[]->slug.current,
    "zones": zones[]->${ZONE_PROJECTION},
    "chapters": chapters[]->slug.current
  }`,
};

const ASSET_PROJECTION = `{"id": _id, "url": url}`;
const GALLERY_PROJECTION = `gallery[]{caption, alt, "asset": image.asset->${ASSET_PROJECTION}}`;

export const MEDIA_QUERY = `{
  "chapters": *[_type == "chapter"]{
    "owner": name, "ownerId": _id, arm,
    "region": region->slug.current, "zone": zone->${ZONE_PROJECTION},
    "cover": logo.asset->${ASSET_PROJECTION},
    ${GALLERY_PROJECTION}
  },
  "events": *[_type == "event"]{
    "owner": title, "ownerId": _id, arm,
    "regions": regions[]->slug.current, "zones": zones[]->${ZONE_PROJECTION}, "chapters": chapters[]->slug.current,
    ${GALLERY_PROJECTION}
  },
  "announcements": *[_type == "announcement"]{
    "owner": title, "ownerId": _id, arm,
    "regions": regions[]->slug.current, "zones": zones[]->${ZONE_PROJECTION}, "chapters": chapters[]->slug.current,
    ${GALLERY_PROJECTION}
  },
  "news": *[_type == "post"]{
    "owner": title, "ownerId": _id, arm,
    "regions": regions[]->slug.current, "zones": zones[]->${ZONE_PROJECTION}, "chapters": chapters[]->slug.current,
    "cover": coverImage.asset->${ASSET_PROJECTION},
    ${GALLERY_PROJECTION}
  },
  "outreaches": *[_type == "outreach"]{
    "owner": title, "ownerId": _id, arm,
    "regions": regions[]->slug.current, "zones": zones[]->${ZONE_PROJECTION}, "chapters": chapters[]->slug.current,
    "cover": coverImage.asset->${ASSET_PROJECTION},
    ${GALLERY_PROJECTION}
  },
  "pages": *[_type == "page"]{
    "owner": title, "ownerId": _id, arm,
    "regions": regions[]->slug.current, "zones": zones[]->${ZONE_PROJECTION}, "chapters": chapters[]->slug.current,
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
  "outreach": count(*[_type == "outreach"]),
  "page": count(*[_type == "page"])
}`;

export const STUDIO_TYPE_BY_MODULE: Record<ContentModuleKey, string> = {
  chapters: "chapter",
  events: "event",
  news: "post",
  announcements: "announcement",
  outreaches: "outreach",
  pages: "page",
};
