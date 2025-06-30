import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface Category {
  name: string;
  description: string;
  href: string;
}

export function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const categories: Category[] = [
    {
      name: 'Web Development',
      description: 'Learn to build modern web applications',
      href: '/categories/web-development',
    },
    {
      name: 'Data Science',
      description: 'Master data analysis and machine learning',
      href: '/categories/data-science',
    },
    {
      name: 'Design',
      description: 'Create beautiful user interfaces and experiences',
      href: '/categories/design',
    },
    {
      name: 'Business',
      description: 'Develop essential business and entrepreneurship skills',
      href: '/categories/business',
    },
  ];

  const popularCourses = [
    {
      title: 'React Masterclass',
      to: '/courses/react-masterclass',
    },
    {
      title: 'Python for Data Science',
      to: '/courses/python-data-science',
    },
    {
      title: 'UI/UX Design Fundamentals',
      to: '/courses/uiux-design',
    },
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="flex items-center gap-1 px-2"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        Courses{' '}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 z-50 mt-2 grid w-[600px] grid-cols-3 gap-4 p-4">
          <div className="col-span-2">
            <CardHeader className="p-2">
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 p-2">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.href}
                  className="hover:bg-muted block rounded-md p-3"
                  onClick={() => setIsOpen(false)}
                >
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {category.description}
                  </p>
                </Link>
              ))}
            </CardContent>
            <CardFooter className="p-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/categories">View All Categories</Link>
              </Button>
            </CardFooter>
          </div>

          <div>
            <CardHeader className="p-2">
              <CardTitle className="text-lg">Popular Courses</CardTitle>
              <CardDescription>Our most enrolled courses</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 p-2">
              {popularCourses.map((course) => (
                <Link
                  key={course.title}
                  to={course.to}
                  className="text-sm hover:underline"
                  onClick={() => setIsOpen(false)}
                >
                  {course.title}
                </Link>
              ))}
            </CardContent>
            <CardFooter className="p-2">
              <Button asChild variant="link" size="sm" className="px-0">
                <Link to="/courses">Browse All Courses</Link>
              </Button>
            </CardFooter>
          </div>
        </Card>
      )}
    </div>
  );
}
