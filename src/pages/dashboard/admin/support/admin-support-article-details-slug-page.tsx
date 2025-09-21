import { useState } from 'react';
import { ArrowLeft, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export default function ArticleDetailPage() {
  // const params = useParams<{ slug: string }>();
  //   const router = useNavigate()
  const [article,] = useState({
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
  });

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
            <Link to={`/dashboard/admin/support/articles/${article.slug}/edit`}>
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
          <span>Last updated: {article.lastUpdated}</span>
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
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium">Status</h3>
            <Badge
              variant={
                article.status === 'published'
                  ? 'secondary'
                  : article.status === 'draft'
                    ? 'outline'
                    : 'default'
              }
              className="mt-1"
            >
              {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
            </Badge>
          </div>
          <div>
            <h3 className="text-sm font-medium">Created</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              {article.createdAt}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
