import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ArrowLeft, Eye, Loader2, Save } from 'lucide-react';

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link, useNavigate, useParams } from 'react-router-dom';
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

// Mock function to get article data
const getArticleBySlug = (slug: string) => {
  // This would be replaced with an actual API call in a real application
  const articles = [
    {
      id: 'KB-101',
      title: 'How to Reset Your Password',
      slug: 'how-to-reset-password',
      category: 'account-management',
      tags: 'password,account,security',
      status: 'published',
      excerpt:
        'Step-by-step guide to resetting your password and recovering account access.',
      content: `<h1>How to Reset Your Password</h1>
<p>If you've forgotten your password or need to reset it for security reasons, follow these simple steps to regain access to your account.</p>
<h2>Method 1: Using the Login Page</h2>
<ol>
  <li>Navigate to the login page</li>
  <li>Click on the "Forgot Password" link below the login form</li>
  <li>Enter the email address associated with your account</li>
  <li>Check your email for a password reset link</li>
  <li>Click the link and follow the instructions to create a new password</li>
</ol>
<h2>Method 2: Contact Support</h2>
<p>If you're unable to reset your password using the above method, you can contact our support team:</p>
<ol>
  <li>Email support@example.com with the subject "Password Reset Request"</li>
  <li>Include your username and the email address associated with your account</li>
  <li>Our team will verify your identity and help you reset your password</li>
</ol>
<h2>Security Tips</h2>
<ul>
  <li>Choose a strong password with a mix of letters, numbers, and special characters</li>
  <li>Don't reuse passwords across multiple sites</li>
  <li>Consider using a password manager to keep track of your credentials</li>
  <li>Enable two-factor authentication for additional security</li>
</ul>
<p>If you continue to experience issues, please contact our support team for assistance.</p>`,
    },
    {
      id: 'KB-102',
      title: 'Accessing Course Materials Offline',
      slug: 'accessing-course-materials-offline',
      category: 'course-access',
      tags: 'offline,download,mobile',
      status: 'published',
      excerpt:
        "Learn how to download and access course materials when you don't have an internet connection.",
      content: `<h1>Accessing Course Materials Offline</h1>
<p>Our platform allows you to download course materials for offline access, making it convenient to learn even without an internet connection.</p>
<h2>Downloading Course Materials</h2>
<h3>On Desktop</h3>
<ol>
  <li>Navigate to the course page</li>
  <li>Click on the "Materials" tab</li>
  <li>Look for the download icon next to each resource</li>
  <li>Click the download icon to save the material to your device</li>
</ol>
<h3>On Mobile App</h3>
<ol>
  <li>Open the mobile app and go to your course</li>
  <li>Tap on the "Materials" section</li>
  <li>Tap the three-dot menu next to each resource</li>
  <li>Select "Download for Offline Use"</li>
  <li>Access downloaded materials in the "Downloads" section of the app</li>
</ol>
<h2>Supported File Types</h2>
<p>The following file types can be downloaded for offline access:</p>
<ul>
  <li>PDF documents</li>
  <li>Video lectures (MP4 format)</li>
  <li>Audio files (MP3 format)</li>
  <li>Presentation slides (PDF format)</li>
</ul>
<h2>Storage Management</h2>
<p>Downloaded materials can take up significant space on your device. To manage your storage:</p>
<ol>
  <li>Go to "Settings" > "Downloads"</li>
  <li>View how much space each course is using</li>
  <li>Delete unnecessary downloads to free up space</li>
</ol>
<h2>Limitations</h2>
<ul>
  <li>Quizzes and interactive exercises require an internet connection</li>
  <li>Downloaded materials expire after 30 days and need to be re-downloaded</li>
  <li>Some specialized content may not be available for offline access</li>
</ul>
<p>For any issues with offline access, please contact our support team.</p>`,
    },
  ];

  return articles.find((article) => article.slug === slug);
};

export default function EditArticlePage() {
  const params = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
  const [_article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize the form
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      category: '',
      excerpt: '',
      content: '',
      tags: '',
      status: 'draft',
    },
  });

  // Fetch article data on component mount
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        const articleData = getArticleBySlug(params.slug!);

        if (!articleData) {
          setError('Article not found');
          return;
        }

        setArticle(articleData);

        // Set form values
        form.reset({
          title: articleData.title,
          category: articleData.category,
          excerpt: articleData.excerpt,
          content: articleData.content,
          tags: articleData.tags,
          status: articleData.status as 'published' | 'draft' | 'archived',
        });
      } catch (err) {
        setError('Failed to load article data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [params.slug, form]);

  // Handle form submission
  const onSubmit = async (data: ArticleFormValues) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Log the form data (in a real app, you would send this to your API)
      console.log('Updated article data:', data);

      //   toast({
      //     title: "Article updated",
      //     description: "The article has been updated successfully.",
      //   })
      toast.success('Article updated', {
        description: 'The article has been updated successfully.',
      });

      navigate(`/dashboard/admin/support/articles/${params.slug}`);
    } catch (error) {
      console.error('Error updating article:', error);
      //   toast({
      //     title: "Update failed",
      //     description: "Failed to update article. Please try again.",
      //     variant: "destructive",
      //   })
      toast.error('Update failed', {
        description: 'Failed to update article. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 md:p-8">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading article data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 md:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/admin/support/articles">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Articles
            </Link>
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/dashboard/admin/support/articles/${params.slug}`}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Article
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/support/articles/${params.slug}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              View Live
            </Link>
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Article</h2>
        <p className="text-muted-foreground">
          Update the content and metadata for this article
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
          <CardDescription>
            Edit the information for this article
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
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
