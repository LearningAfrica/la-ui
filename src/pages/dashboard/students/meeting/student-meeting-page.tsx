import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Maximize2, Minimize2, ArrowLeft, Users, Clock, Calendar } from 'lucide-react';
import { convertToEmbedUrl, formatDate, getStatusBadgeVariant, getSessionById, mockLiveSessions } from '@/lib/data/live-sessions-data';
import type { LiveSession } from '@/lib/types/live-session';

export default function StudentMeetingPage() {
  const { meetingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [session, setSession] = useState<LiveSession | null>(null);

  useEffect(() => {
    if (location.state?.session) {
      setSession(location.state.session);
    } else {
      // Fallback to mock data if state is not available (e.g., direct URL access)
      const fallbackSession = getSessionById(mockLiveSessions, meetingId || '1');
      if (fallbackSession) {
        setSession(fallbackSession);
      } else {
        // Create a default session if not found
        const defaultSession: LiveSession = {
          id: meetingId || '1',
          title: 'Advanced JavaScript Concepts',
          instructor: 'Dr. Sarah Johnson',
          course: 'JavaScript Fundamentals',
          date: '2024-01-15',
          time: '14:00',
          duration: '90 minutes',
          status: 'upcoming',
          participants: 12,
          maxParticipants: 20,
          meetingLink: 'https://zoom.us/j/1234567890?pwd=abcdefghijklmnop'
        };
        setSession(defaultSession);
      }
    }
  }, [meetingId, location.state]);

  const getStatusBadge = (status: LiveSession['status']) => {
    return <Badge className={getStatusBadgeVariant(status)}>{status}</Badge>;
  };

  const handleBack = () => {
    navigate('/dashboard/student/live-sessions');
  };

  if (!session) {
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
            <h1 className="text-2xl font-bold text-foreground">{session.title}</h1>
            <p className="text-muted-foreground">{session.course} • {session.instructor}</p>
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
              <span className="text-sm">{formatDate(session.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{session.time} ({session.duration})</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{session.participants}/{session.maxParticipants} participants</span>
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
                <h2 className="text-lg font-semibold text-foreground">{session.title}</h2>
                <p className="text-sm text-muted-foreground">{session.course} • {session.instructor}</p>
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
            src={convertToEmbedUrl(session.meetingLink!)}
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
              <li>• Make sure your camera and microphone are working properly</li>
              <li>• Join the meeting a few minutes early to test your audio</li>
              <li>• Use the full-screen option for the best viewing experience</li>
              <li>• If you have technical issues, contact your instructor</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
