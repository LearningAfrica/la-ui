import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
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
import {
  forgotPasswordResolver,
  type ForgotPasswordFormData,
} from "@/lib/schema/auth-schema";
import { useForgotPassword } from "@/features/auth/auth-mutations";

interface ForgotPasswordFormProps {
  searchParams?: URLSearchParams;
}

export function ForgotPasswordForm({ searchParams }: ForgotPasswordFormProps) {
  const navigate = useNavigate();
  const form = useForm<ForgotPasswordFormData>({
    resolver: forgotPasswordResolver,
    defaultValues: { email: "" },
  });
  const forgotMutation = useForgotPassword();

  const onSubmit = form.handleSubmit(async (data) => {
    await forgotMutation.mutateAsync(data, {
      onSuccess: () => {
        navigate("/reset-password-confirmation");
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
          Reset Password
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Enter your email to receive a reset link
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                    disabled={forgotMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={forgotMutation.isPending}
          >
            {forgotMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Remember your password?{" "}
        </span>
        <Link
          to={`/sign-in${searchParams ? `?${searchParams.toString()}` : ""}`}
          className="text-primary font-medium hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
