import type { ReactNode } from "react";

export type NavBadgeTone = "default" | "warn" | "success";

export type NavItem = {
  id: string;
  label: string;
  to: string;
  icon: ReactNode;
  badge?: number | string;
  badgeTone?: NavBadgeTone;
  /** Match nested routes (default true for parents like /dashboard/org/:id) */
  end?: boolean;
};

export type NavGroup = {
  id: string;
  /** Section label rendered above the items. Omit to render an unlabelled group. */
  label?: string;
  /** Use amber accent for the group label (e.g. Platform admin) */
  accent?: boolean;
  items: NavItem[];
};

export type DashboardContext = "personal" | "org" | "platform";

export type ContextOption = {
  id: string;
  kind: DashboardContext;
  label: string;
  hint?: string;
  /** Navigation target. Ignored if onSelect is provided. */
  to: string;
  initials?: string;
  /** When set, overrides default <Link> navigation. */
  onSelect?: () => void;
};
