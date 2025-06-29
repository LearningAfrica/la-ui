import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentSupportTicketsLoading() {
	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex items-center gap-2">
				<Skeleton className="h-9 w-24" />
			</div>

			<div>
				<Skeleton className="mb-2 h-8 w-64" />
				<Skeleton className="h-4 w-48" />
			</div>

			<Card>
				<CardHeader>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<Skeleton className="mb-2 h-6 w-32" />
							<Skeleton className="h-4 w-48" />
						</div>
						<Skeleton className="h-9 w-32" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="mb-6 flex flex-col gap-4 sm:flex-row">
						<Skeleton className="h-10 flex-1" />
						<Skeleton className="h-10 w-32" />
					</div>

					<div className="rounded-md border">
						<div className="p-4">
							<div className="flex items-center gap-4 py-3">
								<Skeleton className="h-6 w-16" />
								<Skeleton className="hidden h-6 w-32 md:block" />
								<Skeleton className="h-6 flex-1" />
								<Skeleton className="hidden h-6 w-20 sm:block" />
								<Skeleton className="hidden h-6 w-16 lg:block" />
								<Skeleton className="hidden h-6 w-32 lg:block" />
								<Skeleton className="h-6 w-8" />
							</div>
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="flex items-center gap-4 border-t py-4">
									<Skeleton className="h-6 w-16" />
									<Skeleton className="hidden h-6 w-32 md:block" />
									<Skeleton className="h-6 flex-1" />
									<Skeleton className="hidden h-6 w-20 sm:block" />
									<Skeleton className="hidden h-6 w-16 lg:block" />
									<Skeleton className="hidden h-6 w-32 lg:block" />
									<Skeleton className="h-6 w-8" />
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
