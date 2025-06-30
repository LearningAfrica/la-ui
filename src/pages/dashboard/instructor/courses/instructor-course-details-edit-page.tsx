import { useState, useEffect } from 'react';

import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { type Course, courseSchema } from '@/lib/types/curriculum';
import { CourseBasicInfoForm } from '../_components/basic-info-form';
import { CourseCurriculumForm } from '../_components/curriculum-form';
import { CourseMediaForm } from '../_components/media-form';
import { CoursePricingForm } from '../_components/pricing-form';
import { CourseSettingsForm } from '../_components/settings-form';
import { Link, useParams } from 'react-router-dom';
// import { useNavigate } from "react-router-dom"

// Mock course data
const mockCourseData: Course = {
  id: '1',
  title: 'Introduction to JavaScript',
  subtitle: 'Learn the fundamentals of JavaScript programming',
  description:
    'This course covers the basics of JavaScript programming language, including variables, data types, functions, and more.',
  category: 'programming',
  subcategory: 'Web Development',
  level: 'beginner',
  language: 'english',
  thumbnail: '/javascript-code-abstract.png',
  sections: [
    {
      id: 'section-1',
      title: 'Getting Started with JavaScript',
      lessons: [
        {
          id: 'lesson-1-1',
          title: 'Introduction to JavaScript',
          type: 'video',
          duration: 10,
          videoUrl: 'https://example.com/videos/intro-js.mp4',
        },
        {
          id: 'lesson-1-2',
          title: 'Setting Up Your Development Environment',
          type: 'text',
          duration: 5,
          content:
            '<p>Follow these steps to set up your JavaScript development environment:</p><ul><li>Install Node.js</li><li>Set up a code editor like VS Code</li><li>Create your first project folder</li></ul>',
        },
        {
          id: 'lesson-1-3',
          title: 'Your First JavaScript Program',
          type: 'video',
          duration: 15,
          videoUrl: 'https://example.com/videos/first-js-program.mp4',
        },
      ],
    },
    {
      id: 'section-2',
      title: 'JavaScript Fundamentals',
      lessons: [
        {
          id: 'lesson-2-1',
          title: 'Variables and Data Types',
          type: 'video',
          duration: 20,
          videoUrl: 'https://example.com/videos/js-variables.mp4',
        },
        {
          id: 'lesson-2-2',
          title: 'Operators',
          type: 'video',
          duration: 15,
          videoUrl: 'https://example.com/videos/js-operators.mp4',
        },
        {
          id: 'lesson-2-3',
          title: 'Control Flow',
          type: 'quiz',
          duration: 10,
          content: 'Quiz on JavaScript control flow structures',
        },
      ],
    },
  ],
  price: '49.99',
  pricingModel: 'one-time',
  isPublic: true,
  allowComments: true,
  allowRatings: true,
  certificateEnabled: true,
  status: 'draft',
};

// Import form components

export default function CourseEditPage() {
  //   const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('basic-info');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [courseData, setCourseData] = useState<Course | null>(null);
  const params = useParams<{ id: string }>();
  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Check if this is a new course (ID starts with "new-")
        if (params.id!.startsWith('new-')) {
          setCourseData({
            id: params.id!,
            title: '',
            subtitle: '',
            description: '',
            category: '',
            subcategory: '',
            level: 'beginner',
            language: 'english',
            thumbnail: '',
            sections: [],
            price: '0',
            pricingModel: 'one-time',
            isPublic: false,
            allowComments: true,
            allowRatings: true,
            certificateEnabled: false,
            status: 'draft',
          });
        } else {
          setCourseData(mockCourseData);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Failed to load course data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [params.id]);

  const handleSave = async () => {
    if (!courseData) return;

    try {
      // Validate the course data using imported schema
      const validationResult = courseSchema.safeParse(courseData);
      if (!validationResult.success) {
        validationResult.error.errors.forEach((err) => {
          toast.error(`${err.path.join('.')}: ${err.message}`);
        });
        return;
      }

      setIsSaving(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Course saved successfully');
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error('Failed to save course');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !courseData) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 md:p-8">
        <div className="text-center">
          <Loader2 className="text-primary mx-auto mb-4 h-8 w-8 animate-spin" />
          <p className="text-lg font-medium">Loading course data...</p>
        </div>
      </div>
    );
  }

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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {courseData.title
              ? `Edit: ${courseData.title}`
              : 'Create New Course'}
          </h1>
          <p className="text-muted-foreground">
            {courseData.status === 'draft'
              ? 'Draft - Not yet published'
              : `Status: ${courseData.status}`}
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{courseData.title || 'New Course'}</CardTitle>
        </CardHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <CardContent className="pt-6">
            <TabsContent value="basic-info">
              <CourseBasicInfoForm
                courseData={courseData}
                setCourseData={setCourseData}
              />
            </TabsContent>
            <TabsContent value="curriculum">
              <CourseCurriculumForm
                courseData={courseData}
                setCourseData={setCourseData}
              />
            </TabsContent>
            <TabsContent value="media">
              <CourseMediaForm
                courseData={courseData}
                setCourseData={setCourseData}
              />
            </TabsContent>
            <TabsContent value="pricing">
              <CoursePricingForm
                courseData={courseData}
                setCourseData={setCourseData}
              />
            </TabsContent>
            <TabsContent value="settings">
              <CourseSettingsForm
                courseData={courseData}
                setCourseData={setCourseData}
              />
            </TabsContent>
          </CardContent>
        </Tabs>
        <CardFooter className="flex justify-between border-t p-6">
          <Button variant="outline" asChild>
            <Link to="/dashboard/instructor/courses">Cancel</Link>
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
