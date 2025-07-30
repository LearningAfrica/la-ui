import { useState } from 'react';
import {
  Building2,
  Check,
  ChevronsUpDown,
  LogOut,
  Plus,
  Settings,
  User,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useOrganization } from '@/hooks/use-organizations';
import { useAuth } from '@/hooks/use-auth';

interface OrganizationSwitcherProps {
  className?: string;
  onWorkspaceChange?: (workspace: any) => void;
}

export function OrganizationSwitcher({
  className,
  onWorkspaceChange,
}: OrganizationSwitcherProps) {
  const { mutations } = useOrganization();
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  const [showNewOrgDialog, setShowNewOrgDialog] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgDescription, setNewOrgDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const userRole = auth.user?.role || 'student';
  const canCreateOrganization =
    userRole === 'super_admin' || userRole === 'admin';
  const currentOrganization = auth.getCurrentOrganization();

  if (!currentOrganization) {
    return null;
  }

  // Function to get the organization logo or fallback to its first letter
  const getOrganizationIcon = (organization: any) => {
    return organization?.name?.charAt(0).toUpperCase() || 'O';
  };

  // Handle organization change
  const handleOrganizationChange = (organization: any) => {
    auth.changeCurrentOrganization(organization.id);
    setOpen(false);
    if (onWorkspaceChange) {
      onWorkspaceChange(organization);
    }
  };

  // Handle new organization creation
  const handleCreateOrganization = async () => {
    if (!newOrgName.trim()) return;

    setIsCreating(true);
    try {
      await mutations.create.mutateAsync({
        name: newOrgName,
        description: newOrgDescription,
      });
      setNewOrgName('');
      setNewOrgDescription('');
      setShowNewOrgDialog(false);
    } catch (error) {
      console.error('Failed to create organization:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-2 rounded-lg p-2 hover:bg-muted/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <span className="text-base font-semibold">
              {getOrganizationIcon(currentOrganization)}
            </span>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{currentOrganization.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {currentOrganization.position || 'Switch organization'}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[280px] p-2"
        side="bottom"
        align="start"
        alignOffset={-8}
        sideOffset={8}
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Current organization
        </DropdownMenuLabel>
        <div className="mt-2 flex items-center gap-3 rounded-md bg-muted/50 p-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-background shadow">
            <span className="text-base font-semibold">{getOrganizationIcon(currentOrganization)}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{currentOrganization.name}</span>
            {currentOrganization.position && (
              <span className="text-xs text-muted-foreground">{currentOrganization.position}</span>
            )}
          </div>
          <Check className="ml-auto h-4 w-4 text-primary" />
        </div>

        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          All organizations
        </DropdownMenuLabel>
        <div className="max-h-[230px] overflow-y-auto py-1">
          {auth.user?.organizations.map((organization) => (
            <DropdownMenuItem
              key={organization.id}
              disabled={currentOrganization.id === organization.id}
              onClick={() => handleOrganizationChange(organization)}
              className="flex items-center gap-3 p-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-background shadow">
                <span className="text-base font-semibold">{getOrganizationIcon(organization)}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{organization.name}</span>
                {organization.position && (
                  <span className="text-xs text-muted-foreground">{organization.position}</span>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>

        {canCreateOrganization && (
          <>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem
              onClick={() => setShowNewOrgDialog(true)}
              className="flex items-center gap-3 p-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                <Plus className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="font-medium">Create new organization</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
