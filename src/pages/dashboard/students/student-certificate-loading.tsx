import { Skeleton } from '@/components/ui/skeleton';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';

export default function StudentCertificatesLoading() {
	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<Skeleton className="h-8 w-48" />
					<Skeleton className="mt-2 h-4 w-64" />
				</div>
			</div>

			<div className="flex flex-col gap-4 md:flex-row">
				<Skeleton className="h-10 flex-1" />
				<div className="flex gap-2">
					<Skeleton className="h-10 w-24" />
					<Skeleton className="h-10 w-24" />
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{Array(6)
					.fill(null)
					.map((_, i) => (
						<Card key={i} className="overflow-hidden">
							<CardHeader className="p-0">
								<Skeleton className="aspect-[1.4/1] w-full" />
							</CardHeader>
							<CardContent className="p-4">
								<Skeleton className="mb-2 h-5 w-3/4" />
								<Skeleton className="mb-2 h-4 w-full" />
								<Skeleton className="mb-1 h-3 w-1/2" />
								<Skeleton className="h-3 w-2/3" />
							</CardContent>
							<CardFooter className="flex justify-between p-4 pt-0">
								<Skeleton className="h-9 w-16" />
								<div className="flex gap-2">
									<Skeleton className="h-8 w-8" />
									<Skeleton className="h-8 w-8" />
								</div>
							</CardFooter>
						</Card>
					))}
			</div>
		</div>
	);
}
