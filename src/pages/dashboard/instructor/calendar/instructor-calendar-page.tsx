import { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CalendarIcon, Clock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock events data
const initialEvents = [
  {
    id: '1',
    title: 'JavaScript Live Q&A Session',
    date: new Date(2024, 1, 15),
    time: '14:00 - 15:30',
    type: 'webinar',
    course: 'Complete JavaScript Course',
    description:
      'Live Q&A session to answer student questions about JavaScript fundamentals.',
  },
  {
    id: '2',
    title: 'React Native Project Review',
    date: new Date(2024, 1, 20),
    time: '16:00 - 17:00',
    type: 'review',
    course: 'React Native for Beginners',
    description:
      'Review session for student projects. Will provide feedback and suggestions for improvement.',
  },
  {
    id: '3',
    title: 'TypeScript Workshop',
    date: new Date(2024, 1, 25),
    time: '10:00 - 12:00',
    type: 'workshop',
    course: 'Advanced TypeScript Patterns',
    description:
      'Hands-on workshop covering advanced TypeScript patterns and practices.',
  },
  {
    id: '4',
    title: 'Course Update Deadline',
    date: new Date(2024, 1, 28),
    time: '23:59',
    type: 'deadline',
    course: 'Complete JavaScript Course',
    description: 'Deadline for updating course content with ES2022 features.',
  },
];

export default function InstructorCalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState(initialEvents);
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    time: '',
    type: 'webinar',
    course: '',
    description: '',
  });

  // Get events for the selected date
  const selectedDateEvents = events.filter(
    (event) => date && event.date.toDateString() === date.toDateString(),
  );

  // Get dates with events for highlighting in the calendar
  const datesWithEvents = events.map((event) => event.date);

  // Handle adding a new event
  const handleAddEvent = () => {
    if (newEvent.title && newEvent.time && newEvent.course) {
      const id = `event-${Date.now()}`;
      setEvents([...events, { id, ...newEvent, date: date || new Date() }]);
      setIsAddEventDialogOpen(false);
      setNewEvent({
        title: '',
        date: new Date(),
        time: '',
        type: 'webinar',
        course: '',
        description: '',
      });
      toast.success('Event added successfully');
    }
  };

  // Get badge color based on event type
  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'webinar':
        return 'bg-blue-100 text-blue-800';
      case 'workshop':
        return 'bg-green-100 text-green-800';
      case 'review':
        return 'bg-purple-100 text-purple-800';
      case 'deadline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your schedule, events, and deadlines
          </p>
        </div>
        <Dialog
          open={isAddEventDialogOpen}
          onOpenChange={setIsAddEventDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>
                Create a new event or deadline for your calendar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  placeholder="Enter event title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                    <span>
                      {date ? date.toLocaleDateString() : 'Select a date'}
                    </span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    value={newEvent.time}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, time: e.target.value })
                    }
                    placeholder="e.g. 14:00 - 15:30"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Event Type</Label>
                  <Select
                    value={newEvent.type}
                    onValueChange={(value) =>
                      setNewEvent({ ...newEvent, type: value })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="webinar">Webinar</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="review">Review Session</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="course">Related Course</Label>
                  <Input
                    id="course"
                    value={newEvent.course}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, course: e.target.value })
                    }
                    placeholder="Course name"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  placeholder="Add event details"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddEventDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>Add Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>
              Select a date to view or add events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                event: datesWithEvents,
              }}
              modifiersStyles={{
                event: { fontWeight: 'bold', textDecoration: 'underline' },
              }}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {date
                ? date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Select a date'}
            </CardTitle>
            <CardDescription>
              {selectedDateEvents.length} event
              {selectedDateEvents.length !== 1 ? 's' : ''} scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length === 0 ? (
              <div className="py-8 text-center">
                <Clock className="text-muted-foreground/50 mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-medium">
                  No events scheduled
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Click "Add Event" to schedule something for this day.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <div key={event.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{event.title}</h3>
                          <Badge className={getEventBadgeColor(event.type)}>
                            {event.type.charAt(0).toUpperCase() +
                              event.type.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {event.time} • {event.course}
                        </p>
                        <p className="mt-2">{event.description}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Link to={`/dashboard/instructor/calendar/${event.id}`}>
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
