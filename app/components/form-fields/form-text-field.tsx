import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormTextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  required?: boolean;
  disabled?: boolean;
  testId?: string;
  labelTestId?: string;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  renderEndAdornment?: () => React.ReactNode;
  description?: string;
}

export function FormTextField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
  testId,
  labelTestId,
  className,
  inputProps,
  renderEndAdornment,
  description,
}: FormTextFieldProps<TFieldValues, TName>) {
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
            <div className="relative">
              <Input
                type={type}
                placeholder={placeholder}
                data-testid={inputTestId}
                disabled={disabled}
                {...field}
                {...inputProps}
                className="h-12 px-4"
              />
              {renderEndAdornment && (
                <div className="absolute top-1/2 right-2 -translate-y-1/2">
                  {renderEndAdornment()}
                </div>
              )}
            </div>
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
