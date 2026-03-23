import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  registerResolver,
  type RegisterFormData,
} from "@/lib/schema/auth-schema";
import { useRegister } from "@/features/auth/auth-mutations";
import { extractError } from "@/lib/error";
import { FormTextField } from "@/components/form-fields/form-text-field";
import { FormPasswordField } from "@/components/form-fields/form-password-field";

interface RegisterFormProps {
  searchParams?: URLSearchParams;
}

export function RegisterForm({ searchParams }: RegisterFormProps) {
  const navigate = useNavigate();

  const form = useForm<RegisterFormData>({
    resolver: registerResolver,
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      username: "",
      accept_terms: false,
    },
  });

  const registerMutation = useRegister();

  const onSubmit = form.handleSubmit(async (data) => {
    await registerMutation.mutateAsync(data, {
      onSuccess: () => {
        // Navigate to sign-in page after successful registration
        navigate(
          `/sign-in${searchParams ? `?${searchParams.toString()}` : ""}`
        );
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
          Create Account
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Join Learning Africa and transform your organization&apos;s learning
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          {form.formState.errors.root && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
              {form.formState.errors.root.message}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <FormTextField
              control={form.control}
              name="first_name"
              label="First Name"
              placeholder="John"
              disabled={registerMutation.isPending}
            />

            <FormTextField
              control={form.control}
              name="last_name"
              label="Last Name"
              placeholder="Maina"
              disabled={registerMutation.isPending}
            />
          </div>

          <FormTextField
            control={form.control}
            name="email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            disabled={registerMutation.isPending}
          />

          <FormTextField
            control={form.control}
            name="username"
            label="Username"
            placeholder="Your Username"
            disabled={registerMutation.isPending}
            description="You can add this later if you're not sure yet"
          />

          <FormPasswordField
            control={form.control}
            name="password"
            label="Password"
            disabled={registerMutation.isPending}
            autoComplete="new-password"
            description="Must contain uppercase, lowercase, and number"
          />

          <FormPasswordField
            control={form.control}
            name="confirm_password"
            label="Confirm Password"
            disabled={registerMutation.isPending}
            autoComplete="new-password"
          />

          <FormField
            control={form.control}
            name="accept_terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-y-0 space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={registerMutation.isPending}
                  />
                </FormControl>
                <div className="leading-tight">
                  <FormLabel className="text-xs font-normal sm:text-sm">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-primary hover:underline"
                      target="_blank"
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-primary hover:underline"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
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
