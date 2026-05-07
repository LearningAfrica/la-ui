import { Bell, Menu, Search } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

type Crumb = {
  label: string;
  to?: string;
};

type Props = {
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  action?: React.ReactNode;
  rightSlot?: React.ReactNode;
  /** Mobile menu trigger — rendered only when provided + on small screens */
  onMenuClick?: () => void;
  className?: string;
};

export function DashTopbar({
  title,
  subtitle,
  crumbs,
  action,
  rightSlot,
  onMenuClick,
  className,
}: Props) {
  return (
    <header
      className={cn(
        "border-la-rule bg-la-paper flex h-16 items-center gap-3 border-b px-3 sm:px-4",
        className
      )}
    >
      {onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="text-la-ink-2 hover:bg-la-cream grid size-9 shrink-0 place-items-center rounded transition-colors lg:hidden"
        >
          <Menu className="size-5" />
        </button>
      )}

      <div className="min-w-0 flex-1">
        {crumbs && crumbs.length > 0 && (
          <nav className="font-display text-la-muted mb-0.5 hidden items-center gap-1 truncate text-[11px] sm:flex">
            {crumbs.map((c, i) => (
              <span key={`${c.label}-${i}`} className="flex items-center gap-1">
                {i > 0 && <span aria-hidden>/</span>}
                {c.to ? (
                  <a href={c.to} className="hover:text-la-ink-2">
                    {c.label}
                  </a>
                ) : (
                  <span className="truncate">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-display text-la-ink truncate text-[18px] font-medium tracking-tight sm:text-[20px]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-la-muted hidden truncate text-[12px] sm:block">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {action}
        <SearchInput />
        <ThemeToggle />
        <button
          type="button"
          aria-label="Notifications"
          className="text-la-ink-2 hover:bg-la-cream relative grid size-9 place-items-center rounded transition-colors"
        >
          <Bell className="size-4" />
        </button>
        {rightSlot}
      </div>
    </header>
  );
}

function SearchInput() {
  return (
    <div className="relative hidden md:block">
      <Search className="text-la-muted pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
      <input
        type="search"
        placeholder="Search…"
        className="border-la-rule bg-la-cream font-display text-la-ink placeholder:text-la-muted focus:ring-la-forest h-9 w-48 rounded border px-8 text-[13px] outline-none focus:ring-1 lg:w-56"
      />
    </div>
  );
}
