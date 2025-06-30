import { useState } from 'react';
import { ArrowLeft, Loader2, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { type Course, createEmptyCourse } from '@/lib/types/curriculum';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseCurriculumForm } from '../_components/curriculum-form';
import { CourseMediaForm } from '../_components/media-form';
import { CoursePricingForm } from '../_components/pricing-form';
import { CourseSettingsForm } from '../_components/settings-form';
import { CourseBasicInfoForm } from '../_components/basic-info-form';
import { Link, useNavigate } from 'react-router-dom';

export default function CourseCreatePage() {
  const router = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic-info');
  const [courseData, setCourseData] = useState<Course | null>(
    createEmptyCourse(`new-${Date.now()}`),
  );

  const handleSave = async () => {
    if (!courseData) return;

    try {
      setIsLoading(true);
      // Simulate API call to create a new course
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you would send the data to your API
      console.log('Course data:', courseData);

      toast.success('Course created successfully!');

      // Redirect to the edit page with the new course ID
      router(`/dashboard/instructor/courses/${courseData.id}/edit`);
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!courseData) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 md:p-8">
        <div className="text-center">
          <Loader2 className="text-primary mx-auto mb-4 h-8 w-8 animate-spin" />
          <p className="text-lg font-medium">Loading...</p>
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
            Create New Course
          </h1>
          <p className="text-muted-foreground">
            Follow the steps to create and publish your course
          </p>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <div className="p-6">
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
          </div>
          <div className="flex justify-between border-t p-6">
            <Button variant="outline" asChild>
              <Link to="/dashboard/instructor/courses">Cancel</Link>
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Course...
                </>
              ) : (
                <>
                  Create Course
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
