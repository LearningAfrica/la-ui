import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Mail,
  UserPlus,
  X,
  Users,
  GraduationCap,
  Shield,
  Sparkles,
  Send,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { OrgUserRole } from '@/lib/validators/auth-schema';
import { useOrganization } from '@/domains/organizations/use-organizations';
import { inviteUsersToOrganizationResolver } from '@/lib/validators/organization-schema';
import { apiErrorMsg } from '@/lib/utils/axios-err';

// Define UserRole type (assuming it's imported from your auth schema)

interface EmailChip {
  id: string;
  email: string;
  isValid: boolean;
}

// Email validation helper
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

type OrganizationsInviteUsersModalProps = {
  orgId?: string; // Optional prop to pass organization UUID if needed
};

export default function OrganizationsInviteUsersModal({
  orgId,
}: OrganizationsInviteUsersModalProps) {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailChips, setEmailChips] = useState<EmailChip[]>([]);

  const { mutations } = useOrganization();

  const form = useForm({
    resolver: inviteUsersToOrganizationResolver,
    defaultValues: {
      organization_id: orgId || '',
      role: 'learner',
      receiver_email: [],
    },
  });

  const handleEmailInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      addEmailChip();
    }
  };

  const addEmailChip = () => {
    const email = emailInput.trim();
    if (!email) return;

    const isValid = validateEmail(email);
    const isDuplicate = emailChips.some((chip) => chip.email === email);

    if (isDuplicate) {
      toast.error('Email already added');
      return;
    }

    const newChip: EmailChip = {
      id: `chip-${Date.now()}`,
      email,
      isValid,
    };

    const updatedChips = [...emailChips, newChip];
    setEmailChips(updatedChips);

    // Update form with valid emails
    const validEmails = updatedChips
      .filter((chip) => chip.isValid)
      .map((chip) => chip.email);
    form.setValue('receiver_email', validEmails);

    setEmailInput('');
  };

  const removeEmailChip = (chipId: string) => {
    const updatedChips = emailChips.filter((chip) => chip.id !== chipId);
    setEmailChips(updatedChips);

    // Update form with valid emails
    const validEmails = updatedChips
      .filter((chip) => chip.isValid)
      .map((chip) => chip.email);
    form.setValue('receiver_email', validEmails);
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setIsInviting(true);
    try {
      // Simulate API call
      await mutations.inviteUsers.mutateAsync(data);

      setEmailChips([]);
      setEmailInput('');
      form.reset();
      setShowInviteDialog(false);
      toast.success(`Invitations sent to ${data.receiver_email.length} users`);
    } catch (error) {
      toast.error(apiErrorMsg(error, 'Failed to send invitations'));
    } finally {
      setIsInviting(false);
    }
  });

  const getRoleIcon = (role: OrgUserRole) => {
    switch (role) {
      case 'learner':
        return <GraduationCap className="h-4 w-4" />;
      case 'instructor':
        return <Users className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: OrgUserRole) => {
    switch (role) {
      case 'learner':
        return 'from-blue-500 to-cyan-500';
      case 'instructor':
        return 'from-green-500 to-emerald-500';
      case 'admin':
        return 'from-purple-500 to-pink-500';
    }
  };

  // const getRoleDescription = (role: UserRole) => {
  //   switch (role) {
  //     case 'learner':
  //       return 'Can access courses and materials';
  //     case 'instructor':
  //       return 'Can create and manage courses';
  //     case 'admin':
  //       return 'Full administrative access';
  //   }
  // };

  const validEmailCount = emailChips.filter((chip) => chip.isValid).length;
  const currentRole = form.watch('role');

  return (
    <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
      <DialogTrigger asChild>
        <Button className="transform bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Users
        </Button>
      </DialogTrigger>

      <DialogContent className="overflow-hidden border-0 bg-gradient-to-br from-slate-50 to-white p-0 shadow-2xl sm:max-w-[650px]">
        {/* Beautiful Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
                <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                  <UserPlus className="h-6 w-6" />
                </div>
                Invite Users
                <Sparkles className="h-5 w-5 text-yellow-300" />
              </DialogTitle>
              <DialogDescription className="mt-2 text-base text-blue-100">
                Invite users to join this organization and start collaborating
                together
              </DialogDescription>
            </DialogHeader>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute -bottom-2 -left-2 h-16 w-16 rounded-full bg-yellow-300/20 blur-lg"></div>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Role Selection */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                      <Users className="h-4 w-4 text-blue-600" />
                      Role Assignment
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-lg border-2 border-gray-200 transition-all duration-200 focus:border-blue-500 focus:ring-blue-500/20">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-lg border-2 border-gray-200 shadow-xl">
                        <SelectItem
                          value="student"
                          className="p-4 transition-colors duration-200 hover:bg-blue-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2">
                              <GraduationCap className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-800">
                                Student
                              </span>
                              <span className="text-sm text-gray-600">
                                Can access courses and materials
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="instructor"
                          className="p-4 transition-colors duration-200 hover:bg-green-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-2">
                              <Users className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-800">
                                Instructor
                              </span>
                              <span className="text-sm text-gray-600">
                                Can create and manage courses
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="admin"
                          className="p-4 transition-colors duration-200 hover:bg-purple-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-purple-100 p-2">
                              <Shield className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-800">
                                Admin
                              </span>
                              <span className="text-sm text-gray-600">
                                Full administrative access
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-gray-600">
                      Choose the role that will be assigned to the invited
                      users.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Input Section */}
              <FormField
                control={form.control}
                name="receiver_email"
                render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                      <Mail className="h-4 w-4 text-blue-600" />
                      Email Addresses
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {/* Email Chips Display */}
                        {emailChips.length > 0 && (
                          <div className="rounded-xl border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50/50 to-purple-50/50 p-4 backdrop-blur-sm">
                            <div className="mb-3 flex flex-wrap gap-2">
                              {emailChips.map((chip, index) => (
                                <div
                                  key={chip.id}
                                  className={`animate-in slide-in-from-left-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                    chip.isValid
                                      ? 'border border-green-200 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800'
                                      : 'border border-red-200 bg-gradient-to-r from-red-100 to-pink-100 text-red-800'
                                  }`}
                                  style={{ animationDelay: `${index * 100}ms` }}
                                >
                                  <Mail className="h-3 w-3" />
                                  {chip.email}
                                  <button
                                    type="button"
                                    onClick={() => removeEmailChip(chip.id)}
                                    className="group ml-1 rounded-full p-1 transition-colors duration-200 hover:bg-black/20"
                                  >
                                    <X className="h-3 w-3 group-hover:text-red-600" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-blue-600">
                                {validEmailCount} valid email
                                {validEmailCount !== 1 ? 's' : ''} ready to
                                invite
                              </span>
                              {emailChips.some((chip) => !chip.isValid) && (
                                <span className="font-medium text-red-600">
                                  {
                                    emailChips.filter((chip) => !chip.isValid)
                                      .length
                                  }{' '}
                                  invalid email
                                  {emailChips.filter((chip) => !chip.isValid)
                                    .length !== 1
                                    ? 's'
                                    : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Email Input */}
                        <Input
                          placeholder="Enter email addresses (press Enter, comma, or space to add)"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          onKeyDown={handleEmailInputKeyDown}
                          onBlur={addEmailChip}
                          className="h-12 rounded-lg border-2 border-gray-200 transition-all duration-200 focus:border-blue-500 focus:ring-blue-500/20"
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="flex items-center gap-2 text-gray-600">
                      <span>Enter multiple email addresses separated by</span>
                      <kbd className="rounded bg-gray-100 px-2 py-1 text-xs">
                        Enter
                      </kbd>
                      <kbd className="rounded bg-gray-100 px-2 py-1 text-xs">
                        ,
                      </kbd>
                      <span>or</span>
                      <kbd className="rounded bg-gray-100 px-2 py-1 text-xs">
                        Space
                      </kbd>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role Preview */}
              {currentRole && validEmailCount > 0 && (
                <div
                  className={`rounded-xl bg-gradient-to-r p-4 ${getRoleColor(currentRole)} bg-opacity-10 border-opacity-20 animate-in fade-in-50 border-2`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`bg-gradient-to-r p-2 ${getRoleColor(currentRole)} rounded-lg text-white`}
                    >
                      {getRoleIcon(currentRole)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 capitalize">
                        Inviting as {currentRole}
                      </p>
                      <p className="text-sm text-gray-600">
                        {validEmailCount} user{validEmailCount !== 1 ? 's' : ''}{' '}
                        will receive {currentRole} access
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <DialogFooter className="gap-3 border-t border-gray-200 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowInviteDialog(false)}
                  className="border-2 border-gray-300 px-6 transition-all duration-200 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isInviting || validEmailCount === 0}
                  className={`bg-gradient-to-r px-8 ${getRoleColor(currentRole!)} transform text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:transform-none disabled:opacity-50`}
                >
                  {isInviting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Send {validEmailCount} Invitation
                      {validEmailCount !== 1 ? 's' : ''}
                    </div>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
