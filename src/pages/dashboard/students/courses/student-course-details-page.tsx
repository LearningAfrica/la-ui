import { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  Play,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseProgressBar } from '@/components/courses/course-progress-bar';
import { Link, useParams } from 'react-router-dom';

// Mock course data
const courseData = {
  id: '1',
  title: 'Complete JavaScript Course',
  description:
    'Master JavaScript with the most comprehensive course available. This course is designed to take you from beginner to professional level.',
  instructor: {
    id: 'i1',
    name: 'Jane Doe',
    image: '/instructor-1.jpg',
    title: 'Senior Web Developer',
  },
  coverImage: '/javascript-code-abstract.png',
  duration: '24h 30m',
  lessons: 42,
  level: 'Beginner to Advanced',
  rating: 4.8,
  reviews: 1240,
  students: 15600,
  lastUpdated: '2023-10-15',
  price: 89.99,
  progress: 35,
  sections: [
    {
      id: 's1',
      title: 'Getting Started',
      lessons: [
        {
          id: 'l1',
          title: 'Course Introduction',
          duration: '10:25',
          type: 'video',
          isCompleted: true,
        },
        {
          id: 'l2',
          title: 'Setting Up Your Environment',
          duration: '15:40',
          type: 'video',
          isCompleted: true,
        },
        {
          id: 'l3',
          title: 'JavaScript Basics Quiz',
          duration: '15:00',
          type: 'quiz',
          isCompleted: false,
        },
      ],
    },
    {
      id: 's2',
      title: 'JavaScript Fundamentals',
      lessons: [
        {
          id: 'l4',
          title: 'Variables and Data Types',
          duration: '18:30',
          type: 'video',
          isCompleted: true,
        },
        {
          id: 'l5',
          title: 'Operators and Expressions',
          duration: '22:15',
          type: 'video',
          isCompleted: false,
        },
        {
          id: 'l6',
          title: 'Control Flow',
          duration: '25:10',
          type: 'video',
          isCompleted: false,
        },
      ],
    },
    {
      id: 's3',
      title: 'Functions and Objects',
      lessons: [
        {
          id: 'l7',
          title: 'Functions in JavaScript',
          duration: '28:45',
          type: 'video',
          isCompleted: false,
        },
        {
          id: 'l8',
          title: 'Objects and Properties',
          duration: '24:20',
          type: 'video',
          isCompleted: false,
        },
        {
          id: 'l9',
          title: 'Functions and Objects Quiz',
          duration: '20:00',
          type: 'quiz',
          isCompleted: false,
        },
      ],
    },
    {
      id: 's4',
      title: 'DOM Manipulation',
      lessons: [
        {
          id: 'l10',
          title: 'Introduction to the DOM',
          duration: '15:30',
          type: 'video',
          isCompleted: false,
        },
        {
          id: 'l11',
          title: 'Selecting and Modifying Elements',
          duration: '22:15',
          type: 'video',
          isCompleted: false,
        },
        {
          id: 'l12',
          title: 'Events and Event Handling',
          duration: '26:40',
          type: 'video',
          isCompleted: false,
        },
      ],
    },
  ],
};

export default function StudentCourseDetailPage() {
  const [activeTab, setActiveTab] = useState('curriculum');
  const params = useParams<{ id: string }>();
  // Calculate total duration
  const totalDuration = courseData.sections.reduce(
    (total, section) =>
      total +
      section.lessons.reduce((sectionTotal, lesson) => {
        const [minutes, seconds] = lesson.duration.split(':').map(Number);
        return sectionTotal + minutes + seconds / 60;
      }, 0),
    0,
  );

  // Format total duration
  const formattedTotalDuration = `${Math.floor(totalDuration)}h ${Math.round((totalDuration % 1) * 60)}m`;

  // Calculate completed lessons
  const totalLessons = courseData.sections.reduce(
    (total, section) => total + section.lessons.length,
    0,
  );
  const completedLessons = courseData.sections.reduce(
    (total, section) =>
      total + section.lessons.filter((lesson) => lesson.isCompleted).length,
    0,
  );

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/dashboard/student/courses">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Courses
        </Link>
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{courseData.title}</h1>
                  <p className="text-muted-foreground">
                    Instructor: {courseData.instructor.name} • Last updated:{' '}
                    {courseData.lastUpdated}
                  </p>
                </div>
                <Button asChild>
                  <Link
                    to={`/dashboard/student/courses/${params.id}/lessons/l1`}
                  >
                    {completedLessons > 0
                      ? 'Continue Learning'
                      : 'Start Course'}
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <CourseProgressBar progress={courseData.progress} />
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                <div className="flex items-center text-sm">
                  <BookOpen className="text-muted-foreground mr-1 h-4 w-4" />
                  <span>
                    {completedLessons}/{totalLessons} lessons
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="text-muted-foreground mr-1 h-4 w-4" />
                  <span>{formattedTotalDuration}</span>
                </div>
                <div className="flex items-center text-sm">
                  <User className="text-muted-foreground mr-1 h-4 w-4" />
                  <span>{courseData.students.toLocaleString()} students</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="curriculum" className="mt-4 space-y-4">
              {courseData.sections.map((section, index) => (
                <Card key={section.id}>
                  <CardHeader className="py-3">
                    <h3 className="font-medium">
                      Section {index + 1}: {section.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="py-0">
                    <div className="space-y-2">
                      {section.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="hover:bg-muted/50 flex items-center justify-between rounded-md p-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                              {lesson.isCompleted ? (
                                <CheckCircle className="text-primary h-4 w-4" />
                              ) : lesson.type === 'video' ? (
                                <Play className="h-4 w-4" />
                              ) : (
                                <BookOpen className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {lesson.title}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {lesson.type === 'video' ? 'Video' : 'Quiz'} •{' '}
                                {lesson.duration}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className={lesson.isCompleted ? 'text-primary' : ''}
                          >
                            <Link
                              to={`/dashboard/student/courses/${params.id}/lessons/${lesson.id}`}
                            >
                              {lesson.isCompleted ? 'Replay' : 'Start'}
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <h2>About This Course</h2>
                    <p>{courseData.description}</p>
                    <p>
                      This comprehensive JavaScript course will take you from
                      beginner to advanced level. You'll learn:
                    </p>
                    <ul>
                      <li>
                        JavaScript fundamentals including variables, data types,
                        and functions
                      </li>
                      <li>
                        Advanced concepts like closures, prototypes, and ES6+
                        features
                      </li>
                      <li>DOM manipulation and event handling</li>
                      <li>
                        Asynchronous JavaScript with Promises and async/await
                      </li>
                      <li>Error handling and debugging techniques</li>
                      <li>Modern JavaScript frameworks and libraries</li>
                    </ul>
                    <h2>Who This Course is For</h2>
                    <p>
                      This course is designed for anyone who wants to learn
                      JavaScript, whether you're a complete beginner or looking
                      to refresh your skills. No prior programming experience is
                      required.
                    </p>
                    <h2>Requirements</h2>
                    <ul>
                      <li>A computer with internet access</li>
                      <li>Basic computer skills</li>
                      <li>
                        A text editor (recommendations provided in the course)
                      </li>
                      <li>A desire to learn and practice</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <h3 className="mr-2 text-2xl font-bold">
                          {courseData.rating}
                        </h3>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-5 w-5 ${i < Math.floor(courseData.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        Based on {courseData.reviews} reviews
                      </p>
                    </div>
                    <Button>Write a Review</Button>
                  </div>

                  <div className="space-y-6">
                    {/* Sample reviews */}
                    <div className="border-b pb-6">
                      <div className="mb-2 flex justify-between">
                        <div className="flex items-center">
                          <div className="bg-muted mr-3 h-10 w-10 rounded-full"></div>
                          <div>
                            <p className="font-medium">Alex Johnson</p>
                            <p className="text-muted-foreground text-xs">
                              October 12, 2023
                            </p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="h-4 w-4 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p>
                        This course is amazing! I had no prior JavaScript
                        experience, and now I feel confident building my own
                        applications. The instructor explains complex concepts
                        in a way that's easy to understand.
                      </p>
                    </div>

                    <div className="border-b pb-6">
                      <div className="mb-2 flex justify-between">
                        <div className="flex items-center">
                          <div className="bg-muted mr-3 h-10 w-10 rounded-full"></div>
                          <div>
                            <p className="font-medium">Sarah Miller</p>
                            <p className="text-muted-foreground text-xs">
                              September 28, 2023
                            </p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(4)].map((_, i) => (
                            <svg
                              key={i}
                              className="h-4 w-4 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <svg
                            className="h-4 w-4 text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </div>
                      <p>
                        Great course with lots of practical examples. I
                        especially enjoyed the projects. The only thing I would
                        suggest is more exercises for beginners to practice the
                        concepts.
                      </p>
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between">
                        <div className="flex items-center">
                          <div className="bg-muted mr-3 h-10 w-10 rounded-full"></div>
                          <div>
                            <p className="font-medium">Michael Chen</p>
                            <p className="text-muted-foreground text-xs">
                              August 15, 2023
                            </p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="h-4 w-4 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p>
                        As someone with experience in other programming
                        languages, this course helped me quickly get up to speed
                        with JavaScript. The advanced sections were particularly
                        valuable, covering topics that many other courses skip.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Load More Reviews
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Course Information</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{courseData.progress}%</span>
                </div>
                <div className="bg-muted h-2 w-full rounded-full">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${courseData.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Course Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level</span>
                    <span>{courseData.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span>{courseData.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lessons</span>
                    <span>{courseData.lessons}</span>
                  </div>
                </div>
              </div>

              <div className="bg-border h-px w-full" />

              <div>
                <h3 className="mb-2 font-medium">Instructor</h3>
                <div className="flex items-center">
                  <div className="bg-muted mr-3 h-10 w-10 rounded-full"></div>
                  <div>
                    <p className="font-medium">{courseData.instructor.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {courseData.instructor.title}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to={`/dashboard/student/courses/${params.id}/lessons/l1`}>
                  {completedLessons > 0 ? 'Continue Learning' : 'Start Course'}
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Resources</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Course Workbook
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                JavaScript Cheat Sheet
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Project Files
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
