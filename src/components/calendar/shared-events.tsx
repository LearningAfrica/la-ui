import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Check, Clock, MapPin, Share2, User, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

// Sample shared events data
const sampleSharedEvents = [
  {
    id: 'se1',
    eventId: '1',
    title: 'JavaScript Study Group',
    start: new Date(new Date().setHours(new Date().getHours() + 48)),
    end: new Date(new Date().setHours(new Date().getHours() + 50)),
    type: 'studyGroup',
    course: 'Advanced JavaScript',
    location: 'Discord Channel #javascript',
    sharedBy: {
      id: 's2',
      name: 'Jamie Smith',
      image: '/javascript-code-abstract.png',
    },
    status: 'pending',
    message: "Let's prepare for the upcoming quiz together!",
    allowEdit: false,
    sharedAt: new Date(new Date().setHours(new Date().getHours() - 2)),
  },
  {
    id: 'se2',
    eventId: '2',
    title: 'Project Planning Session',
    start: new Date(new Date().setHours(new Date().getHours() + 24)),
    end: new Date(new Date().setHours(new Date().getHours() + 26)),
    type: 'liveSession',
    course: 'Web Development Bootcamp',
    location: 'Zoom Meeting Room 2',
    sharedBy: {
      id: 's3',
      name: 'Taylor Wilson',
      image: '/Abstract Geometric Shapes.png',
    },
    status: 'accepted',
    message: 'Important meeting to discuss final project requirements.',
    allowEdit: true,
    sharedAt: new Date(new Date().setHours(new Date().getHours() - 5)),
  },
  {
    id: 'se3',
    eventId: '3',
    title: 'React Hooks Workshop',
    start: new Date(new Date().setHours(new Date().getHours() + 72)),
    end: new Date(new Date().setHours(new Date().getHours() + 74)),
    type: 'liveSession',
    course: 'React Masterclass',
    location: 'Classroom B',
    sharedBy: {
      id: 's4',
      name: 'Morgan Lee',
      image: '/machine-learning-concept.png',
    },
    status: 'declined',
    message: null,
    allowEdit: false,
    sharedAt: new Date(new Date().setHours(new Date().getHours() - 12)),
  },
];

// Event types and their corresponding colors
const EVENT_TYPES: Record<string, { color: string }> = {
  assignment: { color: 'bg-blue-500' },
  deadline: { color: 'bg-red-500' },
  liveSession: { color: 'bg-green-500' },
  exam: { color: 'bg-amber-500' },
  studyGroup: { color: 'bg-purple-500' },
  reminder: { color: 'bg-slate-500' },
};

interface SharedEventsProps {
  onAccept: (eventId: string) => void;
  onDecline: (eventId: string) => void;
  onAddToCalendar: (event: any) => void;
}

export function SharedEvents({
  onAccept,
  onDecline,
  onAddToCalendar,
}: SharedEventsProps) {
  const [activeTab, setActiveTab] = useState('pending');

  // Filter events based on active tab
  const filteredEvents = sampleSharedEvents.filter((event) => {
    if (activeTab === 'pending') return event.status === 'pending';
    if (activeTab === 'accepted') return event.status === 'accepted';
    if (activeTab === 'declined') return event.status === 'declined';
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Shared Events
            </CardTitle>
            <CardDescription>
              Events shared with you by other students
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-auto">
            {sampleSharedEvents.filter((e) => e.status === 'pending').length}{' '}
            pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="pending"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="declined">Declined</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            <ScrollArea className="h-[300px] pr-4">
              {filteredEvents.length > 0 ? (
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <div key={event.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{event.title}</h4>
                            <Badge
                              className="ml-2"
                              style={{
                                backgroundColor: EVENT_TYPES[
                                  event.type
                                ]?.color.replace('bg-', ''),
                              }}
                            >
                              {event.type.replace(/([A-Z])/g, ' $1').trim()}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mt-1 text-sm">
                            {event.course}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={event.sharedBy.image || '/placeholder.svg'}
                              alt={event.sharedBy.name}
                            />
                            <AvatarFallback>
                              {event.sharedBy.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                          <User className="h-3.5 w-3.5" />
                          <span>Shared by {event.sharedBy.name}</span>
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {format(
                              new Date(event.start),
                              'EEEE, MMMM d, yyyy',
                            )}
                          </span>
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {format(new Date(event.start), 'h:mm a')} -{' '}
                            {format(new Date(event.end), 'h:mm a')}
                          </span>
                        </div>
                        {event.location && (
                          <div className="text-muted-foreground flex items-center gap-2 text-xs">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>

                      {event.message && (
                        <div className="bg-muted mt-3 rounded-md p-2 text-sm">
                          <p className="italic">"{event.message}"</p>
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-muted-foreground text-xs">
                          {event.allowEdit && (
                            <span className="italic">
                              You can edit this event
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {event.status === 'pending' ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500"
                                onClick={() => {
                                  onDecline(event.id);
                                  toast.success('Event invitation declined');
                                }}
                              >
                                <X className="mr-1 h-4 w-4" />
                                Decline
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  onAccept(event.id);
                                  toast.success('Event added to your calendar');
                                }}
                              >
                                <Check className="mr-1 h-4 w-4" />
                                Accept
                              </Button>
                            </>
                          ) : event.status === 'accepted' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onAddToCalendar(event)}
                            >
                              View in Calendar
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                onAccept(event.id);
                                toast.success('Event added to your calendar');
                              }}
                            >
                              Add to Calendar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No {activeTab} events</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
