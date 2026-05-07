import { LogOut, Settings, UserCircle2 } from "lucide-react";
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

type Props = {
  initials: string;
  name: string;
  email: string;
  profileTo: string;
  onSignOut: () => void;
  /** Override the avatar tile color (kept flat) */
  avatarTone?: "forest" | "ink" | "amber";
};

export function UserMenu({
  initials,
  name,
  email,
  profileTo,
  onSignOut,
  avatarTone = "forest",
}: Props) {
  const tone =
    avatarTone === "amber"
      ? "bg-(--color-la-amber) text-la-ink"
      : avatarTone === "ink"
        ? "bg-la-ink text-la-paper"
        : "bg-la-forest text-la-paper";

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
        className="border-la-rule bg-la-paper w-60 rounded border p-1"
      >
        <DropdownMenuLabel className="px-2 py-1.5">
          <div className="font-display text-la-ink truncate text-[13px] font-semibold">
            {name}
          </div>
          <div className="text-la-muted truncate text-[11px]">{email}</div>
        </DropdownMenuLabel>
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
