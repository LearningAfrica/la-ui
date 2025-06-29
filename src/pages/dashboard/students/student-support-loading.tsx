export default function StudentSupportLoading() {
	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<div className="bg-muted h-8 w-48 animate-pulse rounded-md"></div>
					<div className="bg-muted mt-2 h-4 w-64 animate-pulse rounded-md"></div>
				</div>
				<div className="bg-muted h-10 w-32 animate-pulse rounded-md"></div>
			</div>

			<div className="bg-muted h-10 w-72 animate-pulse rounded-md"></div>

			<div className="space-y-4">
				<div className="flex justify-between">
					<div className="bg-muted h-8 w-48 animate-pulse rounded-md"></div>
					<div className="bg-muted h-8 w-32 animate-pulse rounded-md"></div>
				</div>
				<div className="bg-muted h-[400px] w-full animate-pulse rounded-md border"></div>
			</div>
		</div>
	);
}
