import { useForm } from "react-hook-form";
import { href, Link, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { loginResolver } from "@/lib/schema/auth-schema";
import { useLogin } from "@/features/auth/auth-mutations";
import { useAuthStore } from "@/stores/auth/auth-store";
import { extractError } from "@/lib/error";
import { FormTextField } from "@/components/form-fields/form-text-field";
import { FormPasswordField } from "@/components/form-fields/form-password-field";

interface LoginFormProps {
  searchParams?: URLSearchParams;
}

export function LoginForm({ searchParams }: LoginFormProps) {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const form = useForm({
    resolver: loginResolver,
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const loginMutation = useLogin();

  const onSubmit = form.handleSubmit(async (data) => {
    await loginMutation.mutateAsync(data, {
      onSuccess: async (result) => {
        // Update auth store
        login(result);

        if (!result.user.is_verified) {
          navigate(
            "/email-verification-pending" +
              (data.email ? `?email=${encodeURIComponent(data.email)}` : "")
          );

          return;
        }

        // Check for a safe redirect param, otherwise navigate by role
        const redirectTo = searchParams?.get("redirect");
        const isSafeRedirect =
          redirectTo &&
          redirectTo.startsWith("/") &&
          !redirectTo.startsWith("//");

        if (isSafeRedirect) {
          navigate(redirectTo);
        } else if (result.user_role === "super_admin") {
          navigate(href("/system/dashboard"));
        } else {
          navigate(href("/dashboard"));
        }
      },
      onError: (error) => {
        // Reset password field on error
        form.setError("root", { message: extractError(error) });
      },
    });
  });

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome Back
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Sign in to your Learning Africa account
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          {form.formState.errors.root && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
              {form.formState.errors.root.message}
            </div>
          )}

          <FormTextField
            control={form.control}
            name="email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            disabled={loginMutation.isPending}
            inputProps={{ autoComplete: "email" }}
          />

          <FormPasswordField
            control={form.control}
            name="password"
            label="Password"
            disabled={loginMutation.isPending}
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center space-y-0 space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loginMutation.isPending}
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer text-sm font-normal">
                    Remember me
                  </FormLabel>
                </FormItem>
              )}
            />
            <Link
              to={href("/forgot-password")}
              className="text-primary text-sm hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
        </span>
        <Link
          to={`/sign-up${searchParams ? `?${searchParams.toString()}` : ""}`}
          className="text-primary font-medium hover:underline"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}
