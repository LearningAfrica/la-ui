import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ArrowLeft, Loader2, SaveIcon, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createCourseCategoryResolver } from '@/lib/validators/course-categories-page';
import { useCourseCategories } from '@/lib/features/categories/use-course-categories';
import { apiErrorMsg } from '@/lib/utils/axios-err';
import { useAuth } from '@/hooks/use-auth';

export default function CreateCategoryPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const {
    mutations: { create },
  } = useCourseCategories();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Initialize the form
  const form = useForm({
    resolver: createCourseCategoryResolver,
    defaultValues: {
      category_name: '',
      description: '',
      organization: auth.current_org_id || '',
    },
  });

  // Handle form submission
  const onSubmit = form.handleSubmit(async (data) => {
    await create.mutateAsync(data, {
      onSuccess: () => {
        toast.success('Category created successfully');
        navigate('/dashboard/admin/categories');
      },
      onError: (error) => {
        toast.error(
          apiErrorMsg(error, 'Failed to create category'),
        );
      },
    });
  });

  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };
  console.log(form.getValues());

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/admin/categories">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Categories
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Category</h1>
          <p className="text-muted-foreground">
            Add a new course category to the platform
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>
            Enter the information for the new category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6" >
              <FormField
                control={form.control}
                name="category_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Web Development" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed to users.
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
                        placeholder="Describe what students will learn in this category..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a clear description of what this category covers.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_image"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Category Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById('category-image')?.click()
                            }
                            className="w-full"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                          </Button>
                          <Input
                            id="category-image"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              onChange(e.target.files![0]);
                              handleImageChange(e);
                            }}
                            {...fieldProps}
                          />
                        </div>

                        {previewImage && (
                          <div className="mt-4">
                            <p className="text-muted-foreground mb-2 text-sm">
                              Preview:
                            </p>
                            <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border">
                              <img
                                src={previewImage || '/placeholder.svg'}
                                alt="Category preview"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload an image that represents this category. Recommended
                      size: 1280x720px.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/admin/categories')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full"
                >
                  {form.formState.isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <SaveIcon className="mr-2 h-4 w-4" />
                  )}
                  {form.formState.isSubmitting
                    ? 'Creating...'
                    : 'Create Category'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
