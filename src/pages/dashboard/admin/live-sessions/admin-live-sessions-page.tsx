import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, Video, ExternalLink, Plus, Edit, Trash2, BarChart3, TrendingUp, Maximize2, X } from 'lucide-react';
import { CreateSessionDialog } from '@/components/live-sessions/create-session-dialog';
import { DeleteSessionDialog } from '@/components/live-sessions/delete-session-dialog';
import type { LiveSession, CreateSessionData } from '@/lib/types/live-session';

export default function AdminLiveSessionsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sessions, setSessions] = useState<LiveSession[]>([
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
    },
    {
      id: '4',
      title: 'TypeScript Best Practices',
      instructor: 'Dr. Sarah Johnson',
      course: 'TypeScript Advanced',
      date: '2024-01-12',
      time: '15:00',
      duration: '90 minutes',
      status: 'ongoing',
      participants: 15,
      maxParticipants: 20,
      meetingLink: 'https://meet.google.com/ongoing-session'
    },
    {
      id: '5',
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
      id: '6',
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
      id: '7',
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
  ]);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<LiveSession | null>(null);

  // Iframe embed states
  const [embeddedSession, setEmbeddedSession] = useState<LiveSession | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Simple toast implementation
  const toast = ({ title, description }: { title: string; description: string }) => {
    console.log(`Toast: ${title} - ${description}`);
    // In a real app, this would show a toast notification
  };

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

  const handleCreateSession = (sessionData: CreateSessionData) => {
    const newSession: LiveSession = {
      ...sessionData,
      id: Date.now().toString(), // Simple ID generation
      status: 'upcoming',
      participants: 0,
      instructor: 'Admin User', // Default instructor for admin-created sessions
    };

    setSessions(prev => [newSession, ...prev]);
    toast({
      title: "Session Created",
      description: `"${sessionData.title}" has been successfully created.`,
    });
  };

  const handleEditSession = (sessionData: CreateSessionData) => {
    setSessions(prev => prev.map(session =>
      session.id === sessionData.id
        ? { ...session, ...sessionData }
        : session
    ));
    toast({
      title: "Session Updated",
      description: `"${sessionData.title}" has been successfully updated.`,
    });
  };

  const handleDeleteSession = () => {
    if (!sessionToDelete) return;

    setSessions(prev => prev.filter(session => session.id !== sessionToDelete.id));
    toast({
      title: "Session Deleted",
      description: `"${sessionToDelete.title}" has been successfully deleted.`,
    });
    setSessionToDelete(null);
  };

  const openEditDialog = (session: LiveSession) => {
    setSelectedSession(session);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (session: LiveSession) => {
    setSessionToDelete(session);
    setDeleteDialogOpen(true);
  };

  const getSessionsByStatus = (status: LiveSession['status']) => {
    return sessions.filter(session => session.status === status);
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

  const totalSessions = sessions.length;
  const totalParticipants = sessions.reduce((sum, session) => sum + session.participants, 0);
  const avgAttendance = totalSessions > 0 ? totalParticipants / totalSessions : 0;
  const upcomingSessions = getSessionsByStatus('upcoming');
  const ongoingSessions = getSessionsByStatus('ongoing');
  const pastSessions = getSessionsByStatus('completed');

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Live Sessions Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage all live learning sessions across the platform
            </p>
          </div>
          <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Session
          </Button>
        </div>

        {/* Analytics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSessions}</div>
              <p className="text-xs text-muted-foreground">
                Across all instructors
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ongoingSessions.length}</div>
              <p className="text-xs text-muted-foreground">
                Currently running
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalParticipants}</div>
              <p className="text-xs text-muted-foreground">
                Across all sessions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgAttendance.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Per session
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sessions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 6)
                .map((session) => (
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
                        {session.meetingLink && (
                          <Button variant="outline" className="flex-1" onClick={() => joinSession(session)}>
                            <Video className="h-4 w-4 mr-2" />
                            Join Session
                          </Button>
                        )}
                        {session.recordingLink && (
                          <Button variant="outline" className="flex-1" asChild>
                            <a href={session.recordingLink} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Recording
                            </a>
                          </Button>
                        )}
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(session)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingSessions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Video className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Upcoming Sessions</h3>
                  <p className="text-muted-foreground text-center">
                    No upcoming live sessions scheduled across the platform.
                  </p>
                  <Button className="mt-4 gap-2" onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Create First Session
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingSessions.map((session) => (
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
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(session)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ongoing" className="space-y-4">
            {ongoingSessions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Video className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Ongoing Sessions</h3>
                  <p className="text-muted-foreground text-center">
                    No live sessions are currently running.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ongoingSessions.map((session) => (
                  <Card key={session.id} className="hover:shadow-md transition-shadow border-green-200 dark:border-green-800">
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
                        <Button className="flex-1" onClick={() => joinSession(session)}>
                          <Video className="h-4 w-4 mr-2" />
                          Join Session
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(session)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastSessions.length === 0 ? (
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
                {pastSessions.map((session) => (
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
                            View Recording
                          </a>
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(session)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => openDeleteDialog(session)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Create Session Dialog */}
        <CreateSessionDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSave={handleCreateSession}
          mode="create"
        />

        {/* Edit Session Dialog */}
        <CreateSessionDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          session={selectedSession}
          onSave={handleEditSession}
          mode="edit"
        />

        {/* Delete Session Dialog */}
        <DeleteSessionDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          sessionTitle={sessionToDelete?.title || ''}
          onConfirm={handleDeleteSession}
        />
      </div>
    </>
  );
}
