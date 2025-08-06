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

interface OrganizationSwitcherProps {
  className?: string;
  onWorkspaceChange?: (workspace: ApiOrganizationInterface) => void;
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

  const userRole = auth.user?.role || 'student';
  const canCreateOrganization =
    userRole === 'super_admin' || userRole === 'admin';
  const currentOrganization = auth.getCurrentOrganization();

  // Function to get the organization icon
  const getOrganizationIcon = (organization: ApiOrganizationInterface) => {
    return organization?.name?.charAt(0).toUpperCase() || 'O';
  };

  // Handle organization change
  const handleOrganizationChange = (organization: ApiOrganizationInterface) => {
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
      console.error('Failed to create organization:', error);
    } finally {
      setIsCreating(false);
    }
  };

  if (!currentOrganization) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-500">
        <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 text-xs">-</span>
        </div>
        <span>No Organization</span>
      </div>
    );
  }

  return (
    <Dialog open={showNewOrgDialog} onOpenChange={setShowNewOrgDialog}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded transition-colors">
            <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-medium">
                {getOrganizationIcon(currentOrganization)}
              </span>
            </div>
            <span className="truncate flex-1 text-left">
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
          <DropdownMenuLabel className="text-xs text-gray-500 px-2 py-1">
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
                <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-xs font-medium">
                    {getOrganizationIcon(organization)}
                  </span>
                </div>
                <span className="truncate">{organization.name}</span>
                {currentOrganization.id === organization.id && (
                  <Check className="ml-auto h-3 w-3 text-primary" />
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
                  <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
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
