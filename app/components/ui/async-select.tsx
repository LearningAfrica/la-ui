import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export interface AsyncSelectOption {
  value: string;
  label: string;
  [key: string]: unknown;
}

interface AsyncSelectProps {
  options?: AsyncSelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  onSearch?: (query: string) => void;
  searchFn?: (query: string) => Promise<AsyncSelectOption[]>;
  placeholder?: string;
  emptyText?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
}

export function AsyncSelect({
  options = [],
  value,
  onChange,
  onSearch,
  searchFn,
  placeholder = "Select...",
  emptyText = "No results found",
  multiple = false,
  disabled = false,
  className,
  isLoading = false,
}: AsyncSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredOptions, setFilteredOptions] =
    React.useState<AsyncSelectOption[]>(options);
  const [remoteOptions, setRemoteOptions] = React.useState<AsyncSelectOption[]>(
    []
  );
  const [loading, setLoading] = React.useState(false);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout>(null!);

  // Normalize value to array for easier handling
  const selectedValues = React.useMemo(() => {
    if (!value) return [];

    return Array.isArray(value) ? value : [value];
  }, [value]);

  // Get selected options
  const selectedOptions = React.useMemo(() => {
    const allOptions = searchFn ? remoteOptions : options;

    return allOptions.filter((opt) => selectedValues.includes(opt.value));
  }, [selectedValues, options, remoteOptions, searchFn]);

  // Handle remote search
  React.useEffect(() => {
    if (!searchFn) {
      // Local filtering
      const filtered = options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredOptions(filtered);

      return;
    }

    // Remote search with debounce
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery) {
      setRemoteOptions([]);

      return;
    }

    setLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchFn(searchQuery);

        setRemoteOptions(results);
      } catch (error) {
        console.error("Search error:", error);
        setRemoteOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, searchFn, options]);

  const displayOptions = searchFn ? remoteOptions : filteredOptions;

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];

      onChange?.(newValues);
    } else {
      onChange?.(optionValue);
      setOpen(false);
    }
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (multiple) {
      const newValues = selectedValues.filter((v) => v !== optionValue);

      onChange?.(newValues);
    } else {
      onChange?.("");
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(multiple ? [] : "");
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={cn(
          "w-full justify-between",
          !selectedValues.length && "text-muted-foreground"
        )}
      >
        <div className="flex flex-1 flex-wrap items-center gap-1">
          {selectedOptions.length > 0 ? (
            multiple ? (
              selectedOptions.map((opt) => (
                <Badge
                  key={opt.value}
                  variant="secondary"
                  className="mr-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {opt.label}
                  <button
                    type="button"
                    onClick={(e) => handleRemove(opt.value, e)}
                    className="hover:bg-muted ml-1 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <span>{selectedOptions[0]?.label}</span>
            )
          ) : (
            placeholder
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedValues.length > 0 && (
            <X
              className="h-4 w-4 opacity-50 hover:opacity-100"
              onClick={handleClear}
            />
          )}
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </div>
      </Button>

      {open && (
        <div className="border-border bg-popover text-popover-foreground absolute top-full z-50 mt-2 w-full rounded-md border shadow-md">
          <div className="p-2">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
              className="h-9"
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-y-auto p-1">
            {loading || isLoading ? (
              <div className="py-6 text-center text-sm">Loading...</div>
            ) : displayOptions.length === 0 ? (
              <div className="py-6 text-center text-sm">{emptyText}</div>
            ) : (
              displayOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value);

                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "relative flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none",
                      "hover:bg-accent hover:text-accent-foreground",
                      isSelected && "bg-accent"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
