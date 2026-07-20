import type { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Combobox, type ComboboxItem } from "@/components/ui/combobox";

interface BaseFormComboboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  searchPlaceholder?: string;
  /** Message shown when the list is empty. */
  emptyMessage?: string;
  /** Quick action rendered in the empty dropdown (e.g. "+ Add type"). */
  emptyAction?: React.ReactNode;
  /** Static options for client-side filtering. */
  items?: ReadonlyArray<ComboboxItem>;
  /**
   * Async loader called after the user types (post-debounce). Return
   * matching items. Use the supplied `signal` to abort stale fetches.
   */
  onSearch?: (
    query: string,
    signal: AbortSignal
  ) => Promise<ReadonlyArray<ComboboxItem>>;
  /** Items rendered before the user types (remote mode). */
  initialItems?: ReadonlyArray<ComboboxItem>;
  /** Debounce window for the search input. Default 250ms. */
  debounceMs?: number;
}

interface SingleFormComboboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormComboboxFieldProps<TFieldValues, TName> {
  multiple?: false;
  /** Value passed to `onChange` when the user clears the selection. */
  clearedValue?: string | null | undefined;
}

interface MultiFormComboboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormComboboxFieldProps<TFieldValues, TName> {
  multiple: true;
  /** Max number of selections. */
  max?: number;
}

type FormComboboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> =
  | SingleFormComboboxFieldProps<TFieldValues, TName>
  | MultiFormComboboxFieldProps<TFieldValues, TName>;

/**
 * Form field wrapper for the {@link Combobox} that integrates with
 * react-hook-form. Supports single/multi-select and static/remote search.
 *
 * @example
 * <FormComboboxField
 *   control={control}
 *   name="categoryId"
 *   label="Category"
 *   items={categoryItems}
 *   required
 * />
 *
 * @example
 * <FormComboboxField
 *   control={control}
 *   name="tags"
 *   label="Tags"
 *   multiple
 *   onSearch={(q, signal) => searchTags(q, signal)}
 * />
 */
export function FormComboboxField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: FormComboboxFieldProps<TFieldValues, TName>) {
  const {
    control,
    name,
    label,
    placeholder,
    required = false,
    disabled = false,
    className,
    description,
    searchPlaceholder,
    emptyMessage,
    emptyAction,
    items,
    onSearch,
    initialItems,
    debounceMs,
  } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const shared = {
          placeholder,
          searchPlaceholder,
          emptyMessage,
          emptyAction,
          disabled,
        } as const;
        const source = onSearch
          ? ({ onSearch, initialItems, debounceMs } as const)
          : ({ items: items ?? [] } as const);

        const single = {
          value:
            field.value === undefined ||
            field.value === null ||
            field.value === ""
              ? null
              : String(field.value),
          onChange: (v: string | null) =>
            field.onChange(
              v ?? (props.multiple ? undefined : props.clearedValue)
            ),
        };
        const multi = {
          multi: true as const,
          max: props.multiple ? props.max : undefined,
          value: (Array.isArray(field.value)
            ? field.value
            : []) as ReadonlyArray<string>,
          onChange: (v: ReadonlyArray<string>) => field.onChange([...v]),
        };

        return (
          <FormItem className={className}>
            <FormLabel>
              {label} {required && <span className="text-la-bad">*</span>}
            </FormLabel>
            {description && (
              <p className="text-la-muted mb-1 text-sm">{description}</p>
            )}
            <FormControl>
              {props.multiple ? (
                "onSearch" in source ? (
                  <Combobox {...shared} {...multi} {...source} />
                ) : (
                  <Combobox {...shared} {...multi} {...source} />
                )
              ) : "onSearch" in source ? (
                <Combobox {...shared} {...single} {...source} />
              ) : (
                <Combobox {...shared} {...single} {...source} />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export type { ComboboxItem };
