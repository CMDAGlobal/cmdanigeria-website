"use client";

import { Link, useLocation } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type ComponentType, type ReactNode } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard,
  ScrollText,
  Users,
  Building2,
  CalendarDays,
  Newspaper,
  Megaphone,
  HeartHandshake,
  Images,
  Settings2,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  FileText,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/admin/auth/server";
import { cn } from "@/lib/utils";
import { scopeLabel } from "./admin-session";
import type { AdminSession } from "./admin-session";

interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }> | LucideIcon;
  permission?: string;
  group: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  {
    href: "/admin/chapters",
    label: "Chapters",
    icon: Building2,
    permission: "chapters.read",
    group: "Content",
  },
  {
    href: "/admin/events",
    label: "Events",
    icon: CalendarDays,
    permission: "events.read",
    group: "Content",
  },
  {
    href: "/admin/news",
    label: "News",
    icon: Newspaper,
    permission: "news.read",
    group: "Content",
  },
  {
    href: "/admin/announcements",
    label: "Announcements",
    icon: Megaphone,
    permission: "announcements.read",
    group: "Content",
  },
  {
    href: "/admin/outreaches",
    label: "Outreaches",
    icon: HeartHandshake,
    permission: "outreaches.read",
    group: "Content",
  },
  {
    href: "/admin/media",
    label: "Media Library",
    icon: Images,
    permission: "media.read",
    group: "Content",
  },
  {
    href: "/admin/pages",
    label: "Pages",
    icon: FileText,
    permission: "pages.read",
    group: "Content",
  },
  {
    href: "/admin/users",
    label: "Administrators",
    icon: Users,
    permission: "users.read",
    group: "People & Access",
  },
  {
    href: "/admin/audit",
    label: "Audit Log",
    icon: ScrollText,
    permission: "audit_logs.view",
    group: "System",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings2,
    permission: "settings.read",
    group: "System",
  },
];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function SidebarContent({
  session,
  onNavigate,
}: {
  session: AdminSession;
  onNavigate?: () => void;
}) {
  const location = useLocation();
  const groups = [...new Set(NAV_ITEMS.map((item) => item.group))];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
          <ShieldCheck className="h-5 w-5 text-gold" />
        </div>
        <div>
          <p className="font-display text-sm font-bold tracking-tight text-white">CMDA Nigeria</p>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">
            Admin Console
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        {groups.map((group) => {
          const items = NAV_ITEMS.filter((item) => item.group === group);
          const visible = items.filter(
            (item) => !item.permission || session.permissions.includes(item.permission),
          );
          if (!visible.length) return null;
          return (
            <div key={group}>
              <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                {group}
              </p>
              <nav className="space-y-0.5">
                {visible.map((item) => {
                  const active = location.pathname === item.href;
                  const Icon = item.icon as ComponentType<{ className?: string }>;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-gold text-gold-foreground shadow-sm"
                          : "text-white/75 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          active ? "text-gold-foreground" : "text-gold/80 group-hover:text-gold",
                        )}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      <div className="border-t border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 bg-white/15 text-white ring-1 ring-white/15">
            <AvatarFallback>{initials(session.user?.name ?? "AD")}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{session.user?.name}</p>
            <p className="truncate text-xs text-white/55">{session.user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminTopbar({
  session,
  onOpenMobile,
}: {
  session: AdminSession;
  onOpenMobile: () => void;
}) {
  const queryClient = useQueryClient();
  const location = useLocation();
  const current = NAV_ITEMS.find((item) => item.href === location.pathname);

  async function handleLogout() {
    try {
      await logoutAction();
      await queryClient.invalidateQueries({ queryKey: ["admin-session"] });
      window.location.href = "/admin/login";
    } catch (error) {
      console.error(error);
      toast.error("Could not sign you out. Please try again.");
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card/80 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenMobile}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display text-base font-bold tracking-tight sm:text-lg">
            {current?.label ?? "Admin"}
          </h1>
          <p className="hidden text-xs text-muted-foreground sm:block sm:text-sm">
            CMDA Nigeria administration
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {session.roles.map((role) => (
          <Badge key={role.key} variant="secondary" className="hidden sm:inline-flex">
            {role.name}
          </Badge>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account menu">
              <Avatar className="h-8 w-8 bg-primary/10 text-primary">
                <AvatarFallback>{initials(session.user?.name ?? "AD")}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <p className="font-semibold">{session.user?.name}</p>
              <p className="truncate text-xs font-normal text-muted-foreground">
                {session.user?.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Roles
              </p>
              <div className="flex flex-wrap gap-1.5">
                {session.roles.map((role) => (
                  <span
                    key={role.key}
                    className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"
                  >
                    {role.name}
                  </span>
                ))}
              </div>
              {session.roles.some((role) => Object.keys(role.scope).length > 0) && (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {session.roles
                    .filter((role) => Object.keys(role.scope).length > 0)
                    .map((role) => scopeLabel(role.scope))
                    .join(" · ")}
                </p>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function AdminShell({ session, children }: { session: AdminSession; children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-dvh bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-primary-deep lg:flex">
        <SidebarContent session={session} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-primary-deep shadow-2xl">
            <div className="flex justify-end p-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                className="text-white hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="min-h-0 flex-1">
              <SidebarContent session={session} onNavigate={() => setMobileOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <AdminTopbar session={session} onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
