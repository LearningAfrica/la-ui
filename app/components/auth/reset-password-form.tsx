import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { resetPasswordResolver } from "@/lib/schema/auth-schema";
import { useResetPassword } from "@/features/auth/auth-mutations";
import { extractError } from "@/lib/error";
import { useSearchParams, useNavigate, Link } from "react-router";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { href } from "react-router";

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const token = searchParams.get("token") || "";

  const form = useForm({
    resolver: resetPasswordResolver,
    defaultValues: {
      otp_code: "",
      password: "",
      confirm_password: "",
    },
  });

  const resetPasswordMutation = useResetPassword();

  const onSubmit = form.handleSubmit(async (data) => {
    await resetPasswordMutation.mutateAsync(
      { ...data, token },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => navigate("/sign-in"), 2000);
        },
        onError: (error) => {
          form.setError("root", { message: extractError(error) });
        },
      }
    );
  });

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Reset Password
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Enter your OTP and new password below
        </p>
      </div>
      {success ? (
        <div className="bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-lg p-4 text-sm border border-green-200 dark:border-green-800">
          <p className="font-medium">Password reset successful!</p>
          <p>Redirecting to sign in...</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            {form.formState.errors.root && (
              <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
                {form.formState.errors.root.message}
              </div>
            )}

            {/* OTP Code Field */}
            <FormField
              control={form.control}
              name="otp_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        {...field}
                        disabled={resetPasswordMutation.isPending}
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
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        disabled={resetPasswordMutation.isPending}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        disabled={resetPasswordMutation.isPending}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? (
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
      )}
      {/* Bottom link to login */}
      <div className="text-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Remember your password?{" "}
        </span>
        <Link
          to={href("/sign-in")}
          className="text-primary font-medium hover:underline"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
