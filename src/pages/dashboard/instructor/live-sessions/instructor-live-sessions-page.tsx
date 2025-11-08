import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Plus } from 'lucide-react';
import { CreateSessionDialog } from '@/components/live-sessions/create-session-dialog';
import { DeleteSessionDialog } from '@/components/live-sessions/delete-session-dialog';
import { CallCard } from '@/components/live-sessions/call-card';
import {
  useDeleteSession,
  type LiveSession,
  useLiveSessions,
} from '@/lib/features/live-sessions';
import { toast } from 'sonner';

export default function InstructorLiveSessionsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const {
    data: allSessions = [],
    isLoading,
    error,
    isError,
  } = useLiveSessions();

  // TanStack Query mutations
  const deleteSessionMutation = useDeleteSession();

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(
    null,
  );
  const [sessionToDelete, setSessionToDelete] = useState<LiveSession | null>(
    null,
  );

  const navigate = useNavigate();

  // Filter sessions by status
  const upcomingSessions = allSessions.filter(session => session.status === 'upcoming');
  const ongoingSessions = allSessions.filter(session => session.status === 'ongoing');
  const pastSessions = allSessions.filter(session => session.status === 'past');

  const handleDeleteSession = () => {
    if (!sessionToDelete) return;

    deleteSessionMutation.mutate(sessionToDelete.id, {
      onSuccess: () => {
        toast.success('Session Deleted', {
          description: `"${sessionToDelete.topic}" has been successfully deleted.`,
        });
        setDeleteDialogOpen(false);
        setSessionToDelete(null);
      },
      onError: (error) => {
        toast.error('Error', {
          description: `Failed to delete session: ${error.message}`,
        });
      },
    });
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
      state: { session },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold">
            My Live Sessions
          </h1>
          <p className="text-muted-foreground">
            Manage and host your live learning sessions
          </p>
        </div>
        <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Session
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                <p className="text-muted-foreground">
                  Loading upcoming sessions...
                </p>
              </CardContent>
            </Card>
          ) : isError ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="mb-4 h-12 w-12 text-red-500">⚠️</div>
                <p className="text-red-500">Error loading sessions</p>
                <p className="text-muted-foreground text-sm">{error.message}</p>
              </CardContent>
            </Card>
          ) : upcomingSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Video className="text-muted-foreground mb-4 h-12 w-12" />
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No Upcoming Sessions
                </h3>
                <p className="text-muted-foreground text-center">
                  No upcoming live sessions scheduled. Create your first session
                  to get started.
                </p>
                <Button
                  className="mt-4 gap-2"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Create First Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingSessions.map((session) => (
                <CallCard
                  key={session.id}
                  session={session}
                  onJoinSession={joinSession}
                  onEditSession={openEditDialog}
                  showInstructor={false}
                  showCourse={false}
                  showParticipantCount={false}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ongoing" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-green-600"></div>
                <p className="text-muted-foreground">
                  Loading ongoing sessions...
                </p>
              </CardContent>
            </Card>
          ) : isError ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="mb-4 h-12 w-12 text-red-500">⚠️</div>
                <p className="text-red-500">Error loading sessions</p>
                <p className="text-muted-foreground text-sm">{error.message}</p>
              </CardContent>
            </Card>
          ) : allSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Video className="text-muted-foreground mb-4 h-12 w-12" />
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No Ongoing Sessions
                </h3>
                <p className="text-muted-foreground text-center">
                  No live sessions are currently running.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ongoingSessions.map((session) => (
                <CallCard
                  key={session.id}
                  session={session}
                  onJoinSession={joinSession}
                  onEditSession={openEditDialog}
                  showInstructor={false}
                  showCourse={false}
                  showParticipantCount={false}
                  variant="highlighted"
                  joinButtonText="Join Session"
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-600"></div>
                <p className="text-muted-foreground">
                  Loading past sessions...
                </p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="mb-4 h-12 w-12 text-red-500">⚠️</div>
                <p className="text-red-500">Error loading sessions</p>
                <p className="text-muted-foreground text-sm">{error.message}</p>
              </CardContent>
            </Card>
          ) : pastSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Video className="text-muted-foreground mb-4 h-12 w-12" />
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No Past Sessions
                </h3>
                <p className="text-muted-foreground text-center">
                  No completed live sessions found.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastSessions.map((session) => (
                <CallCard
                  key={session.id}
                  session={session}
                  onJoinSession={joinSession}
                  onEditSession={openEditDialog}
                  onDeleteSession={openDeleteDialog}
                  showInstructor={false}
                  showCourse={false}
                  showParticipantCount={false}
                  joinButtonText="View Recording"
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Session Dialog */}
      <CreateSessionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        mode="create"
      />

      {/* Edit Session Dialog */}
      <CreateSessionDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        session={selectedSession}
        mode="edit"
      />

      {/* Delete Session Dialog */}
      <DeleteSessionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        sessionTitle={sessionToDelete?.topic || ''}
        onConfirm={handleDeleteSession}
      />
    </div>
  );
}
