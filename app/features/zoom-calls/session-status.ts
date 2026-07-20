import type { ZoomCall } from "./zoom-call-queries";

export type SessionStatus = "upcoming" | "live" | "past";

/**
 * Derive status from start_time + duration. Robust against the backend's
 * differing status vocabulary ("Upcoming"/"Ongoing"/"Past") and the legacy
 * frontend enum ("scheduled"/"live"/...). Single source of truth for the UI.
 */
export function getSessionStatus(
  call: Pick<ZoomCall, "start_time" | "duration">,
  now: number = Date.now()
): SessionStatus {
  const start = new Date(call.start_time).getTime();

  if (Number.isNaN(start)) return "upcoming";

  const end = start + (call.duration ?? 0) * 60_000;

  if (now < start) return "upcoming";

  if (now <= end) return "live";

  return "past";
}

export const SESSION_STATUS_LABEL: Record<SessionStatus, string> = {
  upcoming: "Upcoming",
  live: "Live",
  past: "Past",
};

export const SESSION_STATUS_CLASS: Record<SessionStatus, string> = {
  upcoming: "bg-la-amber/15 text-la-amber-deep border-transparent",
  live: "bg-la-ok/15 text-la-ok border-transparent",
  past: "bg-la-cream text-la-muted border-transparent",
};
