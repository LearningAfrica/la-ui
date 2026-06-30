import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormDateTimeFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  min?: string;
  max?: string;
  description?: string;
}

// Opens the native picker when the user clicks anywhere on the field — the bare
// <input type="datetime-local"> only opens via its tiny icon, which reads as
// "nothing happens" on click. showPicker() is a no-op/throw on browsers that
// don't support it (Firefox), where the native icon still works — so guard it.
function openPicker(e: { currentTarget: HTMLInputElement }) {
  try {
    e.currentTarget.showPicker?.();
  } catch {
    /* showPicker unsupported or blocked — native icon still works */
  }
}

export function FormDateTimeField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  required = false,
  disabled = false,
  className,
  min,
  max,
  description,
}: FormDateTimeFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-md font-medium text-gray-700">
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type="datetime-local"
              disabled={disabled}
              min={min}
              max={max}
              className={cn("h-12 cursor-pointer px-4")}
              onClick={openPicker}
              onFocus={openPicker}
              {...field}
            />
          </FormControl>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
