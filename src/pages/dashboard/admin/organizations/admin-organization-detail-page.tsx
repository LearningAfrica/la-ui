import type React from 'react';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Edit,
  Mail,
  MoreHorizontal,
  Search,
  Settings,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import type { UserRole } from '@/lib/types/auth';
import { Link, useParams } from 'react-router-dom';
import { useOrganization } from '@/domains/organizations/use-organizations';
import { useAuth } from '@/hooks/use-auth';

// Mock member data
const mockMembers = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    image: '/vibrant-street-market.png',
    role: 'admin' as UserRole,
    joinedAt: '2023-01-20T00:00:00Z',
    status: 'active',
    lastActive: '2024-01-15T10:30:00Z',
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    image: '/abstract-geometric-shapes.png',
    role: 'instructor' as UserRole,
    joinedAt: '2023-02-15T00:00:00Z',
    status: 'active',
    lastActive: '2024-01-14T15:45:00Z',
  },
  {
    id: 'user-3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    image: '/abstract-blue-burst.png',
    role: 'student' as UserRole,
    joinedAt: '2023-03-10T00:00:00Z',
    status: 'active',
    lastActive: '2024-01-13T09:20:00Z',
  },
  {
    id: 'user-4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    image: '/abstract-southwest.png',
    role: 'student' as UserRole,
    joinedAt: '2023-04-05T00:00:00Z',
    status: 'pending',
    lastActive: null,
  },
];

interface EmailChip {
  id: string;
  email: string;
  isValid: boolean;
}

export default function OrganizationDetailPage() {
  const params = useParams<{ id: string }>();
  const { mutations, queries } = useOrganization();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailChips, setEmailChips] = useState<EmailChip[]>([]);
  const [inviteRole, setInviteRole] = useState<UserRole>('student');
  const [isInviting, setIsInviting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const { user, getCurrentOrganization } = useAuth();
  const canManageMembers =
    user?.role === 'super_admin' || user?.role === 'admin';

  // Find organization
  const organization = getCurrentOrganization();

  if (!organization) {
    return (
      <div className="flex-1 p-6 md:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/admin/organizations">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Organizations
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="mb-2 text-xl font-semibold">
              Organization Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              The requested organization could not be found.
            </p>
            <Button asChild>
              <Link to="/dashboard/admin/organizations">
                Return to Organizations
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Initialize edit form
  if (showEditDialog && !editName) {
    setEditName(organization.name);
    setEditDescription(organization.description || '');
  }

  const filteredMembers = mockMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

    setEmailChips([...emailChips, newChip]);
    setEmailInput('');
  };

  const removeEmailChip = (chipId: string) => {
    setEmailChips(emailChips.filter((chip) => chip.id !== chipId));
  };

  const handleSelectMember = (memberId: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers([...selectedMembers, memberId]);
    } else {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(filteredMembers.map((member) => member.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleInviteUsers = async () => {
    const validEmails = emailChips.filter((chip) => chip.isValid);
    if (validEmails.length === 0) {
      toast.error('Please add at least one valid email address');
      return;
    }

    setIsInviting(true);
    try {
      for (const chip of validEmails) {
        // await inviteUserToOrganization(chip.email, organization.id, inviteRole);
      }
      setEmailChips([]);
      setEmailInput('');
      setInviteRole('student');
      setShowInviteDialog(false);
      toast.success(`Invitations sent to ${validEmails.length} users`);
    } catch (error) {
      toast.error('Failed to send invitations');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMembers = async () => {
    if (selectedMembers.length === 0) return;

    setIsRemoving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSelectedMembers([]);
      setShowRemoveDialog(false);
      toast.success(
        `Removed ${selectedMembers.length} members from organization`,
      );
    } catch (error) {
      toast.error('Failed to remove members');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleEditOrganization = async () => {
    if (!editName.trim()) {
      toast.error('Organization name is required');
      return;
    }

    setIsEditing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowEditDialog(false);
      toast.success('Organization updated successfully');
    } catch (error) {
      toast.error('Failed to update organization');
    } finally {
      setIsEditing(false);
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'instructor':
        return 'default';
      case 'student':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'suspended':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/admin/organizations">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Organizations
          </Link>
        </Button>
      </div>

      {/* Organization Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={organization.logo || '/placeholder.svg'}
              alt={organization.name}
            />
            <AvatarFallback className="text-lg">
              {organization.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {organization.name}
            </h1>
            {organization.description && (
              <p className="text-muted-foreground mt-1">
                {organization.description}
              </p>
            )}
            <div className="mt-2 flex items-center gap-4">
              <div className="text-muted-foreground flex items-center gap-1 text-sm">
                <Users className="h-4 w-4" />
                {organization.memberCount} members
              </div>
              {organization.domain && (
                <Badge variant="secondary">{organization.domain}</Badge>
              )}
            </div>
          </div>
        </div>
        {canManageMembers && (
          <div className="flex items-center gap-2">
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Organization</DialogTitle>
                  <DialogDescription>
                    Update organization details and settings.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Organization Name</Label>
                    <Input
                      id="edit-name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowEditDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleEditOrganization} disabled={isEditing}>
                    {isEditing ? 'Updating...' : 'Update Organization'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button asChild>
              <Link
                to={`/dashboard/admin/organizations/${organization.id}/settings`}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Actions Bar */}
      {canManageMembers && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedMembers.length > 0 && (
              <Dialog
                open={showRemoveDialog}
                onOpenChange={setShowRemoveDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove ({selectedMembers.length})
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Remove Members</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to remove {selectedMembers.length}{' '}
                      member(s) from this organization? This action cannot be
                      undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowRemoveDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleRemoveMembers}
                      disabled={isRemoving}
                    >
                      {isRemoving ? 'Removing...' : 'Remove Members'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Users
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Invite Users</DialogTitle>
                <DialogDescription>
                  Invite users to join this organization by entering their email
                  addresses.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={inviteRole}
                    onValueChange={(value: UserRole) => setInviteRole(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emails">Email Addresses</Label>
                  <div className="space-y-2">
                    {emailChips.length > 0 && (
                      <div className="bg-muted/50 flex flex-wrap gap-2 rounded-md border p-2">
                        {emailChips.map((chip) => (
                          <div
                            key={chip.id}
                            className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm ${
                              chip.isValid
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-destructive text-destructive-foreground'
                            }`}
                          >
                            <Mail className="h-3 w-3" />
                            {chip.email}
                            <button
                              onClick={() => removeEmailChip(chip.id)}
                              className="ml-1 rounded-full p-0.5 hover:bg-black/20"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <Input
                      id="emails"
                      placeholder="Enter email addresses (press Enter, comma, or space to add)"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={handleEmailInputKeyDown}
                      onBlur={addEmailChip}
                    />
                    <p className="text-muted-foreground text-xs">
                      Enter multiple email addresses separated by commas,
                      spaces, or press Enter after each email.
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowInviteDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInviteUsers}
                  disabled={isInviting || emailChips.length === 0}
                >
                  {isInviting
                    ? 'Sending...'
                    : `Send ${emailChips.filter((c) => c.isValid).length} Invitations`}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Members</CardTitle>
          <CardDescription>
            {filteredMembers.length} of {mockMembers.length} members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {canManageMembers && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedMembers.length === filteredMembers.length &&
                        filteredMembers.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  {canManageMembers && (
                    <TableCell>
                      <Checkbox
                        checked={selectedMembers.includes(member.id)}
                        onCheckedChange={(checked) =>
                          handleSelectMember(member.id, checked as boolean)
                        }
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={member.image || '/placeholder.svg'}
                          alt={member.name}
                        />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-muted-foreground text-sm">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(member.role)}>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(member.status)}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {member.lastActive
                      ? new Date(member.lastActive).toLocaleDateString()
                      : 'Never'}
                  </TableCell>
                  <TableCell className="text-right">
                    {canManageMembers && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Role</DropdownMenuItem>
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Remove from Organization
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
