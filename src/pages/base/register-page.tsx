import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { Link, useNavigate } from 'react-router-dom';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { registerUserSchemaResolver } from '@/lib/validators/auth-schema';
import { useState } from 'react';
import { LucideEye, LucideEyeOff } from 'lucide-react';
import { useApiClient } from '@/lib/api';
import { apiErrorMsg } from '@/lib/utils/axios-err';

export default function RegisterPage() {
  const { register } = useAuth();
  const apiClient = useApiClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    resolver: registerUserSchemaResolver,
    defaultValues: {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      // invitation_token: '',
      terms: false,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      await register(apiClient, data, {});
      toast.success('Registered successfully');
      // await navigate('/login');
       await navigate('/dashboard');
    } catch (error) {
      toast.error(apiErrorMsg(error), {
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Create an Account
          </CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        {...field}
                      />
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        to="/forgot-password"
                        className="text-primary text-sm hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...field}
                          className="pr-10" // Add padding to prevent text under button
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                        >
                          {showPassword ? (
                            <LucideEyeOff className="text-muted-foreground h-4 w-4" />
                          ) : (
                            <LucideEye className="text-muted-foreground h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? 'Hide password' : 'Show password'}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      At least 8 characters with uppercase, lowercase, and
                      number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="invitation_token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel hidden>Invitation Token (if any)</FormLabel>
                    <FormControl hidden>
                      <Input
                        hidden
                        placeholder="Enter invitation token"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4" hidden>
                <FormLabel>Account Type</FormLabel>
                <div className="space-y-2">
                  {/* <FormField
                    control={form.control}
                    name="is_student"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Student Account
                        </FormLabel>
                      </FormItem>
                    )}
                  /> */}
                  {/* <FormField
                    control={form.control}
                    name="is_instructor"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Instructor Account
                        </FormLabel>
                      </FormItem>
                    )}
                  /> */}
                  {/* <FormField
                    control={form.control}
                    name="is_admin"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Administrator Account
                        </FormLabel>
                      </FormItem>
                    )}
                  /> */}
                  {/* <FormField
                    control={form.control}
                    name="is_super_admin"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Super Administrator Account
                        </FormLabel>
                      </FormItem>
                    )}
                  /> */}
                </div>
              </div>

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer font-normal">
                        I agree to the{' '}
                        <Link
                          to="/terms"
                          className="text-primary hover:underline"
                        >
                          terms of service
                        </Link>{' '}
                        and{' '}
                        <Link
                          to="/privacy"
                          className="text-primary hover:underline"
                        >
                          privacy policy
                        </Link>
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
