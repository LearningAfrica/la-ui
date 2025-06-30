import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

// Form validation schema
const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Name must be less than 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be less than 100 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens',
    ),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  isActive: z.boolean(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

// Mock function to get category by ID
const getCategoryById = async (id: string) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const categories = [
    {
      id: 'cat-1',
      name: 'Account Management',
      slug: 'account-management',
      description: 'Articles related to account settings, login, and security.',
      isActive: true,
      articleCount: 12,
      publishedArticles: 10,
      draftArticles: 2,
      totalViews: 15420,
      createdAt: '2023-09-15',
      updatedAt: '2023-12-10',
    },
    {
      id: 'cat-2',
      name: 'Billing & Payments',
      slug: 'billing-payments',
      description:
        'Information about billing cycles, payment methods, and invoices.',
      isActive: true,
      articleCount: 8,
      publishedArticles: 7,
      draftArticles: 1,
      totalViews: 9876,
      createdAt: '2023-09-20',
      updatedAt: '2023-12-08',
    },
    {
      id: 'cat-3',
      name: 'Course Creation',
      slug: 'course-creation',
      description: 'Guides for instructors on creating and managing courses.',
      isActive: true,
      articleCount: 15,
      publishedArticles: 13,
      draftArticles: 2,
      totalViews: 23450,
      createdAt: '2023-08-10',
      updatedAt: '2023-12-12',
    },
  ];

  return categories.find((cat) => cat.id === id) || null;
};

export default function EditSupportCategoryPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState<any>(null);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      isActive: true,
    },
  });

  // Load category data
  useEffect(() => {
    const loadCategory = async () => {
      try {
        const categoryData = await getCategoryById(params.id!);
        if (categoryData) {
          setCategory(categoryData);
          form.reset({
            name: categoryData.name,
            slug: categoryData.slug,
            description: categoryData.description,
            isActive: categoryData.isActive,
          });
        }
      } catch (error) {
        console.error('Error loading category:', error);
        // toast({
        //   title: "Error",
        //   description: "Failed to load category data.",
        //   variant: "destructive",
        // })
        toast.error('Failed to load category data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategory();
  }, [params.id, form]);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Watch name field to auto-generate slug
  const watchedName = form.watch('name');
  useEffect(() => {
    if (watchedName && !form.formState.dirtyFields.slug) {
      form.setValue('slug', generateSlug(watchedName));
    }
  }, [watchedName, form]);

  // Handle form submission
  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      //   toast({
      //     title: "Category updated",
      //     description: "The support category has been updated successfully.",
      //   })
      toast.success('The support category has been updated successfully.');

      navigate('/dashboard/admin/support/categories');
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/admin/support/categories">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Categories
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="bg-muted h-6 animate-pulse rounded" />
                <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-muted h-4 w-1/4 animate-pulse rounded" />
                  <div className="bg-muted h-10 animate-pulse rounded" />
                </div>
                <div className="space-y-4">
                  <div className="bg-muted h-4 w-1/4 animate-pulse rounded" />
                  <div className="bg-muted h-10 animate-pulse rounded" />
                </div>
                <div className="space-y-4">
                  <div className="bg-muted h-4 w-1/4 animate-pulse rounded" />
                  <div className="bg-muted h-24 animate-pulse rounded" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <div className="bg-muted h-6 animate-pulse rounded" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted h-4 animate-pulse rounded" />
                <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
                <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex-1 p-6 md:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/admin/support/categories">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Categories
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="mb-2 text-xl font-semibold">Category Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The requested category could not be found.
            </p>
            <Button asChild>
              <Link to="/dashboard/admin/support/categories">
                Return to Categories
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/admin/support/categories">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Categories
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Support Category</CardTitle>
                  <CardDescription>
                    Update the details of this support category
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter category name" {...field} />
                        </FormControl>
                        <FormDescription>
                          The display name for this support category
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
                        <FormLabel>URL Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="category-slug" {...field} />
                        </FormControl>
                        <FormDescription>
                          The URL-friendly version of the name. Only lowercase
                          letters, numbers, and hyphens allowed.
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
                            placeholder="Describe what this category covers..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A brief description of what articles this category
                          contains
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Active Status
                          </FormLabel>
                          <FormDescription>
                            When active, this category and its articles will be
                            visible to users
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex items-center gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Category...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Category
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/dashboard/admin/support/categories">Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Current Status</Label>
                <div className="mt-1">
                  {category.isActive ? (
                    <Badge
                      variant="outline"
                      className="border-green-200 bg-green-50 text-green-600"
                    >
                      Active
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-gray-200 bg-gray-50 text-gray-600"
                    >
                      Inactive
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium">Articles</Label>
                <div className="mt-1 space-y-1">
                  <div className="text-2xl font-bold">
                    {category.articleCount}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {category.publishedArticles} published,{' '}
                    {category.draftArticles} draft
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Total Views</Label>
                <div className="mt-1">
                  <div className="text-2xl font-bold">
                    {category.totalViews.toLocaleString()}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    All time views
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium">Created</Label>
                <div className="text-muted-foreground mt-1 text-sm">
                  {formatDate(category.createdAt)}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Last Updated</Label>
                <div className="text-muted-foreground mt-1 text-sm">
                  {formatDate(category.updatedAt)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-transparent"
                asChild
              >
                <Link to={`/dashboard/admin/support/categories/${category.id}`}>
                  View Category Details
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-transparent"
                asChild
              >
                <Link
                  to={`/dashboard/admin/support/articles/create?category=${category.slug}`}
                >
                  Add New Article
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-transparent"
                asChild
              >
                <Link to="/dashboard/admin/support/articles">
                  View All Articles
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
