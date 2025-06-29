import { Share2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface EventSharingInfoProps {
	sharedWith: {
		id: string;
		name: string;
		image?: string;
		status: 'accepted' | 'pending' | 'declined';
	}[];
	onManageSharing: () => void;
}

export function EventSharingInfo({
	sharedWith,
	onManageSharing,
}: EventSharingInfoProps) {
	if (!sharedWith || sharedWith.length === 0) {
		return null;
	}

	const acceptedCount = sharedWith.filter(
		(person) => person.status === 'accepted',
	).length;
	const pendingCount = sharedWith.filter(
		(person) => person.status === 'pending',
	).length;
	const declinedCount = sharedWith.filter(
		(person) => person.status === 'declined',
	).length;

	return (
		<div className="mt-4 border-t pt-4">
			<div className="mb-2 flex items-center justify-between">
				<h4 className="flex items-center gap-1 text-sm font-medium">
					<Share2 className="text-muted-foreground h-4 w-4" />
					Shared with {sharedWith.length}{' '}
					{sharedWith.length === 1 ? 'person' : 'people'}
				</h4>
				<Button variant="ghost" size="sm" onClick={onManageSharing}>
					Manage
				</Button>
			</div>

			<div className="mb-2 flex flex-wrap gap-1">
				{acceptedCount > 0 && (
					<Badge
						variant="outline"
						className="border-green-200 bg-green-50 text-green-700"
					>
						{acceptedCount} accepted
					</Badge>
				)}
				{pendingCount > 0 && (
					<Badge
						variant="outline"
						className="border-yellow-200 bg-yellow-50 text-yellow-700"
					>
						{pendingCount} pending
					</Badge>
				)}
				{declinedCount > 0 && (
					<Badge
						variant="outline"
						className="border-red-200 bg-red-50 text-red-700"
					>
						{declinedCount} declined
					</Badge>
				)}
			</div>

			<div className="flex -space-x-2 overflow-hidden">
				<TooltipProvider>
					{sharedWith.slice(0, 5).map((person) => (
						<Tooltip key={person.id}>
							<TooltipTrigger asChild>
								<Avatar className="border-background h-8 w-8 border-2">
									<AvatarImage
										src={person.image || '/placeholder.svg'}
										alt={person.name}
									/>
									<AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
								</Avatar>
							</TooltipTrigger>
							<TooltipContent>
								<div className="text-xs">
									<p className="font-medium">{person.name}</p>
									<p className="capitalize">{person.status}</p>
								</div>
							</TooltipContent>
						</Tooltip>
					))}
					{sharedWith.length > 5 && (
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="border-background bg-muted flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium">
									+{sharedWith.length - 5}
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p className="text-xs">{sharedWith.length - 5} more people</p>
							</TooltipContent>
						</Tooltip>
					)}
				</TooltipProvider>
			</div>
		</div>
	);
}
