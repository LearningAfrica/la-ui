import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  testId?: string;
  labelTestId?: string;
  className?: string;
  // Multi-select and search props
  multiSelect?: boolean;
  searchable?: boolean;
  maxSelections?: number;
  searchPlaceholder?: string;
  description?: string;
  onValueChange?: (value: string) => void;
}

export function FormSelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder = "Select an option",
  options,
  required = false,
  disabled = false,
  testId,
  labelTestId,
  className,
  multiSelect = false,
  searchable = false,
  maxSelections,
  searchPlaceholder = "Search options...",
  description,
  onValueChange,
}: FormSelectFieldProps<TFieldValues, TName>) {
  // Multi-select with search component
  if (multiSelect || searchable) {
    const MultiSelectComponent = () => {
      const [searchTerm, setSearchTerm] = useState("");
      const [isOpen, setIsOpen] = useState(false);

      const selectTestId = testId || `${String(name)}-select`;
      const selectLabelTestId = labelTestId || `${String(name)}-label`;
      const errorTestId = `${String(name)}-error`;

      return (
        <FormField
          control={control}
          name={name}
          render={({ field }) => {
            const currentValues: string[] = Array.isArray(field.value)
              ? field.value
              : [];
            const selectedOptions = options.filter((option) =>
              currentValues.includes(option.value)
            );

            const filteredOptions = options.filter(
              (option) =>
                option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                option.value.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const handleSelect = (optionValue: string) => {
              if (multiSelect) {
                const newValues = currentValues.includes(optionValue)
                  ? currentValues.filter((v) => v !== optionValue)
                  : maxSelections && currentValues.length >= maxSelections
                    ? currentValues
                    : [...currentValues, optionValue];

                field.onChange(newValues);
              } else {
                field.onChange(optionValue);
                setIsOpen(false);
              }
            };

            const removeSelection = (optionValue: string) => {
              if (multiSelect) {
                field.onChange(currentValues.filter((v) => v !== optionValue));
              }
            };

            return (
              <FormItem className={className}>
                <FormLabel
                  className="text-sm font-medium text-gray-700"
                  data-testid={selectLabelTestId}
                >
                  {label}{" "}
                  {required && <span className="text-destructive">*</span>}
                </FormLabel>

                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isOpen}
                        className="h-12 w-full justify-between px-4"
                        data-testid={selectTestId}
                        disabled={disabled}
                      >
                        {multiSelect ? (
                          selectedOptions.length > 0 ? (
                            <div className="flex min-w-0 flex-1 flex-wrap gap-1">
                              {selectedOptions.slice(0, 2).map((option) => (
                                <Badge
                                  key={option.value}
                                  variant="secondary"
                                  className="px-2 py-0.5 text-xs"
                                >
                                  {option.label}
                                </Badge>
                              ))}
                              {selectedOptions.length > 2 && (
                                <Badge
                                  variant="secondary"
                                  className="px-2 py-0.5 text-xs"
                                >
                                  +{selectedOptions.length - 2} more
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              {placeholder}
                            </span>
                          )
                        ) : (
                          <span className="text-muted-foreground">
                            {options.find((opt) => opt.value === field.value)
                              ?.label || placeholder}
                          </span>
                        )}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent className="w-full p-0" align="start">
                    <div className="p-2">
                      {searchable && (
                        <Input
                          placeholder={searchPlaceholder}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="mb-2"
                          data-testid={`${selectTestId}-search`}
                        />
                      )}

                      <div className="max-h-60 overflow-y-auto">
                        {filteredOptions.length === 0 ? (
                          <div className="text-muted-foreground py-6 text-center text-sm">
                            No options found
                          </div>
                        ) : (
                          filteredOptions.map((option) => {
                            const isSelected = multiSelect
                              ? currentValues.includes(option.value)
                              : field.value === option.value;

                            return (
                              <div
                                key={option.value}
                                className={cn(
                                  "hover:bg-accent flex cursor-pointer items-center space-x-2 rounded-sm px-2 py-2",
                                  isSelected && "bg-accent"
                                )}
                                onClick={() => handleSelect(option.value)}
                                data-testid={`${selectTestId}-option-${option.value}`}
                              >
                                {multiSelect && (
                                  <Checkbox checked={isSelected} />
                                )}
                                {!multiSelect && isSelected && (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                                <span className="flex-1">{option.label}</span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Selected items display for multi-select */}
                {multiSelect && selectedOptions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedOptions.map((option) => (
                      <Badge
                        key={option.value}
                        variant="secondary"
                        className="flex items-center gap-1 px-2 py-1"
                        data-testid={`${selectTestId}-selected-${option.value}`}
                      >
                        {option.label}
                        <button
                          type="button"
                          onClick={() => removeSelection(option.value)}
                          className="ml-1 rounded-full p-0.5 transition-colors hover:bg-gray-300"
                          data-testid={`${selectTestId}-remove-${option.value}`}
                          aria-label={`Remove ${option.label}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {description && (
                  <p className="mt-2 text-xs text-gray-500">{description}</p>
                )}

                <FormMessage data-testid={errorTestId} />
              </FormItem>
            );
          }}
        />
      );
    };

    return <MultiSelectComponent />;
  }

  // Original single-select component
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectTestId = testId || `${String(name)}-select`;
        const selectLabelTestId = labelTestId || `${String(name)}-label`;
        const errorTestId = `${String(name)}-error`;

        return (
          <FormItem className={className}>
            <FormLabel
              className="text-sm font-medium text-gray-700"
              data-testid={selectLabelTestId}
            >
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
            <Select
              onValueChange={(val) => {
                field.onChange(val);
                onValueChange?.(val);
              }}
              value={field.value}
              disabled={disabled}
            >
              <FormControl className="w-full">
                <SelectTrigger
                  data-testid={selectTestId}
                  size="default"
                  className="h-12! px-4"
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {field.value === option.value && (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
            <FormMessage data-testid={errorTestId} />
          </FormItem>
        );
      }}
    />
  );
}
