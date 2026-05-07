import { LogOut } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  initials: string;
  name: string;
  email: string;
  onSignOut: () => void;
  /** Tile color tone */
  avatarTone?: "forest" | "ink" | "amber";
};

export function SidebarUserCard({
  initials,
  name,
  email,
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
    <div className="flex items-center gap-2.5">
      <span
        className={cn(
          "font-display grid size-9 shrink-0 place-items-center rounded text-[12px] font-semibold",
          tone
        )}
        aria-hidden
      >
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-display text-la-ink truncate text-[13px] font-semibold">
          {name}
        </div>
        <div className="text-la-muted truncate text-[11px]">{email}</div>
      </div>
      <button
        type="button"
        onClick={onSignOut}
        aria-label="Sign out"
        className="text-la-muted hover:bg-la-cream grid size-8 shrink-0 place-items-center rounded transition-colors hover:text-(--color-la-bad)"
      >
        <LogOut className="size-4" />
      </button>
    </div>
  );
}
