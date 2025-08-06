import { useState } from 'react';
import { ArrowLeft, Menu, Home } from 'lucide-react';
import type { TSFixMe } from '@/lib/types/global';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CurriculumSidebar } from '@/components/courses/curriculum-sidebar';
import { LessonCompletionButton } from '@/components/courses/lesson-completion-button';
import { CommentSection } from '@/components/comments/comment-section';
import { CurriculumBackdrop } from '@/components/courses/curriculum-backdrop';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

// Mock data for the lesson
const lessonData = {
  id: 'l1',
  title: 'Introduction to JavaScript',
  content: `
    <div class="prose prose-slate dark:prose-invert max-w-none">
      <h1>Introduction to JavaScript</h1>
      <p>JavaScript is a programming language that enables interactive web pages. It is an essential part of web applications, and nearly all websites use it for client-side page behavior.</p>

      <h2>What is JavaScript?</h2>
      <p>JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification. It has dynamic typing, prototype-based object-orientation, and first-class functions.</p>

      <h3>Key Features:</h3>
      <ul>
        <li>Interpreted language (not compiled)</li>
        <li>Runs on the client-side (browser) and server-side (Node.js)</li>
        <li>Event-driven programming</li>
        <li>Object-oriented capabilities</li>
      </ul>

      <h2>Getting Started</h2>
      <p>Let's start with a simple example:</p>

      <pre><code>// This is a comment
console.log("Hello, World!"); // This prints to the console

// Variables
let name = "JavaScript";
const version = "ES6";
var oldWay = "Not recommended";

// Functions
function greet(person) {
  return "Hello, " + person + "!";
}

console.log(greet(name));</code></pre>

      <p>In the next lesson, we'll dive deeper into variables, data types, and operators.</p>
    </div>
  `,
  type: 'video',
  videoUrl: 'https://example.com/videos/intro-to-js.mp4',
  duration: '10:25',
  isCompleted: false,
  nextLessonId: 'l2',
  prevLessonId: null,
};

// Mock data for the course
const courseData = {
  id: 'c1',
  title: 'Complete JavaScript Course',
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
          isCompleted: false,
        },
        {
          id: 'l2',
          title: 'Setting Up Your Environment',
          duration: '15:40',
          type: 'video',
          isCompleted: false,
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
          isCompleted: false,
        },
        {
          id: 'l5',
          title: 'Operators and Expressions',
          duration: '22:15',
          type: 'video',
          isCompleted: false,
        },
      ],
    },
  ],
};

// Mock comments data
const commentsData = [
  {
    id: 'c1',
    content:
      "Great explanation of JavaScript basics! I was confused about the difference between let and const before, but now it's clear.",
    author: {
      id: 'u1',
      name: 'John Smith',
      image: '/student-1.jpg',
      role: 'student',
    },
    createdAt: '2023-11-15T10:30:00Z',
    likes: 5,
    isLiked: false,
    replies: [
      {
        id: 'c2',
        content:
          'Glad you found it helpful! Remember that const prevents reassignment, but the object properties can still be modified.',
        author: {
          id: 'i1',
          name: 'Jane Doe',
          image: '/instructor-1.jpg',
          role: 'instructor',
        },
        createdAt: '2023-11-15T11:15:00Z',
        likes: 3,
        isLiked: true,
        replies: [],
      },
    ],
  },
  {
    id: 'c3',
    content:
      "I'm having trouble with the console.log example. When I try it in my browser, nothing happens. What am I doing wrong?",
    author: {
      id: 'u2',
      name: 'Sarah Johnson',
      image: '/student-2.jpg',
      role: 'student',
    },
    createdAt: '2023-11-16T09:45:00Z',
    likes: 0,
    isLiked: false,
    replies: [],
  },
];

export default function StudentCourseLessonPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default to open for better UX
  const [activeTab, setActiveTab] = useState('content');
  const [comments, setComments] = useState(commentsData);
  const params = useParams<{
    id: string;
    lessonId: string;
  }>();
  // Current user (mock data)
  const currentUser = {
    id: 'u3',
    name: 'Current User',
    image: '/student-3.jpg',
    role: 'student' as const,
  };

  // Handle lesson completion
  const handleLessonComplete = (lessonId: string) => {
    // In a real app, you would update this in your database
    console.log(`Lesson ${lessonId} marked as completed`);
  };

  // Handle adding a new comment
  const handleAddComment = (
    _contentId: string,
    _contentType: string,
    content: string,
  ) => {
    const newComment = {
      id: `c${Date.now()}`,
      content,
      author: currentUser,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: [],
    };

    setComments([...comments, newComment]);
  };

  // Handle replying to a comment
  const handleReplyComment = (commentId: string, content: string) => {
    const newReply = {
      id: `c${Date.now()}`,
      content,
      author: currentUser,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: [],
    };

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
        };
      }

      // Check nested replies
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: comment.replies.map((reply) => {
            if (reply.id === commentId) {
              return {
                ...reply,
                replies: [...(reply.replies || []), newReply],
              };
            }
            return reply;
          }),
        };
      }

      return comment;
    });

    setComments(updatedComments);
  };

  // Handle editing a comment
  const handleEditComment = (commentId: string, content: string) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          content,
          updatedAt: new Date().toISOString(),
        };
      }

      // Check nested replies
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: comment.replies.map((reply) => {
            if (reply.id === commentId) {
              return {
                ...reply,
                content,
                updatedAt: new Date().toISOString(),
              };
            }
            return reply;
          }),
        };
      }

      return comment;
    });

    setComments(updatedComments);
  };

  // Handle deleting a comment
  const handleDeleteComment = (commentId: string) => {
    // Filter out the deleted comment
    const filteredComments = comments.filter(
      (comment) => comment.id !== commentId,
    );

    // Also filter out the comment from replies
    const updatedComments = filteredComments.map((comment) => {
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: comment.replies.filter((reply) => reply.id !== commentId),
        };
      }
      return comment;
    });

    setComments(updatedComments);
  };

  // Handle liking a comment
  const handleLikeComment = (commentId: string) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked,
        };
      }

      // Check nested replies
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: comment.replies.map((reply) => {
            if (reply.id === commentId) {
              return {
                ...reply,
                likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                isLiked: !reply.isLiked,
              };
            }
            return reply;
          }),
        };
      }

      return comment;
    });

    setComments(updatedComments);
  };

  // Handle reporting a comment
  const handleReportComment = (_commentId: string) => {
    toast.success(
      // 	{
      //   title: "Comment reported",
      //   description: "Thank you for reporting this comment. Our team will review it shortly.",
      // }
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="mb-4 text-center text-2xl font-bold">
          Comment reported
        </h1>
        <p className="text-muted-foreground text-center">
          Thank you for reporting this comment. Our team will review it shortly.
        </p>
      </div>,
    );
  };

  // Navigate to the next or previous lesson
  const navigateToLesson = (lessonId: string | null) => {
    if (lessonId) {
      navigate(`/dashboard/student/courses/${params.id}/lessons/${lessonId}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top navigation bar */}
      <div className="bg-background sticky top-0 z-30 flex h-14 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle curriculum</span>
          </Button>
          <div className="flex-1 truncate text-sm font-medium">
            {lessonData.title}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/dashboard/student/courses/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to course
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/student">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Course curriculum sidebar */}
        <CurriculumSidebar
          courseId={params.id || ''}
          sections={courseData.sections}
          currentLessonId={params.lessonId || ''}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Backdrop for mobile */}
        <CurriculumBackdrop
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="container max-w-6xl py-6">
            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold">{lessonData.title}</h1>
              </div>
              <div className="flex items-center gap-2">
                {lessonData.prevLessonId && (
                  <Button
                    variant="outline"
                    onClick={() => navigateToLesson(lessonData.prevLessonId)}
                  >
                    Previous Lesson
                  </Button>
                )}
                <LessonCompletionButton
                  lessonId={params.lessonId || ''}
                  isCompleted={lessonData.isCompleted}
                  onComplete={handleLessonComplete}
                />
                {lessonData.nextLessonId && (
                  <Button
                    onClick={() => navigateToLesson(lessonData.nextLessonId)}
                  >
                    Next Lesson
                  </Button>
                )}
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList>
                <TabsTrigger value="content">Lesson Content</TabsTrigger>
                <TabsTrigger
                  value="discussion"
                  className="flex items-center gap-1"
                >
                  Discussion
                  <span className="bg-muted ml-1 rounded-full px-2 py-0.5 text-xs">
                    {comments.length}
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                {lessonData.type === 'video' && (
                  <Card>
                    <CardContent className="p-0">
                      <div className="bg-muted aspect-video w-full">
                        {/* In a real app, you would embed a video player here */}
                        <div className="flex h-full items-center justify-center">
                          <p className="text-muted-foreground">
                            Video Player Placeholder
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardContent className="p-6">
                    <div
                      dangerouslySetInnerHTML={{ __html: lessonData.content }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discussion">
                <Card>
                  <CardContent className="p-6">
                    <CommentSection
                      contentId={params.lessonId || ''}
                      contentType="lesson"
                      comments={comments.map(comment => ({
                        ...comment,
                        currentUserId: currentUser.id
                      }))}
                      currentUser={currentUser}
                      onAddComment={handleAddComment}
                      onReplyComment={handleReplyComment}
                      onEditComment={handleEditComment}
                      onDeleteComment={handleDeleteComment}
                      onLikeComment={handleLikeComment}
                      onReportComment={handleReportComment}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
