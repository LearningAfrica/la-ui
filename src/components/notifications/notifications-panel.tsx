import { Bell, CheckCircle, AlertCircle, Info, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: string;
  isRead: boolean;
  avatar?: string;
  username?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Course Completed',
    message: 'Congratulations! You have completed "JavaScript Fundamentals"',
    type: 'success',
    timestamp: '2 minutes ago',
    isRead: false,
    username: 'John Doe',
    avatar: 'JD'
  },
  {
    id: '2',
    title: 'New Assignment',
    message: 'A new assignment has been posted for "React Development"',
    type: 'info',
    timestamp: '1 hour ago',
    isRead: false,
    username: 'Sarah Wilson',
    avatar: 'SW'
  },
  {
    id: '3',
    title: 'Deadline Reminder',
    message: 'Your project submission is due in 2 days',
    type: 'warning',
    timestamp: '3 hours ago',
    isRead: true,
    username: 'Mike Johnson',
    avatar: 'MJ'
  },
  {
    id: '4',
    title: 'Achievement Unlocked',
    message: 'You earned the "First Course Complete" badge!',
    type: 'success',
    timestamp: '1 day ago',
    isRead: true,
    username: 'Learning Africa',
    avatar: 'LA'
  },
  {
    id: '5',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight at 2 AM',
    type: 'info',
    timestamp: '2 days ago',
    isRead: true,
    username: 'System',
    avatar: 'S'
  }
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'info':
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

const getNotificationBadgeColor = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'info':
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  }
};

export function NotificationsPanel() {
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end" forceMount>
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <DropdownMenuLabel className="text-base font-semibold">
              Notifications
            </DropdownMenuLabel>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {mockNotifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm">No notifications yet</p>
              <p className="text-xs">We'll notify you when something important happens</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "px-4 py-3 hover:bg-accent transition-colors cursor-pointer group",
                    !notification.isRead && "bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="text-xs bg-muted">
                        {notification.avatar}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getNotificationIcon(notification.type)}
                            <p className="text-sm font-medium text-foreground truncate">
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-muted-foreground">
                              {notification.timestamp}
                            </p>
                            <Badge
                              variant="secondary"
                              className={cn("text-xs", getNotificationBadgeColor(notification.type))}
                            >
                              {notification.type}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {mockNotifications.length > 0 && (
          <DropdownMenuSeparator />
        )}

        <div className="px-4 py-2 border-t border-border">
          <DropdownMenuItem className="text-center text-sm text-muted-foreground hover:text-foreground">
            View all notifications
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
