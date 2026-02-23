import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

// Validation function type
export type ChipValidationFn = (value: string) => string | true;

interface FormChipFieldProps<
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
  chipVariant?: "default" | "secondary" | "destructive" | "outline";
  separator?: string | RegExp;
  maxChips?: number;
  allowDuplicates?: boolean;
  description?: string;
}

// Pre-built validation functions
export const chipValidators = {
  email: (value: string): string | true => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (
      emailRegex.test(value.trim()) || "Please enter a valid email address"
    );
  },

  phone: (value: string): string | true => {
    // Basic international phone validation - adjust as needed
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    const cleanPhone = value.replace(/[-\s()]/g, "");

    return phoneRegex.test(cleanPhone) || "Please enter a valid phone number";
  },

  // No validation - always valid
  none: (): string | true => true,

  // No empty values
  nonEmpty: (value: string): string | true => {
    return value.trim().length > 0 || "Value cannot be empty";
  },

  // Max length validation
  maxLength:
    (max: number) =>
    (value: string): string | true => {
      return value.length <= max || `Value cannot exceed ${max} characters`;
    },

  // Min length validation
  minLength:
    (min: number) =>
    (value: string): string | true => {
      return value.length >= min || `Value must be at least ${min} characters`;
    },
};

export function FormChipField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder = "Type and press Enter to add",
  required = false,
  disabled = false,
  testId,
  labelTestId,
  className,
  chipVariant = "secondary",
  separator = /[,;]/,
  maxChips,
  allowDuplicates = false,
  description,
}: FormChipFieldProps<TFieldValues, TName>) {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState<string>("");
  const chipFieldTestId = testId || `${String(name)}-chips`;
  const chipInputTestId = `${String(name)}-chip-input`;
  const chipLabelTestId = labelTestId || `${String(name)}-label`;
  const errorTestId = `${String(name)}-error`;

  const addChip = (value: string, currentChips: string[]) => {
    const trimmed = value.trim();

    if (!trimmed) return currentChips;

    // duplicates
    if (!allowDuplicates && currentChips.includes(trimmed)) {
      setInputError("Item already exists");

      return currentChips;
    }

    // limit
    if (maxChips && currentChips.length >= maxChips) {
      setInputError(`Maximum ${maxChips} items allowed`);

      return currentChips;
    }

    // Clear any previous errors
    setInputError("");

    return [...currentChips, trimmed];
  };

  const removeChip = (indexToRemove: number, currentChips: string[]) => {
    return currentChips.filter((_, i) => i !== indexToRemove);
  };

  const splitParts = (value: string) => {
    if (!value) return [""];

    return typeof separator === "string"
      ? value.split(separator)
      : value.split(separator);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const chips: string[] = Array.isArray(field.value) ? field.value : [];

        const commitInputAsChip = (val: string) => {
          // If user input contains separator(s), split and add all full parts
          const parts = splitParts(val);
          let newChips = chips;

          parts.forEach((part, idx) => {
            // add all parts except possibly the last empty fragment which we keep in input
            if (part.trim() === "" && idx === parts.length - 1) {
              // last is empty — nothing to add, will clear input below
              return;
            }

            // for the last part, if it was not terminated by a separator (i.e. user typed but didn't press separator),
            // we still want to add it only if this function was called intentionally (e.g. onBlur or Enter)
            newChips = addChip(part, newChips);
          });
          // Update RHF value and clear input
          field.onChange(newChips);
          setInputValue("");
        };

        // ... rest of the component remains the same
        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (disabled) return;

          if (e.key === "Enter") {
            e.preventDefault();
            commitInputAsChip(inputValue);
          } else if (e.key === "Tab") {
            if (inputValue.trim()) {
              e.preventDefault();
              commitInputAsChip(inputValue);
            }
          } else if (e.key === "Backspace" && !inputValue && chips.length > 0) {
            const newChips = removeChip(chips.length - 1, chips);

            field.onChange(newChips);
          }
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;

          if (inputError) setInputError("");

          const parts = splitParts(value);

          if (parts.length > 1) {
            let newChips = chips;

            for (let i = 0; i < parts.length - 1; i++) {
              newChips = addChip(parts[i], newChips);
            }

            setInputValue(parts[parts.length - 1]);
            field.onChange(newChips);
          } else {
            setInputValue(value);
          }
        };

        const handleBlur = () => {
          if (inputValue.trim() !== "") {
            commitInputAsChip(inputValue);
          }

          field.onBlur();
        };

        return (
          <FormItem className={className}>
            <FormLabel
              className="text-sm font-medium text-gray-700"
              data-testid={chipLabelTestId}
            >
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
            <FormControl>
              <div
                className="border-input bg-background ring-offset-background focus-within:ring-ring min-h-10 w-full rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                data-testid={chipFieldTestId}
              >
                <div className="mb-1 flex flex-wrap gap-1">
                  {chips.map((chip, index) => (
                    <Badge
                      key={index}
                      variant={chipVariant}
                      className="flex items-center gap-1 pr-1"
                      data-testid={`${String(name)}-chip-${index}`}
                    >
                      <span>{chip}</span>
                      {!disabled && (
                        <button
                          type="button"
                          className="ring-offset-background focus:ring-ring ml-1 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                          onClick={() => {
                            const newChips = removeChip(index, chips);

                            field.onChange(newChips);
                          }}
                          data-testid={`${String(name)}-remove-chip-${index}`}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {chip}</span>
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>

                <Input
                  value={inputValue}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  placeholder={chips.length === 0 ? placeholder : ""}
                  disabled={disabled}
                  className="h-auto border-0 p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  data-testid={chipInputTestId}
                />
              </div>
            </FormControl>

            {inputError && (
              <p
                className="text-sm text-red-600"
                data-testid={`${String(name)}-input-error`}
              >
                {inputError}
              </p>
            )}

            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}

            {fieldState.error && (
              <p className="text-sm text-red-600" data-testid={errorTestId}>
                {fieldState.error.message}
              </p>
            )}

            {maxChips && (
              <p className="text-xs text-gray-500">
                {chips.length}/{maxChips} items
              </p>
            )}
          </FormItem>
        );
      }}
    />
  );
}
