"use client";

import type { LucideIcon } from "lucide-react";

export function NoAccess({ icon: Icon, permission }: { icon: LucideIcon; permission: string }) {
  return (
    <div className="rounded-lg border border-dashed bg-background/60 p-12 text-center">
      <Icon className="mx-auto h-8 w-8 text-muted-foreground" />
      <h2 className="mt-4 font-display text-xl font-bold tracking-tight">No access</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        You don’t hold the <code className="text-primary">{permission}</code> permission.
      </p>
    </div>
  );
}
