import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, type ComponentType } from "react";
import { isSanityConfigured } from "@/sanity/config";

const StudioAdmin = lazy(() => import("@/sanity/Studio")) as unknown as ComponentType;

export const Route = createFileRoute("/studio")({
  component: StudioRoute,
});

const title = "Admin — CMDA Nigeria";

function StudioRoute() {
  if (!isSanityConfigured()) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-xl text-center">
          <h1 className="display-1 text-balance">Sanity is not configured</h1>
          <p className="lede mt-6 text-muted-foreground">
            Set <code className="font-mono text-cmda-green">VITE_SANITY_PROJECT_ID</code> (and
            optionally <code className="font-mono text-cmda-green">VITE_SANITY_DATASET</code>)
            in your environment to enable the admin studio on this site.
          </p>
        </div>
      </section>
    );
  }
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="font-display text-sm tracking-wide text-muted-foreground">Loading studio…</p>
        </div>
      }
    >
      <StudioAdmin />
    </Suspense>
  );
}