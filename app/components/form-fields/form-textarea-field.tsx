import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface FormTextareaFieldProps<
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
  rows?: number;
  description?: string;
}

export function FormTextareaField<
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
  rows = 3,
  description,
}: FormTextareaFieldProps<TFieldValues, TName>) {
  const textareaTestId = testId || `${String(name)}-input`;
  const textareaLabelTestId = labelTestId || `${String(name)}-label`;
  const errorTestId = `${String(name)}-error`;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel
            className="text-sm font-medium text-gray-700"
            data-testid={textareaLabelTestId}
          >
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              data-testid={textareaTestId}
              disabled={disabled}
              rows={rows}
              {...field}
              className="h-32 p-4"
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
