import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useOrganization } from '@/hooks/use-organizations';
import { useAuth } from '@/hooks/use-auth';

export function OrganizationSwitcher() {
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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            aria-label="Select organization"
            className="flex items-center gap-2 rounded-full pl-3 pr-5 transition-all hover:bg-muted/50"
          >
            <Avatar className="h-8 w-8 border shadow">
              <AvatarImage
                src={`/placeholder-logo.svg`}
                alt={currentOrganization.name}
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                {currentOrganization.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{currentOrganization.name}</span>
              <span className="text-xs text-muted-foreground">Switch organization</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="end">
          <Command>
            <CommandList>
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium">Current organization</p>
                <div className="mt-2 flex items-center gap-3 p-2 rounded-md bg-muted/50">
                  <Avatar className="h-10 w-10 border shadow">
                    <AvatarImage
                      src={`/placeholder-logo.svg`}
                      alt={currentOrganization.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {currentOrganization.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{currentOrganization.name}</span>
                    {currentOrganization.position && (
                      <span className="text-xs text-muted-foreground">
                        {currentOrganization.position}
                      </span>
                    )}
                  </div>
                  <Check className="ml-auto h-4 w-4 text-primary" />
                </div>
              </div>

              <CommandInput placeholder="Search organizations..." className="px-4 py-3" />
              <CommandEmpty className="py-6 text-center text-sm">
                No organization found.
              </CommandEmpty>

              <ScrollArea className="h-[230px]">
                <CommandGroup heading="All organizations">
                  {auth.user?.organizations.map((organization) => (
                    <CommandItem
                      key={organization.id}
                      onSelect={() => {
                        auth.changeCurrentOrganization(organization.id);
                        setOpen(false);
                      }}
                      className="px-4 py-3 flex items-center gap-3"
                      disabled={currentOrganization.id === organization.id}
                    >
                      <Avatar className="h-10 w-10 border shadow">
                        <AvatarImage
                          src={`/placeholder-logo.svg`}
                          alt={organization.name}
                        />
                        <AvatarFallback className="bg-muted text-foreground">
                          {organization.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{organization.name}</span>
                        {organization.position && (
                          <span className="text-xs text-muted-foreground">
                            {organization.position}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>

              {canCreateOrganization && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <DialogTrigger asChild>
                      <CommandItem
                        onSelect={() => {
                          setOpen(false);
                          setShowNewOrgDialog(true);
                        }}
                        className="px-4 py-3 flex items-center"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted mr-3">
                          <Plus className="h-5 w-5" />
                        </div>
                        <span>Create new organization</span>
                      </CommandItem>
                    </DialogTrigger>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
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
