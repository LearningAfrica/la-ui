import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StudentAchievementsLoading() {
	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div>
				<Skeleton className="h-10 w-[250px]" />
				<Skeleton className="mt-2 h-5 w-[350px]" />
			</div>

			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-[200px]" />
					<Skeleton className="h-4 w-[300px]" />
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="bg-muted/50 flex flex-col items-center rounded-lg p-4"
							>
								<Skeleton className="h-10 w-10 rounded-full" />
								<Skeleton className="mt-2 h-4 w-20" />
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<Tabs defaultValue="all">
				<TabsList className="mb-4 grid grid-cols-3 md:grid-cols-6">
					{[
						'All',
						'Earned',
						'In Progress',
						'Locked',
						'Categories',
						'Rarity',
					].map((tab) => (
						<TabsTrigger key={tab} value={tab.toLowerCase()} disabled>
							{tab}
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value="all">
					<div className="grid gap-4 md:grid-cols-4">
						{Array(12)
							.fill(0)
							.map((_, i) => (
								<div key={i} className="flex flex-col items-center">
									<Skeleton className="h-20 w-20 rounded-full" />
									<Skeleton className="mt-2 h-4 w-24" />
									<Skeleton className="mt-1 h-3 w-16" />
								</div>
							))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
