'use client';

import { useState } from 'react';
import {
	format,
	addDays,
	subDays,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	isSameMonth,
	isSameDay,
	parseISO,
} from 'date-fns';
import {
	CalendarIcon,
	ChevronLeft,
	ChevronRight,
	Plus,
	Filter,
	Download,
	MoreHorizontal,
	Users,
	BookOpen,
	GraduationCap,
	Bell,
} from 'lucide-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

// Mock data for calendar events
const initialEvents = [
	{
		id: '1',
		title: 'New Course Review',
		date: '2025-04-22T10:00:00',
		endDate: '2025-04-22T11:30:00',
		type: 'course',
		description: 'Review new JavaScript Fundamentals course submission',
		instructor: 'Alex Johnson',
	},
	{
		id: '2',
		title: 'Instructor Onboarding',
		date: '2025-04-23T14:00:00',
		endDate: '2025-04-23T15:00:00',
		type: 'instructor',
		description: 'Onboarding session for new instructors',
		instructor: 'Admin Team',
	},
	{
		id: '3',
		title: 'Platform Maintenance',
		date: '2025-04-25T08:00:00',
		endDate: '2025-04-25T12:00:00',
		type: 'system',
		description: 'Scheduled maintenance for platform updates',
		instructor: 'Tech Team',
	},
	{
		id: '4',
		title: 'Student Support Hours',
		date: '2025-04-21T13:00:00',
		endDate: '2025-04-21T15:00:00',
		type: 'student',
		description: 'Open office hours for student support',
		instructor: 'Support Team',
	},
	{
		id: '5',
		title: 'Content Review Meeting',
		date: '2025-04-24T11:00:00',
		endDate: '2025-04-24T12:30:00',
		type: 'course',
		description: 'Review content quality for recent courses',
		instructor: 'Quality Assurance Team',
	},
	{
		id: '6',
		title: 'New Feature Rollout',
		date: '2025-04-26T09:00:00',
		endDate: '2025-04-26T10:00:00',
		type: 'system',
		description: 'Rollout of new quiz feature',
		instructor: 'Product Team',
	},
	{
		id: '7',
		title: 'Instructor Performance Review',
		date: '2025-04-27T14:00:00',
		endDate: '2025-04-27T16:00:00',
		type: 'instructor',
		description: 'Quarterly performance review for instructors',
		instructor: 'Admin Team',
	},
];

// Event type configuration
const eventTypes = {
	course: {
		label: 'Course',
		color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
		icon: BookOpen,
	},
	instructor: {
		label: 'Instructor',
		color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
		icon: GraduationCap,
	},
	student: {
		label: 'Student',
		color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
		icon: Users,
	},
	system: {
		label: 'System',
		color:
			'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
		icon: Bell,
	},
};

export default function AdminCalendarPage() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [events, setEvents] = useState(initialEvents);
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date(),
	);
	const [view, setView] = useState('month');
	const [filteredTypes, setFilteredTypes] = useState<string[]>([]);
	const [isAddEventOpen, setIsAddEventOpen] = useState(false);
	const [newEvent, setNewEvent] = useState({
		title: '',
		date: format(new Date(), 'yyyy-MM-dd'),
		time: '10:00',
		endTime: '11:00',
		type: 'course',
		description: '',
		instructor: '',
	});

	// Filter events based on selected types
	const filteredEvents = events.filter((event) => {
		if (filteredTypes.length === 0) return true;
		return filteredTypes.includes(event.type);
	});

	// Get events for the selected date
	const eventsForSelectedDate = filteredEvents.filter((event) => {
		if (!selectedDate) return false;
		return isSameDay(parseISO(event.date), selectedDate);
	});

	// Handle navigation
	const goToPreviousMonth = () => {
		setCurrentDate((prev) =>
			subDays(prev, view === 'month' ? 30 : view === 'week' ? 7 : 1),
		);
	};

	const goToNextMonth = () => {
		setCurrentDate((prev) =>
			addDays(prev, view === 'month' ? 30 : view === 'week' ? 7 : 1),
		);
	};

	// Handle event type filtering
	const toggleEventTypeFilter = (type: string) => {
		setFilteredTypes((prev) => {
			if (prev.includes(type)) {
				return prev.filter((t) => t !== type);
			} else {
				return [...prev, type];
			}
		});
	};

	// Handle adding a new event
	const handleAddEvent = () => {
		const dateTimeString = `${newEvent.date}T${newEvent.time}:00`;
		const endDateTimeString = `${newEvent.date}T${newEvent.endTime}:00`;

		const event = {
			id: (events.length + 1).toString(),
			title: newEvent.title,
			date: dateTimeString,
			endDate: endDateTimeString,
			type: newEvent.type,
			description: newEvent.description,
			instructor: newEvent.instructor,
		};

		setEvents([...events, event]);
		setIsAddEventOpen(false);
		toast.success('Event added successfully');

		// Reset form
		setNewEvent({
			title: '',
			date: format(new Date(), 'yyyy-MM-dd'),
			time: '10:00',
			endTime: '11:00',
			type: 'course',
			description: '',
			instructor: '',
		});
	};

	// Generate days for the month view
	const monthStart = startOfMonth(currentDate);
	const monthEnd = endOfMonth(currentDate);
	const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

	// Get events for a specific day
	const getEventsForDay = (day: Date) => {
		return filteredEvents.filter((event) =>
			isSameDay(parseISO(event.date), day),
		);
	};

	return (
		<div className="flex-1 space-y-4 p-4 md:p-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
					<p className="text-muted-foreground">
						Manage events, schedules, and important dates
					</p>
				</div>
				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm">
								<Filter className="mr-2 h-4 w-4" />
								Filter
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>Filter by Event Type</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{Object.entries(eventTypes).map(
								([key, { label, icon: Icon }]) => (
									<DropdownMenuItem
										key={key}
										onSelect={(e) => e.preventDefault()}
									>
										<div className="flex items-center space-x-2">
											<Checkbox
												id={`filter-${key}`}
												checked={
													filteredTypes.includes(key) ||
													filteredTypes.length === 0
												}
												onCheckedChange={() => toggleEventTypeFilter(key)}
											/>
											<label
												htmlFor={`filter-${key}`}
												className="flex items-center text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												<Icon className="mr-2 h-4 w-4" />
												{label}
											</label>
										</div>
									</DropdownMenuItem>
								),
							)}
						</DropdownMenuContent>
					</DropdownMenu>

					<Button variant="outline" size="sm">
						<Download className="mr-2 h-4 w-4" />
						Export
					</Button>

					<Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
						<DialogTrigger asChild>
							<Button size="sm">
								<Plus className="mr-2 h-4 w-4" />
								Add Event
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[525px]">
							<DialogHeader>
								<DialogTitle>Add New Event</DialogTitle>
								<DialogDescription>
									Create a new event on the calendar.
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid gap-2">
									<Label htmlFor="title">Event Title</Label>
									<Input
										id="title"
										value={newEvent.title}
										onChange={(e) =>
											setNewEvent({ ...newEvent, title: e.target.value })
										}
										placeholder="Enter event title"
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="grid gap-2">
										<Label htmlFor="date">Date</Label>
										<Input
											id="date"
											type="date"
											value={newEvent.date}
											onChange={(e) =>
												setNewEvent({ ...newEvent, date: e.target.value })
											}
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="type">Event Type</Label>
										<Select
											value={newEvent.type}
											onValueChange={(value) =>
												setNewEvent({ ...newEvent, type: value })
											}
										>
											<SelectTrigger id="type">
												<SelectValue placeholder="Select event type" />
											</SelectTrigger>
											<SelectContent>
												{Object.entries(eventTypes).map(([key, { label }]) => (
													<SelectItem key={key} value={key}>
														{label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="grid gap-2">
										<Label htmlFor="time">Start Time</Label>
										<Input
											id="time"
											type="time"
											value={newEvent.time}
											onChange={(e) =>
												setNewEvent({ ...newEvent, time: e.target.value })
											}
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="endTime">End Time</Label>
										<Input
											id="endTime"
											type="time"
											value={newEvent.endTime}
											onChange={(e) =>
												setNewEvent({ ...newEvent, endTime: e.target.value })
											}
										/>
									</div>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="instructor">Responsible Person/Team</Label>
									<Input
										id="instructor"
										value={newEvent.instructor}
										onChange={(e) =>
											setNewEvent({ ...newEvent, instructor: e.target.value })
										}
										placeholder="Enter responsible person or team"
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="description">Description</Label>
									<Textarea
										id="description"
										value={newEvent.description}
										onChange={(e) =>
											setNewEvent({ ...newEvent, description: e.target.value })
										}
										placeholder="Enter event description"
									/>
								</div>
							</div>
							<DialogFooter>
								<Button
									variant="outline"
									onClick={() => setIsAddEventOpen(false)}
								>
									Cancel
								</Button>
								<Button onClick={handleAddEvent} disabled={!newEvent.title}>
									Add Event
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<Card className="col-span-2">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<div className="space-y-1">
							<CardTitle>Calendar</CardTitle>
							<CardDescription>
								{view === 'month'
									? format(currentDate, 'MMMM yyyy')
									: view === 'week'
										? `Week of ${format(currentDate, 'MMM d, yyyy')}`
										: format(currentDate, 'EEEE, MMMM d, yyyy')}
							</CardDescription>
						</div>
						<div className="flex items-center space-x-2">
							<Button variant="outline" size="icon" onClick={goToPreviousMonth}>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<Button variant="outline" size="icon" onClick={goToNextMonth}>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<Tabs value={view} onValueChange={setView} className="w-full">
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="month">Month</TabsTrigger>
								<TabsTrigger value="week">Week</TabsTrigger>
								<TabsTrigger value="day">Day</TabsTrigger>
							</TabsList>
							<TabsContent value="month" className="space-y-4">
								<div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
									{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
										(day) => (
											<div key={day} className="py-2">
												{day}
											</div>
										),
									)}
								</div>
								<div className="grid grid-cols-7 gap-1">
									{days.map((day, i) => {
										const dayEvents = getEventsForDay(day);
										return (
											<div
												key={i}
												className={`min-h-24 rounded-md border p-1 ${
													isSameMonth(day, currentDate)
														? 'bg-card'
														: 'bg-muted/50 text-muted-foreground'
												} ${selectedDate && isSameDay(day, selectedDate) ? 'ring-primary ring-2' : ''}`}
												onClick={() => setSelectedDate(day)}
											>
												<div className="flex justify-between">
													<span className="text-sm font-medium">
														{format(day, 'd')}
													</span>
													{dayEvents.length > 0 && (
														<Badge variant="outline" className="text-xs">
															{dayEvents.length}
														</Badge>
													)}
												</div>
												<div className="mt-1 space-y-1 overflow-hidden">
													{dayEvents.slice(0, 2).map((event) => {
														const eventType =
															eventTypes[event.type as keyof typeof eventTypes];
														return (
															<div
																key={event.id}
																className={`truncate rounded-sm px-1 py-0.5 text-xs ${eventType.color}`}
																title={event.title}
															>
																{format(parseISO(event.date), 'HH:mm')}{' '}
																{event.title}
															</div>
														);
													})}
													{dayEvents.length > 2 && (
														<div className="text-muted-foreground text-xs">
															+{dayEvents.length - 2} more
														</div>
													)}
												</div>
											</div>
										);
									})}
								</div>
							</TabsContent>
							<TabsContent value="week">
								<div className="space-y-2">
									{Array.from({ length: 7 }).map((_, i) => {
										const day = addDays(currentDate, i - 3); // Start from 3 days before current date
										const dayEvents = getEventsForDay(day);
										return (
											<div
												key={i}
												className={`rounded-md border p-2 ${
													selectedDate && isSameDay(day, selectedDate)
														? 'ring-primary ring-2'
														: ''
												}`}
												onClick={() => setSelectedDate(day)}
											>
												<div className="flex items-center justify-between">
													<h3 className="font-medium">
														{format(day, 'EEEE, MMMM d')}
													</h3>
													{dayEvents.length > 0 && (
														<Badge variant="outline">
															{dayEvents.length} events
														</Badge>
													)}
												</div>
												<div className="mt-2 space-y-2">
													{dayEvents.map((event) => {
														const eventType =
															eventTypes[event.type as keyof typeof eventTypes];
														const EventIcon = eventType.icon;
														return (
															<div
																key={event.id}
																className={`flex items-center rounded-md p-2 ${eventType.color}`}
															>
																<EventIcon className="mr-2 h-4 w-4" />
																<div className="flex-1">
																	<p className="font-medium">{event.title}</p>
																	<p className="text-xs">
																		{format(parseISO(event.date), 'h:mm a')} -{' '}
																		{format(parseISO(event.endDate), 'h:mm a')}
																	</p>
																</div>
															</div>
														);
													})}
													{dayEvents.length === 0 && (
														<p className="text-muted-foreground text-sm">
															No events scheduled
														</p>
													)}
												</div>
											</div>
										);
									})}
								</div>
							</TabsContent>
							<TabsContent value="day">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="text-lg font-medium">
											{format(currentDate, 'EEEE, MMMM d, yyyy')}
										</h3>
									</div>
									<div className="space-y-2">
										{Array.from({ length: 12 }).map((_, i) => {
											const hour = i + 8; // Start from 8 AM
											const hourEvents = filteredEvents.filter((event) => {
												const eventDate = parseISO(event.date);
												return (
													isSameDay(eventDate, currentDate) &&
													eventDate.getHours() === hour
												);
											});
											return (
												<div key={i} className="flex border-t pt-2">
													<div className="text-muted-foreground w-16 text-sm">
														{hour === 12
															? '12 PM'
															: hour < 12
																? `${hour} AM`
																: `${hour - 12} PM`}
													</div>
													<div className="flex-1 space-y-2">
														{hourEvents.map((event) => {
															const eventType =
																eventTypes[
																	event.type as keyof typeof eventTypes
																];
															const EventIcon = eventType.icon;
															return (
																<div
																	key={event.id}
																	className={`flex items-center rounded-md p-2 ${eventType.color}`}
																>
																	<EventIcon className="mr-2 h-4 w-4" />
																	<div className="flex-1">
																		<p className="font-medium">{event.title}</p>
																		<p className="text-xs">
																			{format(parseISO(event.date), 'h:mm a')} -{' '}
																			{format(
																				parseISO(event.endDate),
																				'h:mm a',
																			)}
																		</p>
																	</div>
																</div>
															);
														})}
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>

				<div className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Selected Date</CardTitle>
							<CardDescription>
								{selectedDate
									? format(selectedDate, 'EEEE, MMMM d, yyyy')
									: 'No date selected'}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Calendar
								mode="single"
								selected={selectedDate}
								onSelect={setSelectedDate}
								className="rounded-md border"
							/>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Events</CardTitle>
							<CardDescription>
								{selectedDate
									? `${eventsForSelectedDate.length} events on ${format(selectedDate, 'MMM d, yyyy')}`
									: 'Select a date to view events'}
							</CardDescription>
						</CardHeader>
						<CardContent>
							{eventsForSelectedDate.length > 0 ? (
								<div className="space-y-4">
									{eventsForSelectedDate.map((event) => {
										const eventType =
											eventTypes[event.type as keyof typeof eventTypes];
										const EventIcon = eventType.icon;
										return (
											<div key={event.id} className="space-y-2">
												<div className="flex items-center justify-between">
													<div className="flex items-center">
														<Badge className={eventType.color}>
															<EventIcon className="mr-1 h-3 w-3" />
															{eventType.label}
														</Badge>
													</div>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="sm"
																className="h-8 w-8 p-0"
															>
																<MoreHorizontal className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem>Edit</DropdownMenuItem>
															<DropdownMenuItem>Duplicate</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuItem className="text-destructive">
																Delete
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</div>
												<div>
													<h4 className="font-medium">{event.title}</h4>
													<div className="text-muted-foreground flex items-center text-sm">
														<CalendarIcon className="mr-1 h-3 w-3" />
														<span>
															{format(parseISO(event.date), 'h:mm a')} -{' '}
															{format(parseISO(event.endDate), 'h:mm a')}
														</span>
													</div>
												</div>
												{event.description && (
													<p className="text-muted-foreground text-sm">
														{event.description}
													</p>
												)}
												{event.instructor && (
													<div className="flex items-center text-sm">
														<Users className="mr-1 h-3 w-3" />
														<span>{event.instructor}</span>
													</div>
												)}
											</div>
										);
									})}
								</div>
							) : (
								<div className="flex flex-col items-center justify-center py-8 text-center">
									<CalendarIcon className="text-muted-foreground/50 h-12 w-12" />
									<h3 className="mt-4 text-lg font-medium">No events</h3>
									<p className="text-muted-foreground mt-2 text-sm">
										{selectedDate
											? 'No events scheduled for this date.'
											: 'Select a date to view events.'}
									</p>
									{selectedDate && (
										<Button
											onClick={() => setIsAddEventOpen(true)}
											variant="outline"
											className="mt-4"
										>
											<Plus className="mr-2 h-4 w-4" />
											Add Event
										</Button>
									)}
								</div>
							)}
						</CardContent>
						{eventsForSelectedDate.length > 0 && (
							<CardFooter>
								<Button
									onClick={() => setIsAddEventOpen(true)}
									variant="outline"
									className="w-full"
								>
									<Plus className="mr-2 h-4 w-4" />
									Add Event
								</Button>
							</CardFooter>
						)}
					</Card>
				</div>
			</div>
		</div>
	);
}
