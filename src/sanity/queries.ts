export const portableTextProjection = `
  ...,
  _type == "image" => { ..., asset->{ url, _id } },
  _type == "reference" => @-> { _id, name, slug, title }
`;

export const imageProjection = `{
  ..., 
  asset-> { url, _id }
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
*[_type == "region"] | order(order asc, _createdAt asc) {
  _id,
  name,
  slug,
  eyebrow,
  tagline,
  intro,
  countries,
  stats,
  "chapterCount": count(*[_type == "chapter" && references(^._id)]),
  "eventCount": count(*[_type == "event" && references(^._id)])
}
`;

export const regionQuery = `
*[_type == "region" && slug.current == $slug][0] {
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
  "leaders": *[_type == "person" && references(^._id)] | order(order asc, _createdAt asc) ${personProjection},
  "chapters": *[_type == "chapter" && references(^._id)] | order(order asc, name asc) ${chapterListProjection},
  "events": *[_type == "event" && references(^._id)] | order(startDate desc) ${eventProjection},
  "activities": *[_type == "activity" && references(^._id)] | order(date desc, _createdAt desc) {
    _id, title, slug, type, arm, date, outcome,
    "description": coalesce(description[]{ ${portableTextProjection} }, [])
  },
  "announcements": *[_type == "announcement" && references(^._id)] | order(publishedAt desc) {
    _id, title, slug, category, publishedAt, pinned, link,
    "body": coalesce(body[]{ ${portableTextProjection} }, [])
  },
  "gallery": coalesce(gallery[]{ ${imageProjection} }, [])
}
`;

export const necQuery = `
*[_type == "person" && arm == $arm && isNational == true] | order(order asc, _createdAt asc) ${personProjection}
`;

export const zonesQuery = `
*[_type == "zone"] | order(order asc, name asc) {
  _id, name, slug, eyebrow, tagline, intro, countries, stats, order,
  "chapterCount": count(*[_type == "chapter" && arm == $arm && references(^._id)]),
  "sampleChapters": *[_type == "chapter" && arm == $arm && references(^._id)] | order(order asc, name asc)[0...16] ${chapterListProjection}
}
`;

export const armEventsQuery = `
*[_type == "event" && arm == $arm] | order(startDate desc) ${eventProjection}
`;

export const armAnnouncementsQuery = `
*[_type == "announcement" && arm == $arm] | order(pinned desc, publishedAt desc) {
  _id, title, slug, category, publishedAt, pinned, link,
  "body": coalesce(body[]{ ${portableTextProjection} }, [])
}
`;

export const chapterQuery = `
*[_type == "chapter" && slug.current == $slug][0] {
  _id, name, slug, institution, location, country, arm, establishedAt, order,
  "zone": zone->{ _id, name, slug },
  "region": region->{ _id, name, slug },
  "logo": logo ${imageProjection},
  "description": coalesce(description[]{ ${portableTextProjection} }, []),
  "membership": membership,
  "exco": *[_type == "person" && memberOfChapter._ref == ^._id] | order(order asc, _createdAt asc) ${personProjection},
  "gallery": coalesce(gallery[]{ ${imageProjection} }, []),
  "events": *[_type == "event" && references(^._id)] | order(startDate desc) ${eventProjection}
}
`;

export const zoneQuery = `
*[_type == "zone" && slug.current == $slug][0] {
  _id, name, slug, eyebrow, tagline, intro, countries, stats, order,
  "overview": coalesce(overview[]{ ${portableTextProjection} }, []),
  "chapters": *[_type == "chapter" && references(^._id)] | order(order asc, name asc) ${chapterListProjection},
  "leaders": *[_type == "person" && references(^._id)] | order(order asc, _createdAt asc) ${personProjection},
  "gallery": coalesce(gallery[]{ ${imageProjection} }, [])
}
`;