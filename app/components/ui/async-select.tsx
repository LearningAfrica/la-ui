import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Loader2, ChevronDown, X } from "lucide-react";

/**
 * Represents a single selectable option in the dropdown.
 *
 * @interface SelectOption
 * @property {string | number} value - Unique identifier for the option
 * @property {string} label - Display text shown to the user
 */
export interface SelectOption {
  value: string | number;
  label: string;
}

/**
 * Type helper that determines the onChange callback signature based on whether
 * the select is in multiple mode or not.
 *
 * @template T - Boolean indicating if multiple mode is enabled
 */
type SelectOnChange<T extends boolean> = T extends true
  ? (value: (string | number)[]) => void
  : (value: string | number | null) => void;

/**
 * Base props shared between single and multi-select modes.
 *
 * @interface BaseSelectProps
 */
interface BaseSelectProps {
  /** Placeholder text displayed when no value is selected */
  placeholder?: string;
  /** Whether the select component is disabled */
  disabled?: boolean;
  /** Local options array for client-side filtering (local mode) */
  options?: SelectOption[];
  /** Async function to fetch options from server (server mode) */
  onSearch?: (query: string) => Promise<SelectOption[]>;
  /** Debounce delay in milliseconds for server searches */
  searchDebounceMs?: number;
  /** Minimum number of characters required before triggering server search */
  minSearchLength?: number;
  /** Additional CSS classes to apply to the container */
  className?: string;
  /** External loading state override */
  loading?: boolean;
  /** Message displayed when no options are available */
  noOptionsMessage?: string;
}

/**
 * Props for single-select mode.
 * When multiple is false or omitted, value and onChange use single value types.
 *
 * @interface SingleSelectProps
 * @extends BaseSelectProps
 */
interface SingleSelectProps extends BaseSelectProps {
  /** Must be false or omitted for single-select mode */
  multiple?: false;
  /** Currently selected value (single value or null) */
  value?: string | number | null;
  /** Callback fired when selection changes (receives single value) */
  onChange?: (value: string | number | null) => void;
}

/**
 * Props for multi-select mode.
 * When multiple is true, value and onChange use array types.
 *
 * @interface MultiSelectProps
 * @extends BaseSelectProps
 */
interface MultiSelectProps extends BaseSelectProps {
  /** Must be true for multi-select mode */
  multiple: true;
  /** Currently selected values (array) */
  value?: (string | number)[];
  /** Callback fired when selection changes (receives array of values) */
  onChange?: (value: (string | number)[]) => void;
}

/**
 * Union type representing either single or multi-select props.
 * TypeScript uses discriminated unions to ensure type safety.
 */
type SelectProps = SingleSelectProps | MultiSelectProps;

/**
 * A flexible select component supporting both single and multi-select modes,
 * with local or server-side option fetching.
 *
 * Features:
 * - Single and multi-select modes with type-safe props
 * - Local mode: Client-side filtering with options array
 * - Server mode: Async fetching with debouncing and caching
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Loading states and error handling
 * - Accessible with ARIA labels
 *
 * @component
 * @param {SelectProps} props - Component props (single or multi-select)
 * @returns {JSX.Element} The rendered select component
 *
 * @example
 * // Single select with local options
 * <AsyncSelect
 *   value={selected}
 *   onChange={setSelected}
 *   options={localOptions}
 *   placeholder="Choose an option..."
 * />
 *
 * @example
 * // Multi-select with server search
 * <AsyncSelect
 *   multiple
 *   value={selected}
 *   onChange={setSelected}
 *   onSearch={fetchOptions}
 *   minSearchLength={2}
 * />
 */
export default function AsyncSelect(props: SelectProps) {
  const {
    placeholder = "Select an option...",
    disabled = false,
    options: localOptions,
    onSearch,
    searchDebounceMs = 300,
    minSearchLength = 0,
    className = "",
    loading: externalLoading,
    noOptionsMessage = "No options found",
    multiple = false,
    value,
    onChange,
  } = props;

  /** Controls dropdown open/closed state */
  const [isOpen, setIsOpen] = useState(false);
  /** Current search query text */
  const [searchQuery, setSearchQuery] = useState("");
  /** Options fetched from server (only used in server mode) */
  const [serverOptions, setServerOptions] = useState<SelectOption[]>([]);
  /** Internal loading state for async operations */
  const [loading, setLoading] = useState(false);
  /** Index of currently highlighted option for keyboard navigation */
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  /**
   * Cache of selected options by value.
   * Critical for server mode: stores selected option labels even when
   * they're not in current search results, ensuring proper display.
   */
  const [selectedOptionsCache, setSelectedOptionsCache] = useState<
    Map<string | number, SelectOption>
  >(new Map());

  /** Ref to the container div for click-outside detection */
  const containerRef = useRef<HTMLDivElement>(null);
  /** Ref to the search input element */
  const inputRef = useRef<HTMLInputElement>(null);
  /** Ref to the options container for scrolling */
  const optionsRef = useRef<HTMLDivElement>(null);
  /** Ref to store debounce timer ID for cleanup */
  const debounceTimerRef = useRef<number | undefined>(undefined);

  /** Determines if component is in server search mode (has onSearch prop) */
  const isServerMode = !!onSearch;
  /** Options to display: server options in server mode, local options otherwise */
  const displayOptions = isServerMode ? serverOptions : localOptions || [];

  /**
   * Converts the value prop to a normalized array format.
   * In single mode: converts single value to array, null/undefined to empty array.
   * In multi mode: returns the array directly, or empty array if invalid.
   *
   * @returns {Array<string | number>} Array of selected values
   */
  const selectedValues = useMemo((): (string | number)[] => {
    if (multiple) {
      return Array.isArray(value) ? value : [];
    } else {
      return value !== null && value !== undefined
        ? [value as string | number]
        : [];
    }
  }, [multiple, value]);

  /**
   * Retrieves the full SelectOption objects for currently selected values.
   * In server mode: uses the cache to look up options by value.
   * In local mode: filters the local options array.
   *
   * @returns {SelectOption[]} Array of selected option objects with labels
   */
  const getSelectedOptions = useCallback((): SelectOption[] => {
    if (isServerMode) {
      // Use cache for server mode - ensures we have labels even when option
      // is not in current search results
      return selectedValues
        .map((val: string | number) => selectedOptionsCache.get(val))
        .filter((opt): opt is SelectOption => opt !== undefined);
    } else {
      // Use local options - simple filter operation
      return (localOptions || []).filter((opt) =>
        selectedValues.includes(opt.value)
      );
    }
  }, [selectedValues, isServerMode, selectedOptionsCache, localOptions]);

  const selectedOptions = getSelectedOptions();

  /**
   * Display text for single-select mode.
   * Shows the label of the selected option, or empty string if none selected.
   */
  const displayValue =
    !multiple && selectedOptions.length > 0 ? selectedOptions[0].label : "";

  /**
   * Filters local options based on search query (case-insensitive).
   * Only used in local mode - server mode uses serverOptions instead.
   */
  const filteredLocalOptions =
    localOptions?.filter((opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  /** Final list of options to display in the dropdown */
  const finalOptions = isServerMode ? displayOptions : filteredLocalOptions;

  /**
   * Handles selection of an option from the dropdown.
   *
   * Behavior differs by mode:
   * - Single mode: Sets value and closes dropdown
   * - Multi mode: Toggles option (adds if not selected, removes if selected)
   *
   * In server mode, updates the cache to store the selected option's label.
   *
   * @param {SelectOption} option - The option that was selected
   */
  const handleSelect = useCallback(
    (option: SelectOption) => {
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        const isSelected = currentValues.includes(option.value);

        let newValues: (string | number)[];

        if (isSelected) {
          newValues = currentValues.filter((v) => v !== option.value);
        } else {
          newValues = [...currentValues, option.value];
        }

        // Update cache
        if (isServerMode) {
          setSelectedOptionsCache((prev) => {
            const newCache = new Map(prev);

            if (isSelected) {
              newCache.delete(option.value);
            } else {
              newCache.set(option.value, option);
            }

            return newCache;
          });
        }

        (onChange as SelectOnChange<true>)?.(newValues);

        // Don't close dropdown in multiselect mode
        if (!isSelected) {
          setSearchQuery("");
          setHighlightedIndex(-1);
        }
      } else {
        // Update cache for server mode
        if (isServerMode) {
          setSelectedOptionsCache((prev) => {
            const newCache = new Map(prev);

            newCache.set(option.value, option);

            return newCache;
          });
        }

        (onChange as SelectOnChange<false>)?.(option.value);
        setIsOpen(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
        inputRef.current?.blur();
      }
    },
    [multiple, value, onChange, isServerMode]
  );

  /**
   * Fetches options from the server using the onSearch function.
   *
   * - Respects minSearchLength (returns empty if query too short)
   * - Updates serverOptions with results
   * - Updates cache if fetched results include selected values
   * - Handles errors gracefully (logs and sets empty array)
   *
   * @param {string} query - Search query string
   * @returns {Promise<void>}
   */
  const fetchServerOptions = useCallback(
    async (query: string) => {
      if (!onSearch) return;

      if (query.length < minSearchLength) {
        setServerOptions([]);

        return;
      }

      setLoading(true);

      try {
        const results = await onSearch(query);

        setServerOptions(results);

        // Update cache with fetched results if they match selected values
        setSelectedOptionsCache((prev) => {
          const newCache = new Map(prev);

          results.forEach((opt) => {
            if (selectedValues.includes(opt.value)) {
              newCache.set(opt.value, opt);
            }
          });

          return newCache;
        });
      } catch (error) {
        console.error("Error fetching options:", error);
        setServerOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [onSearch, minSearchLength, selectedValues]
  );

  /**
   * Debounced search effect for server mode.
   *
   * Waits for user to stop typing (debounceMs) before fetching.
   * Cleans up previous timer if query changes before debounce completes.
   * Only runs in server mode.
   *
   * @effect
   * @dependencies searchQuery, isServerMode, fetchServerOptions, searchDebounceMs
   */
  useEffect(() => {
    if (!isServerMode) return;

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      fetchServerOptions(searchQuery);
    }, searchDebounceMs);

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, isServerMode, fetchServerOptions, searchDebounceMs]);

  /**
   * Closes dropdown when user clicks outside the component.
   *
   * Uses mousedown event (instead of click) for better UX.
   * Resets search query and highlighted index when closing.
   *
   * @effect
   * @dependencies [] - Only runs once on mount, cleanup on unmount
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Keyboard navigation handler.
   *
   * Supported keys:
   * - ArrowDown: Move highlight down (wraps at bottom)
   * - ArrowUp: Move highlight up (stops at top)
   * - Enter: Select highlighted option
   * - Escape: Close dropdown and reset
   *
   * Only active when dropdown is open.
   *
   * @effect
   * @dependencies isOpen, highlightedIndex, finalOptions, handleSelect
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < finalOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          e.preventDefault();

          if (highlightedIndex >= 0 && finalOptions[highlightedIndex]) {
            handleSelect(finalOptions[highlightedIndex]);
          }

          break;
        case "Escape":
          setIsOpen(false);
          setSearchQuery("");
          setHighlightedIndex(-1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, highlightedIndex, finalOptions, handleSelect]);

  /**
   * Auto-scrolls highlighted option into view when navigating with keyboard.
   *
   * Uses 'nearest' block to minimize scrolling, 'smooth' for better UX.
   * Only scrolls if option is not already visible.
   *
   * @effect
   * @dependencies highlightedIndex
   */
  useEffect(() => {
    if (highlightedIndex >= 0 && optionsRef.current) {
      const optionElement = optionsRef.current.children[
        highlightedIndex
      ] as HTMLElement;

      if (optionElement) {
        optionElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [highlightedIndex]);

  /**
   * Toggles dropdown open/closed state.
   *
   * When opening:
   * - Focuses the input for immediate typing
   * - Triggers server fetch if in server mode and query meets min length
   *
   * When closing:
   * - Resets search query and highlighted index
   */
  const handleToggle = () => {
    if (disabled) return;

    setIsOpen(!isOpen);

    if (!isOpen) {
      inputRef.current?.focus();

      if (isServerMode && searchQuery.length >= minSearchLength) {
        fetchServerOptions(searchQuery);
      }
    } else {
      setSearchQuery("");
      setHighlightedIndex(-1);
    }
  };

  /**
   * Handles search input changes.
   *
   * - Updates search query state
   * - Opens dropdown if closed
   * - Resets highlighted index (new search = start from top)
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;

    setSearchQuery(query);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  /**
   * Clears all selections.
   *
   * - Resets value to null (single) or [] (multi)
   * - Clears the options cache
   * - Closes dropdown and resets search
   *
   * @param {React.MouseEvent} e - Click event
   */
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (multiple) {
      (onChange as SelectOnChange<true>)?.([]);
    } else {
      (onChange as SelectOnChange<false>)?.(null);
    }

    setSelectedOptionsCache(new Map());
    setSearchQuery("");
    setIsOpen(false);
  };

  /**
   * Removes a single tag in multi-select mode.
   *
   * - Filters out the value from the selected array
   * - Updates cache in server mode
   * - Prevents event propagation to avoid toggling dropdown
   *
   * @param {React.MouseEvent} e - Click event
   * @param {string | number} valueToRemove - Value of the tag to remove
   */
  const handleRemoveTag = (
    e: React.MouseEvent,
    valueToRemove: string | number
  ) => {
    e.stopPropagation();

    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.filter((v) => v !== valueToRemove);

      (onChange as SelectOnChange<true>)?.(newValues);

      // Update cache
      if (isServerMode) {
        setSelectedOptionsCache((prev) => {
          const newCache = new Map(prev);

          newCache.delete(valueToRemove);

          return newCache;
        });
      }
    }
  };

  /** Combined loading state: external prop or internal async loading */
  const isLoading = externalLoading || loading;

  /** Whether any value is currently selected. Empty strings count as empty
   *  so the placeholder stays visible for unselected required fields. */
  const hasValue = multiple
    ? Array.isArray(value) && value.length > 0
    : value !== null && value !== undefined && value !== "";

  /** Whether to show the search input (open or has search query) */
  const showInput = isOpen || searchQuery.length > 0;

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <div
        className={`border-input bg-background box-border flex min-h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border px-3 py-2 transition-all duration-200 ${multiple ? "min-h-0 py-1.5" : ""} ${!disabled && "hover:border-ring/60"} ${isOpen ? "border-ring ring-ring/30 ring-[3px]" : ""} ${disabled ? "bg-muted cursor-not-allowed opacity-60" : ""} `}
        onClick={handleToggle}
      >
        <div className="flex min-w-0 flex-1 items-center">
          {multiple && selectedOptions.length > 0 ? (
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
              {selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="bg-primary/10 text-primary inline-flex shrink-0 items-center gap-1 rounded px-2 py-1 text-sm leading-5"
                >
                  <span className="max-w-37.5 overflow-hidden text-ellipsis whitespace-nowrap">
                    {option.label}
                  </span>
                  <button
                    type="button"
                    className="text-primary/70 hover:bg-primary/20 hover:text-primary flex shrink-0 cursor-pointer items-center justify-center rounded border-none bg-transparent p-0 transition-all duration-150"
                    onClick={(e) => handleRemoveTag(e, option.value)}
                    aria-label={`Remove ${option.label}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {showInput && (
                <input
                  ref={inputRef}
                  type="text"
                  className="placeholder:text-muted-foreground text-foreground font-inherit min-w-20 flex-auto border-none bg-transparent p-0 outline-none"
                  value={searchQuery}
                  onChange={handleInputChange}
                  placeholder={selectedOptions.length === 0 ? placeholder : ""}
                  disabled={disabled}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          ) : !showInput ? (
            <span
              className={`text-foreground flex-1 overflow-hidden text-left text-ellipsis whitespace-nowrap ${!hasValue ? "text-muted-foreground" : ""}`}
            >
              {hasValue ? displayValue : placeholder}
            </span>
          ) : (
            <input
              ref={inputRef}
              type="text"
              className="text-foreground placeholder:text-muted-foreground font-inherit w-full min-w-12.5 flex-1 border-none bg-transparent p-0 outline-none"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder={placeholder}
              disabled={disabled}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
        <div className="ml-2 flex items-center gap-2">
          {isLoading && (
            <Loader2 className="text-primary animate-spin" size={16} />
          )}
          {hasValue && !disabled && !isLoading && (
            <button
              type="button"
              className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0.5 transition-all duration-200"
              onClick={handleClear}
              aria-label="Clear selection"
            >
              <X size={16} />
            </button>
          )}
          <ChevronDown
            className={`text-muted-foreground shrink-0 transition-transform duration-200 select-none ${isOpen ? "rotate-180" : ""}`}
            size={16}
          />
        </div>
      </div>

      {isOpen && (
        <div className="bg-popover text-popover-foreground border-border absolute top-[calc(100%+4px)] right-0 left-0 z-1000 max-h-75 animate-[slideDown_0.2s_ease_forwards] overflow-hidden rounded-md border shadow-lg">
          {isLoading ? (
            <div className="text-primary flex items-center justify-center gap-2 p-4 text-center text-sm">
              <Loader2 className="animate-spin" size={20} />
              <span>Loading...</span>
            </div>
          ) : finalOptions.length === 0 ? (
            <div className="text-muted-foreground flex items-center justify-center gap-2 p-4 text-center text-sm">
              {noOptionsMessage}
            </div>
          ) : (
            <div
              className="[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50 [&::-webkit-scrollbar-track]:bg-muted/40 max-h-75 overflow-y-auto p-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-track]:rounded"
              ref={optionsRef}
            >
              {finalOptions.map((option, index) => {
                const isSelected = multiple
                  ? Array.isArray(value) && value.includes(option.value)
                  : value === option.value;

                return (
                  <div
                    key={option.value}
                    className={`text-popover-foreground flex cursor-pointer items-center gap-2 rounded px-3 py-2.5 transition-colors duration-150 ${
                      isSelected
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-accent hover:text-accent-foreground"
                    } ${
                      index === highlightedIndex
                        ? isSelected
                          ? "bg-primary/20"
                          : "bg-accent text-accent-foreground"
                        : ""
                    } `}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {multiple && (
                      <span
                        className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 text-xs transition-all duration-150 ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-background"
                        } `}
                      >
                        {isSelected ? "✓" : ""}
                      </span>
                    )}
                    <span>{option.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
