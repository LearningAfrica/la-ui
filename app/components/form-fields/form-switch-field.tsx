import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormSwitchFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function FormSwitchField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  disabled = false,
  className,
}: FormSwitchFieldProps<TFieldValues, TName>) {
  const id = `${String(name)}-switch`;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-row items-center justify-between gap-4 rounded-lg border p-4",
            className
          )}
        >
          <div className="space-y-1">
            <Label
              htmlFor={id}
              className={cn(
                "cursor-pointer text-sm font-medium",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              {label}
            </Label>
            {description && (
              <p className="text-muted-foreground text-xs">{description}</p>
            )}
            <FormMessage />
          </div>
          <FormControl>
            <Switch
              id={id}
              checked={!!field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
