import { useState } from 'react';
import {
  ArrowLeft,
  Book,
  BookOpen,
  Clock,
  Edit,
  Eye,
  FileText,
  MoreHorizontal,
  Plus,
  Trash2,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Mock data for knowledge base articles
const knowledgeBaseArticles = [
  {
    id: 'KB-101',
    title: 'How to Reset Your Password',
    slug: 'how-to-reset-password',
    category: 'Account Management',
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
    content: `
# How to Reset Your Password

If you've forgotten your password or need to reset it for security reasons, follow these simple steps to regain access to your account.

## Method 1: Using the Login Page

1. Navigate to the login page
2. Click on the "Forgot Password" link below the login form
3. Enter the email address associated with your account
4. Check your email for a password reset link
5. Click the link and follow the instructions to create a new password

## Method 2: Contact Support

If you're unable to reset your password using the above method, you can contact our support team:

1. Email support@example.com with the subject "Password Reset Request"
2. Include your username and the email address associated with your account
3. Our team will verify your identity and help you reset your password

## Security Tips

- Choose a strong password with a mix of letters, numbers, and special characters
- Don't reuse passwords across multiple sites
- Consider using a password manager to keep track of your credentials
- Enable two-factor authentication for additional security

If you continue to experience issues, please contact our support team for assistance.
    `,
  },
  {
    id: 'KB-102',
    title: 'Accessing Course Materials Offline',
    slug: 'accessing-course-materials-offline',
    category: 'Course Access',
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
    content: `
# Accessing Course Materials Offline

Our platform allows you to download course materials for offline access, making it convenient to learn even without an internet connection.

## Downloading Course Materials

### On Desktop

1. Navigate to the course page
2. Click on the "Materials" tab
3. Look for the download icon next to each resource
4. Click the download icon to save the material to your device

### On Mobile App

1. Open the mobile app and go to your course
2. Tap on the "Materials" section
3. Tap the three-dot menu next to each resource
4. Select "Download for Offline Use"
5. Access downloaded materials in the "Downloads" section of the app

## Supported File Types

The following file types can be downloaded for offline access:

- PDF documents
- Video lectures (MP4 format)
- Audio files (MP3 format)
- Presentation slides (PDF format)

## Storage Management

Downloaded materials can take up significant space on your device. To manage your storage:

1. Go to "Settings" > "Downloads"
2. View how much space each course is using
3. Delete unnecessary downloads to free up space

## Limitations

- Quizzes and interactive exercises require an internet connection
- Downloaded materials expire after 30 days and need to be re-downloaded
- Some specialized content may not be available for offline access

For any issues with offline access, please contact our support team.
    `,
  },
  // Other articles...
];

// Mock data for article categories
const articleCategories = [
  {
    id: 'CAT-1',
    name: 'Account Management',
    slug: 'account-management',
    articleCount: 12,
  },
  {
    id: 'CAT-2',
    name: 'Course Access',
    slug: 'course-access',
    articleCount: 8,
  },
  // Other categories...
];

// Mock data for article tags
const articleTags = [
  { id: 'TAG-1', name: 'password', articleCount: 5 },
  { id: 'TAG-2', name: 'account', articleCount: 8 },
  // Other tags...
];

export default function AdminSupportArticlesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter articles based on search query and filters
  const filteredArticles = knowledgeBaseArticles.filter((article) => {
    // Search query filter
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory =
      categoryFilter === 'all' || article.category === categoryFilter;

    // Status filter
    const matchesStatus =
      statusFilter === 'all' || article.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle article selection
  const handleArticleSelect = (article: any) => {
    setSelectedArticle(article);
  };

  // Handle article deletion
  const handleDeleteArticle = () => {
    if (!selectedArticle) return;

    setIsDeleting(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would delete the article from the database
      //   toast({
      //     title: "Article deleted",
      //     description: `Article "${selectedArticle.title}" has been deleted.`,
      //   })
      toast.success(`Article "${selectedArticle.title}" has been deleted.`);

      setIsDeleting(false);
      setShowDeleteDialog(false);
      setSelectedArticle(null);
    }, 1000);
  };

  // Handle article status change
  const handleStatusChange = (status: string) => {
    if (!selectedArticle) return;

    // In a real app, you would update the article status in the database
    // toast({
    //   title: "Status updated",
    //   description: `Article status changed to ${status}.`,
    // })
    toast.success(`Article status changed to ${status}.`);

    // Update the selected article with the new status
    setSelectedArticle({
      ...selectedArticle,
      status,
      lastUpdated: new Date().toISOString().split('T')[0],
    });
  };

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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Knowledge Base Articles
          </h2>
          <p className="text-muted-foreground">
            Manage support articles and help documentation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard/admin/support">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Support
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/dashboard/admin/support/articles/create">
              <Plus className="mr-2 h-4 w-4" />
              New Article
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>All Articles</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {articleCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
            <CardDescription className="pt-2">
              {filteredArticles.length} article
              {filteredArticles.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-auto">
              {filteredArticles.length > 0 ? (
                <div className="divide-y">
                  {filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      className={`hover:bg-muted/50 cursor-pointer p-4 ${
                        selectedArticle?.id === article.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => handleArticleSelect(article)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{article.title}</p>
                          <p className="text-muted-foreground line-clamp-1 text-sm">
                            {article.excerpt}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(article.status)}
                        </div>
                      </div>
                      <div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4">
                          <p>ID: {article.id}</p>
                          <p>Category: {article.category}</p>
                          <p>Updated: {formatDate(article.lastUpdated)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {article.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />{' '}
                            {article.helpfulRating}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="text-muted-foreground/50 h-12 w-12" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No articles found
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Organize articles by category</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[300px] overflow-auto">
                <div className="divide-y">
                  {articleCategories.map((category) => (
                    <div
                      key={category.id}
                      className={`hover:bg-muted/50 cursor-pointer p-3 ${
                        categoryFilter === category.name ? 'bg-muted' : ''
                      }`}
                      onClick={() => setCategoryFilter(category.name)}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{category.name}</p>
                        <Badge variant="outline">{category.articleCount}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/dashboard/admin/support/categories/manage">
                  <Plus className="mr-2 h-4 w-4" />
                  Manage Categories
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Tags</CardTitle>
              <CardDescription>Most used article tags</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {articleTags
                  .sort((a, b) => b.articleCount - a.articleCount)
                  .slice(0, 15)
                  .map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="hover:bg-muted cursor-pointer"
                      onClick={() => setSearchQuery(tag.name)}
                    >
                      {tag.name} ({tag.articleCount})
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>

          {selectedArticle && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Article Actions</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(
                            `/dashboard/admin/support/articles/edit/${selectedArticle.id}`,
                          )
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Article
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(
                            `/dashboard/admin/support/articles/view/${selectedArticle.id}`,
                          )
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          window.open(
                            `/support/articles/${selectedArticle.slug}`,
                            '_blank',
                          )
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Live
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleStatusChange('published')}
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Publish
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange('draft')}
                      >
                        <Book className="mr-2 h-4 w-4" />
                        Save as Draft
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange('archived')}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Article
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>
                  {selectedArticle.id}: {selectedArticle.title}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Status</p>
                  <div>{getStatusBadge(selectedArticle.status)}</div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm">{selectedArticle.category}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Views</p>
                  <p className="text-sm">
                    {selectedArticle.views.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Helpful Rating</p>
                  <p className="text-sm">{selectedArticle.helpfulRating}%</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm">
                    {formatDate(selectedArticle.lastUpdated)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm">
                    {formatDate(selectedArticle.createdAt)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Author</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage
                        src={
                          selectedArticle.author.avatar || '/placeholder.svg'
                        }
                        alt={selectedArticle.author.name}
                      />
                      <AvatarFallback>
                        {selectedArticle.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm">{selectedArticle.author.name}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link
                    to={`/dashboard/admin/support/articles/edit/${selectedArticle.id}`}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link
                    to={`/dashboard/admin/support/articles/view/${selectedArticle.id}`}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this article? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{selectedArticle?.title}</p>
            <p className="text-muted-foreground mt-1 text-sm">
              {selectedArticle?.excerpt}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteArticle}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Article'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
