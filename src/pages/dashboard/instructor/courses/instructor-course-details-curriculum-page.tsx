import { useState } from 'react';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { ArrowLeft, Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SectionList } from '../_components/section-list';
import { Link, useParams } from 'react-router-dom';
import { AddSectionDialog } from '../_components/add-section-dialog';
import { AddLessonDialog } from '../_components/add-lesson-dialog';
import { PreviewCurriculumDialog } from '../_components/preview-curriculum-dialog';

// Mock course data
const coursesData = [
  {
    id: '1',
    title: 'Complete JavaScript Course',
    description:
      'Master JavaScript with the most comprehensive course available.',
    curriculum: [
      {
        id: 's1',
        title: 'Getting Started',
        lessons: [
          {
            id: 'l1',
            title: 'Course Introduction',
            duration: '10:25',
            type: 'video',
            isPublished: true,
          },
          {
            id: 'l2',
            title: 'Setting Up Your Environment',
            duration: '15:40',
            type: 'video',
            isPublished: true,
          },
          {
            id: 'l3',
            title: 'JavaScript Basics Quiz',
            duration: '15:00',
            type: 'quiz',
            isPublished: true,
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
            isPublished: true,
          },
          {
            id: 'l5',
            title: 'Operators and Expressions',
            duration: '22:15',
            type: 'video',
            isPublished: true,
          },
          {
            id: 'l6',
            title: 'Control Flow',
            duration: '25:45',
            type: 'video',
            isPublished: true,
          },
          {
            id: 'l7',
            title: 'Functions',
            duration: '30:20',
            type: 'video',
            isPublished: true,
          },
          {
            id: 'l8',
            title: 'Fundamentals Practice Assignment',
            duration: '45:00',
            type: 'assignment',
            isPublished: true,
          },
        ],
      },
      {
        id: 's3',
        title: 'Advanced JavaScript Concepts',
        lessons: [
          {
            id: 'l9',
            title: 'Objects and Prototypes',
            duration: '28:15',
            type: 'video',
            isPublished: true,
          },
          {
            id: 'l10',
            title: 'Classes and OOP',
            duration: '32:40',
            type: 'video',
            isPublished: true,
          },
          {
            id: 'l11',
            title: 'Asynchronous JavaScript',
            duration: '35:10',
            type: 'video',
            isPublished: true,
          },
          {
            id: 'l12',
            title: 'Advanced Concepts Quiz',
            duration: '20:00',
            type: 'quiz',
            isPublished: false,
          },
        ],
      },
    ],
  },
];

// Form schema for course details
const courseFormSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

export default function CurriculumEditorPage() {
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );
  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const params = useParams<{ id: string }>();
  // Find course by ID
  const course = coursesData.find((c) => c.id === params.id);

  // Initialize form with course data
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: course?.title || '',
      description: course?.description || '',
    },
  });

  // Initialize curriculum state from course data
  useState(() => {
    if (course) {
      setCurriculum(course.curriculum);
    }
  });

  // Handle form submission
  function onSubmit(data: CourseFormValues) {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Curriculum saved successfully');
      setIsSaving(false);
    }, 1000);
  }

  // Handle adding a new section
  const handleAddSection = (sectionData: { title: string }) => {
    const newSection = {
      id: `s${Date.now()}`,
      title: sectionData.title,
      lessons: [],
    };

    setCurriculum([...curriculum, newSection]);
    setIsAddSectionOpen(false);
    toast.success('Section added successfully');
  };

  // Handle adding a new lesson
  const handleAddLesson = (lessonData: {
    title: string;
    type: string;
    duration: string;
  }) => {
    if (!selectedSectionId) return;

    const newLesson = {
      id: `l${Date.now()}`,
      title: lessonData.title,
      type: lessonData.type,
      duration: lessonData.duration,
      isPublished: false,
    };

    const updatedCurriculum = curriculum.map((section) => {
      if (section.id === selectedSectionId) {
        return {
          ...section,
          lessons: [...section.lessons, newLesson],
        };
      }
      return section;
    });

    setCurriculum(updatedCurriculum);
    setIsAddLessonOpen(false);
    toast.success('Lesson added successfully');
  };

  // Handle moving a section
  const handleMoveSection = (dragIndex: number, hoverIndex: number) => {
    const updatedCurriculum = [...curriculum];
    const draggedSection = updatedCurriculum[dragIndex];

    updatedCurriculum.splice(dragIndex, 1);
    updatedCurriculum.splice(hoverIndex, 0, draggedSection);

    setCurriculum(updatedCurriculum);
  };

  // Handle moving a lesson
  const handleMoveLesson = (
    sectionId: string,
    dragIndex: number,
    hoverIndex: number,
    targetSectionId?: string,
  ) => {
    const updatedCurriculum = [...curriculum];
    const sourceSection = updatedCurriculum.find(
      (section) => section.id === sectionId,
    );

    if (!sourceSection) return;

    const draggedLesson = sourceSection.lessons[dragIndex];

    // If moving within the same section
    if (!targetSectionId || targetSectionId === sectionId) {
      sourceSection.lessons.splice(dragIndex, 1);
      sourceSection.lessons.splice(hoverIndex, 0, draggedLesson);
    }
    // If moving to a different section
    else {
      const targetSection = updatedCurriculum.find(
        (section) => section.id === targetSectionId,
      );
      if (!targetSection) return;

      sourceSection.lessons.splice(dragIndex, 1);
      targetSection.lessons.splice(hoverIndex, 0, draggedLesson);
    }

    setCurriculum(updatedCurriculum);
  };

  // Handle deleting a section
  const handleDeleteSection = (sectionId: string) => {
    const updatedCurriculum = curriculum.filter(
      (section) => section.id !== sectionId,
    );
    setCurriculum(updatedCurriculum);
    toast.success('Section deleted successfully');
  };

  // Handle deleting a lesson
  const handleDeleteLesson = (sectionId: string, lessonId: string) => {
    const updatedCurriculum = curriculum.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: section.lessons.filter((lesson) => lesson.id !== lessonId),
        };
      }
      return section;
    });

    setCurriculum(updatedCurriculum);
    toast.success('Lesson deleted successfully');
  };

  // Handle updating a section
  const handleUpdateSection = (sectionId: string, data: { title: string }) => {
    const updatedCurriculum = curriculum.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          title: data.title,
        };
      }
      return section;
    });

    setCurriculum(updatedCurriculum);
    toast.success('Section updated successfully');
  };

  // Handle updating a lesson
  const handleUpdateLesson = (
    sectionId: string,
    lessonId: string,
    data: {
      title: string;
      type: string;
      duration: string;
      isPublished: boolean;
    },
  ) => {
    const updatedCurriculum = curriculum.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: section.lessons.map((lesson) => {
            if (lesson.id === lessonId) {
              return {
                ...lesson,
                ...data,
              };
            }
            return lesson;
          }),
        };
      }
      return section;
    });

    setCurriculum(updatedCurriculum);
    toast.success('Lesson updated successfully');
  };

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

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/dashboard/instructor/courses/${params.id}`}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Course
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsPreviewOpen(true)}>
            Preview
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Curriculum
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>
              Basic information about your course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter course title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter course description"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Briefly describe what students will learn in this
                        course.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Curriculum</CardTitle>
              <CardDescription>Organize your course content</CardDescription>
            </div>
            <Button onClick={() => setIsAddSectionOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Section
            </Button>
          </CardHeader>
          <CardContent>
            <DndProvider backend={HTML5Backend}>
              <SectionList
                sections={curriculum}
                onMoveSection={handleMoveSection}
                onMoveLesson={handleMoveLesson}
                onDeleteSection={handleDeleteSection}
                onDeleteLesson={handleDeleteLesson}
                onUpdateSection={handleUpdateSection}
                onUpdateLesson={handleUpdateLesson}
                onAddLesson={(sectionId) => {
                  setSelectedSectionId(sectionId);
                  setIsAddLessonOpen(true);
                }}
              />
            </DndProvider>

            {curriculum.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="mb-2 text-lg font-medium">No Sections Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start building your course by adding sections and lessons.
                </p>
                <Button onClick={() => setIsAddSectionOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Section
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Section Dialog */}
      <AddSectionDialog
        open={isAddSectionOpen}
        onOpenChange={setIsAddSectionOpen}
        onAdd={handleAddSection}
      />

      {/* Add Lesson Dialog */}
      <AddLessonDialog
        open={isAddLessonOpen}
        onOpenChange={setIsAddLessonOpen}
        onAdd={handleAddLesson}
      />

      {/* Preview Curriculum Dialog */}
      <PreviewCurriculumDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        curriculum={curriculum}
      />
    </div>
  );
}
