import { useState } from 'react';
import { Header } from '@/components/header';
import { CourseCard } from '@/components/course-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search } from 'lucide-react';
import { MobileFilterDrawer } from '@/components/mobile-filter-drawer';
import { Link, useParams } from 'react-router-dom';

// Mock data for categories
const categoriesData = [
  {
    id: '1',
    name: 'Programming',
    description: 'Learn coding and software development',
    image: '/programming-category.jpg',
    courseCount: 243,
  },
  {
    id: '2',
    name: 'Data Science',
    description: 'Master data analysis and machine learning',
    image: '/data-science-category.jpg',
    courseCount: 187,
  },
  {
    id: '3',
    name: 'Design',
    description: 'Explore graphic, UX, and UI design',
    image: '/design-category.jpg',
    courseCount: 156,
  },
  {
    id: '4',
    name: 'Business',
    description: 'Develop business and entrepreneurship skills',
    image: '/business-category.jpg',
    courseCount: 201,
  },
];

// Mock data for courses in each category
const coursesData = {
  '1': [
    {
      id: '1',
      title: 'Complete JavaScript Course',
      description:
        'Master JavaScript with the most comprehensive course available. Learn from basics to advanced concepts.',
      image: '/javascript-course.jpg',
      instructor: 'Jane Doe',
      rating: 4.8,
      students: 45678,
      price: 49.99,
      category: 'Programming',
      level: 'All Levels',
      duration: '42h 30m',
      lastUpdated: '2023-10-15',
    },
    {
      id: '2',
      title: 'Python for Beginners',
      description:
        'Learn Python programming from scratch with hands-on projects and real-world examples.',
      image: '/python-course.jpg',
      instructor: 'John Smith',
      rating: 4.7,
      students: 32145,
      price: 39.99,
      category: 'Programming',
      level: 'Beginner',
      duration: '28h 15m',
      lastUpdated: '2023-09-20',
    },
    {
      id: '3',
      title: 'React Development Masterclass',
      description:
        'Build modern web applications with React, Redux, and modern JavaScript features.',
      image: '/react-course.jpg',
      instructor: 'Sarah Johnson',
      rating: 4.9,
      students: 28934,
      price: 59.99,
      category: 'Programming',
      level: 'Intermediate',
      duration: '35h 45m',
      lastUpdated: '2023-11-02',
    },
    {
      id: '4',
      title: 'Full Stack Web Development',
      description:
        'Complete guide to becoming a full stack developer with Node.js, Express, and MongoDB.',
      image: '/fullstack-course.jpg',
      instructor: 'Michael Chen',
      rating: 4.6,
      students: 19876,
      price: 79.99,
      category: 'Programming',
      level: 'Advanced',
      duration: '52h 20m',
      lastUpdated: '2023-08-14',
    },
  ],
  '2': [
    {
      id: '5',
      title: 'Data Science with Python',
      description:
        'Learn data analysis, visualization, and machine learning with Python and popular libraries.',
      image: '/data-science-course.jpg',
      instructor: 'Dr. Emily Rodriguez',
      rating: 4.8,
      students: 24567,
      price: 69.99,
      category: 'Data Science',
      level: 'Intermediate',
      duration: '45h 30m',
      lastUpdated: '2023-10-08',
    },
    {
      id: '6',
      title: 'Machine Learning A-Z',
      description:
        'Complete machine learning course covering supervised, unsupervised, and reinforcement learning.',
      image: '/ml-course.jpg',
      instructor: 'David Kim',
      rating: 4.7,
      students: 18432,
      price: 89.99,
      category: 'Data Science',
      level: 'Advanced',
      duration: '58h 15m',
      lastUpdated: '2023-09-25',
    },
  ],
  '3': [
    {
      id: '7',
      title: 'UI/UX Design Fundamentals',
      description:
        'Learn the principles of user interface and user experience design with practical projects.',
      image: '/ux-course.jpg',
      instructor: 'Lisa Wang',
      rating: 4.9,
      students: 15678,
      price: 54.99,
      category: 'Design',
      level: 'Beginner',
      duration: '32h 45m',
      lastUpdated: '2023-10-12',
    },
    {
      id: '8',
      title: 'Graphic Design Masterclass',
      description:
        'Master Adobe Creative Suite and create stunning visual designs for print and digital media.',
      image: '/graphic-design-course.jpg',
      instructor: 'Robert Taylor',
      rating: 4.6,
      students: 12345,
      price: 64.99,
      category: 'Design',
      level: 'All Levels',
      duration: '38h 20m',
      lastUpdated: '2023-09-18',
    },
  ],
  '4': [
    {
      id: '9',
      title: 'Digital Marketing Strategy',
      description:
        'Learn how to create and execute effective digital marketing campaigns across all channels.',
      image: '/marketing-course.jpg',
      instructor: 'Amanda Wilson',
      rating: 4.7,
      students: 21098,
      price: 49.99,
      category: 'Business',
      level: 'Intermediate',
      duration: '29h 30m',
      lastUpdated: '2023-10-05',
    },
    {
      id: '10',
      title: 'Entrepreneurship Essentials',
      description:
        'Start and grow your own business with proven strategies and real-world case studies.',
      image: '/entrepreneurship-course.jpg',
      instructor: 'James Brown',
      rating: 4.8,
      students: 16754,
      price: 59.99,
      category: 'Business',
      level: 'All Levels',
      duration: '41h 15m',
      lastUpdated: '2023-09-30',
    },
  ],
};

export default function CategoryCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [levelFilter, setLevelFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const params = useParams<{
    id: string;
  }>();

  // Find category by ID
  const category = categoriesData.find((c) => c.id === params.id);
  const courses = coursesData[params.id as keyof typeof coursesData] || [];

  if (!category) {
    return (
      <div>
        <Header />
        <div className="container py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h2 className="mb-2 text-xl font-semibold">Category Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The requested category could not be found.
              </p>
              <Button asChild>
                <Link to="/categories">Browse Categories</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Filter and sort courses
  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLevel =
        levelFilter === 'all' ||
        course.level.toLowerCase().includes(levelFilter.toLowerCase());

      const matchesPrice =
        priceFilter === 'all' ||
        (priceFilter === 'free' && course.price === 0) ||
        (priceFilter === 'paid' && course.price > 0) ||
        (priceFilter === 'under-50' && course.price < 50) ||
        (priceFilter === '50-100' && course.price >= 50 && course.price <= 100);

      return matchesSearch && matchesLevel && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return (
            new Date(b.lastUpdated).getTime() -
            new Date(a.lastUpdated).getTime()
          );
        case 'popularity':
        default:
          return b.students - a.students;
      }
    });

  return (
    <div>
      <Header />

      {/* Category Hero */}
      <div className="bg-muted py-12">
        <div className="container">
          <div className="mb-4 flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/categories">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Categories
              </Link>
            </Button>
          </div>

          <div className="max-w-3xl">
            <h1 className="mb-4 text-4xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground mb-6 text-xl">
              {category.description}
            </p>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                {courses.length} courses available
              </Badge>
              <Badge variant="outline" className="text-sm">
                {courses
                  .reduce((acc, course) => acc + course.students, 0)
                  .toLocaleString()}{' '}
                students enrolled
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container py-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Desktop Filters Sidebar */}
          <div className="hidden w-64 space-y-6 lg:block">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Level
                  </label>
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Price
                  </label>
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="under-50">Under $50</SelectItem>
                      <SelectItem value="50-100">$50 - $100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Bar */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Mobile Filter Button */}
                <MobileFilterDrawer
                // levelFilter={levelFilter}
                // setLevelFilter={setLevelFilter}
                // priceFilter={priceFilter}
                // setPriceFilter={setPriceFilter}
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {filteredCourses.length} of {courses.length} courses
              </p>
            </div>

            {/* Courses Grid */}
            {filteredCourses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <h3 className="mb-2 text-lg font-semibold">
                    No courses found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filters
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setLevelFilter('all');
                      setPriceFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
