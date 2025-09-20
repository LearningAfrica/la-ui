import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  loginUserSchemaResolver,
  registerUserSchemaResolver,
} from '@/lib/validators/auth-schema';
import { useAuth } from '@/hooks/use-auth';
import { useApiClient } from '@/lib/api';
import type { AuthModalMode } from './auth-modal.context';
import type { ILoginUser, IRegisterUser } from '@/lib/validators/auth-schema';

const defaultRegisterValues: IRegisterUser = {
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  password: '',
  invitation_token: undefined,
  terms: false,
};

const defaultLoginValues: ILoginUser = {
  email: '',
  password: '',
};

type AuthModalProps = {
  open: boolean;
  mode: AuthModalMode;
  onOpenChange: (value: boolean) => void;
  onModeChange: (value: AuthModalMode) => void;
};

export function AuthModal({ open, mode, onOpenChange, onModeChange }: AuthModalProps) {
  const apiClient = useApiClient();
  const {
    login,
    register: registerUser,
    is_loading,
    clearError,
  } = useAuth();

  const loginForm = useForm<ILoginUser>({
    resolver: loginUserSchemaResolver,
    defaultValues: defaultLoginValues,
  });

  const registerForm = useForm<IRegisterUser>({
    resolver: registerUserSchemaResolver,
    defaultValues: defaultRegisterValues,
  });

  useEffect(() => {
    if (!open) {
      loginForm.reset(defaultLoginValues);
      registerForm.reset(defaultRegisterValues);
      clearError();
    }
  }, [open, clearError, loginForm, registerForm]);

  const handleLogin = loginForm.handleSubmit(async (data) => {
    try {
      await login(apiClient, data);
      toast.success('Welcome back!');
      onOpenChange(false);
    } catch (error) {
      toast.error((error as Error).message);
    }
  });

  const handleRegister = registerForm.handleSubmit(async (data) => {
    try {
      await registerUser(apiClient, data);
      toast.success('Account created successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error((error as Error).message);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </DialogTitle>
        </DialogHeader>
        <Tabs
          value={mode}
          onValueChange={(value) => onModeChange(value as AuthModalMode)}
          className="mt-4"
        >
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <Form {...loginForm}>
              <form className="space-y-4" onSubmit={handleLogin}>
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={is_loading || loginForm.formState.isSubmitting}
                >
                  {loginForm.formState.isSubmitting ? 'Signing in…' : 'Login'}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="register" className="mt-6">
            <Form {...registerForm}>
              <form className="space-y-4" onSubmit={handleRegister}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={registerForm.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="janedoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal">
                            I agree to the terms and privacy policy.
                          </FormLabel>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={is_loading || registerForm.formState.isSubmitting}
                >
                  {registerForm.formState.isSubmitting ? 'Creating account…' : 'Create account'}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
