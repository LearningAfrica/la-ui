import { useState } from 'react';
import { Bell, CalendarIcon, Clock } from 'lucide-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { NotificationsPanel } from '@/components/notifications/notifications-panel';

// Mock upcoming events
const upcomingEvents = [
	{
		id: '1',
		title: 'JavaScript Quiz',
		date: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
		type: 'assignment',
		course: 'Advanced JavaScript',
		color: '#3b82f6', // blue-500
	},
	{
		id: '2',
		title: 'Final Project Deadline',
		date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 1 day from now
		type: 'deadline',
		course: 'Web Development Bootcamp',
		color: '#ef4444', // red-500
	},
	{
		id: '3',
		title: 'React Hooks Workshop',
		date: new Date(new Date().getTime() + 45 * 60 * 1000), // 45 minutes from now
		type: 'liveSession',
		course: 'React Masterclass',
		color: '#22c55e', // green-500
	},
];

export function UpcomingNotifications() {
	const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] =
		useState(false);

	// Sort events by date (closest first)
	const sortedEvents = [...upcomingEvents].sort(
		(a, b) => a.date.getTime() - b.date.getTime(),
	);

	// Take only the first 3 events
	const nextEvents = sortedEvents.slice(0, 3);

	return (
		<>
			<Card>
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Upcoming Events</CardTitle>
							<CardDescription>Your next scheduled activities</CardDescription>
						</div>
						<Button
							variant="outline"
							size="icon"
							className="relative"
							onClick={() => setIsNotificationsPanelOpen(true)}
						>
							<Bell className="h-4 w-4" />
							<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
								{upcomingEvents.length}
							</span>
						</Button>
					</div>
				</CardHeader>
				<CardContent className="pb-2">
					<div className="space-y-3">
						{nextEvents.map((event) => (
							<div
								key={event.id}
								className="hover:bg-muted/50 flex items-start rounded-md p-2 transition-colors"
								style={{ borderLeft: `3px solid ${event.color}` }}
							>
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<h4 className="text-sm font-medium">{event.title}</h4>
									</div>
									<p className="text-muted-foreground mt-1 text-xs">
										{event.course}
									</p>
									<div className="mt-2 flex items-center gap-3">
										<div className="text-muted-foreground flex items-center gap-1 text-xs">
											<CalendarIcon className="h-3 w-3" />
											<span>{format(event.date, 'MMM d')}</span>
										</div>
										<div className="text-muted-foreground flex items-center gap-1 text-xs">
											<Clock className="h-3 w-3" />
											<span>{format(event.date, 'p')}</span>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
				<CardFooter>
					<Button
						variant="outline"
						size="sm"
						className="w-full"
						onClick={() => setIsNotificationsPanelOpen(true)}
					>
						View all notifications
					</Button>
				</CardFooter>
			</Card>

			<NotificationsPanel
				open={isNotificationsPanelOpen}
				onOpenChange={setIsNotificationsPanelOpen}
			/>
		</>
	);
}
