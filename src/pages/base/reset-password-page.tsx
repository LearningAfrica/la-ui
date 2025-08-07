import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useApiClient } from '@/lib/api';
import { apiErrorMsg } from '@/lib/utils/axios-err';
import { LucideEye, LucideEyeOff } from 'lucide-react';
import {
  resetPasswordSchemaResolver,
  type IResetPassword,
} from '@/lib/validators/auth-schema';
import { PASSWORD_RESET_KEYS } from '@/lib/constants/password-reset';

export default function ResetPasswordPage() {
  const apiClient = useApiClient();
  const navigate = useNavigate();
  // const [searchParams] = useSearchParams();
  // const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState(false);
  const sessionEmail = localStorage.getItem(PASSWORD_RESET_KEYS.resetEmailKey);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<IResetPassword>({
    resolver: resetPasswordSchemaResolver,
    defaultValues: {
      otp_code: '',
      email: sessionEmail!,
      new_password: '',
      confirm_password: '',
    },
  });

  useEffect(() => {
    if (!sessionEmail) {
      toast.error(
        'No email found for password reset. Please request a new link.',
      );
      navigate('/forgot-password');
    }
  }, [sessionEmail, navigate]);

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);

    try {
      // Replace with your actual API endpoint
      await apiClient.patch('/auth/password-reset-complete/', {
        otp_code: data.otp_code,
        email: sessionEmail!,
        new_password: data.new_password,
      });
      toast.success('Password reset successfully');
      // localStorage.removeItem(PASSWORD_RESET_KEYS.resetEmailKey);
      await navigate('/login');
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
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Enter the verification code sent to your email and set your new
            password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="otp_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                                            <div className="flex items-center gap-2">
                        <InputOTP maxLength={6} {...field}>
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
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => field.onChange('')}
                          className="text-xs"
                        >
                          Clear
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Please enter the one-time password sent to your email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...field}
                          className="pr-10"
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
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          {...field}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                        >
                          {showConfirmPassword ? (
                            <LucideEyeOff className="text-muted-foreground h-4 w-4" />
                          ) : (
                            <LucideEye className="text-muted-foreground h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showConfirmPassword
                              ? 'Hide password'
                              : 'Show password'}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="flex justify-center">
            <Link
              to="/forgot-password"
              className="text-primary text-sm hover:underline"
            >
              Didn't receive OTP? Request again
            </Link>
          </div>
          <div className="flex justify-center">
            <Link to="/login" className="text-primary text-sm hover:underline">
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
