import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building, Plus, Search, Settings, Users } from 'lucide-react';
import { useOrganization } from '@/hooks/use-organizations';
import { Link } from 'react-router-dom';

export default function OrganizationsPage() {
	const { organizations, createOrganization, getCurrentUserRole } =
		useOrganization();
	const [searchQuery, setSearchQuery] = useState('');
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [newOrgName, setNewOrgName] = useState('');
	const [newOrgDescription, setNewOrgDescription] = useState('');
	const [isCreating, setIsCreating] = useState(false);

	const userRole = getCurrentUserRole();
	const canManageOrganizations =
		userRole === 'superAdmin' || userRole === 'admin';
	console.log('userRole:', userRole);

	const filteredOrganizations = organizations.filter(
		(org) =>
			org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			org.description?.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleCreateOrganization = async () => {
		if (!newOrgName.trim()) return;

		setIsCreating(true);
		try {
			await createOrganization({
				name: newOrgName,
				description: newOrgDescription,
			});
			setNewOrgName('');
			setNewOrgDescription('');
			setShowCreateDialog(false);
		} catch (error) {
			console.error('Failed to create organization:', error);
		} finally {
			setIsCreating(false);
		}
	};

	if (!canManageOrganizations) {
		return (
			<div className="flex-1 space-y-6 p-6 md:p-8">
				<div className="py-12 text-center">
					<Building className="text-muted-foreground/50 mx-auto h-12 w-12" />
					<h3 className="mt-4 text-lg font-medium">Access Denied</h3>
					<p className="text-muted-foreground mt-2 text-sm">
						You don't have permission to manage organizations.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
					<p className="text-muted-foreground">
						Manage organizations and their settings across the platform.
					</p>
				</div>
				<Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Create Organization
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create New Organization</DialogTitle>
							<DialogDescription>
								Create a new organization to manage courses and users.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-2 pb-4">
							<div className="space-y-2">
								<Label htmlFor="org-name">Organization Name</Label>
								<Input
									id="org-name"
									placeholder="Enter organization name"
									value={newOrgName}
									onChange={(e) => setNewOrgName(e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="org-description">Description (optional)</Label>
								<Textarea
									id="org-description"
									placeholder="Enter organization description"
									value={newOrgDescription}
									onChange={(e) => setNewOrgDescription(e.target.value)}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setShowCreateDialog(false)}
							>
								Cancel
							</Button>
							<Button
								onClick={handleCreateOrganization}
								disabled={!newOrgName.trim() || isCreating}
							>
								{isCreating ? 'Creating...' : 'Create Organization'}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			{/* Search */}
			<Card>
				<CardContent className="p-6">
					<div className="relative">
						<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
						<Input
							placeholder="Search organizations..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Organizations Table */}
			<Card>
				<CardHeader>
					<CardTitle>All Organizations</CardTitle>
					<CardDescription>
						{filteredOrganizations.length} of {organizations.length}{' '}
						organizations
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Organization</TableHead>
								<TableHead>Members</TableHead>
								<TableHead>Domain</TableHead>
								<TableHead>Created</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredOrganizations.map((org) => (
								<TableRow key={org.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar className="h-8 w-8">
												<AvatarImage
													src={org.logo || '/placeholder.svg'}
													alt={org.name}
												/>
												<AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
											</Avatar>
											<div>
												<div className="font-medium">{org.name}</div>
												{org.description && (
													<div className="text-muted-foreground line-clamp-1 text-sm">
														{org.description}
													</div>
												)}
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1">
											<Users className="text-muted-foreground h-4 w-4" />
											{org.memberCount}
										</div>
									</TableCell>
									<TableCell>
										{org.domain ? (
											<Badge variant="secondary">{org.domain}</Badge>
										) : (
											<span className="text-muted-foreground">-</span>
										)}
									</TableCell>
									<TableCell>
										{new Date(org.createdAt).toLocaleDateString()}
									</TableCell>
									<TableCell>
										<Badge variant="default">Active</Badge>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex items-center justify-end gap-2">
											<Button variant="ghost" size="sm" asChild>
												<Link to={`/dashboard/admin/organizations/${org.id}`}>
													View
												</Link>
											</Button>
											<Button variant="ghost" size="sm" asChild>
												<Link
													to={`/dashboard/admin/organizations/${org.id}/settings`}
												>
													<Settings className="h-4 w-4" />
												</Link>
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
