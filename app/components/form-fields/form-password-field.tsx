import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface FormPasswordFieldProps<
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
  showToggle?: boolean;
  strengthIndicator?: boolean;
  autoComplete?: string;
  description?: string;
}

interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4; // 0: Very Weak, 1: Weak, 2: Fair, 3: Good, 4: Strong
  feedback: string[];
}

const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return { score: 0, feedback: [] };
  }

  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) {
    score++;
  } else {
    feedback.push("Use at least 8 characters");
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score++;
  } else {
    feedback.push("Add lowercase letters");
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push("Add uppercase letters");
  }

  // Number check
  if (/\d/.test(password)) {
    score++;
  } else {
    feedback.push("Add numbers");
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score++;
  } else {
    feedback.push("Add special characters");
  }

  return { score: Math.min(score, 4) as PasswordStrength["score"], feedback };
};

const getStrengthColor = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return "bg-red-500";
    case 2:
      return "bg-yellow-500";
    case 3:
      return "bg-blue-500";
    case 4:
      return "bg-green-500";
    default:
      return "bg-gray-300";
  }
};

const getStrengthLabel = (score: number): string => {
  switch (score) {
    case 0:
      return "Very Weak";
    case 1:
      return "Weak";
    case 2:
      return "Fair";
    case 3:
      return "Good";
    case 4:
      return "Strong";
    default:
      return "";
  }
};

export function FormPasswordField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder = "••••••••",
  required = false,
  disabled = false,
  testId,
  labelTestId,
  className,
  showToggle = true,
  strengthIndicator = false,
  autoComplete = "current-password",
  description,
}: FormPasswordFieldProps<TFieldValues, TName>) {
  const [showPassword, setShowPassword] = useState(false);

  const inputTestId = testId || `${String(name)}-input`;
  const inputLabelTestId = labelTestId || `${String(name)}-label`;
  const errorTestId = `${String(name)}-error`;
  const toggleTestId = `${String(name)}-visibility-toggle`;
  const strengthTestId = `${String(name)}-strength`;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const strength = strengthIndicator
          ? getPasswordStrength(field.value || "")
          : null;

        return (
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
                  type={showPassword ? "text" : "password"}
                  placeholder={placeholder}
                  data-testid={inputTestId}
                  disabled={disabled}
                  autoComplete={autoComplete}
                  {...field}
                  className="h-12 px-4"
                />
                {showToggle && (
                  <button
                    type="button"
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 transition-colors hover:bg-gray-100"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Toggle password visibility"
                    data-testid={toggleTestId}
                    disabled={disabled}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </FormControl>

            {/* Password Strength Indicator */}
            {strengthIndicator && field.value && (
              <div className="space-y-2" data-testid={strengthTestId}>
                {/* Strength Bar */}
                <div className="flex space-x-1">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-full rounded-full transition-colors ${
                        index < (strength?.score || 0)
                          ? getStrengthColor(strength?.score || 0)
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Strength Label */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    Password strength:{" "}
                    <span
                      className={`font-medium ${
                        strength?.score === 4
                          ? "text-green-600"
                          : strength?.score === 3
                            ? "text-blue-600"
                            : strength?.score === 2
                              ? "text-yellow-600"
                              : "text-red-600"
                      }`}
                    >
                      {getStrengthLabel(strength?.score || 0)}
                    </span>
                  </span>
                </div>

                {/* Feedback */}
                {strength?.feedback && strength.feedback.length > 0 && (
                  <ul className="space-y-1 text-xs text-gray-500">
                    {strength.feedback.map((item, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-gray-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}

            <FormMessage data-testid={errorTestId} />
          </FormItem>
        );
      }}
    />
  );
}
