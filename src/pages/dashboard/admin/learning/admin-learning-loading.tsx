import { Skeleton } from '@/components/ui/skeleton';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';

export default function AdminLearningLoading() {
	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<Skeleton className="mb-2 h-8 w-[250px]" />
					<Skeleton className="h-4 w-[350px]" />
				</div>
				<div className="flex items-center gap-2">
					<Skeleton className="h-10 w-[140px]" />
					<Skeleton className="h-10 w-10" />
				</div>
			</div>

			{/* Overview Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{Array(4)
					.fill(null)
					.map((_, i) => (
						<Card key={i}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<Skeleton className="h-5 w-[100px]" />
								<Skeleton className="h-4 w-4" />
							</CardHeader>
							<CardContent>
								<Skeleton className="mb-2 h-8 w-[60px]" />
								<Skeleton className="h-4 w-[120px]" />
							</CardContent>
						</Card>
					))}
			</div>

			{/* Search and Filters */}
			<div className="flex flex-col gap-4 md:flex-row">
				<Skeleton className="h-10 flex-1" />
				<Skeleton className="h-10 w-full md:w-[180px]" />
				<Skeleton className="h-10 w-full md:w-[180px]" />
				<Skeleton className="h-10 w-full md:w-[140px]" />
			</div>

			{/* Tabs */}
			<div className="space-y-4">
				<Skeleton className="h-10 w-[300px]" />

				<Card>
					<CardHeader>
						<Skeleton className="mb-2 h-6 w-[150px]" />
						<Skeleton className="h-4 w-[250px]" />
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{Array(5)
								.fill(null)
								.map((_, i) => (
									<div key={i} className="flex items-center gap-4">
										<Skeleton className="h-10 w-10 rounded-md" />
										<Skeleton className="h-6 w-[200px]" />
										<Skeleton className="ml-auto h-6 w-[100px]" />
										<Skeleton className="h-6 w-[80px]" />
										<Skeleton className="h-6 w-[100px]" />
										<Skeleton className="h-6 w-[80px]" />
										<Skeleton className="h-8 w-8 rounded-full" />
									</div>
								))}
						</div>
					</CardContent>
					<CardFooter className="flex justify-between">
						<Skeleton className="h-9 w-[120px]" />
						<Skeleton className="h-9 w-[120px]" />
					</CardFooter>
				</Card>
			</div>

			{/* Charts */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<Skeleton className="mb-2 h-6 w-[150px]" />
						<Skeleton className="h-4 w-[250px]" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-[200px] w-full" />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<Skeleton className="mb-2 h-6 w-[150px]" />
						<Skeleton className="h-4 w-[250px]" />
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{Array(4)
								.fill(null)
								.map((_, i) => (
									<div key={i} className="flex items-center gap-2">
										<Skeleton className="h-8 w-8 rounded-full" />
										<div className="flex-1 space-y-1">
											<Skeleton className="h-4 w-[200px]" />
											<Skeleton className="h-3 w-[150px]" />
										</div>
										<Skeleton className="h-4 w-[80px]" />
									</div>
								))}
						</div>
					</CardContent>
					<CardFooter>
						<Skeleton className="h-9 w-full" />
					</CardFooter>
				</Card>
			</div>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<Skeleton className="mb-2 h-6 w-[150px]" />
					<Skeleton className="h-4 w-[200px]" />
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						{Array(3)
							.fill(null)
							.map((_, i) => (
								<Skeleton key={i} className="h-[120px] w-full" />
							))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
