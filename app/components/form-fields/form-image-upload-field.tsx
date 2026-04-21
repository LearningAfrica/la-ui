import { useEffect, useMemo, useRef } from "react";
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
import { ImagePlus } from "lucide-react";

interface FormImageUploadFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  maxBytes?: number;
  acceptedTypes?: string[];
  helperText?: string;
  className?: string;
}

/**
 * Controlled image picker. Stores a File on the form value and shows a
 * preview. Used for course/category images and organization logos.
 */
export function FormImageUploadField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label = "Image",
  required = false,
  disabled = false,
  maxBytes = 5_000_000,
  acceptedTypes = ["image/jpeg", "image/png"],
  helperText,
  className,
}: FormImageUploadFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const value = field.value as File | undefined;

        return (
          <FormItem className={className}>
            <FormLabel>
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
            <FormControl>
              <ImagePreview
                value={value}
                disabled={disabled}
                maxBytes={maxBytes}
                acceptedTypes={acceptedTypes}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
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

function ImagePreview({
  value,
  disabled,
  maxBytes,
  acceptedTypes,
  onChange,
  onBlur,
}: {
  value: File | undefined;
  disabled: boolean;
  maxBytes: number;
  acceptedTypes: string[];
  onChange: (value: File | undefined) => void;
  onBlur: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  // Derive an object URL directly from the file. useMemo gives us a stable
  // value per file instance so the effect below can revoke it on cleanup.
  const previewUrl = useMemo(
    () => (value ? URL.createObjectURL(value) : ""),
    [value]
  );

  useEffect(() => {
    if (!previewUrl) return;

    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const pick = () => inputRef.current?.click();
  const clear = () => {
    if (inputRef.current) inputRef.current.value = "";

    onChange(undefined);
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="border-border flex items-center gap-3 rounded-lg border p-3">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-20 w-20 rounded-md object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{value.name}</p>
            <p className="text-muted-foreground text-xs">
              {(value.size / 1024).toFixed(1)} KB
            </p>
            <div className="mt-2 flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={pick}
                disabled={disabled}
              >
                Change Image
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={clear}
                disabled={disabled}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-border flex flex-col items-center gap-2 rounded-lg border border-dashed p-6">
          <ImagePlus className="text-muted-foreground h-8 w-8" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={pick}
            disabled={disabled}
          >
            Upload Image
          </Button>
          <p className="text-muted-foreground text-xs">
            {acceptedTypes
              .map((t) => t.replace("image/", "").toUpperCase())
              .join(" or ")}
            , max {Math.round(maxBytes / 1_000_000)}MB
          </p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        className="hidden"
        disabled={disabled}
        onBlur={onBlur}
        onChange={(e) => {
          const file = e.target.files?.[0];

          onChange(file);
        }}
      />
    </div>
  );
}
