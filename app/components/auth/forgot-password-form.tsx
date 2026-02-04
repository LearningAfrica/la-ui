import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { forgotPasswordResolver } from "@/lib/schema/auth-schema";
import { useForgotPassword } from "@/features/auth/auth-mutations";
import { extractError } from "@/lib/error";
import { href, Link } from "react-router";

export function ForgotPasswordForm() {
  const [success, setSuccess] = useState(false);
  const form = useForm({
    resolver: forgotPasswordResolver,
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useForgotPassword();

  const onSubmit = form.handleSubmit(async (data) => {
    await forgotPasswordMutation.mutateAsync(data, {
      onSuccess: () => {
        setSuccess(true);
      },
      onError: (error) => {
        form.setError("root", { message: extractError(error) });
      },
    });
  });

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Forgot Password
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Enter your email to receive a password reset link
        </p>
      </div>
      {success ? (
        <div className="bg-success/10 text-success rounded-lg p-3 text-sm">
          If your email exists, a reset link has been sent.
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            {form.formState.errors.root && (
              <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
                {form.formState.errors.root.message}
              </div>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                      disabled={forgotPasswordMutation.isPending}
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending
                ? "Sending..."
                : "Send Reset Link"}
            </Button>
          </form>
        </Form>
      )}
      {/* Bottom link to login */}
      <div className="mt-8 text-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Remembered password?{" "}
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
