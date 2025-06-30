import { useState } from 'react';
import { ArrowLeft, MoreHorizontal, Plus, Search } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

// Mock data for categories
const categoriesData = [
  {
    id: 'cat-1',
    name: 'Account Management',
    slug: 'account-management',
    description: 'Articles related to account settings, login, and security.',
    articleCount: 12,
  },
  {
    id: 'cat-2',
    name: 'Billing & Payments',
    slug: 'billing-payments',
    description:
      'Information about billing cycles, payment methods, and invoices.',
    articleCount: 8,
  },
  {
    id: 'cat-3',
    name: 'Course Creation',
    slug: 'course-creation',
    description: 'Guides for instructors on creating and managing courses.',
    articleCount: 15,
  },
  {
    id: 'cat-4',
    name: 'Student Resources',
    slug: 'student-resources',
    description: 'Resources and guides for students using the platform.',
    articleCount: 10,
  },
  {
    id: 'cat-5',
    name: 'Technical Support',
    slug: 'technical-support',
    description: 'Troubleshooting common technical issues and platform bugs.',
    articleCount: 7,
  },
];

// Define the form schema with Zod
const categorySchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  slug: z
    .string()
    .min(3, { message: 'Slug must be at least 3 characters' })
    .regex(/^[a-z0-9-]+$/, {
      message: 'Slug can only contain lowercase letters, numbers, and hyphens',
    }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' }),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function ManageCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(categoriesData);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  });

  // Filter categories based on search query
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Auto-generate slug from name
  const watchName = form.watch('name');
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  };

  // Update slug when name changes
  useState(() => {
    if (watchName && !form.getValues('slug')) {
      form.setValue('slug', generateSlug(watchName));
    }
  });

  // Handle opening the create dialog
  const handleOpenCreateDialog = () => {
    form.reset({
      name: '',
      slug: '',
      description: '',
    });
    setIsCreateDialogOpen(true);
  };

  // Handle opening the edit dialog
  const handleOpenEditDialog = (category: any) => {
    setSelectedCategory(category);
    form.reset({
      name: category.name,
      slug: category.slug,
      description: category.description,
    });
    setIsEditDialogOpen(true);
  };

  // Handle opening the delete dialog
  const handleOpenDeleteDialog = (category: any) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  // Handle creating a new category
  const handleCreateCategory = async (data: CategoryFormValues) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create a new category
      const newCategory = {
        id: `cat-${categories.length + 1}`,
        name: data.name,
        slug: data.slug,
        description: data.description,
        articleCount: 0,
      };

      // Add the new category to the list
      setCategories([...categories, newCategory]);

      //   toast({
      //     title: "Category created",
      //     description: `${data.name} has been created successfully.`,
      //   })
      toast.success(`${data.name} has been created successfully.`);

      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating category:', error);
      //   toast({
      //     title: "Error",
      //     description: "Failed to create category. Please try again.",
      //     variant: "destructive",
      //   })
      toast.error('Failed to create category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle updating a category
  const handleUpdateCategory = async (data: CategoryFormValues) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the category
      const updatedCategories = categories.map((category) => {
        if (category.id === selectedCategory.id) {
          return {
            ...category,
            name: data.name,
            slug: data.slug,
            description: data.description,
          };
        }
        return category;
      });

      // Update the categories list
      setCategories(updatedCategories);

      //   toast({
      //     title: "Category updated",
      //     description: `${data.name} has been updated successfully.`,
      //   })
      toast.success(`${data.name} has been updated successfully.`);

      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating category:', error);
      //   toast({
      //     title: "Error",
      //     description: "Failed to update category. Please try again.",
      //     variant: "destructive",
      //   })
      toast.error('Failed to update category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Remove the category from the list
      const updatedCategories = categories.filter(
        (category) => category.id !== selectedCategory.id,
      );
      setCategories(updatedCategories);

      //   toast({
      //     title: "Category deleted",
      //     description: `${selectedCategory.name} has been deleted successfully.`,
      //   })
      toast.success(`${selectedCategory.name} has been deleted successfully.`);

      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting category:', error);
      //   toast({
      //     title: "Error",
      //     description: "Failed to delete category. Please try again.",
      //     variant: "destructive",
      //   })
      toast.error('Failed to delete category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/admin/support">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Support
            </Link>
          </Button>
        </div>
        <Button onClick={handleOpenCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Manage Categories</h2>
        <p className="text-muted-foreground">
          Create, edit, and organize knowledge base categories
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base Categories</CardTitle>
          <CardDescription>
            Manage the categories used to organize your knowledge base articles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-sm">
                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search categories..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Articles</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No categories found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          <Link
                            to={`/dashboard/admin/support/categories/${category.id}`}
                            className="text-primary hover:underline"
                          >
                            {category.name}
                          </Link>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {category.slug}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {category.description}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">
                            {category.articleCount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link
                                  to={`/dashboard/admin/support/categories/${category.id}`}
                                >
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleOpenEditDialog(category)}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleOpenDeleteDialog(category)}
                                disabled={category.articleCount > 0}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Category Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category to organize your knowledge base articles.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreateCategory)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Account Management" {...field} />
                    </FormControl>
                    <FormDescription>
                      A clear and descriptive name for the category.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. account-management" {...field} />
                    </FormControl>
                    <FormDescription>
                      The URL-friendly version of the name. Use only lowercase
                      letters, numbers, and hyphens.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief description of what this category contains..."
                        className="min-h-16"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A short description that explains what kind of articles
                      belong in this category.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Category'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the details of this category.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdateCategory)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Account Management" {...field} />
                    </FormControl>
                    <FormDescription>
                      A clear and descriptive name for the category.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. account-management" {...field} />
                    </FormControl>
                    <FormDescription>
                      The URL-friendly version of the name. Use only lowercase
                      letters, numbers, and hyphens.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief description of what this category contains..."
                        className="min-h-16"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A short description that explains what kind of articles
                      belong in this category.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Category'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category &quot;
              {selectedCategory?.name}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
