"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { useAdminSession } from "./admin-session";

export interface ModulePlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  permission?: string;
  iconClassName?: string;
}

export function ModulePlaceholder({
  title,
  description,
  icon: Icon,
  permission,
  iconClassName,
}: ModulePlaceholderProps) {
  const session = useAdminSession();
  const hasAccess = !permission || session.data?.permissions.includes(permission) === true;

  if (!hasAccess) {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Icon className={`h-6 w-6 text-primary ${iconClassName ?? ""}`} />
          </div>
          <div>
            <CardTitle className="text-lg">{title} management</CardTitle>
            <CardDescription>This module is ready for you to build out.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The governance layer — authentication, role-based permissions and the audit log — is
            live for this module. The management screens and data model are scaffolded and awaiting
            their next iteration. No account activity has been altered.
          </p>
          <div className="mt-5 grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-3">
            {[
              { label: "Data model", value: "Ready to define" },
              { label: "Access control", value: "Active" },
              { label: "Audit trail", value: "Recording" },
            ].map((item) => (
              <div key={item.label} className="bg-background px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-0.5 text-sm font-medium text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
