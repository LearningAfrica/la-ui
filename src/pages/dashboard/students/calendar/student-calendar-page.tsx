import { useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import type { TSFixMe } from '@/lib/types/global';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import format from "date-fns/format"
// import parse from "date-fns/parse"
// import startOfWeek from "date-fns/startOfWeek"
// import getDay from "date-fns/getDay"
// import addDays from "date-fns/addDays"
// import addHours from "date-fns/addHours"
// import startOfDay from "date-fns/startOfDay"
// import subDays from "date-fns/subDays"
// import enUS from "date-fns/locale/en-US"
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Plus,
  Bell,
  Filter,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  Share2,
  Users,
} from 'lucide-react';
import { NotificationsPanel } from '@/components/notifications/notifications-panel';
import { ShareEventDialog } from '@/components/calendar/share-event-dialog';
import { SharedEvents } from '@/components/calendar/shared-events';
import { EventSharingInfo } from '@/components/calendar/event-sharing-info';
import { enUS } from 'date-fns/locale';
import {
  addDays,
  addHours,
  format,
  getDay,
  parse,
  startOfDay,
  startOfWeek,
  subDays,
} from 'date-fns';

// Date localizer setup for the calendar
const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Event types and their corresponding colors
const EVENT_TYPES = {
  assignment: { label: 'Assignment', color: 'bg-blue-500', icon: BookOpen },
  deadline: { label: 'Deadline', color: 'bg-red-500', icon: Clock },
  liveSession: { label: 'Live Session', color: 'bg-green-500', icon: Calendar },
  exam: { label: 'Exam', color: 'bg-amber-500', icon: BookOpen },
  studyGroup: { label: 'Study Group', color: 'bg-purple-500', icon: Calendar },
  reminder: { label: 'Reminder', color: 'bg-slate-500', icon: Bell },
};

// Sample events data
const generateSampleEvents = () => {
  const today = new Date();
  const startOfToday = startOfDay(today);

  return [
    {
      id: '1',
      title: 'JavaScript Fundamentals Quiz',
      start: addHours(startOfToday, 10),
      end: addHours(startOfToday, 11),
      type: 'assignment',
      course: 'Advanced JavaScript',
      description:
        'Complete the quiz on JavaScript fundamentals covering variables, functions, and objects.',
      location: 'Online',
      sharedWith: [],
    },
    {
      id: '2',
      title: 'Final Project Deadline',
      start: addDays(startOfToday, 7),
      end: addDays(startOfToday, 7),
      type: 'deadline',
      course: 'Web Development Bootcamp',
      description:
        'Submit your final project including all source code and documentation.',
      location: 'Online Submission Portal',
      sharedWith: [
        {
          id: 's1',
          name: 'Alex Johnson',
          image: '/abstract-aj.png',
          status: 'accepted',
        },
        {
          id: 's2',
          name: 'Jamie Smith',
          image: '/javascript-code-abstract.png',
          status: 'pending',
        },
      ],
    },
    {
      id: '3',
      title: 'React Hooks Workshop',
      start: addDays(startOfToday, 2),
      end: addDays(startOfToday, 2),
      type: 'liveSession',
      course: 'React Masterclass',
      description:
        'Live workshop covering advanced React hooks with Q&A session.',
      location: 'Zoom Meeting Room 3',
      sharedWith: [],
    },
    {
      id: '4',
      title: 'Database Design Midterm',
      start: addDays(startOfToday, 5),
      end: addDays(startOfToday, 5),
      type: 'exam',
      course: 'Database Systems',
      description:
        'Midterm exam covering normalization, SQL queries, and database design principles.',
      location: 'Online Proctored Exam',
      sharedWith: [],
    },
    {
      id: '5',
      title: 'Algorithm Study Group',
      start: addDays(startOfToday, 1),
      end: addDays(startOfToday, 1),
      type: 'studyGroup',
      course: 'Data Structures & Algorithms',
      description:
        'Weekly study group to practice algorithm problems and discuss solutions.',
      location: 'Discord Channel #algorithms',
      sharedWith: [
        {
          id: 's3',
          name: 'Taylor Wilson',
          image: '/Abstract Geometric Shapes.png',
          status: 'accepted',
        },
        {
          id: 's4',
          name: 'Morgan Lee',
          image: '/machine-learning-concept.png',
          status: 'accepted',
        },
        {
          id: 's5',
          name: 'Casey Brown',
          image: '/abstract-blue-curves.png',
          status: 'declined',
        },
      ],
    },
    {
      id: '6',
      title: 'Complete CSS Grid Exercises',
      start: subDays(startOfToday, 1),
      end: subDays(startOfToday, 1),
      type: 'reminder',
      course: 'CSS Mastery',
      description:
        'Reminder to complete the CSS grid layout exercises before next class.',
      location: 'Self-paced',
      sharedWith: [],
    },
    {
      id: '7',
      title: 'TypeScript Tutorial Review',
      start: addHours(addDays(startOfToday, 3), 14),
      end: addHours(addDays(startOfToday, 3), 15),
      type: 'assignment',
      course: 'TypeScript Fundamentals',
      description: 'Review the TypeScript tutorial and complete the exercises.',
      location: 'Online',
      sharedWith: [],
    },
    {
      id: '8',
      title: 'UI/UX Design Critique',
      start: addHours(addDays(startOfToday, 4), 11),
      end: addHours(addDays(startOfToday, 4), 12),
      type: 'liveSession',
      course: 'UI/UX Design Principles',
      description: 'Live session for peer critique of UI/UX design projects.',
      location: 'Google Meet',
      sharedWith: [],
    },
  ];
};

// Form schema for adding/editing events
const eventFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  start: z.string(),
  startTime: z.string(),
  end: z.string(),
  endTime: z.string(),
  type: z.string(),
  course: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

// Sample courses for dropdown
const sampleCourses = [
  'Advanced JavaScript',
  'Web Development Bootcamp',
  'React Masterclass',
  'Database Systems',
  'Data Structures & Algorithms',
  'CSS Mastery',
  'TypeScript Fundamentals',
  'UI/UX Design Principles',
];

export default function StudentCalendarPage() {
  const [events, setEvents] = useState(generateSampleEvents());
  const [selectedEvent, setSelectedEvent] = useState<TSFixMe>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isViewEventOpen, setIsViewEventOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isShareEventOpen, setIsShareEventOpen] = useState(false);
  const [_isSharedEventsOpen, setIsSharedEventsOpen] = useState(false);
  const [calendarView, setCalendarView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] =
    useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Initialize form
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      start: format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      end: format(new Date(), 'yyyy-MM-dd'),
      endTime: '10:00',
      type: 'assignment',
      course: '',
      description: '',
      location: '',
    },
  });

  // Filter events based on active filters
  const filteredEvents =
    activeFilters.length > 0
      ? events.filter((event) => activeFilters.includes(event.type))
      : events;

  // Handle event selection
  const handleSelectEvent = (event: TSFixMe) => {
    setSelectedEvent(event);
    setIsViewEventOpen(true);
    setIsEditMode(false);
  };

  // Handle slot selection (clicking on a time slot)
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    form.reset({
      title: '',
      start: format(start, 'yyyy-MM-dd'),
      startTime: format(start, 'HH:mm'),
      end: format(end, 'yyyy-MM-dd'),
      endTime: format(end, 'HH:mm'),
      type: 'assignment',
      course: '',
      description: '',
      location: '',
    });
    setIsAddEventOpen(true);
  };

  // Handle filter toggle
  const toggleFilter = (type: string) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  // Handle form submission for new event
  const onSubmit = (data: EventFormValues) => {
    const startDateTime = new Date(`${data.start}T${data.startTime}`);
    const endDateTime = new Date(`${data.end}T${data.endTime}`);

    const newEvent = {
      id:
        selectedEvent && isEditMode ? selectedEvent.id : `${events.length + 1}`,
      title: data.title,
      start: startDateTime,
      end: endDateTime,
      type: data.type,
      course: data.course,
      description: data.description || '',
      location: data.location || '',
      sharedWith:
        selectedEvent && isEditMode ? selectedEvent.sharedWith || [] : [],
    };

    if (selectedEvent && isEditMode) {
      // Update existing event
      setEvents(
        events.map((event) =>
          event.id === selectedEvent.id ? newEvent : event,
        ),
      );
      toast.success('Event updated successfully');
    } else {
      // Add new event
      setEvents([...events, newEvent]);
      toast.success('Event added to calendar');
    }

    setIsAddEventOpen(false);
    setIsViewEventOpen(false);
    setIsEditMode(false);
    form.reset();
  };

  // Handle edit event
  const handleEditEvent = () => {
    if (!selectedEvent) return;

    form.reset({
      title: selectedEvent.title,
      start: format(new Date(selectedEvent.start), 'yyyy-MM-dd'),
      startTime: format(new Date(selectedEvent.start), 'HH:mm'),
      end: format(new Date(selectedEvent.end), 'yyyy-MM-dd'),
      endTime: format(new Date(selectedEvent.end), 'HH:mm'),
      type: selectedEvent.type,
      course: selectedEvent.course,
      description: selectedEvent.description || '',
      location: selectedEvent.location || '',
    });

    setIsViewEventOpen(false);
    setIsAddEventOpen(true);
    setIsEditMode(true);
  };

  // Handle delete event
  const handleDeleteEvent = () => {
    if (!selectedEvent) return;

    setEvents(events.filter((event) => event.id !== selectedEvent.id));
    setIsViewEventOpen(false);
    toast.success('Event deleted successfully');
  };

  // Handle share event
  const handleShareEvent = () => {
    if (!selectedEvent) return;
    setIsShareEventOpen(true);
  };

  // Handle share event submission
  const handleShareEventSubmit = (recipients: string[], _options: TSFixMe) => {
    if (!selectedEvent) return;

    // In a real app, this would send invitations to the recipients
    // For now, we'll just update the event's sharedWith property
    const updatedEvent = {
      ...selectedEvent,
      sharedWith: [
        ...selectedEvent.sharedWith,
        ...recipients.map((id) => ({
          id,
          name: `Student ${id}`, // In a real app, we'd get the actual name
          image: `/placeholder.svg?height=32&width=32&query=${id}`,
          status: 'pending',
        })),
      ],
    };

    setEvents(
      events.map((event) =>
        event.id === selectedEvent.id ? updatedEvent : event,
      ),
    );
    toast.success(
      `Event shared with ${recipients.length} recipient${recipients.length !== 1 ? 's' : ''}`,
    );
  };

  // Handle accept shared event
  const handleAcceptSharedEvent = (eventId: string) => {
    // In a real app, this would update the shared event status in the database
    console.log(`Accepted shared event: ${eventId}`);
  };

  // Handle decline shared event
  const handleDeclineSharedEvent = (eventId: string) => {
    // In a real app, this would update the shared event status in the database
    console.log(`Declined shared event: ${eventId}`);
  };

  // Handle add shared event to calendar
  const handleAddSharedEventToCalendar = (event: TSFixMe) => {
    // In a real app, this would add the shared event to the user's calendar
    console.log(`Added shared event to calendar: ${event.id}`);
  };

  // Navigate to previous period
  const navigateToPrev = () => {
    const amount =
      calendarView === 'month' ? -1 : calendarView === 'week' ? -7 : -1;
    setCurrentDate(addDays(currentDate, amount));
  };

  // Navigate to next period
  const navigateToNext = () => {
    const amount =
      calendarView === 'month' ? 1 : calendarView === 'week' ? 7 : 1;
    setCurrentDate(addDays(currentDate, amount));
  };

  // Navigate to today
  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  // Custom event styling
  const eventStyleGetter = (event: TSFixMe) => {
    const eventType = event.type as keyof typeof EVENT_TYPES;
    const typeInfo = EVENT_TYPES[eventType];

    const backgroundColor = typeInfo?.color.replace('bg-', '') || 'blue';

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
        fontWeight: '500',
      },
    };
  };

  return (
    <div className="flex-1 space-y-4 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="relative"
            onClick={() => setIsSharedEventsOpen(true)}
          >
            <Users className="mr-2 h-4 w-4" />
            Shared Events
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
              2
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {Object.entries(EVENT_TYPES).map(([key, { label, color }]) => (
                <DropdownMenuItem
                  key={key}
                  onSelect={(e) => {
                    e.preventDefault();
                    toggleFilter(key);
                  }}
                >
                  <div className="flex w-full items-center">
                    <div className={`mr-2 h-3 w-3 rounded-full ${color}`} />
                    <span>{label}</span>
                    {activeFilters.includes(key) && (
                      <span className="ml-auto">✓</span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => setIsNotificationsPanelOpen(true)}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              3
            </span>
          </Button>

          <Button
            onClick={() => {
              form.reset({
                title: '',
                start: format(new Date(), 'yyyy-MM-dd'),
                startTime: '09:00',
                end: format(new Date(), 'yyyy-MM-dd'),
                endTime: '10:00',
                type: 'assignment',
                course: '',
                description: '',
                location: '',
              });
              setIsAddEventOpen(true);
              setIsEditMode(false);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="md:col-span-3">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle>Your Schedule</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={navigateToPrev}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={navigateToToday}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={navigateToNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <CardDescription>
                Manage your classes, assignments, and events
              </CardDescription>
              <Tabs
                value={calendarView}
                onValueChange={setCalendarView}
                className="w-[300px]"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="day">Day</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[600px]">
              <BigCalendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                views={{
                  month: true,
                  week: true,
                  day: true,
                }}
                view={calendarView as TSFixMe}
                onView={(view) => setCalendarView(view)}
                date={currentDate}
                onNavigate={(date) => setCurrentDate(date)}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                eventPropGetter={eventStyleGetter}
                popup
                tooltipAccessor={(event) => event.title}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <SharedEvents
            onAccept={handleAcceptSharedEvent}
            onDecline={handleDeclineSharedEvent}
            onAddToCalendar={handleAddSharedEventToCalendar}
          />
        </div>
      </div>

      {/* Add/Edit Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Edit Event' : 'Add New Event'}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? 'Make changes to your event here.'
                : 'Fill in the details for your new calendar event.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  {...form.register('title')}
                  placeholder="Enter event title"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Event Type</Label>
                  <Select
                    value={form.watch('type')}
                    onValueChange={(value) => form.setValue('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(EVENT_TYPES).map(
                        ([key, { label, color }]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center">
                              <div
                                className={`mr-2 h-3 w-3 rounded-full ${color}`}
                              />
                              {label}
                            </div>
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="course">Course</Label>
                  <Select
                    value={form.watch('course')}
                    onValueChange={(value) => form.setValue('course', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleCourses.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start">Start Date</Label>
                  <Input id="start" type="date" {...form.register('start')} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    {...form.register('startTime')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="end">End Date</Label>
                  <Input id="end" type="date" {...form.register('end')} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    {...form.register('endTime')}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...form.register('location')}
                  placeholder="Enter location (optional)"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...form.register('description')}
                  placeholder="Enter event description (optional)"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddEventOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditMode ? 'Update Event' : 'Add Event'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Event Dialog */}
      <Dialog open={isViewEventOpen} onOpenChange={setIsViewEventOpen}>
        {selectedEvent && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
              <DialogDescription>
                <Badge
                  className={
                    EVENT_TYPES[selectedEvent.type as keyof typeof EVENT_TYPES]
                      ?.color
                  }
                >
                  {
                    EVENT_TYPES[selectedEvent.type as keyof typeof EVENT_TYPES]
                      ?.label
                  }
                </Badge>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <span>
                  {format(new Date(selectedEvent.start), 'EEEE, MMMM d, yyyy')}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="text-muted-foreground h-4 w-4" />
                <span>
                  {format(new Date(selectedEvent.start), 'h:mm a')} -{' '}
                  {format(new Date(selectedEvent.end), 'h:mm a')}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="text-muted-foreground h-4 w-4" />
                <span>{selectedEvent.course}</span>
              </div>

              {selectedEvent.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                  <span>{selectedEvent.location}</span>
                </div>
              )}

              {selectedEvent.description && (
                <div className="border-t pt-2">
                  <h4 className="mb-1 text-sm font-medium">Description</h4>
                  <p className="text-muted-foreground text-sm">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              {/* Show sharing information if the event is shared */}
              {selectedEvent.sharedWith &&
                selectedEvent.sharedWith.length > 0 && (
                  <EventSharingInfo
                    sharedWith={selectedEvent.sharedWith}
                    onManageSharing={handleShareEvent}
                  />
                )}
            </div>

            <DialogFooter>
              <div className="flex w-full justify-between">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteEvent}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShareEvent}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button size="sm" onClick={handleEditEvent}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Share Event Dialog */}
      {selectedEvent && (
        <ShareEventDialog
          open={isShareEventOpen}
          onOpenChange={setIsShareEventOpen}
          event={selectedEvent}
          onShare={handleShareEventSubmit}
        />
      )}

      <NotificationsPanel />
    </div>
  );
}
