import * as React from "react";

import Check from "~icons/lucide/check";
import ChevronsUpDown from "~icons/lucide/chevrons-up-down";
import Loader2 from "~icons/lucide/loader-2";
import X from "~icons/lucide/x";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * Combobox — single + multi-select picker with optional remote search.
 *
 * Built on the target's Popover + cmdk `Command` primitives so keyboard
 * navigation, focus management, and accessibility come for free.
 *
 * Three usage shapes, all driven by the same component:
 *
 *   1. Static single-select — pass `items` and `value: string | null`.
 *      cmdk filters items client-side as the user types.
 *   2. Static multi-select — same `items`, plus `multi`, plus
 *      `value: string[]`. Selected items render as removable chips.
 *   3. Remote search — instead of `items`, pass `onSearch(query, signal)
 *      => Promise<Item[]>`. Debounced; the parent owns the fetch and
 *      respects the AbortSignal for stale-query cancellation.
 */

export interface ComboboxItem {
  readonly value: string;
  readonly label: string;
  /** Optional secondary line shown smaller below `label`. */
  readonly description?: string;
  /** Marks the item unselectable but still rendered. */
  readonly disabled?: boolean;
}

interface BaseProps {
  readonly placeholder?: string;
  readonly searchPlaceholder?: string;
  readonly emptyMessage?: string;
  /**
   * Rendered inside the empty state, below `emptyMessage` — a quick action
   * (e.g. "+ Add category") so an operator who hits a dead-end list can
   * create the missing record inline instead of leaving the flow.
   */
  readonly emptyAction?: React.ReactNode;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly triggerClassName?: string;
  readonly contentClassName?: string;
  /** Aria label for assistive tech when there's no visible label. */
  readonly "aria-label"?: string;
  /**
   * If supplied, the Combobox renders a hidden `<input>` (single) or one
   * hidden `<input>` per value (multi) so it works inside a native
   * `<form>` without `event.preventDefault()`.
   */
  readonly name?: string;
  /** Optional id forwarded to the trigger for label `htmlFor`. */
  readonly id?: string;
}

interface StaticItemsProps extends BaseProps {
  readonly items: ReadonlyArray<ComboboxItem>;
  readonly onSearch?: never;
}

interface RemoteSearchProps extends BaseProps {
  readonly items?: never;
  /**
   * Called whenever the search input changes (after debounce). Return the
   * matching items. Use the supplied `signal` to abort stale fetches when
   * a newer query arrives.
   */
  readonly onSearch: (
    query: string,
    signal: AbortSignal
  ) => Promise<ReadonlyArray<ComboboxItem>>;
  /** Debounce window for the search input. Default 250ms. */
  readonly debounceMs?: number;
  /** Initial items shown before the user types. Optional. */
  readonly initialItems?: ReadonlyArray<ComboboxItem>;
}

interface SingleSelectProps {
  readonly value: string | null;
  readonly onChange: (value: string | null) => void;
  readonly multi?: false;
}

interface MultiSelectProps {
  readonly value: ReadonlyArray<string>;
  readonly onChange: (value: ReadonlyArray<string>) => void;
  readonly multi: true;
  /** Max number of selections; further picks are ignored. */
  readonly max?: number;
  /** Multi list indicator: a check icon (default) or a checkbox square. */
  readonly optionStyle?: "check" | "checkbox";
  /** 'inline' renders an always-open checkbox list (static items only). */
  readonly displayMode?: "popover" | "inline";
  /** How selected items render in popover mode: chips (default) or inline. */
  readonly selectedDisplay?: "chips" | "inline";
}

export type ComboboxProps = (StaticItemsProps | RemoteSearchProps) &
  (SingleSelectProps | MultiSelectProps);

export function Combobox(props: ComboboxProps) {
  const {
    placeholder = "Select…",
    searchPlaceholder = "Search…",
    emptyMessage = "No results.",
    emptyAction,
    disabled,
    className,
    triggerClassName,
    contentClassName,
    "aria-label": ariaLabel,
    name,
    id,
  } = props;

  // Narrow the discriminated union once via a runtime check; TS can't peer
  // through `'onSearch' in props` when static + remote both descend from
  // the same `BaseProps` shape.
  const remoteProps =
    typeof (props as RemoteSearchProps).onSearch === "function"
      ? (props as RemoteSearchProps)
      : null;
  const staticItems: ReadonlyArray<ComboboxItem> = remoteProps
    ? []
    : ((props as StaticItemsProps).items ?? []);

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [remoteItems, setRemoteItems] = React.useState<
    ReadonlyArray<ComboboxItem>
  >(remoteProps?.initialItems ?? []);
  const [loading, setLoading] = React.useState(false);

  // Stash the latest in-flight controller so a new query supersedes the
  // previous one.
  const abortRef = React.useRef<AbortController | null>(null);

  // Debounced remote search.
  React.useEffect(() => {
    if (!remoteProps) return;

    const debounceMs = remoteProps.debounceMs ?? 250;
    const timer = setTimeout(() => {
      abortRef.current?.abort();

      const controller = new AbortController();

      abortRef.current = controller;
      setLoading(true);
      remoteProps
        .onSearch(query, controller.signal)
        .then((items) => {
          if (!controller.signal.aborted) setRemoteItems(items);
        })
        .catch(() => {
          /* swallow aborts + transient errors; parent owns retry */
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, remoteProps]);

  const items: ReadonlyArray<ComboboxItem> = remoteProps
    ? remoteItems
    : staticItems;

  const selectedValues: ReadonlyArray<string> = props.multi
    ? props.value
    : props.value
      ? [props.value]
      : [];
  const selectedItems = items.filter((it) => selectedValues.includes(it.value));
  // Selected values that aren't in the current items list (e.g. came from a
  // previous remote-search page). Keep labels accurate when filtered out.
  const selectedFallback: ReadonlyArray<ComboboxItem> = selectedValues
    .filter((v) => !items.some((it) => it.value === v))
    .map((v) => ({ value: v, label: v }));

  function commitSingle(next: string | null) {
    if (!props.multi) {
      props.onChange(next);
      setOpen(false);
    }
  }

  function commitMulti(value: string) {
    if (!props.multi) return;

    const current = props.value;

    if (current.includes(value)) {
      props.onChange(current.filter((v) => v !== value));

      return;
    }

    if (props.max !== undefined && current.length >= props.max) return;

    props.onChange([...current, value]);
  }

  function clearAll(e: React.MouseEvent) {
    e.stopPropagation();

    if (props.multi) props.onChange([]);
    else props.onChange(null);
  }

  const buttonLabel: React.ReactNode = (() => {
    if (props.multi) {
      if (selectedValues.length === 0) return placeholder;

      return <span className="truncate">{selectedValues.length} selected</span>;
    }

    if (selectedItems[0]) {
      return <span className="truncate">{selectedItems[0].label}</span>;
    }

    if (selectedFallback[0]) {
      return (
        <span className="text-la-muted truncate">
          {selectedFallback[0].label}
        </span>
      );
    }

    return <span className="text-la-muted truncate">{placeholder}</span>;
  })();

  const hasSelection = selectedValues.length > 0;

  const optionStyle = props.multi ? (props.optionStyle ?? "check") : "check";
  const selectedDisplay = props.multi
    ? (props.selectedDisplay ?? "chips")
    : "chips";
  const inlineMode =
    props.multi && props.displayMode === "inline" && !("onSearch" in props);

  // One list row, shared by the popover list + the inline checklist.
  const renderRow = (
    it: ComboboxItem,
    isSelected: boolean,
    onPick: () => void
  ) => (
    <div
      key={it.value}
      role="option"
      aria-selected={isSelected}
      aria-disabled={it.disabled}
      onClick={() => {
        if (!it.disabled) onPick();
      }}
      className={cn(
        "hover:bg-la-cream text-la-ink flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 text-sm",
        it.disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {optionStyle === "checkbox" ? (
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => {}}
          tabIndex={-1}
          className="mt-0.5 shrink-0"
        />
      ) : (
        <Check
          className={cn(
            "mt-0.5 size-3.5 shrink-0",
            isSelected ? "text-la-forest" : "text-transparent"
          )}
        />
      )}
      <div className="min-w-0">
        <div className="truncate">{it.label}</div>
        {it.description ? (
          <div className="text-la-muted truncate text-xs">{it.description}</div>
        ) : null}
      </div>
    </div>
  );

  if (inlineMode) {
    return (
      <div
        className={cn("w-full", className)}
        role="listbox"
        aria-multiselectable
      >
        {name
          ? selectedValues.map((v, i) => (
              <input key={`${name}-${i}`} type="hidden" name={name} value={v} />
            ))
          : null}
        <div className="border-la-rule-strong bg-la-paper max-h-64 space-y-0.5 overflow-y-auto overscroll-contain rounded-md border p-1">
          {items.length === 0 ? (
            <div className="text-la-muted py-3 text-center text-xs">
              {emptyMessage}
            </div>
          ) : (
            items.map((it) =>
              renderRow(it, selectedValues.includes(it.value), () =>
                commitMulti(it.value)
              )
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {props.multi && selectedItems.length > 0 ? (
        selectedDisplay === "inline" ? (
          <div className="text-la-muted mb-1.5 text-xs">
            {[...selectedItems, ...selectedFallback]
              .map((it) => it.label)
              .join(", ")}
          </div>
        ) : (
          <div className="mb-1.5 flex flex-wrap gap-1">
            {[...selectedItems, ...selectedFallback].map((it) => (
              <span
                key={it.value}
                className="bg-la-forest-wash text-la-forest inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs"
              >
                {it.label}
                <button
                  type="button"
                  aria-label={`Remove ${it.label}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    commitMulti(it.value);
                  }}
                  className="hover:text-la-forest-deep"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )
      ) : null}

      {name && !props.multi ? (
        <input type="hidden" name={name} value={selectedValues[0] ?? ""} />
      ) : null}
      {name && props.multi
        ? selectedValues.map((v, i) => (
            <input key={`${name}-${i}`} type="hidden" name={name} value={v} />
          ))
        : null}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            id={id}
            disabled={disabled}
            aria-label={ariaLabel}
            aria-expanded={open}
            aria-haspopup="listbox"
            className={cn(
              "border-la-rule-strong bg-la-paper text-la-ink focus-visible:ring-ring flex h-10 w-full items-center justify-between gap-2 rounded-md border px-3 text-sm shadow-xs focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              triggerClassName
            )}
          >
            {buttonLabel}
            <div className="flex items-center gap-1">
              {hasSelection && !disabled ? (
                // A `<span role="button">`, not a `<button>` — the Radix
                // Trigger renders this whole control AS a `<button>` via
                // `asChild`, and a nested `<button>` is invalid HTML.
                // `tabIndex={-1}` keeps it out of tab order; `clearAll`
                // stops propagation so the popover stays shut.
                <span
                  role="button"
                  aria-label="Clear selection"
                  onClick={clearAll}
                  className="text-la-muted hover:text-la-ink inline-flex cursor-pointer"
                  tabIndex={-1}
                >
                  <X className="size-3.5" />
                </span>
              ) : null}
              <ChevronsUpDown className="text-la-muted size-3.5 shrink-0" />
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={4}
          className={cn(
            "border-la-rule-strong bg-la-paper w-[var(--radix-popover-trigger-width)] min-w-56 overflow-hidden p-0",
            contentClassName
          )}
        >
          <Command shouldFilter={!("onSearch" in props)}>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder={searchPlaceholder}
            />
            <CommandList className="max-h-[min(16rem,var(--radix-popover-content-available-height))] overflow-y-auto overscroll-contain p-1">
              {loading ? (
                <div className="text-la-muted flex items-center justify-center gap-2 py-3 text-center text-xs">
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Searching…</span>
                </div>
              ) : null}
              <CommandEmpty className="text-la-muted py-3 text-center text-xs">
                <span>{emptyMessage}</span>
                {emptyAction ? <div className="mt-2">{emptyAction}</div> : null}
              </CommandEmpty>
              <CommandGroup>
                {items.map((it) => {
                  const isSelected = selectedValues.includes(it.value);

                  return (
                    <CommandItem
                      key={it.value}
                      value={it.value}
                      keywords={[it.label, it.description ?? ""].filter(
                        Boolean
                      )}
                      disabled={it.disabled}
                      onSelect={() => {
                        if (it.disabled) return;

                        if (props.multi) commitMulti(it.value);
                        else commitSingle(isSelected ? null : it.value);
                      }}
                      className="hover:bg-la-cream data-[selected=true]:bg-la-cream items-start"
                    >
                      {optionStyle === "checkbox" ? (
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => {}}
                          tabIndex={-1}
                          className="mt-0.5 shrink-0"
                        />
                      ) : (
                        <Check
                          className={cn(
                            "mt-0.5 size-3.5 shrink-0",
                            isSelected ? "text-la-forest" : "text-transparent"
                          )}
                        />
                      )}
                      <div className="min-w-0">
                        <div className="truncate">{it.label}</div>
                        {it.description ? (
                          <div className="text-la-muted truncate text-xs">
                            {it.description}
                          </div>
                        ) : null}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
