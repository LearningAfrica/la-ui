import { Skeleton } from '@/components/ui/skeleton';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';

export default function StudentCourseLessonLoading() {
	return (
		<div className="flex-1 space-y-6 p-4 md:p-6">
			<div className="space-y-2">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-6 w-64" />
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
				<div className="space-y-6 lg:col-span-3">
					<Card>
						<CardHeader>
							<Skeleton className="h-10 w-full" />
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<Skeleton className="h-64 w-full" />
								<Skeleton className="h-24 w-full" />
								<Skeleton className="h-24 w-full" />
							</div>
						</CardContent>
						<CardFooter className="flex justify-between border-t pt-6">
							<Skeleton className="h-10 w-32" />
							<Skeleton className="h-10 w-40" />
							<Skeleton className="h-10 w-32" />
						</CardFooter>
					</Card>
				</div>

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-32" />
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<div className="flex justify-between">
									<Skeleton className="h-4 w-16" />
									<Skeleton className="h-4 w-8" />
								</div>
								<Skeleton className="h-2 w-full" />
							</div>
							<Skeleton className="h-4 w-48" />
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-32" />
						</CardHeader>
						<CardContent className="p-0">
							<div className="space-y-1">
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
