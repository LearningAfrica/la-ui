import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  resetPasswordResolver,
  type ResetPasswordFormData,
} from "@/lib/schema/auth-schema";
import { useResetPassword } from "@/features/auth/auth-mutations";
import { FormPasswordField } from "@/components/form-fields/form-password-field";

export function ResetPasswordConfirmation() {
  const navigate = useNavigate();
  const form = useForm<ResetPasswordFormData>({
    resolver: resetPasswordResolver,
    defaultValues: {
      otp_code: "",
      new_password: "",
      confirmPassword: "",
    },
  });
  const resetMutation = useResetPassword();

  const onSubmit = form.handleSubmit(async (data) => {
    await resetMutation.mutateAsync(data, {
      onSuccess: () => {
        navigate("/sign-in");
      },
      onError: (error) => {
        form.setError("root", { message: error.message });
      },
    });
  });

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Reset Your Password
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Enter the OTP sent to your email and your new password
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          {form.formState.errors.root && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
              {form.formState.errors.root.message}
            </div>
          )}
          <FormField
            control={form.control}
            name="otp_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP Code</FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={resetMutation.isPending}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormPasswordField
            control={form.control}
            name="new_password"
            label="New Password"
            disabled={resetMutation.isPending}
            autoComplete="new-password"
          />
          <FormPasswordField
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            disabled={resetMutation.isPending}
            autoComplete="new-password"
          />
          <Button
            type="submit"
            className="w-full"
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        <Link
          to="/sign-in"
          className="text-primary font-medium hover:underline"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
