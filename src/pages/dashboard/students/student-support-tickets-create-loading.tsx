import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentSupportTicketsCreateLoading() {
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
					<Skeleton className="mb-2 h-6 w-48" />
					<Skeleton className="h-4 w-96" />
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						<div className="space-y-2">
							<Skeleton className="h-5 w-24" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-4 w-64" />
						</div>

						<div className="space-y-2">
							<Skeleton className="h-5 w-24" />
							<Skeleton className="h-32 w-full" />
							<Skeleton className="h-4 w-96" />
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							<div className="space-y-2">
								<Skeleton className="h-5 w-32" />
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-4 w-64" />
							</div>

							<div className="space-y-2">
								<Skeleton className="h-5 w-24" />
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-4 w-48" />
							</div>
						</div>

						<div className="space-y-2">
							<Skeleton className="h-5 w-32" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-4 w-64" />
						</div>

						<div className="flex justify-end gap-4">
							<Skeleton className="h-9 w-24" />
							<Skeleton className="h-9 w-32" />
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
