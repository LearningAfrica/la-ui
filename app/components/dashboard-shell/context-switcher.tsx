import { Check, ChevronsUpDown } from "lucide-react";
import { Link } from "react-router";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import type { ContextOption } from "./types";

type Props = {
  current: ContextOption;
  options: ContextOption[];
  /** Optional grouping in popover (Personal / Organizations / Platform) */
  groups?: { label: string; ids: string[] }[];
};

export function ContextSwitcher({ current, options, groups }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="border-la-rule bg-la-paper hover:bg-la-cream flex w-full items-center gap-2 rounded border px-2.5 py-2 text-left transition-colors"
        >
          <ContextTile option={current} />
          <div className="min-w-0 flex-1">
            <div className="font-display text-la-ink truncate text-[13px] font-semibold">
              {current.label}
            </div>
            {current.hint && (
              <div className="text-la-muted truncate text-[11px]">
                {current.hint}
              </div>
            )}
          </div>
          <ChevronsUpDown className="text-la-muted size-4 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={6}
        className="border-la-rule bg-la-paper w-[260px] rounded border p-1 shadow-md"
      >
        {groups
          ? groups.map((g) => {
              const items = options.filter((o) => g.ids.includes(o.id));

              if (items.length === 0) return null;

              return (
                <div key={g.label} className="mb-1 last:mb-0">
                  <div className="font-display text-la-muted px-2.5 pt-2 pb-1 text-[10px] font-medium tracking-[0.12em] uppercase">
                    {g.label}
                  </div>
                  {items.map((opt) => (
                    <SwitcherItem
                      key={opt.id}
                      option={opt}
                      active={opt.id === current.id}
                    />
                  ))}
                </div>
              );
            })
          : options.map((opt) => (
              <SwitcherItem
                key={opt.id}
                option={opt}
                active={opt.id === current.id}
              />
            ))}
      </PopoverContent>
    </Popover>
  );
}

function SwitcherItem({
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
  const inner = (
    <>
      <ContextTile option={option} small />
      <div className="min-w-0 flex-1">
        <div className="font-display truncate font-medium">{option.label}</div>
        {option.hint && (
          <div className="text-la-muted truncate text-[11px]">
            {option.hint}
          </div>
        )}
      </div>
      {active && <Check className="text-la-forest size-3.5" />}
    </>
  );

  if (option.onSelect) {
    return (
      <button type="button" onClick={option.onSelect} className={className}>
        {inner}
      </button>
    );
  }

  return (
    <Link to={option.to} prefetch="intent" className={className}>
      {inner}
    </Link>
  );
}

function ContextTile({
  option,
  small,
}: {
  option: ContextOption;
  small?: boolean;
}) {
  const size = small ? "size-7" : "size-9";
  const text = small ? "text-[11px]" : "text-[13px]";
  const tone =
    option.kind === "platform"
      ? "bg-(--color-la-amber) text-la-ink"
      : option.kind === "personal"
        ? "bg-la-ink text-la-paper"
        : "bg-la-forest text-la-paper";

  return (
    <span
      className={cn(
        size,
        text,
        tone,
        "font-display flex shrink-0 items-center justify-center rounded font-semibold"
      )}
      aria-hidden
    >
      {option.initials ?? option.label.slice(0, 2).toUpperCase()}
    </span>
  );
}
