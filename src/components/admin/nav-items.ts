import type { ComponentType } from "react";
import {
  BookOpen,
  CalendarDays,
  FileText,
  Globe2,
  GraduationCap,
  HeartHandshake,
  Images,
  LayoutDashboard,
  Mail,
  Megaphone,
  Newspaper,
  ScrollText,
  Settings2,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { AdminSession } from "./admin-session";

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }> | LucideIcon;
  permission?: string;
  group: string;
  chapterScoped?: boolean;
  arm?: "students" | "doctors";
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/admin",
    label: "Overview",
    icon: LayoutDashboard,
    group: "Overview",
    chapterScoped: true,
  },
  {
    href: "/admin/news",
    label: "News",
    icon: Newspaper,
    permission: "news.read",
    group: "Website Content",
    chapterScoped: true,
  },
  {
    href: "/admin/announcements",
    label: "Announcements",
    icon: Megaphone,
    permission: "announcements.read",
    group: "Website Content",
    chapterScoped: true,
  },
  {
    href: "/admin/outreaches",
    label: "Outreaches",
    icon: HeartHandshake,
    permission: "outreaches.read",
    group: "Website Content",
    chapterScoped: true,
  },
  {
    href: "/admin/pages",
    label: "Pages",
    icon: FileText,
    permission: "pages.read",
    group: "Website Content",
  },
  {
    href: "/admin/newsletter",
    label: "Prescription",
    icon: Mail,
    permission: "publications.read",
    group: "Website Content",
  },
  {
    href: "/admin/students",
    label: "Students' Arm",
    icon: GraduationCap,
    permission: "chapters.read",
    group: "CMDA Nigeria",
    chapterScoped: true,
    arm: "students",
  },
  {
    href: "/admin/doctors",
    label: "Doctors' Arm",
    icon: Stethoscope,
    permission: "chapters.read",
    group: "CMDA Nigeria",
    chapterScoped: true,
    arm: "doctors",
  },
  {
    href: "/admin/global-network",
    label: "Global Network",
    icon: Globe2,
    permission: "regions.read",
    group: "CMDA Nigeria",
  },
  {
    href: "/admin/events",
    label: "Events",
    icon: CalendarDays,
    permission: "events.read",
    group: "Publishing",
    chapterScoped: true,
  },
  {
    href: "/admin/blog",
    label: "Blog",
    icon: BookOpen,
    permission: "news.read",
    group: "Publishing",
  },
  {
    href: "/admin/media",
    label: "Media Library",
    icon: Images,
    permission: "media.read",
    group: "Publishing",
    chapterScoped: true,
  },
  {
    href: "/admin/users",
    label: "Users & Permissions",
    icon: Users,
    permission: "users.read",
    group: "Administration",
  },
  {
    href: "/admin/audit",
    label: "Audit Log",
    icon: ScrollText,
    permission: "audit_logs.view",
    group: "Administration",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings2,
    permission: "settings.read",
    group: "Settings",
  },
];

export function isChapterDashboard(session: AdminSession | null | undefined): boolean {
  if (!session?.roles.length) return false;
  return session.roles.every((role) => role.key === "chapter_admin");
}

function chapterArms(session: AdminSession): Set<string> {
  const arms = new Set<string>();
  for (const role of session.roles) {
    if (role.key === "chapter_admin" && role.scope.arm) arms.add(role.scope.arm);
  }
  return arms;
}

export function visibleNavItems(session: AdminSession, items: NavItem[] = NAV_ITEMS): NavItem[] {
  const chapterOnly = isChapterDashboard(session);
  const arms = chapterOnly ? chapterArms(session) : null;
  return items.filter((item) => {
    if (item.permission && !session.permissions.includes(item.permission)) return false;
    if (!chapterOnly) return true;
    if (!item.chapterScoped) return false;
    if (item.arm && !arms?.has(item.arm)) return false;
    return true;
  });
}
