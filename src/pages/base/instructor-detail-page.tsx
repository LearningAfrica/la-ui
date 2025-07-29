import { useState } from 'react';
import { Header } from '@/components/header';
import { CourseCard } from '@/components/course-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Star,
  Users,
  BookOpen,
  Award,
  MapPin,
  Globe,
  Mail,
  Calendar,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

// Mock data for instructors
const instructorsData = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    image: '/instructor-1.jpg',
    title: 'Professor of Computer Science',
    bio: 'Dr. Sarah Johnson is a renowned computer science professor with over 15 years of experience in teaching and research. She specializes in artificial intelligence, machine learning, and data science. She has published over 50 research papers and has worked with leading tech companies including Google, Microsoft, and IBM. Her passion for education has helped thousands of students launch successful careers in technology.',
    location: 'San Francisco, CA',
    website: 'https://sarahjohnson.edu',
    email: 'sarah.johnson@university.edu',
    joinDate: '2018-03-15',
    specializations: [
      'Artificial Intelligence',
      'Machine Learning',
      'Data Science',
      'Python Programming',
    ],
    courses: 12,
    students: 15432,
    rating: 4.9,
    totalReviews: 2847,
    achievements: [
      'PhD in Computer Science from Stanford University',
      'Published 50+ research papers in AI and ML',
      'Former Senior Data Scientist at Google',
      'Winner of Excellence in Teaching Award 2022',
      'Speaker at 20+ international conferences',
    ],
    socialProof: {
      linkedIn: 'https://linkedin.com/in/sarahjohnson',
      twitter: 'https://twitter.com/sarahjohnson',
      github: 'https://github.com/sarahjohnson',
    },
  },
  {
    id: '2',
    name: 'Michael Chen',
    image: '/instructor-2.jpg',
    title: 'Senior Software Engineer',
    bio: 'Michael Chen is a senior software engineer with 12 years of experience in full-stack web development. He has worked at several Fortune 500 companies and startups, building scalable web applications used by millions of users. Michael is passionate about teaching modern web development technologies and has helped over 10,000 students transition into tech careers.',
    location: 'New York, NY',
    website: 'https://michaelchen.dev',
    email: 'michael@michaelchen.dev',
    joinDate: '2019-07-22',
    specializations: [
      'React',
      'Node.js',
      'JavaScript',
      'Full Stack Development',
    ],
    courses: 8,
    students: 12345,
    rating: 4.8,
    totalReviews: 1923,
    achievements: [
      'Senior Software Engineer at Meta',
      'Built applications used by 10M+ users',
      'Open source contributor with 500+ GitHub stars',
      'Mentor to 100+ junior developers',
      'Featured speaker at React conferences',
    ],
    socialProof: {
      linkedIn: 'https://linkedin.com/in/michaelchen',
      twitter: 'https://twitter.com/michaelchen',
      github: 'https://github.com/michaelchen',
    },
  },
];

// Mock courses data for each instructor
const instructorCoursesData = {
  '1': [
    {
      id: '1',
      title: 'Machine Learning Fundamentals',
      description:
        'Learn the basics of machine learning with Python and scikit-learn.',
      image: 'https://cdni.iconscout.com/illustration/premium/thumb/girls-are-doing-web-development-and-coding-12260429-10390995.png?f=webp',
      instructor: 'Dr. Sarah Johnson',
      rating: 4.9,
      students: 5432,
      price: 79.99,
      category: 'Data Science',
    },
    {
      id: '2',
      title: 'Deep Learning with TensorFlow',
      description:
        'Master deep learning concepts and build neural networks with TensorFlow.',
      image: 'https://cdni.iconscout.com/illustration/premium/thumb/woman-working-on-deep-learning-14126133-11362695.png?f=webp',
      instructor: 'Dr. Sarah Johnson',
      rating: 4.8,
      students: 3876,
      price: 99.99,
      category: 'Data Science',
    },
    {
      id: '3',
      title: 'Data Science with Python',
      description:
        'Complete data science course covering pandas, numpy, and matplotlib.',
      image: 'https://cdni.iconscout.com/illustration/premium/thumb/online-computer-science-course-5526297-4615191.png?f=webp',
      instructor: 'Dr. Sarah Johnson',
      rating: 4.9,
      students: 6124,
      price: 69.99,
      category: 'Data Science',
    },
  ],
  '2': [
    {
      id: '4',
      title: 'React Development Masterclass',
      description: 'Build modern web applications with React and Redux.',
      image: 'https://cdni.iconscout.com/illustration/premium/thumb/coder-doing-web-coding-12644220-10289950.png?f=webp',
      instructor: 'Michael Chen',
      rating: 4.8,
      students: 4567,
      price: 59.99,
      category: 'Programming',
    },
    {
      id: '5',
      title: 'Full Stack JavaScript',
      description:
        'Complete full stack development with Node.js, Express, and MongoDB.',
      image: 'https://cdni.iconscout.com/illustration/premium/thumb/man-working-on-javascript-development-6081845-5054690.png?f=webp',
      instructor: 'Michael Chen',
      rating: 4.7,
      students: 3891,
      price: 89.99,
      category: 'Programming',
    },
  ],
};

// Mock reviews data
const reviewsData = {
  '1': [
    {
      id: 'r1',
      student: 'John Smith',
      studentImage: 'https://cdni.iconscout.com/illustration/premium/thumb/business-woman-5373575-4498296.png?f=webp',
      rating: 5,
      date: '2024-01-20',
      course: 'Machine Learning Fundamentals',
      content:
        'Dr. Johnson is an exceptional instructor! Her explanations are clear and the practical examples really helped me understand complex ML concepts. The course structure is perfect for beginners.',
    },
    {
      id: 'r2',
      student: 'Emily Davis',
      studentImage: 'https://cdni.iconscout.com/illustration/premium/thumb/business-woman-5373575-4498296.png?f=webp',
      rating: 5,
      date: '2024-01-15',
      course: 'Deep Learning with TensorFlow',
      content:
        'Amazing course! The depth of knowledge Dr. Johnson brings is incredible. I went from knowing nothing about deep learning to building my own neural networks. Highly recommended!',
    },
    {
      id: 'r3',
      student: 'Alex Rodriguez',
      studentImage: 'https://cdni.iconscout.com/illustration/premium/thumb/business-woman-5373575-4498296.png?f=webp',
      rating: 4,
      date: '2024-01-10',
      course: 'Data Science with Python',
      content:
        "Great course with lots of practical examples. Dr. Johnson's teaching style is engaging and she responds quickly to questions. The projects were challenging but rewarding.",
    },
  ],
  '2': [
    {
      id: 'r4',
      student: 'Lisa Wang',
      studentImage: 'https://cdni.iconscout.com/illustration/premium/thumb/business-woman-5373575-4498296.png?f=webp',
      rating: 5,
      date: '2024-01-18',
      course: 'React Development Masterclass',
      content:
        'Michael is an outstanding instructor! His real-world experience really shows in the course content. I landed a React developer job after completing this course.',
    },
    {
      id: 'r5',
      student: 'David Kim',
      studentImage: 'https://cdni.iconscout.com/illustration/premium/thumb/business-woman-5373575-4498296.png?f=webp',
      rating: 4,
      date: '2024-01-12',
      course: 'Full Stack JavaScript',
      content:
        "Comprehensive course covering everything you need to know about full stack development. Michael's explanations are clear and the projects are very practical.",
    },
  ],
};

export default function InstructorDetailPage() {
  const [activeTab, setActiveTab] = useState('about');
  const params = useParams<{ id: string }>();
  // Find instructor by ID
  const instructor = instructorsData.find((i) => i.id === params.id);
  const courses =
    instructorCoursesData[params.id as keyof typeof instructorCoursesData] ||
    [];
  const reviews = reviewsData[params.id as keyof typeof reviewsData] || [];

  if (!instructor) {
    return (
      <div>
        <Header />
        <div className="container py-8 mx-auto">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h2 className="mb-2 text-xl font-semibold">
                Instructor Not Found
              </h2>
              <p className="text-muted-foreground mb-6">
                The requested instructor could not be found.
              </p>
              <Button asChild>
                <Link to="/instructors">Browse Instructors</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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

  return (
    <div>
      <Header />

      {/* Instructor Hero */}
      <div className="bg-muted py-12">
        <div className="container mx-auto">
          <div className="mb-6 flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/instructors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Instructors
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="flex flex-col gap-6 md:flex-row">
                <Avatar className="h-32 w-32">
                  <AvatarImage
                    src={instructor.image || '/placeholder.svg'}
                    alt={instructor.name}
                  />
                  <AvatarFallback className="text-2xl">
                    {instructor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h1 className="mb-2 text-3xl font-bold">{instructor.name}</h1>
                  <p className="text-muted-foreground mb-4 text-xl">
                    {instructor.title}
                  </p>

                  <div className="mb-4 flex flex-wrap items-center gap-4">
                    <div className="flex items-center">
                      <div className="mr-1 flex">
                        {renderStars(instructor.rating)}
                      </div>
                      <span className="font-medium">{instructor.rating}</span>
                      <span className="text-muted-foreground ml-1">
                        ({instructor.totalReviews.toLocaleString()} reviews)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="text-muted-foreground mr-1 h-4 w-4" />
                      <span>
                        {instructor.students.toLocaleString()} students
                      </span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="text-muted-foreground mr-1 h-4 w-4" />
                      <span>{instructor.courses} courses</span>
                    </div>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {instructor.specializations.map((spec, index) => (
                      <Badge key={index} variant="secondary">
                        {spec}
                      </Badge>
                    ))}
                  </div>

                  <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      <span>{instructor.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>
                        Joined{' '}
                        {new Date(instructor.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                    {instructor.website && (
                      <div className="flex items-center">
                        <Globe className="mr-1 h-4 w-4" />
                        <a
                          href={instructor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Instructor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>

                  <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{instructor.courses}</p>
                      <p className="text-muted-foreground text-xs">Courses</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {instructor.students.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground text-xs">Students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Instructor Content */}
      <div className="container py-8 mx-auto">
        <Tabs
          defaultValue="about"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="courses">
              Courses ({courses.length})
            </TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>About {instructor.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line">{instructor.bio}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Achievements & Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {instructor.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="bg-primary mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            {courses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="text-muted-foreground mb-4 h-12 w-12" />
                  <h3 className="mb-2 text-lg font-semibold">
                    No courses available
                  </h3>
                  <p className="text-muted-foreground">
                    This instructor hasn't published any courses yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Star className="text-muted-foreground mb-4 h-12 w-12" />
                  <h3 className="mb-2 text-lg font-semibold">No reviews yet</h3>
                  <p className="text-muted-foreground">
                    This instructor hasn't received any reviews yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage
                              src={review.studentImage || '/placeholder.svg'}
                              alt={review.student}
                            />
                            <AvatarFallback>
                              {review.student.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{review.student}</div>
                            <div className="mt-1 flex items-center gap-1">
                              {renderStars(review.rating)}
                            </div>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {review.course}
                            </Badge>
                          </div>
                        </div>
                        <span className="text-muted-foreground text-sm">
                          {review.date}
                        </span>
                      </div>
                      <p className="text-sm">{review.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
