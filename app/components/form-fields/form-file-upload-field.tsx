import { useRef } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type FieldPath,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { FileUp, X } from "lucide-react";

export interface FormFileUploadValue {
  name: string;
  base64: string;
}

interface FormFileUploadFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  helperText?: string;
  className?: string;
}

/**
 * File picker that emits `{ name, base64 }` via react-hook-form. Used for
 * module content file uploads where the backend expects base64 payload.
 */
export function FormFileUploadField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label = "File",
  required = false,
  disabled = false,
  accept,
  helperText,
  className,
}: FormFileUploadFieldProps<TFieldValues, TName>) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const value = field.value as FormFileUploadValue | undefined;

        const pick = () => inputRef.current?.click();
        const clear = () => {
          if (inputRef.current) inputRef.current.value = "";

          field.onChange(undefined);
        };

        const handleFile = (file: File) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            const result = reader.result;

            if (typeof result !== "string") {
              field.onChange(undefined);

              return;
            }

            const base64 = result.split(",")[1] ?? "";

            field.onChange({ name: file.name, base64 });
          };

          reader.readAsDataURL(file);
        };

        return (
          <FormItem className={className}>
            <FormLabel>
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
            <FormControl>
              <div className="space-y-2">
                {value?.name ? (
                  <div className="border-border flex items-center justify-between gap-3 rounded-lg border p-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <FileUp className="text-muted-foreground h-4 w-4 shrink-0" />
                      <span className="truncate text-sm">{value.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={pick}
                        disabled={disabled}
                      >
                        Replace
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={clear}
                        disabled={disabled}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-border flex flex-col items-center gap-2 rounded-lg border border-dashed p-6">
                    <FileUp className="text-muted-foreground h-8 w-8" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={pick}
                      disabled={disabled}
                    >
                      Choose file
                    </Button>
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept={accept}
                  className="hidden"
                  disabled={disabled}
                  onBlur={field.onBlur}
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) handleFile(file);
                  }}
                />
              </div>
            </FormControl>
            {helperText && !fieldState.error && (
              <p className="text-muted-foreground text-xs">{helperText}</p>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
