import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ReviewsLoading() {
	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex items-center justify-between">
				<div>
					<Skeleton className="h-8 w-[250px]" />
					<Skeleton className="mt-2 h-4 w-[350px]" />
				</div>
			</div>

			<Tabs defaultValue="pending" className="space-y-4">
				<TabsList>
					<TabsTrigger value="pending" disabled>
						Pending Review
					</TabsTrigger>
					<TabsTrigger value="reviewed" disabled>
						Recently Reviewed
					</TabsTrigger>
				</TabsList>

				<TabsContent value="pending" className="space-y-4">
					{[1, 2, 3].map((i) => (
						<Card key={i}>
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<Skeleton className="h-10 w-10 rounded-full" />
										<div>
											<Skeleton className="h-5 w-[200px]" />
											<Skeleton className="mt-2 h-4 w-[150px]" />
										</div>
									</div>
									<div className="flex items-center space-x-4">
										<Skeleton className="h-6 w-24" />
										<Skeleton className="h-9 w-24" />
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</TabsContent>
			</Tabs>
		</div>
	);
}
