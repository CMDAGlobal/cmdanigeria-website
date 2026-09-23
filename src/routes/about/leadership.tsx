import { createFileRoute } from "@tanstack/react-router";
import { LeadershipPage } from "@/components/site/org/LeadershipPage";
import { fetchLeadership } from "@/sanity/data";

const title = "National Leadership | CMDA Nigeria";
const description =
  "Meet the leadership of CMDA Nigeria — our Board of Trustees, Governing Board, Management Team and the Student NEC.";

export const Route = createFileRoute("/about/leadership")({
  loader: async () => ({ leadership: await fetchLeadership() }),
  component: LeadershipRoute,
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

function LeadershipRoute() {
  const { leadership } = Route.useLoaderData();
  return <LeadershipPage leadership={leadership} />;
}