import { useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Building, Loader2, Plus, Save, Search, Settings } from 'lucide-react';
import { useOrganization } from '@/lib/features/organizations/use-organizations';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createOrganizationResolver } from '@/lib/validators/organization-schema';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/hooks/use-auth';

export default function OrganizationsPage() {
  const { mutations, queries } = useOrganization();
  const auth = useAuth();
  const form = useForm({
    resolver: createOrganizationResolver,
    defaultValues: { name: '', description: '' },
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('logo', file, { shouldValidate: true });
      setLogoPreview(URL.createObjectURL(file));
    }
  };
  const submitNewOrganization = form.handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.logo) formData.append('logo', data.logo);

      await mutations.create.mutateAsync(formData as any);
      setShowCreateDialog(false);
      form.reset();
      setLogoPreview(null);
    } catch (error: any) {
      console.error('Failed to create organization:', error);
      toast.error(error.message, { position: 'top-center' });
    }
  });

  if (!auth.user?.user_role || auth.user?.user_role !== 'super_admin') {
    return (
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <div className="py-12 text-center">
          <Building className="text-muted-foreground/50 mx-auto h-12 w-12" />
          <h3 className="mt-4 text-lg font-medium">Access Denied</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            You don't have permission to manage organizations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage organizations and their settings across the platform.
          </p>
        </div>

        {auth.user.can_create_organization ? (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button disabled={!auth.user.can_create_organization}>
                <Plus className="mr-2 h-4 w-4" />
                Create Organization
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <div className="flex items-center justify-center">
                  {logoPreview && (
                    <Avatar className="mb-4 h-16 w-16 rounded border">
                      <AvatarImage src={logoPreview} alt="Organization Logo" />
                    </Avatar>
                  )}
                </div>
                <DialogTitle>Create New Organization</DialogTitle>
                <DialogDescription>
                  Create a new organization to manage courses and users.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={submitNewOrganization}
                  className="space-y-4 py-2 pb-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter organization name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter organization description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo (optional)</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              type="file"
                              accept="image/jpeg,image/png,image/svg+xml"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full"
                            >
                              {field.value?.name || 'Upload Logo'}
                            </Button>
                            {field.value && (
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground text-sm">
                                  {field.value.name}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    form.setValue('logo', undefined);
                                    if (fileInputRef.current) {
                                      fileInputRef.current.value = '';
                                    }
                                    setLogoPreview(null);
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          JPEG, PNG, or SVG (max 2MB)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateDialog(false);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Create Organization
                        </>
                      )}
                      {/* {isCreating ? 'Creating...' : 'Create Organization'} */}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        ) : (
          <Link to="/dashboard/billing" className="">
            Contact sales to create an organization.
          </Link>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Organizations Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Organizations</CardTitle>
          <CardDescription>
            {queries.organizations.data?.length}
            {/* of {organizations.length}{' '} */}
            organizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                {/* <TableHead>Members</TableHead> */}
                {/* <TableHead>Domain</TableHead> */}
                <TableHead>Description</TableHead>
                {/* <TableHead>Status</TableHead> */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queries.organizations.data?.map((org) => (
                <TableRow key={org.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={org.logo_url || '/placeholder.svg'}
                          alt={org.name}
                        />
                        <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{org.name}</div>
                        {org.description && (
                          <div className="text-muted-foreground line-clamp-1 text-sm">
                            {org.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  {/* <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="text-muted-foreground h-4 w-4" />
                      {org.memberCount}
                    </div>
                  </TableCell> */}
                  {/* <TableCell>
                    {org.domain ? (
                      <Badge variant="secondary">{org.domain}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell> */}
                  {/* <TableCell>
                    {new Date(org.createdAt).toLocaleDateString()}
                  </TableCell> */}
                  {/* <TableCell>
                    <Badge variant="default">Active</Badge>
                  </TableCell> */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/dashboard/admin/organizations/${org.id}`}>
                          View
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          to={`/dashboard/admin/organizations/${org.id}/settings`}
                        >
                          <Settings className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
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
