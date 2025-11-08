import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Maximize2, Minimize2, ArrowLeft, Users, Clock, Calendar } from 'lucide-react';
import { convertToEmbedUrl, formatDate, getStatusBadgeVariant } from '@/lib/data/live-sessions-data';
import { useSession } from '@/lib/features/live-sessions/queries';
import type { LiveSession } from '@/lib/types/live-session';

export default function AdminMeetingPage() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Use TanStack Query to fetch session data
  const {
    data: session,
    isLoading,
    error,
    isError,
  } = useSession(meetingId || '');

  const getStatusBadge = (status: LiveSession['status']) => {
    return <Badge className={getStatusBadgeVariant(status)}>{status}</Badge>;
  };

  const handleBack = () => {
    navigate('/dashboard/admin/live-sessions');
  };

  // Format date and time from session.start_time
  const formatDateTime = (startTime: string) => {
    const date = new Date(startTime);
    return {
      date: formatDate(startTime),
      time: date.toTimeString().slice(0, 5), // HH:MM format
    };
  };

  const getInstructorName = (session: LiveSession) => {
    return `${session.host.first_name} ${session.host.last_name}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Loading Meeting...</h2>
          <p className="text-muted-foreground">Please wait while we prepare your session.</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Video className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Error Loading Meeting</h2>
          <p className="text-muted-foreground mb-4">
            {error?.message || 'Failed to load meeting details. Please try again.'}
          </p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sessions
          </Button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Meeting Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requested meeting could not be found.
          </p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sessions
          </Button>
        </div>
      </div>
    );
  }

  const { date, time } = formatDateTime(session.start_time);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sessions
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{session.topic}</h1>
            <p className="text-muted-foreground">Meeting • {getInstructorName(session)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(session.status)}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullScreen(!isFullScreen)}
          >
            {isFullScreen ? (
              <>
                <Minimize2 className="h-4 w-4 mr-2" />
                Exit Full Screen
              </>
            ) : (
              <>
                <Maximize2 className="h-4 w-4 mr-2" />
                Full Screen
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Session Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Session Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{time} ({session.duration} min)</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Meeting participants</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meeting Container */}
      <div className={`border border-border rounded-lg overflow-hidden ${isFullScreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
        {isFullScreen && (
          <div className="flex items-center justify-between p-4 border-b border-border bg-card">
            <div className="flex items-center gap-3">
              <Video className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">{session.topic}</h2>
                <p className="text-sm text-muted-foreground">Meeting • {getInstructorName(session)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsFullScreen(false)}>
                <Minimize2 className="h-4 w-4 mr-2" />
                Exit Full Screen
              </Button>
              <Button variant="outline" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className={`${isFullScreen ? 'h-[calc(100vh-80px)]' : 'h-[600px]'}`}>
          <iframe
            src={convertToEmbedUrl(session.join_url)}
            className="w-full h-full border-0"
            allow="camera; microphone; fullscreen; speaker; display-capture"
            allowFullScreen
          />
        </div>
      </div>

      {/* Instructions */}
      {!isFullScreen && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-2">Meeting Instructions</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• As an admin, you can monitor and join any session across the platform</li>
              <li>• Use the full-screen option for the best viewing experience</li>
              <li>• You can manage session settings and participant access</li>
              <li>• Contact the instructor if you need to make any changes</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
