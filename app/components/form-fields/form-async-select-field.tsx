import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import AsyncSelect, { type SelectOption } from "@/components/ui/async-select";

interface BaseFormAsyncSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  testId?: string;
  labelTestId?: string;
  className?: string;
  description?: string;
  /** Local options array for client-side filtering */
  options?: SelectOption[];
  /** Async function to fetch options from server */
  onSearch?: (query: string) => Promise<SelectOption[]>;
  /** Debounce delay in milliseconds for server searches */
  searchDebounceMs?: number;
  /** Minimum number of characters required before triggering server search */
  minSearchLength?: number;
  /** External loading state override */
  loading?: boolean;
  /** Message displayed when no options are available */
  noOptionsMessage?: string;
}

/**
 * Props for single-select mode.
 */
interface SingleFormAsyncSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormAsyncSelectFieldProps<TFieldValues, TName> {
  /** Must be false or omitted for single-select mode */
  multiple?: false;
}

/**
 * Props for multi-select mode.
 */
interface MultiFormAsyncSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormAsyncSelectFieldProps<TFieldValues, TName> {
  /** Must be true for multi-select mode */
  multiple: true;
}

/**
 * Union type representing either single or multi-select form field props.
 */
type FormAsyncSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> =
  | SingleFormAsyncSelectFieldProps<TFieldValues, TName>
  | MultiFormAsyncSelectFieldProps<TFieldValues, TName>;

/**
 * Form field wrapper for AsyncSelect component that integrates with react-hook-form.
 *
 * Supports both single and multi-select modes with local or server-side data fetching.
 *
 * @component
 * @param {FormAsyncSelectFieldProps} props - Component props
 * @returns {JSX.Element} The rendered form field
 *
 * @example
 * // Single select with server search
 * <FormAsyncSelectField
 *   control={control}
 *   name="userId"
 *   label="Select User"
 *   onSearch={async (query) => {
 *     const results = await fetchUsers(query);
 *     return results.map(user => ({
 *       value: user.id,
 *       label: `${user.first_name} ${user.last_name}`
 *     }));
 *   }}
 *   minSearchLength={2}
 *   required
 * />
 *
 * @example
 * // Multi-select with local options
 * <FormAsyncSelectField
 *   control={control}
 *   name="roles"
 *   label="Select Roles"
 *   multiple
 *   options={[
 *     { value: 'admin', label: 'Admin' },
 *     { value: 'user', label: 'User' }
 *   ]}
 * />
 */
export function FormAsyncSelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: FormAsyncSelectFieldProps<TFieldValues, TName>) {
  const {
    control,
    name,
    label,
    placeholder = "Select an option...",
    required = false,
    disabled = false,
    testId,
    labelTestId,
    className,
    description,
    options,
    onSearch,
    searchDebounceMs = 300,
    minSearchLength = 0,
    loading,
    noOptionsMessage = "No options found",
    multiple = false,
  } = props;

  const selectTestId = testId || `${String(name)}-async-select`;
  const selectLabelTestId = labelTestId || `${String(name)}-label`;
  const errorTestId = `${String(name)}-error`;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel
            className="text-md font-medium text-gray-700"
            data-testid={selectLabelTestId}
          >
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
          {description && (
            <p className="mb-2 text-sm text-gray-500">{description}</p>
          )}
          <FormControl>
            <div data-testid={selectTestId}>
              {multiple ? (
                <AsyncSelect
                  multiple
                  value={Array.isArray(field.value) ? field.value : []}
                  onChange={(value) => field.onChange(value)}
                  placeholder={placeholder}
                  disabled={disabled}
                  options={options}
                  onSearch={onSearch}
                  searchDebounceMs={searchDebounceMs}
                  minSearchLength={minSearchLength}
                  loading={loading}
                  noOptionsMessage={noOptionsMessage}
                  className="w-full"
                />
              ) : (
                <AsyncSelect
                  value={field.value ?? null}
                  onChange={(value) => field.onChange(value)}
                  placeholder={placeholder}
                  disabled={disabled}
                  options={options}
                  onSearch={onSearch}
                  searchDebounceMs={searchDebounceMs}
                  minSearchLength={minSearchLength}
                  loading={loading}
                  noOptionsMessage={noOptionsMessage}
                  className="w-full"
                />
              )}
            </div>
          </FormControl>
          <FormMessage data-testid={errorTestId} />
        </FormItem>
      )}
    />
  );
}

export type { SelectOption };
