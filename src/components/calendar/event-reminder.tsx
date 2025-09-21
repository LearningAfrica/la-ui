import { useState } from 'react';
import { format } from 'date-fns';
import { Bell, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EventReminderProps {
  id: string;
  title: string;
  date: Date;
  _type: string;
  course: string;
  color: string;
  location?: string;
  _onDismiss: (id: string) => void;
  onSnooze: (id: string) => void;
}

export function EventReminder({
  id,
  title,
  date,
  course,
  color,
  location,
  onSnooze,
}: EventReminderProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine how soon the event is
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  // Create message based on time remaining
  const getTimeMessage = () => {
    if (diffHours < 0 || diffMinutes < 0) return 'Happening now';
    if (diffHours === 0) {
      return `In ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
    }
    if (diffHours < 24) {
      return `In ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    }
    return `On ${format(date, 'MMM d')}`;
  };

  return (
    <Card
      className={cn('mb-3 border-l-4 transition-all duration-200', {
        'scale-[1.02]': isHovered,
      })}
      style={{ borderLeftColor: color }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Bell className="text-muted-foreground mt-0.5 h-5 w-5" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{title}</h4>
              </div>
              <p className="text-muted-foreground mt-1 text-sm">{course}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Calendar className="h-3 w-3" />
                  <span>{format(date, 'PPP')}</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>{format(date, 'p')}</span>
                </div>
                {location && (
                  <div className="text-muted-foreground flex items-center gap-1 text-xs">
                    <MapPin className="h-3 w-3" />
                    <span>{location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="bg-muted rounded-md px-2 py-1 text-xs font-medium">
            {getTimeMessage()}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onSnooze(id)}>
              Snooze
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-opacity-90"
              style={{ backgroundColor: color }}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
