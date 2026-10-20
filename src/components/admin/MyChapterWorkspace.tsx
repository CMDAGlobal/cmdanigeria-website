"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  CalendarDays,
  ExternalLink,
  Images,
  MapPin,
  Megaphone,
  Newspaper,
  Pencil,
  UsersRound,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyChapter } from "./admin-content";
import { ContentEditorDialog } from "./ContentEditorDialog";
import type { ContentItem } from "@/admin/content/types";

const COUNT_LINKS = [
  { key: "leaders", label: "Leaders", to: "/admin/leadership", icon: UsersRound },
  { key: "events", label: "Events", to: "/admin/events", icon: CalendarDays },
  { key: "news", label: "News", to: "/admin/news", icon: Newspaper },
  { key: "announcements", label: "Announcements", to: "/admin/announcements", icon: Megaphone },
  { key: "gallery", label: "Media files", to: "/admin/media", icon: Images },
] as const;

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="font-display text-2xl font-bold tabular-nums">{value || "—"}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function MyChapterWorkspace() {
  const query = useMyChapter(true);
  const chapter = query.data;
  const loading = query.isLoading;
  const [editorOpen, setEditorOpen] = useState(false);

  const item: ContentItem | null = useMemo(() => {
    if (!chapter?.ok || !chapter.id) return null;
    return {
      id: chapter.id,
      title: chapter.name ?? "",
      slug: chapter.slug,
      arm: chapter.arm,
      subtitle: chapter.institution,
      date: null,
      status: null,
      draft: false,
      scope: {
        arm: chapter.arm,
        regions: [],
        zones: [],
        chapters: chapter.slug ? [chapter.slug] : [],
      },
    };
  }, [chapter]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!chapter?.ok) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No chapter assigned</CardTitle>
          <CardDescription>
            Your account does not have a chapter grant, so there is nothing to manage here yet. Ask
            a super admin to assign you as a chapter admin.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const publicUrl = chapter.slug ? `/chapters/${chapter.slug}` : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div className="space-y-1.5">
            <CardTitle className="font-display text-xl tracking-tight">
              {chapter.name ?? "Untitled chapter"}
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {chapter.arm ? <Badge variant="secondary">{chapter.arm}</Badge> : null}
              {chapter.institution ? (
                <span className="inline-flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" aria-hidden />
                  {chapter.institution}
                </span>
              ) : null}
              {chapter.location || chapter.country ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  {[chapter.location, chapter.country].filter(Boolean).join(", ")}
                </span>
              ) : null}
            </CardDescription>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {publicUrl ? (
              <Button variant="outline" size="sm" asChild>
                <a href={publicUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                  View public page
                </a>
              </Button>
            ) : null}
            {item ? (
              <Button size="sm" onClick={() => setEditorOpen(true)}>
                <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                Edit chapter
              </Button>
            ) : null}
          </div>
        </CardHeader>
        {chapter.mission ? (
          <CardContent>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {chapter.mission}
            </p>
          </CardContent>
        ) : null}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Chapter content</CardTitle>
          <CardDescription>
            Everything published under this chapter, plus the profile details you control.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {COUNT_LINKS.map((entry) => {
              const Icon = entry.icon;
              const value = chapter.counts[entry.key];
              return (
                <Link
                  key={entry.key}
                  to={entry.to}
                  className="group flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="rounded-md bg-primary/10 p-1.5">
                      <Icon className="h-3.5 w-3.5 text-primary" aria-hidden />
                    </span>
                    <span className="text-sm font-medium">{entry.label}</span>
                  </span>
                  <span className="font-display text-lg font-bold tabular-nums">
                    {value.toLocaleString()}
                  </span>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Profile completeness</CardTitle>
            <CardDescription>Fields visitors see on your public chapter page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              { label: "Logo", done: chapter.hasLogo },
              { label: "Mission statement", done: Boolean(chapter.mission) },
              { label: "About / description", done: chapter.hasDescription },
              { label: "History", done: chapter.hasHistory },
              { label: "Contact details", done: Boolean(chapter.contactInfo) },
              { label: "Social links", done: Boolean(chapter.socialLinks) },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">{row.label}</span>
                <Badge variant={row.done ? "secondary" : "outline"}>
                  {row.done ? "Added" : "Missing"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Membership statistics</CardTitle>
            <CardDescription>Typed on this page and shown on the public site.</CardDescription>
          </CardHeader>
          <CardContent>
            {chapter.membership.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No membership statistics yet. Use Edit chapter to add them.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {chapter.membership.map((stat) => (
                  <StatTile key={stat.label} label={stat.label} value={stat.value} />
                ))}
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>{chapter.counts.resources} resource files</span>
              <span aria-hidden>·</span>
              <span>{chapter.counts.gallery} gallery photos</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <ContentEditorDialog
        module="chapters"
        open={editorOpen}
        onOpenChange={setEditorOpen}
        item={item}
        noun="chapter"
      />
    </div>
  );
}
