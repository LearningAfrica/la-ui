import { Building2, Check, LogOut, Settings, UserCircle2 } from "lucide-react";
import { Link } from "react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import type { ContextOption } from "./types";

type ContextGroup = { label?: string; ids: string[] };

type Props = {
  initials: string;
  name: string;
  email: string;
  profileTo: string;
  onSignOut: () => void;
  /** Override the avatar tile color (kept flat) */
  avatarTone?: "forest" | "ink" | "amber";
  /** All available workspaces/contexts (personal, orgs, platform). */
  contextOptions?: ContextOption[];
  /** Id of the context currently active. */
  currentContextId?: string;
  /** Optional grouping for the workspace list (e.g. You / Organizations / Platform). */
  contextGroups?: ContextGroup[];
  /** When provided, shown as a "View all organizations" link below the workspace list. */
  viewAllOrgsTo?: string;
};

export function UserMenu({
  initials,
  name,
  email,
  profileTo,
  onSignOut,
  avatarTone = "forest",
  contextOptions,
  currentContextId,
  contextGroups,
  viewAllOrgsTo,
}: Props) {
  const tone =
    avatarTone === "amber"
      ? "bg-(--color-la-amber) text-la-ink"
      : avatarTone === "ink"
        ? "bg-la-ink text-la-paper"
        : "bg-la-forest text-la-paper";

  const hasContexts = contextOptions != null && contextOptions.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className={cn(
            "font-display grid size-9 place-items-center rounded font-semibold",
            tone
          )}
        >
          {initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="border-la-rule bg-la-paper w-72 rounded border p-1"
      >
        <DropdownMenuLabel className="px-2 py-1.5">
          <div className="font-display text-la-ink truncate text-[13px] font-semibold">
            {name}
          </div>
          <div className="text-la-muted truncate text-[11px]">{email}</div>
        </DropdownMenuLabel>

        {hasContexts && (
          <>
            <DropdownMenuSeparator className="bg-la-rule" />
            <WorkspaceSection
              options={contextOptions}
              currentId={currentContextId}
              groups={contextGroups}
              viewAllOrgsTo={viewAllOrgsTo}
            />
          </>
        )}

        <DropdownMenuSeparator className="bg-la-rule" />
        <DropdownMenuItem asChild>
          <Link
            to={profileTo}
            prefetch="intent"
            className="text-la-ink-2 hover:bg-la-cream flex items-center gap-2 rounded px-2 py-1.5 text-[13px]"
          >
            <UserCircle2 className="size-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to={profileTo}
            prefetch="intent"
            className="text-la-ink-2 hover:bg-la-cream flex items-center gap-2 rounded px-2 py-1.5 text-[13px]"
          >
            <Settings className="size-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-la-rule" />
        <DropdownMenuItem
          onClick={onSignOut}
          className="flex items-center gap-2 rounded px-2 py-1.5 text-[13px] text-(--color-la-bad) hover:bg-(--color-la-bad)/10"
        >
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function WorkspaceSection({
  options,
  currentId,
  groups,
  viewAllOrgsTo,
}: {
  options: ContextOption[];
  currentId?: string;
  groups?: ContextGroup[];
  viewAllOrgsTo?: string;
}) {
  return (
    <>
      <div className="font-display text-la-muted px-2.5 pt-2 pb-1 text-[10px] font-medium tracking-[0.15em] uppercase">
        Switch workspace
      </div>

      {groups
        ? groups.map((g, idx) => {
            const items = options.filter((o) => g.ids.includes(o.id));

            if (items.length === 0) return null;

            return (
              <div key={g.label ?? `group-${idx}`} className="mb-0.5">
                {g.label && (
                  <div className="text-la-muted px-2.5 pt-1 pb-0.5 text-[10px] tracking-wide">
                    {g.label}
                  </div>
                )}
                {items.map((opt) => (
                  <WorkspaceItem
                    key={opt.id}
                    option={opt}
                    active={opt.id === currentId}
                  />
                ))}
              </div>
            );
          })
        : options.map((opt) => (
            <WorkspaceItem
              key={opt.id}
              option={opt}
              active={opt.id === currentId}
            />
          ))}

      {viewAllOrgsTo && (
        <DropdownMenuItem asChild>
          <Link
            to={viewAllOrgsTo}
            prefetch="intent"
            className="text-la-ink-2 hover:bg-la-cream mt-0.5 flex items-center gap-2 rounded px-2 py-1.5 text-[12px]"
          >
            <Building2 className="size-3.5" />
            View all organizations
          </Link>
        </DropdownMenuItem>
      )}
    </>
  );
}

function WorkspaceItem({
  option,
  active,
}: {
  option: ContextOption;
  active: boolean;
}) {
  const className = cn(
    "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[13px]",
    active
      ? "bg-la-forest-wash text-la-forest"
      : "text-la-ink-2 hover:bg-la-cream"
  );

  const tile = (
    <span
      aria-hidden
      className={cn(
        "font-display flex size-7 shrink-0 items-center justify-center rounded text-[11px] font-semibold",
        option.kind === "platform"
          ? "text-la-ink bg-(--color-la-amber)"
          : option.kind === "personal"
            ? "bg-la-ink text-la-paper"
            : "bg-la-forest text-la-paper"
      )}
    >
      {option.initials ?? option.label.slice(0, 2).toUpperCase()}
    </span>
  );

  const body = (
    <>
      {tile}
      <div className="min-w-0 flex-1">
        <div className="font-display truncate font-medium">{option.label}</div>
        {option.hint && (
          <div className="text-la-muted truncate text-[11px]">
            {option.hint}
          </div>
        )}
      </div>
      {active && <Check className="text-la-forest size-3.5 shrink-0" />}
    </>
  );

  if (option.onSelect) {
    return (
      <DropdownMenuItem asChild>
        <button type="button" onClick={option.onSelect} className={className}>
          {body}
        </button>
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem asChild>
      <Link to={option.to} prefetch="intent" className={className}>
        {body}
      </Link>
    </DropdownMenuItem>
  );
}
