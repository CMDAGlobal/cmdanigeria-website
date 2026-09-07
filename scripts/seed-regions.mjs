import { createClient } from "@sanity/client";
import { getFallbackRegion } from "../src/sanity/fallback.ts";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";
const apiVersion = process.env.SANITY_API_VERSION || "2026-01-01";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing SANITY_PROJECT_ID and/or SANITY_WRITE_TOKEN. Set them in your environment (see .env.example).",
  );
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const slugs = ["americas-caribbean", "uk-europe", "middle-east", "australasia", "africa"];

const { results: existingDocs } = await client.fetch(
  `*[_type == "region" && slug.current in $slugs] { _id, slug }`,
  { slugs },
);
const existingSlugSet = new Set(existingDocs.map((doc) => doc.slug.current));

async function createRelated(ref, type, docs) {
  for (const [i, item] of docs.entries()) {
    if (!item) continue;
    const slug = item.slug?.current ?? `${type}-${i}`;
    const { results: dupes } = await client.fetch(
      `*[_type == $type && slug.current == $slug] { _id }`,
      { type, slug },
    );
    if (dupes.length > 0) continue;
    await client.create({ ...item, _type: type, arm: "global", regions: [{ _type: "reference", _ref: ref }] });
  }
}

let created = 0;
for (const [index, slug] of slugs.entries()) {
  const region = getFallbackRegion(slug);
  if (!region) continue;

  if (existingSlugSet.has(slug)) {
    console.log(`skip ${slug}: region already exists`);
    continue;
  }

  const doc = await client.create({
    _type: "region",
    name: region.name,
    slug: { _type: "slug", current: slug },
    eyebrow: region.eyebrow ?? undefined,
    tagline: region.tagline ?? undefined,
    intro: region.intro ?? undefined,
    countries: region.countries ?? [],
    overview: region.overview ?? [],
    stats: (region.stats ?? []).map((stat) => ({
      _type: "statItem",
      value: stat.value ?? "",
      label: stat.label ?? "",
    })),
    newsletters: (region.newsletters ?? []).map((item) => ({
      _type: "newsletterItem",
      title: item.title ?? "",
      description: item.description ?? "",
      url: item.url ?? undefined,
    })),
    order: index,
  });
  created += 1;
  console.log(`created region: ${region.name} (${doc._id})`);

  const events = (region.events ?? []).map((event, i) => ({
    title: event.title,
    slug: { _type: "slug", current: "event-" + i },
    type: event.type ?? "other",
    startDate: event.startDate ?? `${new Date().getFullYear() + 1}-12-31T09:00:00.000Z`,
    venue: event.venue ?? undefined,
    location: event.location ?? undefined,
    mode: event.mode ?? "inperson",
  }));
  await createRelated(doc._id, "event", events);

  const activities = (region.activities ?? []).map((activity, i) => ({
    title: activity.title,
    slug: { _type: "slug", current: `activity-${i}` },
    type: activity.type ?? "other",
    description: activity.description ?? [],
  }));
  await createRelated(doc._id, "activity", activities);
}

console.log(
  `\nDone. ${created} region(s) seeded. Open the studio (SANITY project) to add leaders, chapters, announcements and media.`,
);
process.exit(0);