import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChipInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  validate?: (value: string) => boolean;
  errorMessage?: string;
  className?: string;
  disabled?: boolean;
}

export function ChipInput({
  value = [],
  onChange,
  placeholder = "Type and press Enter...",
  validate,
  errorMessage = "Invalid input",
  className,
  disabled = false,
}: ChipInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [error, setError] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addChip();
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      // Remove last chip when backspace is pressed with empty input
      removeChip(value.length - 1);
    }
  };

  const addChip = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      return;
    }

    // Validate if validator is provided
    if (validate && !validate(trimmedValue)) {
      setError(errorMessage);

      return;
    }

    // Check for duplicates
    if (value.includes(trimmedValue)) {
      setError("This value already exists");

      return;
    }

    onChange([...value, trimmedValue]);
    setInputValue("");
    setError("");
  };

  const removeChip = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedText = e.clipboardData.getData("text");

    // Split by common delimiters
    const values = pastedText
      .split(/[,;\s\n]+/)
      .map((v) => v.trim())
      .filter(Boolean);

    const validValues = values.filter((v) => {
      if (validate) {
        return validate(v) && !value.includes(v);
      }

      return !value.includes(v);
    });

    if (validValues.length > 0) {
      onChange([...value, ...validValues]);
      setError("");
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "border-input bg-background ring-offset-background flex min-h-10 w-full flex-wrap gap-2 rounded-md border px-3 py-2 text-sm",
          "focus-within:ring-ring focus-within:ring-2 focus-within:ring-offset-2",
          disabled && "cursor-not-allowed opacity-50"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((chip, index) => (
          <Badge key={index} variant="secondary" className="gap-1 pr-1">
            <span>{chip}</span>
            <button
              type="button"
              onClick={() => removeChip(index)}
              disabled={disabled}
              className="hover:bg-muted rounded-full"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={addChip}
          placeholder={value.length === 0 ? placeholder : ""}
          disabled={disabled}
          className="flex-1 border-0 p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
