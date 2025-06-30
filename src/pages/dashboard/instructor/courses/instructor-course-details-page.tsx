import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';

import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import {
  ArrowLeft,
  BarChart2,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Eye,
  FileText,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Play,
  Send,
  Settings,
  Star,
  Trash2,
  Upload,
  Users,
  XCircle,
  Download,
} from 'lucide-react';
import type { CourseStatus } from '@/lib/types/course';
import { Link, useNavigate, useParams } from 'react-router-dom';

// Mock course data (simplified for this example)
const coursesData = [
  {
    id: '1',
    title: 'Complete JavaScript Course',
    description:
      'Master JavaScript with the most comprehensive course available. This course is designed to take you from beginner to advanced level.',
    category: 'Programming',
    level: 'All Levels',
    price: 89.99,
    status: 'draft' as CourseStatus,
    image: '/javascript-course.jpg',
    lastUpdated: '2023-10-15',
    createdAt: '2023-08-20',
    students: 456,
    rating: 4.8,
    totalRatings: 128,
    revenue: '$4,560',
    duration: '42h 30m',
    totalLessons: 156,
    totalSections: 12,
    completionRate: 68,
    isComplete: false,
    completionChecklist: {
      basicInfo: true,
      curriculum: true,
      media: false,
      pricing: true,
      settings: false,
    },
    reviews: [],
    goals: ['Understand JavaScript concepts', 'Build interactive websites'],
    requirements: ['Basic HTML knowledge', 'A computer'],
    curriculum: [
      {
        id: 'section-1',
        title: 'Introduction to JavaScript',
        lessons: [
          {
            id: 'lesson-1',
            title: 'What is JavaScript?',
            type: 'video',
            duration: '10m',
            isPublished: true,
          },
          {
            id: 'lesson-2',
            title: 'Setting up your environment',
            type: 'video',
            duration: '15m',
            isPublished: true,
          },
        ],
      },
    ],
    recentStudents: [
      {
        id: 'student-1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        image: '/alice.jpg',
        enrollmentDate: '2023-09-01',
        progress: 25,
      },
    ],
    announcements: [
      {
        id: 'announcement-1',
        title: 'Welcome to the course!',
        content: "We're excited to have you on board.",
        date: '2023-08-21',
      },
    ],
    rejectionReason: 'The course content is not comprehensive enough.',
  },
];

export default function CourseDetailPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams<{ id: string }>();
  // Find course by ID
  const course = coursesData.find((c) => c.id === params.id);

  if (!course) {
    return (
      <div className="flex-1 p-6 md:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/instructor/courses">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Courses
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="mb-2 text-xl font-semibold">Course Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The requested course could not be found.
            </p>
            <Button asChild>
              <Link to="/dashboard/instructor/courses">Return to Courses</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate completion percentage
  const completionItems = Object.values(course.completionChecklist);
  const completedItems = completionItems.filter(Boolean).length;
  const completionPercentage = Math.round(
    (completedItems / completionItems.length) * 100,
  );

  // Handle course deletion
  const handleDeleteCourse = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    toast.success(`Course "${course.title}" has been deleted`);
    setIsDeleteDialogOpen(false);
    navigate('/dashboard/instructor/courses');
  };

  // Handle course submission
  const handleSubmitCourse = () => {
    if (completionPercentage < 100) {
      toast.error('Please complete all sections before submitting for review');
      return;
    }
    setIsSubmitDialogOpen(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(`Course "${course.title}" has been submitted for review`);
      // In a real app, you would update the course status here
      setIsSubmitDialogOpen(false);
      window.location.reload(); // Refresh to show updated status
    } catch (error) {
      toast.error('Failed to submit course for review');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get status badge color
  const getStatusBadgeClass = (status: CourseStatus) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'in-review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'published':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half-star"
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />,
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-star-${i}`}
          className="text-muted-foreground h-4 w-4"
        />,
      );
    }

    return stars;
  };

  // Use totalLessons from the course data instead of calculating from curriculum
  const totalLessons = course.totalLessons || 0;
  // Assume some lessons are published based on completion rate if available
  const publishedLessons = Math.floor(
    (totalLessons * (course.completionRate || 0)) / 100,
  );
  const publishedPercentage = course.completionRate || 0;

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/instructor/courses">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Courses
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {course.title}
            </h1>
            <Badge className={getStatusBadgeClass(course.status)}>
              {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {course.category} • {course.level} • Last updated:{' '}
            {course.lastUpdated}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to={`/dashboard/instructor/courses/${course.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" /> Edit Course
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/courses/${course.id}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" /> Preview
            </Link>
          </Button>
          {course.status === 'draft' && (
            <Button onClick={handleSubmitCourse}>
              <Send className="mr-2 h-4 w-4" /> Submit for Review
            </Button>
          )}
          {course.status === 'rejected' && (
            <Button onClick={handleSubmitCourse}>
              <Send className="mr-2 h-4 w-4" /> Resubmit
            </Button>
          )}
        </div>
      </div>

      {/* Course completion status */}
      {course.status === 'draft' && (
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Course Completion</CardTitle>
            <CardDescription>
              Complete all sections before submitting for review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Overall Completion
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {completedItems}/{completionItems.length} sections
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className={`h-5 w-5 ${
                      course.completionChecklist.basicInfo
                        ? 'text-green-500'
                        : 'text-muted-foreground'
                    }`}
                  />
                  <span className="text-sm">Basic Info</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className={`h-5 w-5 ${
                      course.completionChecklist.curriculum
                        ? 'text-green-500'
                        : 'text-muted-foreground'
                    }`}
                  />
                  <span className="text-sm">Curriculum</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className={`h-5 w-5 ${
                      course.completionChecklist.media
                        ? 'text-green-500'
                        : 'text-muted-foreground'
                    }`}
                  />
                  <span className="text-sm">Media</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className={`h-5 w-5 ${
                      course.completionChecklist.pricing
                        ? 'text-green-500'
                        : 'text-muted-foreground'
                    }`}
                  />
                  <span className="text-sm">Pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className={`h-5 w-5 ${
                      course.completionChecklist.settings
                        ? 'text-green-500'
                        : 'text-muted-foreground'
                    }`}
                  />
                  <span className="text-sm">Settings</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review feedback (if rejected) */}
      {course.status === 'rejected' && course.rejectionReason && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <XCircle className="h-5 w-5 text-red-500" />
              Review Feedback
            </CardTitle>
            <CardDescription>
              Your course was not approved. Please address the following issues:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-800">{course.rejectionReason}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link to={`/dashboard/instructor/courses/${course.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit Course
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-0">
              <Tabs
                defaultValue="overview"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="students">Students</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="announcements">Announcements</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h3 className="mb-2 text-lg font-medium">
                      Course Description
                    </h3>
                    <p className="text-muted-foreground">
                      {course.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-medium">
                      What Students Will Learn
                    </h3>
                    <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {course.goals.map((goal, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-medium">Requirements</h3>
                    <ul className="space-y-2">
                      {course.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="bg-foreground mt-2 h-1.5 w-1.5 rounded-full" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-4 text-lg font-medium">
                      Course Statistics
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-muted-foreground text-sm font-medium">
                              Students
                            </p>
                            <Users className="text-muted-foreground h-4 w-4" />
                          </div>
                          <p className="mt-2 text-2xl font-bold">
                            {course.students}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-muted-foreground text-sm font-medium">
                              Rating
                            </p>
                            <Star className="text-muted-foreground h-4 w-4" />
                          </div>
                          <p className="mt-2 text-2xl font-bold">
                            {course.rating}{' '}
                            <span className="text-muted-foreground text-sm">
                              ({course.totalRatings})
                            </span>
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-muted-foreground text-sm font-medium">
                              Revenue
                            </p>
                            <DollarSign className="text-muted-foreground h-4 w-4" />
                          </div>
                          <p className="mt-2 text-2xl font-bold">
                            {course.revenue}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-muted-foreground text-sm font-medium">
                              Completion
                            </p>
                            <BarChart2 className="text-muted-foreground h-4 w-4" />
                          </div>
                          <p className="mt-2 text-2xl font-bold">
                            {course.completionRate}%
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="curriculum" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Course Content</h3>
                      <p className="text-muted-foreground text-sm">
                        {course.totalSections} sections • {course.totalLessons}{' '}
                        lessons • {course.duration} total length
                      </p>
                    </div>
                    <Button asChild>
                      <Link
                        to={`/dashboard/instructor/courses/${course.id}/curriculum`}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit Curriculum
                      </Link>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {course.curriculum.map((section, sectionIndex) => (
                      <div
                        key={section.id}
                        className="overflow-hidden rounded-md border"
                      >
                        <div className="bg-muted p-4">
                          <h4 className="font-medium">
                            Section {sectionIndex + 1}: {section.title}
                          </h4>
                        </div>
                        <div className="divide-y">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-4"
                            >
                              <div className="flex items-center gap-2">
                                {lesson.type === 'video' ? (
                                  <Play className="text-muted-foreground h-4 w-4" />
                                ) : lesson.type === 'quiz' ? (
                                  <FileText className="text-muted-foreground h-4 w-4" />
                                ) : (
                                  <Upload className="text-muted-foreground h-4 w-4" />
                                )}
                                <span>
                                  {sectionIndex + 1}.{lessonIndex + 1}{' '}
                                  {lesson.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-muted-foreground text-sm">
                                  {lesson.duration}
                                </span>
                                {!lesson.isPublished && (
                                  <Badge
                                    variant="outline"
                                    className="border-yellow-300 bg-yellow-50 text-yellow-600"
                                  >
                                    Draft
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="students" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Enrolled Students</h3>
                      <p className="text-muted-foreground text-sm">
                        {course.students} students enrolled in this course
                      </p>
                    </div>
                    <Button asChild>
                      <Link
                        to={`/dashboard/instructor/courses/${course.id}/students`}
                      >
                        <Users className="mr-2 h-4 w-4" /> View All Students
                      </Link>
                    </Button>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Enrollment Date</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {course.recentStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage
                                    src={student.image || '/placeholder.svg'}
                                    alt={student.name}
                                  />
                                  <AvatarFallback>
                                    {student.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {student.name}
                                  </div>
                                  <div className="text-muted-foreground text-sm">
                                    {student.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{student.enrollmentDate}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={student.progress}
                                  className="h-2 w-[100px]"
                                />
                                <span className="text-sm">
                                  {student.progress}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" asChild>
                                <Link
                                  to={`/dashboard/instructor/students/${student.id}`}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View Student</span>
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Student Reviews</h3>
                      <p className="text-muted-foreground text-sm">
                        {course.totalRatings} reviews • {course.rating} average
                        rating
                      </p>
                    </div>
                    <Button variant="outline" asChild>
                      <Link
                        to={`/dashboard/instructor/courses/${course.id}/reviews`}
                      >
                        <Star className="mr-2 h-4 w-4" /> View All Reviews
                      </Link>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {(course.reviews || []).map((review: any) => (
                      <div
                        key={review.id || Math.random().toString()}
                        className="rounded-lg border p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage
                                src={review.studentImage || '/placeholder.svg'}
                                alt={review.student || 'Unknown student'}
                              />
                              <AvatarFallback>
                                {(review.student || 'U').charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {review.student || 'Anonymous'}
                              </div>
                              <div className="mt-1 flex items-center gap-1">
                                {renderStars(review.rating || 0)}
                              </div>
                              <p className="mt-2">
                                {review.content || 'No content'}
                              </p>
                            </div>
                          </div>
                          <span className="text-muted-foreground text-sm">
                            {review.date || 'Unknown date'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="announcements" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">
                        Course Announcements
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {course.announcements.length} announcements to students
                      </p>
                    </div>
                    <Button asChild>
                      <Link
                        to={`/dashboard/instructor/courses/${course.id}/announcements/new`}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" /> New
                        Announcement
                      </Link>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {course.announcements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className="rounded-lg border p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">
                              {announcement.title}
                            </h4>
                            <p className="text-muted-foreground mt-1 text-sm">
                              {announcement.date}
                            </p>
                            <p className="mt-2">{announcement.content}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={course.image || '/placeholder.svg'}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Price</span>
                  <span className="text-xl font-bold">
                    ${course.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Students</span>
                  <span>{course.students}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Created</span>
                  <span>{course.createdAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Last Updated</span>
                  <span>{course.lastUpdated}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status</span>
                  <Badge
                    className={
                      course.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {course.status.charAt(0).toUpperCase() +
                      course.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-0">
              <Button variant="outline" className="w-full" asChild>
                <Link
                  to={`/dashboard/instructor/courses/${course.id}/analytics`}
                >
                  <BarChart2 className="mr-2 h-4 w-4" /> View Analytics
                </Link>
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDeleteCourse}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Course
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publishing Status</CardTitle>
              <CardDescription>
                Course content publishing progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Published Lessons
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {publishedLessons}/{totalLessons}
                    </span>
                  </div>
                  <Progress value={publishedPercentage} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">
                      {course.totalSections} sections • {course.totalLessons}{' '}
                      lessons
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">
                      {course.duration} total length
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">
                      Last updated on {course.lastUpdated}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link
                  to={`/dashboard/instructor/courses/${course.id}/curriculum`}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit Curriculum
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Resources</CardTitle>
              <CardDescription>
                Downloadable materials for this course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    <FileText className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">course-materials.zip</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    <FileText className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">lecture-slides.pdf</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    <FileText className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">code-examples.zip</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link
                  to={`/dashboard/instructor/courses/${course.id}/resources`}
                >
                  <Settings className="mr-2 h-4 w-4" /> Manage Resources
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this course?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              course and remove all associated data. Students who have enrolled
              in this course will no longer have access to it.
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

      {/* Submit for Review Dialog */}
      <AlertDialog
        open={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Course for Review</AlertDialogTitle>
            <AlertDialogDescription>
              Your course will be reviewed by our team. This process typically
              takes 2-3 business days. Once approved, you can publish your
              course to make it available to students.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit for Review'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
