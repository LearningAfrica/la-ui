import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Video } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  createSessionSchemaResolver,
  type CreateSessionData,
  type CreateSessionFormData,
} from '@/lib/validators/live-session-schema';
import {
  useCreateSession,
  useUpdateSession,
} from '@/lib/features/live-sessions';
import { toast } from 'sonner';
import type { LiveSession } from '@/lib/types/live-session';

interface CreateSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: LiveSession | null;
  mode: 'create' | 'edit';
}

const durationOptions = [
  { value: '30', label: '30 minutes' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' },
  { value: '180', label: '3 hours' },
];

export function CreateSessionDialog({
  open,
  onOpenChange,
  session,
  mode,
}: CreateSessionDialogProps) {
  // TanStack Query mutations
  const createSessionMutation = useCreateSession();
  const updateSessionMutation = useUpdateSession();

  const form = useForm<CreateSessionFormData>({
    resolver: createSessionSchemaResolver,
    defaultValues: {
      topic: '',
      course: 'General Session',
      start_time: '',
      duration: 60,
      max_participants: 20,
      description: '',
    },
  });

  useEffect(() => {
    if (session && mode === 'edit') {
      // For edit mode, convert the LiveSession back to form format
      const start_time = session.start_time || '';

      // Duration is already a number in the new format
      const durationNumber = session.duration || 60;

      form.reset({
        topic: session.topic,
        start_time: start_time.slice(0, 16), // Remove seconds and timezone info for datetime-local input
        duration: durationNumber,
      });
    } else {
      form.reset({
        topic: '',
        course: 'General Session',
        start_time: '',
        duration: 60,
        max_participants: 20,
        description: '',
      });
    }
  }, [session, mode, open, form]);

  const onSubmit = form.handleSubmit((data) => {
    const sessionData: CreateSessionData = {
      id: mode === 'edit' ? session?.id : undefined,
      topic: data.topic,
      course: data.course || 'General Session',
      start_time: data.start_time,
      duration: data.duration,
      max_participants: data.max_participants || 20,
      description: data.description || '',
    };

    if (mode === 'create') {
      createSessionMutation.mutate(sessionData, {
        onSuccess: () => {
          toast.success('Session Created', {
            description: `"${sessionData.topic}" has been successfully created.`,
          });
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error('Error', {
            description: `Failed to create session: ${error.message}`,
          });
        },
      });
    } else {
      updateSessionMutation.mutate(sessionData, {
        onSuccess: () => {
          toast.success('Session Updated', {
            description: `"${sessionData.topic}" has been successfully updated.`,
          });
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error('Error', {
            description: `Failed to update session: ${error.message}`,
          });
        },
      });
    }
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
              : 'Update the details of this live session.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Session Topic */}
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic *</FormLabel>
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

            {/* Course Selection - Commented Out */}
            {/* <FormField
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
            /> */}

            {/* Start Time and Duration */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date *</FormLabel>
                    <FormControl className="w-full">
                      <div className="relative">
                        <Calendar className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                        <Input
                          type="datetime-local"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                        <Input type="time" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value.toString()}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Duration</SelectLabel>
                          {durationOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Max Participants and Meeting Link - Commented Out */}
            {/* <div className="grid grid-cols-2 gap-4">
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
            </div> */}

            {/* Description - Commented Out */}
            {/* <FormField
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
            /> */}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={
                  createSessionMutation.isPending ||
                  updateSessionMutation.isPending
                }
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  createSessionMutation.isPending ||
                  updateSessionMutation.isPending
                }
              >
                {createSessionMutation.isPending ||
                updateSessionMutation.isPending
                  ? mode === 'create'
                    ? 'Creating...'
                    : 'Updating...'
                  : mode === 'create'
                    ? 'Create Session'
                    : 'Update Session'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
