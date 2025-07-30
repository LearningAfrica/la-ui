import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, Video, ExternalLink, Maximize2, X } from 'lucide-react';

interface LiveSession {
  id: string;
  title: string;
  instructor: string;
  course: string;
  date: string;
  time: string;
  duration: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  participants: number;
  maxParticipants: number;
  meetingLink?: string;
  recordingLink?: string;
}

const mockUpcomingSessions: LiveSession[] = [
  {
    id: '1',
    title: 'Advanced JavaScript Concepts',
    instructor: 'Dr. Sarah Johnson',
    course: 'JavaScript Fundamentals',
    date: '2024-01-15',
    time: '14:00',
    duration: '90 minutes',
    status: 'upcoming',
    participants: 12,
    maxParticipants: 20,
    meetingLink: 'https://meet.google.com/abc-def-ghi'
  },
  {
    id: '2',
    title: 'React Hooks Deep Dive',
    instructor: 'Prof. Michael Chen',
    course: 'React Development',
    date: '2024-01-18',
    time: '10:00',
    duration: '120 minutes',
    status: 'upcoming',
    participants: 8,
    maxParticipants: 15,
    meetingLink: 'https://meet.google.com/xyz-uvw-rst'
  },
  {
    id: '3',
    title: 'Python Data Analysis',
    instructor: 'Dr. Emily Rodriguez',
    course: 'Data Science Basics',
    date: '2024-01-20',
    time: '16:00',
    duration: '90 minutes',
    status: 'upcoming',
    participants: 15,
    maxParticipants: 25,
    meetingLink: 'https://meet.google.com/python-data'
  }
];

const mockPastSessions: LiveSession[] = [
  {
    id: '4',
    title: 'Introduction to TypeScript',
    instructor: 'Dr. Sarah Johnson',
    course: 'TypeScript Basics',
    date: '2024-01-10',
    time: '15:00',
    duration: '90 minutes',
    status: 'completed',
    participants: 18,
    maxParticipants: 20,
    recordingLink: 'https://drive.google.com/recording-1'
  },
  {
    id: '5',
    title: 'CSS Grid Layout',
    instructor: 'Prof. Michael Chen',
    course: 'CSS Mastery',
    date: '2024-01-08',
    time: '11:00',
    duration: '60 minutes',
    status: 'completed',
    participants: 15,
    maxParticipants: 15,
    recordingLink: 'https://drive.google.com/recording-2'
  },
  {
    id: '6',
    title: 'Machine Learning Basics',
    instructor: 'Dr. Emily Rodriguez',
    course: 'AI Fundamentals',
    date: '2024-01-05',
    time: '14:00',
    duration: '120 minutes',
    status: 'completed',
    participants: 22,
    maxParticipants: 30,
    recordingLink: 'https://drive.google.com/recording-3'
  }
];

export default function StudentLiveSessionsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');

  // Iframe embed states
  const [embeddedSession, setEmbeddedSession] = useState<LiveSession | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const getStatusBadge = (status: LiveSession['status']) => {
    const variants = {
      upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      ongoing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const joinSession = (session: LiveSession) => {
    setEmbeddedSession(session);
    setIsFullScreen(true);
  };

  const closeEmbeddedSession = () => {
    setEmbeddedSession(null);
    setIsFullScreen(false);
  };

  const convertToEmbedUrl = (meetingLink: string) => {
    // Convert various meeting link formats to embed URLs
    if (meetingLink.includes('meet.google.com')) {
      // Google Meet
      return meetingLink.replace('/meet/', '/meet/embed/');
    } else if (meetingLink.includes('zoom.us')) {
      // Zoom
      return meetingLink.replace('/j/', '/j/embed/');
    } else if (meetingLink.includes('teams.microsoft.com')) {
      // Microsoft Teams
      return meetingLink.replace('/meetup-join/', '/meetup-join/embed/');
    }
    return meetingLink;
  };

  return (
    <>
      {/* Full-screen embedded session */}
      {isFullScreen && embeddedSession && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <Video className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{embeddedSession.title}</h2>
                  <p className="text-sm text-muted-foreground">{embeddedSession.course} • {embeddedSession.instructor}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsFullScreen(false)}>
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Exit Full Screen
                </Button>
                <Button variant="outline" size="sm" onClick={closeEmbeddedSession}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Embedded iframe */}
            <div className="flex-1">
              <iframe
                src={convertToEmbedUrl(embeddedSession.meetingLink!)}
                className="w-full h-full border-0"
                allow="camera; microphone; fullscreen; speaker; display-capture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Sessions</h1>
          <p className="text-muted-foreground">
            Join live learning sessions and access past recordings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="past">Past Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {mockUpcomingSessions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Video className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Upcoming Sessions</h3>
                  <p className="text-muted-foreground text-center">
                    No upcoming live sessions scheduled for you.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockUpcomingSessions.map((session) => (
                  <Card key={session.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{session.title}</CardTitle>
                          <CardDescription>{session.course}</CardDescription>
                          <p className="text-xs text-muted-foreground">{session.instructor}</p>
                        </div>
                        {getStatusBadge(session.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(session.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{session.time} ({session.duration})</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{session.participants}/{session.maxParticipants} participants</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => joinSession(session)}>
                          <Video className="h-4 w-4 mr-2" />
                          Join Session
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {mockPastSessions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Video className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Past Sessions</h3>
                  <p className="text-muted-foreground text-center">
                    No completed live sessions found.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockPastSessions.map((session) => (
                  <Card key={session.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{session.title}</CardTitle>
                          <CardDescription>{session.course}</CardDescription>
                          <p className="text-xs text-muted-foreground">{session.instructor}</p>
                        </div>
                        {getStatusBadge(session.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(session.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{session.time} ({session.duration})</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{session.participants}/{session.maxParticipants} participants</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" asChild>
                          <a href={session.recordingLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Watch Recording
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
