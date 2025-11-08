import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Video, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { formatDate, getStatusBadgeVariant } from '@/lib/data/live-sessions-data';
import type { LiveSession } from '@/lib/types/live-session';

interface CallCardProps {
  session: LiveSession;
  onJoinSession?: (session: LiveSession) => void;
  onEditSession?: (session: LiveSession) => void;
  onDeleteSession?: (session: LiveSession) => void;
  showInstructor?: boolean;
  showCourse?: boolean;
  showParticipantCount?: boolean;
  className?: string;
  joinButtonText?: string;
  variant?: 'default' | 'highlighted';
}

export function CallCard({
  session,
  onJoinSession,
  onEditSession,
  onDeleteSession,
  showInstructor = false,
  showCourse = false,
  showParticipantCount = true,
  className = '',
  joinButtonText,
  variant = 'default',
}: CallCardProps) {
  const getStatusBadge = (status: LiveSession['status']) => {
    return <Badge className={getStatusBadgeVariant(status)}>{status}</Badge>;
  };

  const getJoinButtonText = () => {
    if (joinButtonText) return joinButtonText;

    switch (session.status) {
      case 'ongoing':
        return 'Join Session';
      case 'upcoming':
        return 'Start Session';
      case 'past':
        return 'View Recording';
      default:
        return 'Join Session';
    }
  };

  const getJoinButtonIcon = () => {
    switch (session.status) {
      case 'past':
        return <ExternalLink className="h-4 w-4 mr-2" />;
      default:
        return <Video className="h-4 w-4 mr-2" />;
    }
  };

  const shouldShowJoinButton = () => {
    return true
    // Always show for ongoing sessions
    if (session.status === 'ongoing') return true;

    // Show for upcoming sessions if there's a join action
    if (session.status === 'upcoming' && onJoinSession) return true;

    // Show for past sessions if there's a join action (for recordings)
    if (session.status === 'past' && onJoinSession) return true;

    return false;
  };

  const shouldShowEditButton = () => {
    // Allow editing of upcoming and ongoing sessions
    return (session.status === 'upcoming' || session.status === 'ongoing') && onEditSession;
  };

  const shouldShowDeleteButton = () => {
    // Allow deletion of past sessions or admin deletion of any session
    return onDeleteSession && (session.status === 'past' || showInstructor);
  };

  const handleJoinClick = () => {
    if (onJoinSession) {
      onJoinSession(session);
    }
  };

  const cardClassName = `transition-shadow hover:shadow-md ${
    variant === 'highlighted' && session.status === 'ongoing'
      ? 'border-green-200 dark:border-green-800'
      : ''
  } ${className}`;

  // Format date and time - handle both old and new data formats
  const formatDateTime = () => {
    // New format with start_time field
    if (session.start_time) {
      const startTime = new Date(session.start_time);
      return {
        date: formatDate(startTime.toISOString()),
        time: `${startTime.toTimeString().slice(0, 5)} (${session.duration} min)`,
      };
    }

    // Fallback
    return {
      date: 'Unknown date',
      time: 'Unknown time',
    };
  };

  const { date, time } = formatDateTime();

  // Format participant count
  const getParticipantText = () => {
    if (!showParticipantCount) return 'Participants';

    // For now, just return generic text since participant count isn't in the current LiveSession type
    return 'Participants';
  };

  return (
    <Card className={cardClassName}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              {session.topic}
            </CardTitle>
            {showCourse && 'course' in session && (
              <CardDescription>{session.course as string}</CardDescription>
            )}
            {showInstructor && (
              <p className="text-xs text-muted-foreground">
                {session.host?.first_name} {session.host?.last_name}
              </p>
            )}
          </div>
          {getStatusBadge(session.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{getParticipantText()}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {shouldShowJoinButton() && (
            <Button
              variant={session.status === 'ongoing' ? 'default' : 'outline'}
              className="flex-1"
              onClick={handleJoinClick}
            >
              {getJoinButtonIcon()}
              {getJoinButtonText()}
            </Button>
          )}

          {shouldShowEditButton() && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEditSession!(session)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}

          {shouldShowDeleteButton() && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDeleteSession!(session)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
