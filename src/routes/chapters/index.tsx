import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/chapters/")({
  loader: () => {
    throw redirect({ to: "/students-arm" });
  },
});