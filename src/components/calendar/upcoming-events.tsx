import { useState } from 'react';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: string;
  course: string;
  description?: string;
  location?: string;
}

interface UpcomingEventsProps {
  events: Event[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const [timeframe, setTimeframe] = useState('today');

  // Filter events based on selected timeframe
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.start);
    if (timeframe === 'today') return isToday(eventDate);
    if (timeframe === 'tomorrow') return isTomorrow(eventDate);
    if (timeframe === 'week') {
      const weekFromNow = addDays(new Date(), 7);
      return eventDate <= weekFromNow && eventDate >= new Date();
    }
    return true;
  });

  // Sort events by start time
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );

  // Event types and their corresponding colors
  const EVENT_TYPES: Record<string, { color: string }> = {
    assignment: {
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    },
    deadline: {
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    },
    liveSession: {
      color:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    },
    exam: {
      color:
        'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    },
    studyGroup: {
      color:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    },
    reminder: {
      color:
        'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Your scheduled events</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="today"
          value={timeframe}
          onValueChange={setTimeframe}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
          </TabsList>
          <TabsContent value={timeframe} className="mt-4">
            {sortedEvents.length > 0 ? (
              <div className="space-y-4">
                {sortedEvents.map((event) => (
                  <div key={event.id} className="rounded-lg border p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-muted-foreground text-sm">
                          {event.course}
                        </p>
                      </div>
                      <Badge
                        className={
                          EVENT_TYPES[event.type]?.color || 'bg-gray-100'
                        }
                      >
                        {event.type.charAt(0).toUpperCase() +
                          event.type.slice(1)}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3">
                      <div className="text-muted-foreground flex items-center gap-1 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {format(new Date(event.start), 'EEEE, MMMM d')}
                        </span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>
                          {format(new Date(event.start), 'h:mm a')} -{' '}
                          {format(new Date(event.end), 'h:mm a')}
                        </span>
                      </div>
                      {event.location && (
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-muted-foreground">
                  No events scheduled for this period
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
