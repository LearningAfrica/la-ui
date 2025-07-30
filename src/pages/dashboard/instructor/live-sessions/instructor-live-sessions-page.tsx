import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, Video, ExternalLink, Plus, Edit, Trash2 } from 'lucide-react';
import { CreateSessionDialog } from '@/components/live-sessions/create-session-dialog';
import { DeleteSessionDialog } from '@/components/live-sessions/delete-session-dialog';
import { mockLiveSessions, getSessionsByStatus, formatDate, getStatusBadgeVariant } from '@/lib/data/live-sessions-data';
import type { LiveSession, CreateSessionData } from '@/lib/types/live-session';

export default function InstructorLiveSessionsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [sessions, setSessions] = useState<LiveSession[]>(mockLiveSessions);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<LiveSession | null>(null);

  const navigate = useNavigate();

  // Simple toast implementation
  const toast = ({ title, description }: { title: string; description: string }) => {
    console.log(`Toast: ${title} - ${description}`);
    // In a real app, this would show a toast notification
  };

  const getStatusBadge = (status: LiveSession['status']) => {
    return <Badge className={getStatusBadgeVariant(status)}>{status}</Badge>;
  };

  const handleCreateSession = (sessionData: CreateSessionData) => {
    const newSession: LiveSession = {
      ...sessionData,
      id: Date.now().toString(), // Simple ID generation
      status: 'upcoming',
      participants: 0,
      instructor: 'Current Instructor', // Default instructor for instructor-created sessions
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

  const joinSession = (session: LiveSession) => {
    navigate(`/dashboard/instructor/meeting/${session.id}`, {
      state: { session }
    });
  };

  const upcomingSessions = getSessionsByStatus(sessions, 'upcoming');
  const ongoingSessions = getSessionsByStatus(sessions, 'ongoing');
  const pastSessions = getSessionsByStatus(sessions, 'completed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Live Sessions</h1>
          <p className="text-muted-foreground">
            Manage and host your live learning sessions
          </p>
        </div>
        <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Session
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Video className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Upcoming Sessions</h3>
                <p className="text-muted-foreground text-center">
                  No upcoming live sessions scheduled. Create your first session to get started.
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
                        Start Session
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
  );
}
