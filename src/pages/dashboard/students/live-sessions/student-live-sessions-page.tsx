import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, Video, ExternalLink } from 'lucide-react';
import { mockLiveSessions, getSessionsByStatus, formatDate, getStatusBadgeVariant } from '@/lib/data/live-sessions-data';
import type { LiveSession } from '@/lib/types/live-session';

export default function StudentLiveSessionsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();

  const getStatusBadge = (status: LiveSession['status']) => {
    return <Badge className={getStatusBadgeVariant(status)}>{status}</Badge>;
  };

  const joinSession = (session: LiveSession) => {
    navigate(`/dashboard/student/meeting/${session.id}`, {
      state: { session }
    });
  };

  const upcomingSessions = getSessionsByStatus(mockLiveSessions, 'upcoming');
  const pastSessions = getSessionsByStatus(mockLiveSessions, 'completed');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Live Sessions</h1>
        <p className="text-muted-foreground">
          Join live learning sessions with instructors and fellow students
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="past">Past Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Video className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Upcoming Sessions</h3>
                <p className="text-muted-foreground text-center">
                  No upcoming live sessions scheduled. Check back later for new sessions.
                </p>
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
                        <span>{session.participants}/{session.max_participants} participants</span>
                      </div>
                    </div>

                    <Button className="w-full" onClick={() => joinSession(session)}>
                      <Video className="h-4 w-4 mr-2" />
                      Join Session
                    </Button>
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
                        <span>{session.participants}/{session.max_participants} participants</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full" asChild>
                      <a href={session.recordingLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Recording
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
