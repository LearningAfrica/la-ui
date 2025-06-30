import { useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import {
  ArrowLeft,
  Edit,
  FileText,
  Grip,
  ImageIcon,
  Loader2,
  Plus,
  Save,
  Trash2,
  Video,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ContentPreview } from '@/components/content-preview';
import { TiptapEditor } from '@/components/tiptap';
import { Link, useNavigate } from 'react-router-dom';

// Define schemas for form validation
const sectionSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().optional(),
  order: z.number().int().nonnegative().default(0),
});

const contentSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  type: z.enum(['video', 'rich-text', 'image']),
  duration: z
    .string()
    .regex(/^\d+:\d{2}$/, { message: 'Format must be MM:SS' })
    .optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  videoUrl: z.string().url({ message: 'Please enter a valid URL' }).optional(),
  imageUrl: z.string().url({ message: 'Please enter a valid URL' }).optional(),
  imageAlt: z.string().optional(),
  isPreview: z.boolean().default(false),
  order: z.number().int().nonnegative().default(0),
});

type SectionFormValues = z.infer<typeof sectionSchema>;
type ContentFormValues = z.infer<typeof contentSchema>;

// Define types for curriculum structure
interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'rich-text' | 'image';
  duration?: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  isPreview: boolean;
  order: number;
}

interface Section {
  id: string;
  title: string;
  description?: string;
  contents: ContentItem[];
  order: number;
}

// DnD item types
const ItemTypes = {
  SECTION: 'section',
  CONTENT: 'content',
};

// Section component with drag and drop
function DraggableSection({
  section,
  index,
  moveSection,
  handleEditSection,
  handleDeleteSection,
  handleAddContent,
  handleEditContent,
  handleDeleteContent,
  // expandedSections,
  // toggleSectionExpansion,
}: {
  section: Section;
  index: number;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
  handleEditSection: (section: Section) => void;
  handleDeleteSection: (sectionId: string) => void;
  handleAddContent: (sectionId: string) => void;
  handleEditContent: (sectionId: string, content: ContentItem) => void;
  handleDeleteContent: (sectionId: string, contentId: string) => void;
  expandedSections: string[];
  toggleSectionExpansion: (sectionId: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.SECTION,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.SECTION,
    hover(item: { index: number }, _monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      moveSection(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  // Get content type icon
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'rich-text':
        return <FileText className="h-4 w-4" />;
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div
      ref={ref}
      className={`mb-4 rounded-lg border ${isDragging ? 'opacity-50' : ''}`}
    >
      <AccordionItem value={section.id} className="border-none">
        <div className="bg-muted/30 flex items-center border-b p-4">
          <div className="mr-2 cursor-move">
            <Grip className="text-muted-foreground h-5 w-5" />
          </div>
          <AccordionTrigger className="flex-1 hover:no-underline">
            <div className="flex flex-col items-start text-left">
              <div className="font-medium">
                Section {index + 1}: {section.title}
              </div>
              <div className="text-muted-foreground text-sm">
                {section.contents.length} items
              </div>
            </div>
          </AccordionTrigger>
          <div className="ml-4 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleEditSection(section);
              }}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit Section</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete Section</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Section</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this section? This will also
                    delete all content items within this section.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteSection(section.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <AccordionContent className="px-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm">
              {section.description && (
                <p className="text-muted-foreground">{section.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddContent(section.id)}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Content
              </Button>
            </div>
          </div>

          {section.contents.length > 0 ? (
            <ul className="mb-4 space-y-2">
              {section.contents
                .sort((a, b) => a.order - b.order)
                .map((content, contentIndex) => (
                  <li
                    key={content.id}
                    className="hover:bg-muted/50 flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full">
                        {getContentTypeIcon(content.type)}
                      </div>
                      <div>
                        <div className="font-medium">
                          {index + 1}.{contentIndex + 1} {content.title}
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                          <span className="capitalize">{content.type}</span>
                          {content.duration && (
                            <>
                              <span>•</span>
                              <span>{content.duration}</span>
                            </>
                          )}
                          {content.isPreview && (
                            <>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                Preview
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <ContentPreview
                        title={content.title}
                        type={content.type}
                        content={content.content}
                        videoUrl={content.videoUrl}
                        imageUrl={content.imageUrl}
                        imageAlt={content.imageAlt}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditContent(section.id, content)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="text-destructive h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Content</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this content item?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDeleteContent(section.id, content.id)
                              }
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <div className="rounded-md border border-dashed py-8 text-center">
              <p className="text-muted-foreground mb-2">
                No content items in this section yet
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddContent(section.id)}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Content
              </Button>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}

export default function InstructorCurriculumBuilderPage() {
  const navigate = useNavigate();
  const [curriculum, setCurriculum] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [isEditingSectionId, setIsEditingSectionId] = useState<string | null>(
    null,
  );
  const [isEditingContentId, setIsEditingContentId] = useState<string | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [richTextContent, setRichTextContent] = useState('');

  // Initialize forms
  const sectionForm = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: '',
      description: '',
      order: 0,
    },
  });

  const contentForm = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: '',
      type: 'video',
      duration: '',
      description: '',
      content: '',
      videoUrl: '',
      imageUrl: '',
      imageAlt: '',
      isPreview: false,
      order: 0,
    },
  });

  // Handle section form submission
  const onSubmitSection = (data: SectionFormValues) => {
    if (isEditingSectionId) {
      // Update existing section
      setCurriculum(
        curriculum.map((section) =>
          section.id === isEditingSectionId
            ? { ...section, title: data.title, description: data.description }
            : section,
        ),
      );
      toast.success('Section updated successfully');
    } else {
      // Add new section
      const newSection: Section = {
        id: `section-${Date.now()}`,
        title: data.title,
        description: data.description,
        contents: [],
        order: curriculum.length, // Set order to the end of the list
      };
      setCurriculum([...curriculum, newSection]);
      setExpandedSections([...expandedSections, newSection.id]);
      toast.success('Section added successfully');
    }

    // Reset form and close dialog
    sectionForm.reset();
    setIsSectionDialogOpen(false);
    setIsEditingSectionId(null);
  };

  // Handle content form submission
  const onSubmitContent = (data: ContentFormValues) => {
    if (!activeSection) {
      toast.error('Please select a section first');
      return;
    }

    // Prepare content data based on type
    const contentData: Partial<ContentItem> = {
      title: data.title,
      type: data.type,
      description: data.description,
      isPreview: data.isPreview,
    };

    // Add type-specific fields
    switch (data.type) {
      case 'video':
        contentData.videoUrl = data.videoUrl;
        contentData.duration = data.duration;
        break;
      case 'rich-text':
        // Use the rich text content from the TiptapEditor
        contentData.content = richTextContent || '<p>Empty content</p>';
        break;
      case 'image':
        contentData.imageUrl = data.imageUrl;
        contentData.imageAlt = data.imageAlt;
        break;
    }

    if (isEditingContentId) {
      // Update existing content
      setCurriculum(
        curriculum.map((section) => {
          if (section.id === activeSection) {
            return {
              ...section,
              contents: section.contents.map((content) =>
                content.id === isEditingContentId
                  ? { ...content, ...contentData }
                  : content,
              ),
            };
          }
          return section;
        }),
      );
      toast.success('Content updated successfully');
    } else {
      // Add new content
      const section = curriculum.find((s) => s.id === activeSection);
      const newContent: ContentItem = {
        id: `content-${Date.now()}`,
        order: section?.contents.length || 0,
        ...contentData,
      } as ContentItem;

      setCurriculum(
        curriculum.map((section) => {
          if (section.id === activeSection) {
            return {
              ...section,
              contents: [...section.contents, newContent],
            };
          }
          return section;
        }),
      );
      toast.success('Content added successfully');
    }

    // Reset form and close dialog
    contentForm.reset();
    setRichTextContent('');
    setIsContentDialogOpen(false);
    setIsEditingContentId(null);
  };

  // Handle editing a section
  const handleEditSection = (section: Section) => {
    setIsEditingSectionId(section.id);
    sectionForm.reset({
      title: section.title,
      description: section.description,
      order: section.order,
    });
    setIsSectionDialogOpen(true);
  };

  // Handle editing content
  const handleEditContent = (sectionId: string, content: ContentItem) => {
    setActiveSection(sectionId);
    setIsEditingContentId(content.id);

    // Set rich text content if it's a rich-text type
    if (content.type === 'rich-text' && content.content) {
      setRichTextContent(content.content);
    } else {
      setRichTextContent('');
    }

    contentForm.reset({
      title: content.title,
      type: content.type,
      duration: content.duration || '',
      description: content.description || '',
      content: content.content || '',
      videoUrl: content.videoUrl || '',
      imageUrl: content.imageUrl || '',
      imageAlt: content.imageAlt || '',
      isPreview: content.isPreview,
      order: content.order,
    });
    setIsContentDialogOpen(true);
  };

  // Handle deleting a section
  const handleDeleteSection = (sectionId: string) => {
    setCurriculum(curriculum.filter((section) => section.id !== sectionId));
    toast.success('Section deleted successfully');
  };

  // Handle deleting content
  const handleDeleteContent = (sectionId: string, contentId: string) => {
    setCurriculum(
      curriculum.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            contents: section.contents.filter(
              (content) => content.id !== contentId,
            ),
          };
        }
        return section;
      }),
    );
    toast.success('Content deleted successfully');
  };

  // Handle saving the curriculum
  const handleSaveCurriculum = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you would send the curriculum data to your API
      console.log('Curriculum data:', curriculum);

      toast.success('Curriculum saved successfully');
      navigate('/dashboard/instructor/courses');
    } catch (error) {
      console.error('Error saving curriculum:', error);
      toast.error('Failed to save curriculum. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle section expansion
  const toggleSectionExpansion = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter((id) => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  // Move section (reorder)
  const moveSection = (dragIndex: number, hoverIndex: number) => {
    const sortedSections = [...curriculum].sort((a, b) => a.order - b.order);
    const dragSection = sortedSections[dragIndex];

    // Create new array with reordered sections
    const newSections = [...sortedSections];
    newSections.splice(dragIndex, 1);
    newSections.splice(hoverIndex, 0, dragSection);

    // Update order property for each section
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index,
    }));

    setCurriculum(updatedSections);
  };

  // Calculate total duration
  const calculateTotalDuration = () => {
    let totalMinutes = 0;
    let totalSeconds = 0;

    curriculum.forEach((section) => {
      section.contents.forEach((content) => {
        if (content.duration) {
          const [minutes, seconds] = content.duration.split(':').map(Number);
          totalMinutes += minutes;
          totalSeconds += seconds;
        }
      });
    });

    // Convert excess seconds to minutes
    totalMinutes += Math.floor(totalSeconds / 60);
    totalSeconds = totalSeconds % 60;

    // Convert to hours and minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${totalSeconds}s`;
    }
    return `${minutes}m ${totalSeconds}s`;
  };

  // Watch content type to show appropriate fields
  const contentType = contentForm.watch('type');

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/instructor/courses/create">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Course Details
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Build Your Curriculum
          </h1>
          <p className="text-muted-foreground">
            Organize your course content into sections and lessons
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/courses/preview/2')}
          >
            Preview
          </Button>
          <Button onClick={handleSaveCurriculum} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Curriculum
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Course Curriculum</CardTitle>
              <p className="text-muted-foreground mt-1 text-sm">
                {curriculum.length} sections •{' '}
                {curriculum.reduce(
                  (total, section) => total + section.contents.length,
                  0,
                )}{' '}
                items • {calculateTotalDuration()} total length
              </p>
            </div>
            <Dialog
              open={isSectionDialogOpen}
              onOpenChange={setIsSectionDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Section
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {isEditingSectionId ? 'Edit Section' : 'Add New Section'}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditingSectionId
                      ? 'Update the details of this section'
                      : 'Create a new section to organize your course content'}
                  </DialogDescription>
                </DialogHeader>
                <Form {...sectionForm}>
                  <form
                    onSubmit={sectionForm.handleSubmit(onSubmitSection)}
                    className="space-y-4"
                  >
                    <FormField
                      control={sectionForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section Title*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Introduction to JavaScript"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Give your section a clear and descriptive title
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={sectionForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief description of this section..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Optional: Provide a brief overview of what this
                            section covers
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">
                        {isEditingSectionId ? 'Update Section' : 'Add Section'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <DndProvider backend={HTML5Backend}>
              {curriculum.length > 0 ? (
                <Accordion
                  type="multiple"
                  value={expandedSections}
                  onValueChange={setExpandedSections}
                  className="w-full"
                >
                  {curriculum
                    .sort((a, b) => a.order - b.order)
                    .map((section, index) => (
                      <DraggableSection
                        key={section.id}
                        section={section}
                        index={index}
                        moveSection={moveSection}
                        handleEditSection={handleEditSection}
                        handleDeleteSection={handleDeleteSection}
                        handleAddContent={(sectionId) => {
                          setActiveSection(sectionId);
                          setIsContentDialogOpen(true);
                        }}
                        handleEditContent={handleEditContent}
                        handleDeleteContent={handleDeleteContent}
                        expandedSections={expandedSections}
                        toggleSectionExpansion={toggleSectionExpansion}
                      />
                    ))}
                </Accordion>
              ) : (
                <div className="py-12 text-center">
                  <h3 className="mb-2 text-lg font-medium">No sections yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start building your course by adding sections and content
                  </p>
                  <Button onClick={() => setIsSectionDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Section
                  </Button>
                </div>
              )}
            </DndProvider>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button variant="outline" asChild>
              <Link to="/dashboard/instructor/courses/create">Cancel</Link>
            </Button>
            <Button onClick={handleSaveCurriculum} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save and Continue'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Content Dialog */}
      <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditingContentId ? 'Edit Content' : 'Add New Content'}
            </DialogTitle>
            <DialogDescription>
              {isEditingContentId
                ? 'Update the details of this content item'
                : 'Add a new content item to your section'}
            </DialogDescription>
          </DialogHeader>
          <Form {...contentForm}>
            <form
              onSubmit={contentForm.handleSubmit(onSubmitContent)}
              className="space-y-4"
            >
              <FormField
                control={contentForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Title*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Introduction to Variables"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Give your content a clear and descriptive title
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={contentForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="video">
                          <div className="flex items-center">
                            <Video className="mr-2 h-4 w-4" />
                            <span>Video</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="rich-text">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Rich Text</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="image">
                          <div className="flex items-center">
                            <ImageIcon className="mr-2 h-4 w-4" />
                            <span>Image</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the type of content you want to add
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {contentType === 'video' && (
                <>
                  <FormField
                    control={contentForm.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/video.mp4"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the URL of your video (YouTube, Vimeo, or direct
                          video URL)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={contentForm.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 10:30" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the duration in MM:SS format (e.g. 10:30 for 10
                          minutes and 30 seconds)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {contentType === 'rich-text' && (
                <div className="space-y-2">
                  <FormLabel>Content*</FormLabel>
                  <TiptapEditor
                    content={richTextContent}
                    onChange={setRichTextContent}
                    placeholder="Start writing your content here..."
                    className="min-h-[300px]"
                  />
                  <FormDescription>
                    Use the rich text editor to create formatted content with
                    headings, lists, and more
                  </FormDescription>
                </div>
              )}

              {contentType === 'image' && (
                <>
                  <FormField
                    control={contentForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the URL of your image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={contentForm.control}
                    name="imageAlt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image Alt Text</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Descriptive text for accessibility"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Describe the image for accessibility purposes (for
                          screen readers)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {contentForm.watch('imageUrl') && (
                    <div className="mt-4">
                      <p className="mb-2 text-sm font-medium">Image Preview</p>
                      <div className="bg-muted/30 flex h-[200px] items-center justify-center rounded-md border p-4">
                        <img
                          src={
                            contentForm.watch('imageUrl') || '/placeholder.svg'
                          }
                          alt={contentForm.watch('imageAlt') || 'Preview'}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <FormField
                control={contentForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of this content..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Provide a brief description of what this content
                      covers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={contentForm.control}
                name="isPreview"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Preview Content</FormLabel>
                      <FormDescription>
                        Make this content available as a free preview
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">
                  {isEditingContentId ? 'Update Content' : 'Add Content'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
