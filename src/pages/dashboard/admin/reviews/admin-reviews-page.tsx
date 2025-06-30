import { ArrowRight, Clock, CheckCircle } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CourseStatusBadge } from '@/components/courses/course-status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

// Mock data for courses pending review
const pendingReviews = [
  {
    id: '1',
    title: 'Advanced JavaScript Concepts',
    instructor: {
      id: 'i1',
      name: 'Jane Doe',
      image: '/instructor-1.jpg',
    },
    submittedAt: '2023-09-15',
    status: 'submitted',
  },
  {
    id: '2',
    title: 'React Hooks Masterclass',
    instructor: {
      id: 'i2',
      name: 'John Smith',
      image: '/instructor-2.jpg',
    },
    submittedAt: '2023-09-14',
    status: 'in-review',
  },
  {
    id: '3',
    title: 'Node.js API Development',
    instructor: {
      id: 'i3',
      name: 'Alex Johnson',
      image: '/instructor-3.jpg',
    },
    submittedAt: '2023-09-12',
    status: 'submitted',
  },
];

// Mock data for recently reviewed courses
const recentlyReviewed = [
  {
    id: '4',
    title: 'Python for Data Science',
    instructor: {
      id: 'i4',
      name: 'Sarah Williams',
      image: '/instructor-4.jpg',
    },
    reviewedAt: '2023-09-10',
    status: 'approved',
  },
  {
    id: '5',
    title: 'UI/UX Design Principles',
    instructor: {
      id: 'i5',
      name: 'Michael Brown',
      image: '/instructor-5.jpg',
    },
    reviewedAt: '2023-09-09',
    status: 'rejected',
  },
  {
    id: '6',
    title: 'Machine Learning Fundamentals',
    instructor: {
      id: 'i6',
      name: 'Emily Davis',
      image: '/instructor-6.jpg',
    },
    reviewedAt: '2023-09-08',
    status: 'approved',
  },
];

export default function ReviewsPage() {
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Course Reviews</h1>
          <p className="text-muted-foreground">
            Review and approve course submissions from instructors
          </p>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="relative">
            Pending Review
            <span className="bg-primary text-primary-foreground ml-2 rounded-full px-2 py-0.5 text-xs">
              {pendingReviews.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="reviewed">Recently Reviewed</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingReviews.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="text-muted-foreground/50 mb-4 h-12 w-12" />
                <h3 className="mb-2 text-xl font-semibold">All caught up!</h3>
                <p className="text-muted-foreground max-w-md text-center">
                  There are no courses waiting for review at the moment. Check
                  back later for new submissions.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingReviews.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage
                            src={course.instructor.image || '/placeholder.svg'}
                            alt={course.instructor.name}
                          />
                          <AvatarFallback>
                            {course.instructor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-muted-foreground text-sm">
                            By {course.instructor.name} • Submitted on{' '}
                            {course.submittedAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <CourseStatusBadge status={course.status as any} />
                        <Button asChild>
                          <Link to={`/dashboard/admin/reviews/${course.id}`}>
                            Review <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-4">
          {recentlyReviewed.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="text-muted-foreground/50 mb-4 h-12 w-12" />
                <h3 className="mb-2 text-xl font-semibold">
                  No recent reviews
                </h3>
                <p className="text-muted-foreground max-w-md text-center">
                  You haven't reviewed any courses recently. Start reviewing
                  pending submissions.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {recentlyReviewed.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage
                            src={course.instructor.image || '/placeholder.svg'}
                            alt={course.instructor.name}
                          />
                          <AvatarFallback>
                            {course.instructor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-muted-foreground text-sm">
                            By {course.instructor.name} • Reviewed on{' '}
                            {course.reviewedAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <CourseStatusBadge status={course.status as any} />
                        <Button variant="outline" asChild>
                          <Link to={`/dashboard/admin/reviews/${course.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
