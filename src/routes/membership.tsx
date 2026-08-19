import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Membership } from "@/components/site/Events";
import { ReasonsToJoin } from "@/components/site/ReasonsToJoin";


const title = "Membership | CMDA Nigeria";
const description =
  "Join over 11,000 Christian doctors, dentists and medical students. Explore student, professional and global membership options.";

export const Route = createFileRoute("/membership")({
  component: MembershipPage,
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

function MembershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Belong to a fellowship that shapes your practice"
        intro="Membership connects you to mentorship, continuing education, missions opportunities and a network of colleagues who share your convictions."
      />
      <ReasonsToJoin />
      <Membership />
    </>
  );
}

