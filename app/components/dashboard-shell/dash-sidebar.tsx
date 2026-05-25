import { Link, NavLink } from "react-router";

import { LALogo } from "@/components/landing-b/la-logo";
import { cn } from "@/lib/utils";

import type { NavBadgeTone, NavGroup, NavItem } from "./types";

type Props = {
  groups: NavGroup[];
  /** Top-of-sidebar slot (org switcher / brand) */
  header?: React.ReactNode;
  /** Bottom-of-sidebar slot (user card) */
  footer?: React.ReactNode;
  className?: string;
};

export function DashSidebar({ groups, header, footer, className }: Props) {
  return (
    <aside
      className={cn(
        "border-la-rule bg-la-paper flex h-full w-60 shrink-0 flex-col border-r",
        className
      )}
    >
      <div className="border-la-rule flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <Link
          to="/"
          prefetch="intent"
          aria-label="Learning Africa home"
          className="flex items-center gap-2"
        >
          <LALogo size={26} />
          <span className="font-display text-la-ink text-[13px] font-semibold tracking-tight">
            Learning Africa
          </span>
        </Link>
      </div>
      {header && (
        <div className="border-la-rule border-b px-3 py-3">{header}</div>
      )}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {groups.map((group) => (
          <SidebarGroup key={group.id} group={group} />
        ))}
      </nav>
      {footer && (
        <div className="border-la-rule border-t px-3 py-3">{footer}</div>
      )}
    </aside>
  );
}

function SidebarGroup({ group }: { group: NavGroup }) {
  return (
    <div className="mb-3 last:mb-0">
      {group.label && (
        <div
          className={cn(
            "font-display px-3 pt-2 pb-1 text-[10px] font-medium tracking-[0.15em] uppercase",
            group.accent ? "text-(--color-la-amber)" : "text-la-muted"
          )}
        >
          {group.label}
        </div>
      )}
      <ul className="space-y-0.5">
        {group.items.map((item) => (
          <li key={item.id}>
            <SidebarLink item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function SidebarLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      end={item.end ?? true}
      prefetch="intent"
      className={({ isActive }) =>
        cn(
          "font-display group flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-[13px] transition-colors",
          isActive
            ? "bg-la-forest-wash text-la-forest font-semibold"
            : "text-la-ink-2 hover:bg-la-cream font-medium"
        )
      }
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <span className="flex size-4 shrink-0 items-center justify-center text-current">
          {item.icon}
        </span>
        <span className="truncate">{item.label}</span>
      </span>
      {item.badge != null && (
        <SidebarBadge badge={item.badge} tone={item.badgeTone} />
      )}
    </NavLink>
  );
}

function SidebarBadge({
  badge,
  tone,
}: {
  badge: number | string;
  tone?: NavBadgeTone;
}) {
  const toneClass =
    tone === "warn"
      ? "bg-(--color-la-amber) text-la-ink"
      : tone === "success"
        ? "bg-(--color-la-ok) text-la-paper"
        : "bg-(--color-la-rule-strong) text-la-ink-2";

  return (
    <span
      className={cn(
        "rounded-full px-2 py-px text-[11px] font-semibold tabular-nums",
        toneClass
      )}
    >
      {badge}
    </span>
  );
}
