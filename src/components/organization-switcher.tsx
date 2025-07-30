import { useState } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
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
import { useOrganization } from '@/hooks/use-organizations';
import { useAuth } from '@/hooks/use-auth';

import type { Organization } from '@/lib/types/organization';

interface OrganizationSwitcherProps {
  className?: string;
  onWorkspaceChange?: (workspace: Organization) => void;
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
  const getOrganizationIcon = (organization: Organization) => {
    return organization?.name?.charAt(0).toUpperCase() || 'O';
  };

  // Handle organization change
  const handleOrganizationChange = (organization: Organization) => {
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
    return null;
  }

  return (
    <Dialog open={showNewOrgDialog} onOpenChange={setShowNewOrgDialog}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex w-full items-center gap-2 rounded-lg p-2 hover:bg-muted/50"
          >
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
          </Button>
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
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onClick={() => {
                    setOpen(false);
                    setShowNewOrgDialog(true);
                  }}
                  className="flex items-center gap-3 p-2"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                    <Plus className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="font-medium">Create new organization</span>
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
