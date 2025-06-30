import { useState, useEffect } from 'react';

import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Users,
  BookOpen,
  DollarSign,
  MoreHorizontal,
  Eye,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { toast } from 'sonner';
import { Link, useNavigate, useParams } from 'react-router-dom';

// Mock data for category
const categoryData = {
  id: '1',
  name: 'Web Development',
  description:
    'Learn modern web development technologies including HTML, CSS, JavaScript, React, and more. Build responsive websites and web applications from scratch.',
  image: '/vibrant-street-market.png',
  status: 'active' as const,
  createdAt: '2024-01-15',
  updatedAt: '2024-02-20',
  totalCourses: 24,
  totalStudents: 1847,
  totalRevenue: 89750,
  averageRating: 4.6,
  courses: [
    {
      id: '1',
      title: 'Complete JavaScript Course',
      instructor: {
        id: '1',
        name: 'John Smith',
        image: '/abstract-geometric-shapes.png',
      },
      students: 342,
      rating: 4.8,
      price: 89.99,
      status: 'published' as const,
      createdAt: '2024-01-20',
    },
    {
      id: '2',
      title: 'React for Beginners',
      instructor: {
        id: '2',
        name: 'Sarah Johnson',
        image: '/green-tractor-field.png',
      },
      students: 256,
      rating: 4.7,
      price: 79.99,
      status: 'published' as const,
      createdAt: '2024-01-25',
    },
    {
      id: '3',
      title: 'Advanced CSS Techniques',
      instructor: {
        id: '3',
        name: 'Mike Wilson',
        image: '/stylized-ej-initials.png',
      },
      students: 189,
      rating: 4.5,
      price: 69.99,
      status: 'draft' as const,
      createdAt: '2024-02-01',
    },
    {
      id: '4',
      title: 'Node.js Backend Development',
      instructor: {
        id: '4',
        name: 'Emily Davis',
        image: '/abstract-blue-burst.png',
      },
      students: 298,
      rating: 4.6,
      price: 99.99,
      status: 'published' as const,
      createdAt: '2024-02-05',
    },
    {
      id: '5',
      title: 'Full Stack Web Development',
      instructor: {
        id: '5',
        name: 'David Brown',
        image: '/abstract-southwest.png',
      },
      students: 412,
      rating: 4.9,
      price: 149.99,
      status: 'published' as const,
      createdAt: '2024-02-10',
    },
  ],
};

export default function CategoryViewPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<typeof categoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      if (params.id === '1') {
        setCategory(categoryData);
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [params.id]);

  const handleDeleteCategory = () => {
    toast.success('Category deleted successfully');
    navigate('/dashboard/admin/categories');
  };

  const handleDeleteCourse = (courseId: string) => {
    if (category) {
      const updatedCourses = category.courses.filter(
        (course) => course.id !== courseId,
      );
      setCategory({
        ...category,
        courses: updatedCourses,
        totalCourses: updatedCourses.length,
      });
      toast.success('Course removed from category');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!category) {
    return (
      <div className="flex-1 p-6 md:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/admin/categories">
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
              <Link to="/dashboard/admin/categories">Return to Categories</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/admin/categories">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Categories
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to={`/dashboard/admin/categories/${category.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Category
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleDeleteCategory}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Category Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="bg-muted relative h-32 w-full overflow-hidden rounded-lg md:w-48">
              <img
                src={category.image || '/placeholder.svg'}
                alt={category.name}
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h1 className="mb-2 text-2xl font-bold">{category.name}</h1>
                  <Badge
                    variant={
                      category.status === 'active' ? 'default' : 'secondary'
                    }
                  >
                    {category.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{category.averageRating}</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                {category.description}
              </p>
              <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                <span>
                  Created: {new Date(category.createdAt).toLocaleDateString()}
                </span>
                <span>
                  Updated: {new Date(category.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{category.totalCourses}</div>
            <p className="text-muted-foreground text-xs">
              Active courses in category
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {category.totalStudents.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              Enrolled across all courses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${category.totalRevenue.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">From all courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{category.averageRating}</div>
            <p className="text-muted-foreground text-xs">Across all courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Courses in Category */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Courses in Category</CardTitle>
              <CardDescription>
                Manage courses within this category
              </CardDescription>
            </div>
            <Button asChild>
              <Link to="/dashboard/admin/courses/create">
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {category.courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="font-medium">{course.title}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={course.instructor.image || '/placeholder.svg'}
                          alt={course.instructor.name}
                        />
                        <AvatarFallback>
                          {course.instructor.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{course.instructor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{course.students}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{course.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>${course.price}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        course.status === 'published' ? 'default' : 'secondary'
                      }
                    >
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(course.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/dashboard/admin/courses/${course.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Course
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/dashboard/admin/courses/${course.id}/edit`}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Course
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove from Category
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
