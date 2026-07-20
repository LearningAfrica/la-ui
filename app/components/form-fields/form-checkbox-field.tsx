import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

interface FormCheckboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  options?: CheckboxOption[];
  required?: boolean;
  disabled?: boolean;
  testId?: string;
  labelTestId?: string;
  className?: string;
  orientation?: "vertical" | "horizontal";
  description?: string;
  // For single checkbox (boolean field)
  singleCheckbox?: boolean;
  checkboxLabel?: string;
}

export function FormCheckboxField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  options,
  required = false,
  disabled = false,
  testId,
  labelTestId,
  className,
  orientation = "vertical",
  description,
  singleCheckbox = false,
  checkboxLabel,
}: FormCheckboxFieldProps<TFieldValues, TName>) {
  const checkboxTestId = testId || `${String(name)}-checkbox`;
  const checkboxLabelTestId = labelTestId || `${String(name)}-label`;
  const errorTestId = `${String(name)}-error`;

  // Single checkbox for boolean fields
  if (singleCheckbox) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            <div className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                  data-testid={checkboxTestId}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <Label
                  className={`cursor-pointer text-sm font-medium ${
                    disabled
                      ? "text-muted-foreground cursor-not-allowed"
                      : "text-foreground"
                  }`}
                  data-testid={checkboxLabelTestId}
                >
                  {checkboxLabel || label}{" "}
                  {required && <span className="text-destructive">*</span>}
                </Label>
                {description && (
                  <p className="text-muted-foreground text-sm">{description}</p>
                )}
              </div>
            </div>
            <FormMessage data-testid={errorTestId} />
          </FormItem>
        )}
      />
    );
  }

  // Multiple checkboxes for array fields
  if (!options || options.length === 0) {
    console.warn(
      "FormCheckboxField: No options provided for multi-checkbox field"
    );

    return null;
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel
            className="text-foreground text-sm font-medium"
            data-testid={checkboxLabelTestId}
          >
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
          {description && (
            <p className="text-muted-foreground mb-2 text-sm">{description}</p>
          )}
          <FormControl>
            <div
              className={
                orientation === "horizontal"
                  ? "flex flex-wrap gap-4"
                  : "space-y-3"
              }
              data-testid={checkboxTestId}
            >
              {options.map((option, index) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-2"
                  data-testid={`${String(name)}-checkbox-option-${index}`}
                >
                  <Checkbox
                    checked={field.value?.includes(option.value) || false}
                    onCheckedChange={(checked) => {
                      const currentValue = field.value || [];

                      if (checked) {
                        // Add option to array
                        field.onChange([...currentValue, option.value]);
                      } else {
                        // Remove option from array
                        field.onChange(
                          currentValue.filter(
                            (value: string) => value !== option.value
                          )
                        );
                      }
                    }}
                    disabled={disabled || option.disabled}
                    data-testid={`${String(name)}-checkbox-${index}`}
                  />
                  <div className="flex flex-col">
                    <Label
                      className={`cursor-pointer text-sm font-normal ${
                        disabled || option.disabled
                          ? "text-muted-foreground cursor-not-allowed"
                          : "text-foreground"
                      }`}
                      data-testid={`${String(name)}-checkbox-label-${index}`}
                    >
                      {option.label}
                    </Label>
                    {option.description && (
                      <span className="text-muted-foreground mt-1 text-xs">
                        {option.description}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </FormControl>
          <FormMessage data-testid={errorTestId} />
        </FormItem>
      )}
    />
  );
}
