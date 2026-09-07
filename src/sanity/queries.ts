export const portableTextProjection = `
  ...,
  _type == "image" => { ..., asset->{ url, _id } },
  _type == "reference" => @-> { _id, name, slug, title }
`;

export const imageProjection = `{
  ..., 
  asset-> { url, _id }
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
  "leaders": *[_type == "person" && references(^._id)] | order(order asc, _createdAt asc) {
    _id, name, slug, position, chapterRole, institution, chapter, country, bio, order,
    "headshot": headshot ${imageProjection}
  },
  "chapters": *[_type == "chapter" && references(^._id)] | order(order asc, name asc) {
    _id, name, slug, institution, location, country, arm, establishedAt, order,
    "logo": logo ${imageProjection}
  },
  "events": *[_type == "event" && references(^._id)] | order(startDate desc) {
    _id, title, slug, type, arm, startDate, endDate, venue, location, mode, registrationUrl, report,
    "description": coalesce(description[]{ ${portableTextProjection} }, [])
  },
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