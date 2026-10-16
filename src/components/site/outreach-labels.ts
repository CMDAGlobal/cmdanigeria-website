import { format, parseISO } from "date-fns";

import type { OutreachRecord } from "@/sanity/types";

const STATUS_LABELS: Record<string, string> = {
  planned: "Planned",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function outreachStatusLabel(status: string | null | undefined): string | null {
  if (!status) return null;
  return STATUS_LABELS[status.trim().toLowerCase()] ?? null;
}

export function outreachDateLabel(outreach: Pick<OutreachRecord, "startsAt" | "endsAt">): string {
  if (!outreach.startsAt) return "Date to be announced";
  let start: Date;
  try {
    start = parseISO(outreach.startsAt);
  } catch {
    return "Date to be announced";
  }
  if (Number.isNaN(start.getTime())) return "Date to be announced";
  const startText = format(start, "d MMM yyyy");
  if (!outreach.endsAt) return startText;
  let end: Date;
  try {
    end = parseISO(outreach.endsAt);
  } catch {
    return startText;
  }
  if (Number.isNaN(end.getTime())) return startText;
  if (end.getMonth() === start.getMonth() && end.getFullYear() === start.getFullYear()) {
    return `${format(start, "d")}–${format(end, "d MMM yyyy")}`;
  }
  return `${startText} – ${format(end, "d MMM yyyy")}`;
}
