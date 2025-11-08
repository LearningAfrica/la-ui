import { useMemo, useState } from 'react';
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
import { useCourseCategories } from '@/lib/features/categories/use-course-categories';
import { format } from 'date-fns';

export default function CategoriesPage() {
  const navigate = useNavigate();
  // const [categories, setCategories] = useState(initialCategories);
  const { queries } = useCourseCategories();
  const categoriesData = useMemo(
    () =>
      queries.courseCategories.data && queries.courseCategories.data.data
        ? queries.courseCategories.data.data
        : [],
    [queries.courseCategories.data],
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filter categories based on search query
  // const filteredCategories = categories.filter(
  //   (category) =>
  //     category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  // );

  const filteredCategories = useMemo(() => {
    return categoriesData.filter(
      (category) =>
        category.category_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [categoriesData, searchQuery]);

  // Handle category deletion
  const handleDeleteCategory = (id: number) => {
    setCategoryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      // setCategories(
      //   categories.filter((category) => category.id !== categoryToDelete),
      // );
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
                  {/* <TableHead className="hidden md:table-cell">
                    Courses
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Students
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Revenue
                  </TableHead> */}
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
                              src={
                                category.category_image || '/placeholder.svg'
                              }
                              alt={category.category_name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">
                              {category.category_name}
                            </div>
                            <div className="text-muted-foreground hidden text-sm md:block">
                              {category.description.length > 50
                                ? `${category.description.substring(0, 50)}...`
                                : category.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      {/* <TableCell className="hidden md:table-cell">
                        {category.courseCount}
                      </TableCell> */}
                      {/* <TableCell className="hidden md:table-cell">
                        {category.students.toLocaleString()}
                      </TableCell> */}
                      {/* <TableCell className="hidden lg:table-cell">
                        {category.revenue}
                      </TableCell> */}
                      <TableCell className="hidden lg:table-cell">
                        {format(category.created, 'MMMM dd, yyyy')}
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
