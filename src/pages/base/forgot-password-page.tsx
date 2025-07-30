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
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useApiClient } from '@/lib/api';
import { extractCorrectErrorMessage } from '@/lib/utils/axios-err';
import {
  forgotPasswordSchemaResolver,
  type IForgotPassword,
} from '@/lib/validators/auth-schema';
import { PASSWORD_RESET_KEYS } from '@/lib/constants/password-reset';
import { Loader2, SaveIcon } from 'lucide-react';

export default function ForgotPasswordPage() {
  const apiClient = useApiClient();
  // const [isLoading, setIsLoading] = useState(false);
  // const [emailSent, setEmailSent] = useState(false);

  const form = useForm<IForgotPassword>({
    resolver: forgotPasswordSchemaResolver,
    defaultValues: {
      email: '',
    },
  });
  const navigate = useNavigate();

  const onSubmit = form.handleSubmit(async (data) => {
    // setIsLoading(true);

    try {
      // Replace with your actual API endpoint
      await apiClient.post('/auth/password-reset/', { email: data.email });
      // setEmailSent(true);
      toast.success('Password reset instructions sent to your email');
      localStorage.setItem(PASSWORD_RESET_KEYS.resetEmailKey, data.email);
      await navigate('/reset-password'); // Adjust the token as needed
    } catch (error) {
      toast.error(extractCorrectErrorMessage(error), {
        position: 'top-center',
      });
    }
  });

  // if (emailSent) {
  //   return (
  //     <div className="bg-muted/40 flex min-h-screen items-center justify-center p-4">
  //       <Card className="w-full max-w-md">
  //         <CardHeader className="space-y-1 text-center">
  //           <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
  //           <CardDescription>
  //             We've sent password reset instructions to your email address
  //           </CardDescription>
  //         </CardHeader>
  //         <CardContent className="text-center">
  //           <p className="text-sm text-muted-foreground mb-4">
  //             If you don't see the email in your inbox, please check your spam folder.
  //           </p>
  //           <Button
  //             variant="outline"
  //             className="w-full"
  //             onClick={() => setEmailSent(false)}
  //           >
  //             Try again
  //           </Button>
  //         </CardContent>
  //         <CardFooter className="flex justify-center">
  //           <Link to="/login" className="text-primary text-sm hover:underline">
  //             Back to login
  //           </Link>
  //         </CardFooter>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you an OTP to reset your
            password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
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
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                <span className="sr-only">
                  {form.formState.isSubmitting
                    ? 'Sending...'
                    : 'Send Reset Link'}
                </span>
                {form.formState.isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SaveIcon className="h-4 w-4" />
                )}
                {form.formState.isSubmitting ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/login" className="text-primary text-sm hover:underline">
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
