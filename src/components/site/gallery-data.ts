import type { GalleryPhoto } from "./PhotoGallery";

function album(prefix: string, filePrefix: string, count: number, altBase: string): GalleryPhoto[] {
  return Array.from({ length: count }, (_, i) => ({
    src: `/gallery/${prefix}/${filePrefix}-${String(i + 1).padStart(2, "0")}.webp`,
    alt: `${altBase} photo ${i + 1}`,
  }));
}

export const STUDENT_GALLERY = album("students", "students", 12, "CMDA Nigeria student fellowship");

export const CONFERENCE_GALLERY = album("conferences", "conference", 26, "CMDA Nigeria conference");

export const WHOLENESS_ALBUMS: { title: string; photos: GalleryPhoto[] }[] = [
  {
    title: "Motor Park Missions",
    photos: album("wholeness-missions", "motor-park", 17, "Wholeness Missions motor park outreach"),
  },
  {
    title: "Orphanage Outreach",
    photos: album("wholeness-missions", "orphanage", 20, "Wholeness Missions orphanage outreach"),
  },
];
