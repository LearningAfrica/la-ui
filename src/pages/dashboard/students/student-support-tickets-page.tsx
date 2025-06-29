'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { ArrowLeft, PlusCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for tickets
const tickets = [
	{
		id: 'ticket-1',
		subject: 'Cannot access course videos',
		status: 'open',
		priority: 'high',
		category: 'Technical',
		date: '2023-09-15',
		lastUpdate: '2023-09-16',
	},
	{
		id: 'ticket-2',
		subject: 'Certificate not generating after course completion',
		status: 'closed',
		priority: 'medium',
		category: 'Certificate',
		date: '2023-09-10',
		lastUpdate: '2023-09-12',
	},
	{
		id: 'ticket-3',
		subject: 'Billing question about subscription',
		status: 'in-progress',
		priority: 'low',
		category: 'Billing',
		date: '2023-09-05',
		lastUpdate: '2023-09-07',
	},
	{
		id: 'ticket-4',
		subject: 'Course content is outdated',
		status: 'open',
		priority: 'medium',
		category: 'Content',
		date: '2023-09-03',
		lastUpdate: '2023-09-04',
	},
	{
		id: 'ticket-5',
		subject: 'Need help with course assignment',
		status: 'open',
		priority: 'high',
		category: 'Content',
		date: '2023-09-01',
		lastUpdate: '2023-09-01',
	},
];

export default function StudentSupportTicketsPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [priorityFilter, setPriorityFilter] = useState('all');

	// Filter tickets based on search query and filters
	const filteredTickets = tickets.filter((ticket) => {
		const matchesSearch =
			ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
			ticket.category.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesStatus =
			statusFilter === 'all' || ticket.status === statusFilter;
		const matchesPriority =
			priorityFilter === 'all' || ticket.priority === priorityFilter;

		return matchesSearch && matchesStatus && matchesPriority;
	});

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="sm" asChild>
					<Link to="/dashboard/student/support">
						<ArrowLeft className="mr-1 h-4 w-4" />
						Back to Support
					</Link>
				</Button>
			</div>

			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						My Support Tickets
					</h1>
					<p className="text-muted-foreground">
						View and manage your support requests
					</p>
				</div>
				<Button asChild>
					<Link to="/dashboard/student/support/tickets/create">
						<PlusCircle className="mr-2 h-4 w-4" />
						Create New Ticket
					</Link>
				</Button>
			</div>

			<Card>
				<CardHeader className="pb-3">
					<CardTitle>Tickets</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4 md:flex-row md:items-center">
						<div className="relative flex-1">
							<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
							<Input
								placeholder="Search tickets..."
								className="pl-10"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<div className="flex gap-4">
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Filter by status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Statuses</SelectItem>
									<SelectItem value="open">Open</SelectItem>
									<SelectItem value="in-progress">In Progress</SelectItem>
									<SelectItem value="closed">Closed</SelectItem>
								</SelectContent>
							</Select>
							<Select value={priorityFilter} onValueChange={setPriorityFilter}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Filter by priority" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Priorities</SelectItem>
									<SelectItem value="low">Low</SelectItem>
									<SelectItem value="medium">Medium</SelectItem>
									<SelectItem value="high">High</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="mt-6 rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Subject</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Priority</TableHead>
									<TableHead>Category</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Last Update</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredTickets.length === 0 ? (
									<TableRow>
										<TableCell colSpan={7} className="h-24 text-center">
											No tickets found.
										</TableCell>
									</TableRow>
								) : (
									filteredTickets.map((ticket) => (
										<TableRow key={ticket.id}>
											<TableCell className="font-medium">
												{ticket.subject}
											</TableCell>
											<TableCell>
												<Badge
													variant={
														ticket.status === 'open'
															? 'default'
															: ticket.status === 'in-progress'
																? 'outline'
																: 'secondary'
													}
												>
													{ticket.status === 'open'
														? 'Open'
														: ticket.status === 'in-progress'
															? 'In Progress'
															: 'Closed'}
												</Badge>
											</TableCell>
											<TableCell>
												<Badge
													variant="outline"
													className={
														ticket.priority === 'high'
															? 'border-red-500 text-red-500'
															: ticket.priority === 'medium'
																? 'border-yellow-500 text-yellow-500'
																: 'border-green-500 text-green-500'
													}
												>
													{ticket.priority.charAt(0).toUpperCase() +
														ticket.priority.slice(1)}
												</Badge>
											</TableCell>
											<TableCell>{ticket.category}</TableCell>
											<TableCell>{ticket.date}</TableCell>
											<TableCell>{ticket.lastUpdate}</TableCell>
											<TableCell className="text-right">
												<Button variant="ghost" size="sm" asChild>
													<Link
														to={`/dashboard/student/support/tickets/${ticket.id}`}
													>
														View
													</Link>
												</Button>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
