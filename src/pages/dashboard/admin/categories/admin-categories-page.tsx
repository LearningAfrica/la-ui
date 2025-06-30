import { useState } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Edit, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Mock data for categories
const initialCategories = [
  {
    id: '1',
    name: 'Programming',
    description: 'Learn coding and software development',
    image: '/programming-category.jpg',
    courseCount: 243,
    students: 12345,
    revenue: '$243,500',
    createdAt: '2023-05-15',
  },
  {
    id: '2',
    name: 'Data Science',
    description: 'Master data analysis and machine learning',
    image: '/data-science-category.jpg',
    courseCount: 187,
    students: 9876,
    revenue: '$187,600',
    createdAt: '2023-06-20',
  },
  {
    id: '3',
    name: 'Design',
    description: 'Explore graphic, UX, and UI design',
    image: '/design-category.jpg',
    courseCount: 156,
    students: 8765,
    revenue: '$156,300',
    createdAt: '2023-07-10',
  },
  {
    id: '4',
    name: 'Business',
    description: 'Develop business and entrepreneurship skills',
    image: '/business-category.jpg',
    courseCount: 201,
    students: 10432,
    revenue: '$201,400',
    createdAt: '2023-08-05',
  },
  {
    id: '5',
    name: 'Marketing',
    description: 'Learn digital marketing strategies and techniques',
    image: '/marketing-category.jpg',
    courseCount: 132,
    students: 7654,
    revenue: '$132,800',
    createdAt: '2023-09-12',
  },
  {
    id: '6',
    name: 'Photography',
    description: 'Master photography and photo editing',
    image: '/photography-category.jpg',
    courseCount: 98,
    students: 5432,
    revenue: '$98,700',
    createdAt: '2023-10-18',
  },
  {
    id: '7',
    name: 'Music',
    description: 'Learn music theory and instrument playing',
    image: '/music-category.jpg',
    courseCount: 76,
    students: 4321,
    revenue: '$76,500',
    createdAt: '2023-11-22',
  },
  {
    id: '8',
    name: 'Health & Fitness',
    description: 'Improve your health and fitness knowledge',
    image: '/fitness-category.jpg',
    courseCount: 112,
    students: 6543,
    revenue: '$112,900',
    createdAt: '2023-12-15',
  },
];

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filter categories based on search query
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle category deletion
  const handleDeleteCategory = (id: string) => {
    setCategoryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategories(
        categories.filter((category) => category.id !== categoryToDelete),
      );
      toast.success('Category deleted successfully');
      setCategoryToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage course categories on the platform
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/admin/categories/create">
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>
            View and manage all course categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search categories..."
                className="w-full pl-8 md:max-w-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Courses
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Students
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Revenue
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Created
                  </TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-md">
                            <img
                              src={category.image || '/placeholder.svg'}
                              alt={category.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{category.name}</div>
                            <div className="text-muted-foreground hidden text-sm md:block">
                              {category.description.length > 50
                                ? `${category.description.substring(0, 50)}...`
                                : category.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {category.courseCount}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {category.students.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {category.revenue}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {category.createdAt}
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
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(
                                  `/dashboard/admin/categories/${category.id}`,
                                )
                              }
                            >
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(
                                  `/dashboard/admin/categories/${category.id}/edit`,
                                )
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
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
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category and remove it from all
              related courses. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
