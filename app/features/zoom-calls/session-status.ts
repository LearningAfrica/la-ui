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
  upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  live: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  past: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};
