import { Header } from '@/components/header';
import { CourseCard } from '@/components/course-card';
import { Pagination } from '@/components/ui/pagination';
import { MobileFilterDrawer } from '@/components/mobile-filter-drawer';

export default function CoursesPage() {
  // Mock data for courses
  const courses = [
    {
      id: '1',
      title: 'Complete JavaScript Course',
      description:
        'Master JavaScript with the most comprehensive course available.',
      image: '/javascript-course.jpg',
      instructor: 'John Doe',
      rating: 4.8,
      students: 15432,
      price: 89.99,
      category: 'Programming',
    },
    {
      id: '2',
      title: 'React Native for Beginners',
      description: 'Learn to build mobile apps with React Native.',
      image: '/react-native-course.jpg',
      instructor: 'Jane Smith',
      rating: 4.7,
      students: 8721,
      price: 79.99,
      category: 'Mobile Development',
    },
    {
      id: '3',
      title: 'UX Design Fundamentals',
      description: 'Learn the core principles of UX design and prototyping.',
      image: '/ux-design-course.jpg',
      instructor: 'Michael Johnson',
      rating: 4.9,
      students: 12345,
      price: 94.99,
      category: 'Design',
    },
    {
      id: '4',
      title: 'Python for Data Science',
      description: 'Master Python for data analysis and visualization.',
      image: '/python-course.jpg',
      instructor: 'Sarah Williams',
      rating: 4.8,
      students: 18976,
      price: 99.99,
      category: 'Data Science',
    },
    {
      id: '5',
      title: 'Financial Planning Essentials',
      description: 'Learn the fundamentals of personal finance and investing.',
      image: '/finance-course.jpg',
      instructor: 'Robert Chen',
      rating: 4.6,
      students: 7654,
      price: 69.99,
      category: 'Finance',
    },
    {
      id: '6',
      title: 'Social Media Marketing',
      description:
        'Master social media marketing strategies for business growth.',
      image: '/social-media-course.jpg',
      instructor: 'Emily Davis',
      rating: 4.7,
      students: 9876,
      price: 74.99,
      category: 'Marketing',
    },
  ];

  return (
    <div>
      <Header />
      <main className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Courses</h1>
          <MobileFilterDrawer />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Pagination />
        </div>
      </main>
    </div>
  );
}
