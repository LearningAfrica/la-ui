import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Video, Plus, BarChart3, TrendingUp } from 'lucide-react';
import { CreateSessionDialog } from '@/components/live-sessions/create-session-dialog';
import { DeleteSessionDialog } from '@/components/live-sessions/delete-session-dialog';
import { CallCard } from '@/components/live-sessions/call-card';
import {
  useUpcomingSessions,
  useOngoingSessions,
  usePastSessions,
} from '@/lib/features/live-sessions/queries';
import { useDeleteSession } from '@/lib/features/live-sessions/mutations';
import type { LiveSession } from '@/lib/types/live-session';
import { toast } from 'sonner';

export default function AdminLiveSessionsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // TanStack Query hooks for data fetching
  const { data: upcomingSessions = [] } = useUpcomingSessions();
  const { data: ongoingSessions = [] } = useOngoingSessions();
  const { data: pastSessions = [] } = usePastSessions();
  const deleteSessionMutation = useDeleteSession();

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<LiveSession | null>(null);

  const navigate = useNavigate();

  // Simple toast implementation is now handled by the dialog internally
  const handleDeleteSession = () => {
    if (!sessionToDelete) return;

    deleteSessionMutation.mutate(sessionToDelete.id, {
      onSuccess: () => {
        toast.success("Session Deleted", {
          description: `"${sessionToDelete.topic}" has been successfully deleted.`,
        });
        setDeleteDialogOpen(false);
        setSessionToDelete(null);
      },
      onError: (error) => {
        toast.error("Error", {
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
    navigate(`/dashboard/admin/meeting/${session.id}`, {
      state: { session }
    });
  };

  // Combine all sessions for calculations
  const allSessions = [...upcomingSessions, ...ongoingSessions, ...pastSessions];
  const totalSessions = allSessions.length;
  const totalParticipants = 0; // Participant count not available in current LiveSession type
  const avgAttendance = 0; // Will be 0 until participant data is available

  return (
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
            {allSessions
              .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
              .slice(0, 6)
              .map((session) => (
                <CallCard
                  key={session.id}
                  session={session}
                  onJoinSession={joinSession}
                  onEditSession={openEditDialog}
                  showInstructor={true}
                  showCourse={true}
                  showParticipantCount={true}
                />
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
                <CallCard
                  key={session.id}
                  session={session}
                  onJoinSession={joinSession}
                  onEditSession={openEditDialog}
                  showInstructor={true}
                  showCourse={true}
                  showParticipantCount={true}
                  joinButtonText="Join Session"
                />
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
                <CallCard
                  key={session.id}
                  session={session}
                  onJoinSession={joinSession}
                  onEditSession={openEditDialog}
                  showInstructor={true}
                  showCourse={true}
                  showParticipantCount={true}
                  variant="highlighted"
                  joinButtonText="Join Session"
                />
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
                <CallCard
                  key={session.id}
                  session={session}
                  onJoinSession={joinSession}
                  onEditSession={openEditDialog}
                  onDeleteSession={openDeleteDialog}
                  showInstructor={true}
                  showCourse={true}
                  showParticipantCount={true}
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
