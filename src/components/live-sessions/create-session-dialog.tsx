import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Users, Video } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { CreateSessionData } from '@/lib/types/live-session';
import { createSessionSchemaResolver, type CreateSessionFormData } from '@/lib/validators/live-session-schema';

interface CreateSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: CreateSessionData | null;
  onSave: (session: CreateSessionData) => void;
  mode: 'create' | 'edit';
}

const mockCourses = [
  { id: '1', title: 'JavaScript Fundamentals' },
  { id: '2', title: 'React Development' },
  { id: '3', title: 'TypeScript Basics' },
  { id: '4', title: 'CSS Mastery' },
  { id: '5', title: 'Data Science Basics' },
  { id: '6', title: 'AI Fundamentals' },
];

const durationOptions = [
  { value: '30', label: '30 minutes' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' },
  { value: '180', label: '3 hours' },
];

export function CreateSessionDialog({ open, onOpenChange, session, onSave, mode }: CreateSessionDialogProps) {
  const form = useForm<CreateSessionFormData>({
    resolver: createSessionSchemaResolver,
    defaultValues: {
      title: '',
      course: '',
      date: '',
      time: '',
      duration: '60',
      maxParticipants: 20,
      description: '',
      meetingLink: '',
    },
  });

  useEffect(() => {
    if (session && mode === 'edit') {
      form.reset({
        title: session.title,
        course: session.course,
        date: session.date,
        time: session.time,
        duration: session.duration,
        maxParticipants: session.maxParticipants,
        description: session.description || '',
        meetingLink: session.meetingLink || '',
      });
    } else {
      form.reset({
        title: '',
        course: '',
        date: '',
        time: '',
        duration: '60',
        maxParticipants: 20,
        description: '',
        meetingLink: '',
      });
    }
  }, [session, mode, open, form]);

  const onSubmit = form.handleSubmit((data) => {
    // Ensure all required fields are present
    if (!data.title || !data.course || !data.date || !data.time || !data.duration || !data.maxParticipants) {
      return;
    }

    const sessionData: CreateSessionData = {
      id: mode === 'edit' ? session?.id : undefined,
      title: data.title,
      course: data.course,
      date: data.date,
      time: data.time,
      duration: data.duration,
      maxParticipants: data.maxParticipants,
      description: data.description,
      meetingLink: data.meetingLink,
    };

    onSave(sessionData);
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            {mode === 'create' ? 'Create Live Session' : 'Edit Live Session'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Schedule a new live learning session for your students.'
              : 'Update the details of this live session.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Advanced JavaScript Concepts"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockCourses.map((course) => (
                          <SelectItem key={course.id} value={course.title}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="date"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="time"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {durationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Participants *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          className="pl-10"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meetingLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Link</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://meet.google.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of what will be covered in this session..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === 'create' ? 'Create Session' : 'Update Session'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
