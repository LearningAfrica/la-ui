import { useState } from 'react';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  ArrowLeft,
  FileText,
  ImageIcon,
  Loader2,
  Plus,
  Save,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Link, useNavigate } from 'react-router-dom';
import { TiptapEditor } from '@/components/tiptap';

// Define the form schema with Zod
const contentSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters' })
    .max(100),
  type: z.enum(['text', 'video', 'image']),
  description: z.string().max(500).optional(),
  content: z.string().min(1, { message: 'Content is required' }),
  videoUrl: z.string().url({ message: 'Please enter a valid URL' }).optional(),
  videoDuration: z.string().optional(),
  imageAlt: z.string().max(200).optional(),
  order: z.number().int().positive().optional(),
  isPublished: z.boolean().default(false),
});

type ContentFormValues = z.infer<typeof contentSchema>;

// Mock data for sections
const courseSections = [
  { id: '1', title: 'Introduction to the Course', order: 1 },
  { id: '2', title: 'Getting Started with Fundamentals', order: 2 },
  { id: '3', title: 'Advanced Concepts', order: 3 },
  { id: '4', title: 'Practical Applications', order: 4 },
  { id: '5', title: 'Final Project', order: 5 },
];

export default function InstructorCreateCourseContentPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'text' | 'video' | 'image'>(
    'text',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [richTextContent, setRichTextContent] = useState('');
  const [selectedSection, setSelectedSection] = useState(courseSections[0].id);
  const [contentItems, setContentItems] = useState<
    Array<{ id: string; title: string; type: string }>
  >([]);

  // Initialize the form
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: '',
      type: 'text',
      description: '',
      content: '',
      videoUrl: '',
      videoDuration: '',
      imageAlt: '',
      order: 1,
      isPublished: false,
    },
  });

  // Watch the content type to update the active tab
  const contentType = form.watch('type');
  if (contentType !== activeTab) {
    setActiveTab(contentType as 'text' | 'video' | 'image');
  }

  // Handle form submission
  const onSubmit = async (data: ContentFormValues) => {
    setIsSubmitting(true);

    try {
      // If it's text content, use the rich text editor content
      if (data.type === 'text') {
        data.content = richTextContent;
      }

      // Add section ID to the data
      const submitData = {
        ...data,
        sectionId: selectedSection,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Log the form data (in a real app, you would send this to your API)
      console.log('Content data:', submitData);

      // Add to content items for display
      setContentItems([
        ...contentItems,
        { id: Date.now().toString(), title: data.title, type: data.type },
      ]);

      toast.success('Content added successfully!');

      // Reset form for next content item
      form.reset({
        title: '',
        type: 'text',
        description: '',
        content: '',
        videoUrl: '',
        videoDuration: '',
        imageAlt: '',
        order: contentItems.length + 1,
        isPublished: false,
      });
      setRichTextContent('');
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error('Failed to add content. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'text' | 'video' | 'image');
    form.setValue('type', value as 'text' | 'video' | 'image');
  };

  // Handle section change
  const handleSectionChange = (value: string) => {
    setSelectedSection(value);
  };

  // Handle save and continue
  const handleSaveAndContinue = () => {
    toast.success('Course content saved successfully!');
    navigate('/dashboard/instructor/courses');
  };

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
            Create Course Content
          </h1>
          <p className="text-muted-foreground">
            Add lessons, videos, and other content to your course
          </p>
        </div>
        <Button onClick={handleSaveAndContinue}>
          <Save className="mr-2 h-4 w-4" />
          Save and Continue
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left sidebar - Course structure */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Course Structure</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-muted/50 px-6 py-3">
              <Select
                value={selectedSection}
                onValueChange={handleSectionChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a section" />
                </SelectTrigger>
                <SelectContent>
                  {courseSections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.order}. {section.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4 p-6">
                {contentItems.length > 0 ? (
                  contentItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-muted/30 flex items-center gap-3 rounded-md p-3"
                    >
                      <div className="bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                        {item.type === 'text' && (
                          <FileText className="text-primary h-4 w-4" />
                        )}
                        {item.type === 'video' && (
                          <Video className="text-primary h-4 w-4" />
                        )}
                        {item.type === 'image' && (
                          <ImageIcon className="text-primary h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {item.title}
                        </p>
                        <p className="text-muted-foreground text-xs capitalize">
                          {item.type} content
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground text-sm">
                      No content items yet
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Add content using the form on the right
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t p-4">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/dashboard/instructor/courses/create/sections">
                <Plus className="mr-2 h-4 w-4" />
                Manage Sections
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Right side - Content creation form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Video
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Image
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Title*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Introduction to Key Concepts"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A clear title for this content item
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of this content..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Provide a brief overview of this content
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Tabs value={activeTab} className="w-full">
                  <TabsContent value="text" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Text Content*</FormLabel>
                          <FormControl>
                            <TiptapEditor
                              content={richTextContent}
                              onChange={(value) => {
                                setRichTextContent(value);
                                field.onChange(value);
                              }}
                              placeholder="Start writing your content here..."
                              className="min-h-[300px]"
                            />
                          </FormControl>
                          <FormDescription>
                            Use the rich text editor to create formatted content
                            with headings, lists, and more
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="video" className="space-y-4">
                    <FormField
                      control={form.control}
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
                            Enter the URL of your video (YouTube, Vimeo, or
                            direct video URL)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="videoDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Video Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 10:30" {...field} />
                          </FormControl>
                          <FormDescription>
                            Optional: Enter the duration of the video (MM:SS)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Video Description*</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe what this video covers..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide a description of what students will learn in
                            this video
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="image" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="content"
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
                      control={form.control}
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

                    <div className="mt-4">
                      <p className="mb-2 text-sm font-medium">Image Preview</p>
                      <div className="bg-muted/30 flex h-[200px] items-center justify-center rounded-md border p-4">
                        {form.watch('content') ? (
                          <img
                            src={form.watch('content') || '/placeholder.svg'}
                            alt={form.watch('imageAlt') || 'Preview'}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        ) : (
                          <div className="text-muted-foreground text-center">
                            <ImageIcon className="mx-auto mb-2 h-10 w-10 opacity-50" />
                            <p>Enter an image URL to see a preview</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <Separator />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number.parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          The order in which this content appears in the section
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Publish Content</FormLabel>
                          <FormDescription>
                            Make this content visible to students
                          </FormDescription>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="accent-primary h-4 w-4"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t p-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Content...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Content
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
