import { useState } from 'react';
import { Check, ChevronDown, Plus } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useOrganization } from '@/domains/organizations/use-organizations';
import { useAuth } from '@/hooks/use-auth';

import type { ApiOrganizationInterface } from '@/lib/types/organization';
import { apiErrorMsg } from '@/lib/utils/axios-err';

interface OrganizationSwitcherProps {
  className?: string;
  onWorkspaceChange?: (workspace: Partial<ApiOrganizationInterface>) => void;
}

export function OrganizationSwitcher({
  onWorkspaceChange,
}: OrganizationSwitcherProps = {}) {
  const { mutations } = useOrganization();
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  const [showNewOrgDialog, setShowNewOrgDialog] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgDescription, setNewOrgDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const userRole = auth.user?.user_role || 'user';
  const canCreateOrganization =
    userRole === 'super_admin' || userRole === 'user';
  const currentOrganization = auth.getCurrentOrganization()!;

  // Function to get the organization icon
  const getOrganizationIcon = (organization: ApiOrganizationInterface) => {
    return organization?.name?.charAt(0).toUpperCase() || 'O';
  };

  // Handle organization change
  const handleOrganizationChange = (organization: Partial<ApiOrganizationInterface>) => {
    if (!organization.id) return;
    auth.changeCurrentOrganization(organization.id);
    setOpen(false);
    if (onWorkspaceChange) {
      onWorkspaceChange(organization);
    }
  };

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
      console.error(
        apiErrorMsg(error, 'Failed to create organization:'),
      );
    } finally {
      setIsCreating(false);
    }
  };

  if (!currentOrganization) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-500">
        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-300">
          <span className="text-xs text-gray-600">-</span>
        </div>
        <span>No Organization</span>
      </div>
    );
  }

  return (
    <Dialog open={showNewOrgDialog} onOpenChange={setShowNewOrgDialog}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button className="hover:text-primary flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50">
            <div className="bg-primary flex h-4 w-4 items-center justify-center rounded-full">
              <span className="text-primary-foreground text-xs font-medium">
                {getOrganizationIcon(currentOrganization!)}
              </span>
            </div>
            <span className="flex-1 truncate text-left">
              {currentOrganization.name}
            </span>
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 p-1"
          side="bottom"
          align="start"
          alignOffset={-8}
          sideOffset={8}
        >
          <DropdownMenuLabel className="px-2 py-1 text-xs text-gray-500">
            Organizations
          </DropdownMenuLabel>
          <div className="max-h-48 overflow-y-auto">
            {auth.user?.organizations.map((organization) => (
              <DropdownMenuItem
                key={organization.id}
                disabled={currentOrganization.id === organization.id}
                onClick={() => handleOrganizationChange(organization)}
                className="flex items-center gap-2 px-2 py-1.5 text-sm"
              >
                <div className="bg-primary flex h-4 w-4 items-center justify-center rounded-full">
                  <span className="text-primary-foreground text-xs font-medium">
                    {getOrganizationIcon(organization)}
                  </span>
                </div>
                <span className="truncate">{organization.name}</span>
                {currentOrganization.id === organization.id && (
                  <Check className="text-primary ml-auto h-3 w-3" />
                )}
              </DropdownMenuItem>
            ))}
          </div>

          {canCreateOrganization && (
            <>
              <DropdownMenuSeparator className="my-1" />
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onClick={() => {
                    setOpen(false);
                    setShowNewOrgDialog(true);
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm"
                >
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-200">
                    <Plus className="h-3 w-3 text-gray-500" />
                  </div>
                  <span>Create new</span>
                </DropdownMenuItem>
              </DialogTrigger>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>
            Add a new organization to manage courses and users.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization name</Label>
            <Input
              id="name"
              placeholder="Enter organization name"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter organization description"
              value={newOrgDescription}
              onChange={(e) => setNewOrgDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewOrgDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateOrganization}
            disabled={!newOrgName.trim() || isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Organization'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
