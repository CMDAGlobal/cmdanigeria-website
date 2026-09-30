export const portableTextProjection = `
  ...,
  _type == "image" => { ..., asset->{ url, _id } },
  _type == "reference" => @-> { _id, name, slug, title }
`;

export const imageProjection = `{
  ...,
  asset-> { url, _id }
}`;

/** Exclude Sanity's system drafts (unpublished Studio copies). */
const NOT_DRAFT = `!(_id in path("drafts.**"))`;

/** Publication lifecycle: hidden while Draft/Archived; Scheduled appears once due. */
const VISIBLE = `!(_id in path("drafts.**")) && (publication == "published" || (publication == "scheduled" && publishAt <= now()))`;

/** Ordered page sections, each projected with its own images and copy resolved. */
const sectionProjection = `{
  _key, _type, visible, internalName, eyebrow, heading, width, ctaLabel, ctaHref, tone,
  "body": coalesce(body[]{ ${portableTextProjection} }, []),
  "backgroundImage": backgroundImage ${imageProjection},
  "image": image ${imageProjection},
  imageSide, imageAlt, imageCaption,
  autoFill, items[]{ value, label },
  "images": images[]{ ..., asset->{ url, _id } },
  provider, videoId,
  "poster": poster ${imageProjection},
  caption
}`;

export const pageBySlugQuery = `
*[_type == "page" && ${VISIBLE} && slug.current == $slug][0] {
  _id, title, "slug": slug.current, arm, summary, seoTitle, seoDescription,
  "coverImage": coverImage ${imageProjection},
  "body": coalesce(body[]{ ${portableTextProjection} }, []),
  "sections": sections[] ${sectionProjection}
}
`;

/**
 * Live counts for `statsSection` blocks flagged `autoFill`, so figures an admin is
 * expected to manage are derived rather than typed into JSX.
 */
export const pageCountersQuery = `{
  "students": {
    "chapters": count(*[_type == "chapter" && arm == "students"]),
    "zones": count(*[_type == "zone" && arm == "students"]),
    "people": count(*[_type == "person" && chapter->arm == "students"])
  },
  "doctors": {
    "chapters": count(*[_type == "chapter" && arm == "doctors"]),
    "zones": count(*[_type == "zone" && arm == "doctors"]),
    "people": count(*[_type == "person" && chapter->arm == "doctors"])
  },
  "global": {
    "chapters": count(*[_type == "chapter"]),
    "zones": count(*[_type == "zone"]),
    "regions": count(*[_type == "region"]),
    "people": count(*[_type == "person"])
  }
}`;

export const personProjection = `{
  _id, name, slug, position, chapterRole, isNational, institution, chapter, country, bio, order,
  "headshot": headshot ${imageProjection}
}`;

export const eventProjection = `{
  _id, title, slug, type, arm, startDate, endDate, venue, location, mode, registrationUrl, report,
  "description": coalesce(description[]{ ${portableTextProjection} }, [])
}`;

export const chapterListProjection = `{
  _id, name, slug, institution, location, country, arm, establishedAt, order,
  "zone": zone->{ _id, name, slug },
  "logo": logo ${imageProjection}
}`;

export const regionListQuery = `
*[_type == "region" && ${NOT_DRAFT}] | order(order asc, _createdAt asc) {
  _id,
  name,
  slug,
  eyebrow,
  tagline,
  intro,
  countries,
  stats,
  "chapterCount": count(*[_type == "chapter" && ${NOT_DRAFT} && references(^._id)]),
  "eventCount": count(*[_type == "event" && ${VISIBLE} && references(^._id)])
}
`;

export const regionQuery = `
*[_type == "region" && ${NOT_DRAFT} && slug.current == $slug][0] {
  _id,
  name,
  slug,
  eyebrow,
  tagline,
  intro,
  countries,
  mission,
  focus,
  stats,
  newsletters,
  "heroImage": heroImage ${imageProjection},
  "overview": coalesce(overview[]{ ${portableTextProjection} }, []),
  "leaders": *[_type == "person" && ${NOT_DRAFT} && references(^._id)] | order(order asc, _createdAt asc) ${personProjection},
  "chapters": *[_type == "chapter" && ${NOT_DRAFT} && references(^._id)] | order(order asc, name asc) ${chapterListProjection},
  "events": *[_type == "event" && ${VISIBLE} && references(^._id)] | order(startDate desc) ${eventProjection},
  "activities": *[_type == "activity" && ${VISIBLE} && references(^._id)] | order(date desc, _createdAt desc) {
    _id, title, slug, type, arm, date, outcome,
    "description": coalesce(description[]{ ${portableTextProjection} }, [])
  },
  "announcements": *[_type == "announcement" && ${VISIBLE} && references(^._id)] | order(pinned desc, publishedAt desc) {
    _id, title, slug, category, publishedAt, pinned, link,
    "body": coalesce(body[]{ ${portableTextProjection} }, [])
  },
  "gallery": coalesce(gallery[]{ ${imageProjection} }, [])
}
`;

export const necQuery = `
*[_type == "person" && ${NOT_DRAFT} && arm == $arm && isNational == true] | order(order asc, _createdAt asc) ${personProjection}
`;

export const leadershipQuery = `
{
  "boardOfTrustees": *[_type == "person" && ${NOT_DRAFT} && leadershipTeam == "board-of-trustees"] | order(order asc, _createdAt asc) ${personProjection},
  "governingBoard": *[_type == "person" && ${NOT_DRAFT} && leadershipTeam == "governing-board"] | order(order asc, _createdAt asc) ${personProjection},
  "managementTeam": *[_type == "person" && ${NOT_DRAFT} && leadershipTeam == "management-team"] | order(order asc, _createdAt asc) ${personProjection},
  "studentNec": *[_type == "person" && ${NOT_DRAFT} && arm == "students" && isNational == true] | order(order asc, _createdAt asc) ${personProjection}
}
`;

export const zonesQuery = `
*[_type == "zone" && ${NOT_DRAFT} && arm == $arm] | order(order asc, name asc) {
  _id, name, slug, arm, eyebrow, tagline, intro, countries, stats, order,
  "chapterCount": count(*[_type == "chapter" && ${NOT_DRAFT} && arm == $arm && references(^._id)]),
  "sampleChapters": *[_type == "chapter" && ${NOT_DRAFT} && arm == $arm && references(^._id)] | order(order asc, name asc)[0...16] ${chapterListProjection}
}
`;

export const armEventsQuery = `
*[_type == "event" && ${VISIBLE} && arm == $arm] | order(startDate desc) ${eventProjection}
`;

export const armAnnouncementsQuery = `
*[_type == "announcement" && ${VISIBLE} && arm == $arm] | order(pinned desc, publishedAt desc) {
  _id, title, slug, category, publishedAt, pinned, link,
  "body": coalesce(body[]{ ${portableTextProjection} }, [])
}
`;

const postFields = `_id, title, "slug": slug.current, kind, arm, category, tags,
  publishedAt, featured, excerpt, link, "hasBody": defined(body),
  "cover": coverImage ${imageProjection}, "author": author->{ name }`;

export const postListQuery = `
*[_type == "post" && ${VISIBLE}] | order(featured desc, publishedAt desc) {
  ${postFields}
}
`;

export const postDetailQuery = `
*[_type == "post" && ${VISIBLE} && slug.current == $slug][0] {
  ${postFields},
  "body": coalesce(body[]{ ${portableTextProjection} }, [])
}
`;

export const eventListQuery = `
*[_type == "event" && ${VISIBLE}] | order(startDate asc) ${eventProjection}
`;

const prescriptionFields = `_id, title, "slug": slug.current, kind, arm, issueNumber, issueDate,
  author, summary, url,
  "hasBody": defined(body),
  "cover": coverImage ${imageProjection},
  "downloadUrl": coalesce(url, file.asset->url)`;

export const prescriptionListQuery = `
*[_type == "prescription" && ${VISIBLE}] | order(issueDate desc, _createdAt desc) {
  ${prescriptionFields}
}
`;

export const prescriptionDetailQuery = `
*[_type == "prescription" && ${VISIBLE} && slug.current == $slug][0] {
  ${prescriptionFields},
  "body": coalesce(body[]{ ${portableTextProjection} }, [])
}
`;

export const chapterQuery = `
*[_type == "chapter" && ${NOT_DRAFT} && slug.current == $slug][0] {
  _id, name, slug, institution, location, country, arm, establishedAt, order,
  "zone": zone->{ _id, name, slug },
  "region": region->{ _id, name, slug },
  "logo": logo ${imageProjection},
  "description": coalesce(description[]{ ${portableTextProjection} }, []),
  "membership": membership,
  "exco": *[_type == "person" && ${NOT_DRAFT} && memberOfChapter._ref == ^._id] | order(order asc, _createdAt asc) ${personProjection},
  "gallery": coalesce(gallery[]{ ${imageProjection} }, []),
  "events": *[_type == "event" && ${VISIBLE} && references(^._id)] | order(startDate desc) ${eventProjection}
}
`;

export const zoneQuery = `
*[_type == "zone" && ${NOT_DRAFT} && slug.current == $slug][0] {
  _id, name, slug, arm, eyebrow, tagline, intro, countries, stats, order,
  "overview": coalesce(overview[]{ ${portableTextProjection} }, []),
  "chapters": *[_type == "chapter" && ${NOT_DRAFT} && references(^._id)] | order(order asc, name asc) ${chapterListProjection},
  "leaders": *[_type == "person" && ${NOT_DRAFT} && references(^._id)] | order(order asc, _createdAt asc) ${personProjection},
  "gallery": coalesce(gallery[]{ ${imageProjection} }, [])
}
`;

export const chapterCountsQuery = `{
  "students": count(*[_type == "chapter" && ${NOT_DRAFT} && arm == "students"]),
  "doctors": count(*[_type == "chapter" && ${NOT_DRAFT} && arm == "doctors"])
}`;
