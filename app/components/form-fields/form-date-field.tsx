import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormDateFieldProps<
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
  min?: string;
  max?: string;
  description?: string;
}

export function FormDateField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  testId,
  labelTestId,
  className,
  min,
  max,
  description,
}: FormDateFieldProps<TFieldValues, TName>) {
  const inputTestId = testId || `${String(name)}-input`;
  const inputLabelTestId = labelTestId || `${String(name)}-label`;
  const errorTestId = `${String(name)}-error`;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel
            className="text-md font-medium text-gray-700"
            data-testid={inputLabelTestId}
          >
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type="date"
              placeholder={placeholder}
              data-testid={inputTestId}
              disabled={disabled}
              min={min}
              max={max}
              className="h-12 px-4"
              {...field}
            />
          </FormControl>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
          <FormMessage data-testid={errorTestId} />
        </FormItem>
      )}
    />
  );
}
