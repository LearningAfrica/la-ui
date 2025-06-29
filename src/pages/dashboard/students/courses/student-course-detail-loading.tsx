import { Skeleton } from '@/components/ui/skeleton';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';

export default function StudentCourseDetailLoading() {
	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="h-9 w-32">
				<Skeleton className="h-9 w-32" />
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				<div className="space-y-6 md:col-span-2">
					<Card>
						<CardHeader className="pb-3">
							<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
								<div className="space-y-2">
									<Skeleton className="h-8 w-64" />
									<Skeleton className="h-4 w-40" />
								</div>
								<Skeleton className="h-10 w-40" />
							</div>
						</CardHeader>
						<CardContent className="pb-2">
							<div className="space-y-2">
								<div className="flex justify-between">
									<Skeleton className="h-4 w-16" />
									<Skeleton className="h-4 w-8" />
								</div>
								<Skeleton className="h-2 w-full" />
								<div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
									<Skeleton className="h-4 w-40" />
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-4 w-36" />
								</div>
							</div>
						</CardContent>
					</Card>

					<div className="space-y-4">
						<div className="flex gap-2">
							{[1, 2, 3].map((i) => (
								<Skeleton key={i} className="h-10 flex-1" />
							))}
						</div>

						{[1, 2, 3, 4].map((section) => (
							<Card key={section}>
								<CardHeader className="py-3">
									<Skeleton className="h-6 w-48" />
								</CardHeader>
								<CardContent className="py-0">
									<div className="space-y-2">
										{[1, 2, 3].map((lesson) => (
											<div
												key={lesson}
												className="flex items-center justify-between p-2"
											>
												<div className="flex items-center gap-3">
													<Skeleton className="h-8 w-8 rounded-full" />
													<div className="space-y-1">
														<Skeleton className="h-5 w-40" />
														<Skeleton className="h-3 w-24" />
													</div>
												</div>
												<Skeleton className="h-8 w-32" />
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-32" />
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<div className="flex justify-between">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-4 w-8" />
								</div>
								<Skeleton className="h-2 w-full" />
							</div>

							<div className="space-y-2">
								<Skeleton className="h-5 w-20" />
								<div className="space-y-2">
									{[1, 2, 3].map((i) => (
										<div key={i} className="flex justify-between">
											<Skeleton className="h-4 w-32" />
											<Skeleton className="h-4 w-16" />
										</div>
									))}
								</div>
							</div>

							<Skeleton className="h-px w-full" />

							<div>
								<Skeleton className="mb-2 h-5 w-16" />
								<Skeleton className="h-20 w-full rounded-md" />
							</div>
						</CardContent>
						<CardFooter>
							<Skeleton className="h-10 w-full" />
						</CardFooter>
					</Card>

					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-24" />
						</CardHeader>
						<CardContent className="space-y-4">
							{[1, 2, 3].map((i) => (
								<Skeleton key={i} className="h-10 w-full" />
							))}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
