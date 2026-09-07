import { createClient } from "@sanity/client";
import {
  fallbackDoctorsArm,
  fallbackStudentsArm,
  getFallbackRegion,
} from "../src/sanity/fallback.ts";

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

async function docsExist(type, slugs) {
  const { results } = await client.fetch(
    `*[_type == $type && slug.current in $slugs] { _id, slug }`,
    { type, slugs },
  );
  return new Set(results.map((doc) => doc.slug.current));
}

async function seedArmZones(arm, zones) {
  const createdChapters = [];
  const zoneSlugs = zones.map((zone) => zone.slug?.current).filter(Boolean);
  const existingZones = await docsExist("zone", zoneSlugs);

  for (const [index, zone] of zones.entries()) {
    const zoneSlug = zone.slug?.current ?? `zone-${arm}-${index}`;
    let zoneRef = null;

    if (existingZones.has(zoneSlug)) {
      const [{ _id }] = await client.fetch(`*[_type == "zone" && slug.current == $zoneSlug][0] { _id }`, {
        zoneSlug,
      });
      zoneRef = _id;
      console.log(`skip zone ${zoneSlug}: already exists`);
    } else {
      const doc = await client.create({
        _type: "zone",
        name: zone.name,
        slug: { _type: "slug", current: zoneSlug },
        eyebrow: zone.eyebrow ?? undefined,
        tagline: zone.tagline ?? undefined,
        intro: zone.intro ?? undefined,
        stats: (zone.stats ?? []).map((stat) => ({
          _type: "statItem",
          value: stat.value ?? "",
          label: stat.label ?? "",
        })),
        order: index,
      });
      zoneRef = doc._id;
      console.log(`created zone: ${zone.name} (${doc._id})`);
    }

    for (const [ci, chapter] of (zone.sampleChapters ?? []).entries()) {
      const chapterSlug = chapter.slug?.current ?? `${zoneSlug}-chapter-${ci}`;
      const { results: dupes } = await client.fetch(
        `*[_type == "chapter" && slug.current == $chapterSlug] { _id }`,
        { chapterSlug },
      );
      if (dupes.length > 0) {
        console.log(`skip chapter ${chapterSlug}: already exists`);
        continue;
      }
      const doc = await client.create({
        _type: "chapter",
        name: chapter.name,
        slug: { _type: "slug", current: chapterSlug },
        institution: chapter.institution ?? undefined,
        country: chapter.country ?? "Nigeria",
        arm,
        zone: zoneRef ? { _type: "reference", _ref: zoneRef } : undefined,
        order: ci,
      });
      createdChapters.push(chapterSlug);
      console.log(`created chapter: ${chapter.name} (${doc._id})`);
    }
  }
  return { zones: zoneSlugs.length, chapters: createdChapters.length };
}

async function seedArmEvents(arm, events) {
  let created = 0;
  const existingEvents = await docsExist("event", events.map((event) => event.slug?.current).filter(Boolean));
  for (const [index, event] of events.entries()) {
    const slug = event.slug?.current ?? `${arm}-event-${index}`;
    if (existingEvents.has(slug)) {
      console.log(`skip event ${slug}: already exists`);
      continue;
    }
    await client.create({
      _type: "event",
      title: event.title,
      slug: { _type: "slug", current: slug },
      type: event.type ?? "other",
      arm,
      startDate: event.startDate ?? `${new Date().getFullYear() + 1}-12-31T09:00:00.000Z`,
      venue: event.venue ?? undefined,
      location: event.location ?? undefined,
      mode: event.mode ?? "inperson",
    });
    created += 1;
    console.log(`created event: ${event.title} (${slug})`);
  }
  return created;
}

/* ----------------------------- Global regions ----------------------------- */

const regionSlugs = ["americas-caribbean", "uk-europe", "middle-east", "australasia", "africa"];
const existingRegions = await docsExist("region", regionSlugs);

let regionsCreated = 0;
for (const [index, slug] of regionSlugs.entries()) {
  const region = getFallbackRegion(slug);
  if (!region) continue;
  if (existingRegions.has(slug)) {
    console.log(`skip region ${slug}: already exists`);
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
  regionsCreated += 1;
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
  for (const [i, item] of events.entries()) {
    if (!item) continue;
    const slug = item.slug.current;
    const { results: dupes } = await client.fetch(
      `*[_type == "event" && slug.current == $slug] { _id }`,
      { slug },
    );
    if (dupes.length > 0) continue;
    await client.create({
      ...item,
      _type: "event",
      arm: "global",
      regions: [{ _type: "reference", _ref: doc._id }],
    });
  }
}

/* --------------------------- Students' Arm zones --------------------------- */

const students = fallbackStudentsArm();
const studentZones = await seedArmZones("students", students.zones ?? []);

/* --------------------------- Students' Arm events --------------------------- */

const studentEvents = await seedArmEvents("students", students.events ?? []);

/* ---------------------------- Doctors' Arm zones ---------------------------- */

const doctors = fallbackDoctorsArm();
const doctorZones = await seedArmZones("doctors", doctors.zones ?? []);

/* ---------------------------- Doctors' Arm events ---------------------------- */

const doctorEvents = await seedArmEvents("doctors", doctors.events ?? []);

console.log(
  `\nDone. ${regionsCreated} region(s), ${studentZones.zones} student zone(s) (${studentZones.chapters} chapters), ` +
    `${studentEvents} student event(s), ${doctorZones.zones} doctor zone(s) (${doctorZones.chapters} chapters), ` +
    `${doctorEvents} doctor event(s) seeded. ` +
    `Open the studio (SANITY project) to add NEC members, chapter executives, announcements and media.`,
);
process.exit(0);