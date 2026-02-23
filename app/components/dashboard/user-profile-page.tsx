import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, User } from "lucide-react";
import { useAuthStore } from "@/stores/auth/auth-store";
import {
  useUpdateProfile,
  useChangePassword,
} from "@/features/profile/profile-mutations";
import {
  updateProfileResolver,
  changePasswordResolver,
} from "@/lib/schema/profile-schema";
import type {
  UpdateProfileFormData,
  ChangePasswordFormData,
} from "@/lib/schema/profile-schema";
import { extractError } from "@/lib/error";
import toast from "@/lib/toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

function EditProfileForm() {
  const { user, updateUser } = useAuthStore();
  const updateProfileMutation = useUpdateProfile();

  const form = useForm<UpdateProfileFormData>({
    resolver: updateProfileResolver,
    defaultValues: {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await updateProfileMutation.mutateAsync(data, {
      onSuccess: (result) => {
        updateUser({
          first_name: result.first_name,
          last_name: result.last_name,
        });
        toast.success({
          message: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      },
      onError: (error) => {
        form.setError("root", { message: extractError(error) });
      },
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        {form.formState.errors.root && (
          <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John"
                  {...field}
                  disabled={updateProfileMutation.isPending}
                />
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
                <Input
                  placeholder="Doe"
                  {...field}
                  disabled={updateProfileMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={updateProfileMutation.isPending}>
          {updateProfileMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </Form>
  );
}

function ChangePasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const changePasswordMutation = useChangePassword();

  const form = useForm<ChangePasswordFormData>({
    resolver: changePasswordResolver,
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await changePasswordMutation.mutateAsync(data, {
      onSuccess: () => {
        form.reset();
        toast.success({
          message: "Password changed",
          description: "Your password has been changed successfully.",
        });
      },
      onError: (error) => {
        form.setError("root", { message: extractError(error) });
      },
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        {form.formState.errors.root && (
          <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        <FormField
          control={form.control}
          name="current_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    {...field}
                    disabled={changePasswordMutation.isPending}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(!showCurrentPassword)
                    }
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    {showCurrentPassword ? (
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
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    {...field}
                    disabled={changePasswordMutation.isPending}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    {showNewPassword ? (
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
          name="confirm_new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  {...field}
                  disabled={changePasswordMutation.isPending}
                  autoComplete="new-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={changePasswordMutation.isPending}>
          {changePasswordMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Changing...
            </>
          ) : (
            "Change Password"
          )}
        </Button>
      </form>
    </Form>
  );
}

export default function UserProfilePage() {
  const { user, role, isVerified, isActive } = useAuthStore();

  const userName = user
    ? `${user.first_name} ${user.last_name}`.trim()
    : "User";

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const roleLabel = role === "super_admin" ? "Super Admin" : "User";

  return (
    <div className="container mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings
        </p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4 pt-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-linear-to-br from-orange-400 to-amber-500 text-2xl text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{userName}</h2>
            <p className="text-muted-foreground">{user?.email}</p>
            <div className="mt-2 flex gap-2">
              <Badge variant="secondary">{roleLabel}</Badge>
              {isVerified ? (
                <Badge className="bg-green-600 hover:bg-green-700">
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline">Unverified</Badge>
              )}
              {isActive ? (
                <Badge className="bg-green-600 hover:bg-green-700">
                  Active
                </Badge>
              ) : (
                <Badge variant="destructive">Inactive</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Edit Profile</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your display name.</CardDescription>
            </CardHeader>
            <CardContent>
              <EditProfileForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password. You will need your current password to make
                changes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
