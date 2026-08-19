import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { MinistriesFull } from "@/components/site/Ministries";

const title = "Ministries | CMDA Nigeria";
const description =
  "Explore IfEHL, the Institute of Medical Missions, EXCEL, Wholeness Missions and the CMDA Nigeria Global Network.";

export const Route = createFileRoute("/ministries")({
  component: MinistriesPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function MinistriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Ministries"
        title="Specialised arms carrying the mission forward"
        intro="Each ministry sharpens a different edge of our calling — leadership formation, missions training, student excellence and global fellowship."
      />
      <MinistriesFull />
    </>
  );
}
