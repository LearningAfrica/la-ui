import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

interface FormRadioGroupFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  options: RadioOption[];
  required?: boolean;
  disabled?: boolean;
  testId?: string;
  labelTestId?: string;
  className?: string;
  orientation?: "vertical" | "horizontal";
  description?: string;
}

export function FormRadioGroupField<
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
}: FormRadioGroupFieldProps<TFieldValues, TName>) {
  const radioGroupTestId = testId || `${String(name)}-radio-group`;
  const radioGroupLabelTestId = labelTestId || `${String(name)}-label`;
  const errorTestId = `${String(name)}-error`;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel
            className="text-sm font-medium text-gray-700"
            data-testid={radioGroupLabelTestId}
          >
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
          {description && (
            <p className="mb-2 text-sm text-gray-500">{description}</p>
          )}
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className={
                orientation === "horizontal"
                  ? "flex flex-wrap gap-4"
                  : "grid gap-3"
              }
              disabled={disabled}
              data-testid={radioGroupTestId}
            >
              {options.map((option, index) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-2"
                  data-testid={`${String(name)}-radio-option-${index}`}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`${String(name)}-${option.value}`}
                    disabled={disabled || option.disabled}
                    data-testid={`${String(name)}-radio-${index}`}
                  />
                  <div className="flex flex-col">
                    <Label
                      htmlFor={`${String(name)}-${option.value}`}
                      className={`cursor-pointer text-sm font-normal ${
                        disabled || option.disabled
                          ? "cursor-not-allowed text-gray-400"
                          : "text-gray-700"
                      }`}
                      data-testid={`${String(name)}-radio-label-${index}`}
                    >
                      {option.label}
                    </Label>
                    {option.description && (
                      <span className="mt-1 text-xs text-gray-500">
                        {option.description}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage data-testid={errorTestId} />
        </FormItem>
      )}
    />
  );
}
