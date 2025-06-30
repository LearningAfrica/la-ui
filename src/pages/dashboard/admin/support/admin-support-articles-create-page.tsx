import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { TiptapEditor } from '@/components/tiptap';

// Define the form schema with Zod
const articleSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  category: z.string().min(1, { message: 'Please select a category' }),
  excerpt: z
    .string()
    .min(20, { message: 'Excerpt must be at least 20 characters' }),
  content: z
    .string()
    .min(50, { message: 'Content must be at least 50 characters' }),
  tags: z.string().optional(),
  status: z.enum(['published', 'draft', 'archived']),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

export default function CreateArticlePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');

  // Initialize the form
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      category: '',
      excerpt: '',
      content: '<p>Start writing your article here...</p>',
      tags: '',
      status: 'draft',
    },
  });

  // Handle form submission
  const onSubmit = async (data: ArticleFormValues) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Log the form data (in a real app, you would send this to your API)
      console.log('Article data:', data);

      //   toast({
      //     title: "Article created",
      //     description: "Your article has been created successfully.",
      //   })
      toast.success('Article created', {
        description: 'Your article has been created successfully.',
      });

      navigate('/dashboard/admin/support/articles');
    } catch (error) {
      console.error('Error creating article:', error);
      //   toast({
      //     title: "Error creating article",
      //     description: "Failed to create article. Please try again.",
      //     variant: "destructive",
      //   })
      toast.error('Error creating article', {
        description: 'Failed to create article. Please try again.',
      });

      console.error('Error creating article:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/admin/support/articles">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Articles
          </Link>
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Create New Article
        </h2>
        <p className="text-muted-foreground">
          Create a new knowledge base article
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
          <CardDescription>
            Enter the information for the new article
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Article Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. How to reset your password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A clear and concise title for the article.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="account-management">
                            Account Management
                          </SelectItem>
                          <SelectItem value="course-access">
                            Course Access
                          </SelectItem>
                          <SelectItem value="technical-support">
                            Technical Support
                          </SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select the category that best fits this article.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief summary of the article..."
                        className="min-h-16"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A short summary of the article that appears in search
                      results.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="edit">Edit</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                      </TabsList>
                      <TabsContent value="edit" className="mt-2">
                        <FormControl>
                          <TiptapEditor
                            content={field.value}
                            onChange={field.onChange}
                            placeholder="Start writing your article content here..."
                            className="min-h-[400px]"
                          />
                        </FormControl>
                      </TabsContent>
                      <TabsContent value="preview" className="mt-2">
                        <div className="prose prose-sm dark:prose-invert min-h-[400px] max-w-none rounded-md border p-4">
                          <div
                            dangerouslySetInnerHTML={{ __html: field.value }}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                    <FormDescription>
                      Use the toolbar to format your content.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. password, account, security"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Keywords that describe this article, separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      The status of this article.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Article'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
