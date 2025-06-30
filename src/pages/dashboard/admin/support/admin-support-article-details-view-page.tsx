import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link, useParams } from 'react-router-dom';

// Mock function to get article data by ID
const getArticleById = (id: string) => {
  // This would be replaced with an actual API call in a real application
  const articles = [
    {
      id: 'KB-101',
      title: 'How to Reset Your Password',
      slug: 'how-to-reset-password',
      category: 'Account Management',
      categorySlug: 'account-management',
      tags: ['password', 'account', 'security'],
      status: 'published',
      views: 1245,
      helpfulRating: 92,
      lastUpdated: '2023-10-15',
      createdAt: '2023-09-01',
      author: {
        id: 'A-201',
        name: 'Sarah Miller',
        avatar: '/abstract-geometric-sm.png',
      },
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
      category: 'Course Access',
      categorySlug: 'course-access',
      tags: ['offline', 'download', 'mobile'],
      status: 'published',
      views: 987,
      helpfulRating: 88,
      lastUpdated: '2023-10-28',
      createdAt: '2023-09-15',
      author: {
        id: 'A-202',
        name: 'David Wilson',
        avatar: '/abstract-dw.png',
      },
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
    {
      id: 'KB-103',
      title: 'Understanding Course Completion Requirements',
      slug: 'course-completion-requirements',
      category: 'Courses',
      categorySlug: 'courses',
      tags: ['completion', 'certificate', 'requirements'],
      status: 'published',
      views: 1532,
      helpfulRating: 95,
      lastUpdated: '2023-11-05',
      createdAt: '2023-08-20',
      author: {
        id: 'A-203',
        name: 'James Thompson',
        avatar: '/abstract-letter-jt.png',
      },
      excerpt:
        'Detailed explanation of the requirements needed to complete courses and earn certificates.',
      content: `<h1>Understanding Course Completion Requirements</h1>
<p>To successfully complete a course and receive your certificate, you need to meet specific requirements.</p>
<h2>Standard Completion Requirements</h2>
<p>Most courses require:</p>
<ul>
  <li><strong>Viewing all lecture content</strong> - You must view all video lectures and reading materials</li>
  <li><strong>Completing all quizzes</strong> - You must attempt and pass all quizzes with a minimum score (usually 70%)</li>
  <li><strong>Submitting required assignments</strong> - All required assignments must be submitted and receive a passing grade</li>
  <li><strong>Participating in discussions</strong> - Some courses require a minimum level of participation in discussion forums</li>
</ul>`,
    },
  ];

  return articles.find((article) => article.id === id);
};

export default function ArticleDetailPage() {
  const params = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        const articleData = getArticleById(params.id!);

        if (!articleData) {
          setError('Article not found');
          return;
        }

        setArticle(articleData);
      } catch (err) {
        setError('Failed to load article data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [params.id]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 text-green-600"
          >
            Published
          </Badge>
        );
      case 'draft':
        return (
          <Badge
            variant="outline"
            className="border-yellow-200 bg-yellow-50 text-yellow-600"
          >
            Draft
          </Badge>
        );
      case 'archived':
        return (
          <Badge
            variant="outline"
            className="border-gray-200 bg-gray-50 text-gray-600"
          >
            Archived
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
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

  if (error || !article) {
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
          <AlertDescription>{error || 'Article not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/admin/support/articles">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Articles
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/support/articles/${article.slug}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              View Live
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to={`/dashboard/admin/support/articles/edit/${article.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Article
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{article.title}</h1>
        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
          <Badge variant="outline">{article.category}</Badge>
          <span>•</span>
          <span>Last updated: {formatDate(article.lastUpdated)}</span>
          <span>•</span>
          <span>{article.views} views</span>
          <span>•</span>
          <span>{article.helpfulRating}% found helpful</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardDescription>{article.excerpt}</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Article Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium">Created by</h3>
            <div className="mt-1 flex items-center gap-2">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                <span className="text-xs font-bold">
                  {article.author.name.charAt(0)}
                </span>
              </div>
              <p className="text-sm">{article.author.name}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium">Tags</h3>
            <div className="mt-1 flex flex-wrap gap-1">
              {article.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium">Status</h3>
            <div className="mt-1">{getStatusBadge(article.status)}</div>
          </div>
          <div>
            <h3 className="text-sm font-medium">Created</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              {formatDate(article.createdAt)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
