import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BadgeCollection } from '@/components/badges/badge-collection';
import { BadgeDetailsDialog } from '@/components/badges/badge-details-dialog';
import type { AchievementBadge } from '@/lib/types/badge';
import {
	achievementBadges,
	mockUserBadges,
	getEarnedBadges,
	getInProgressBadges,
	getLockedBadges,
	getBadgesByCategory,
} from '@/lib/utils/badge';

export default function AchievementsPage() {
	const [selectedBadge] = useState<AchievementBadge | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	// In a real app, these would come from your API
	const userBadges = mockUserBadges;
	const allBadges = achievementBadges;

	const earnedBadges = getEarnedBadges(userBadges);
	const inProgressBadges = getInProgressBadges(userBadges);
	const lockedBadges = getLockedBadges(
		allBadges.filter(
			(badge) => !userBadges.some((userBadge) => userBadge.id === badge.id),
		),
	);

	const completionBadges = getBadgesByCategory(allBadges, 'completion');
	const streakBadges = getBadgesByCategory(allBadges, 'streak');
	const participationBadges = getBadgesByCategory(allBadges, 'participation');
	const excellenceBadges = getBadgesByCategory(allBadges, 'excellence');
	const milestoneBadges = getBadgesByCategory(allBadges, 'milestone');
	const specialBadges = getBadgesByCategory(allBadges, 'special');

	//   const handleBadgeClick = (badge: AchievementBadge) => {
	//     setSelectedBadge(badge)
	//     setIsDialogOpen(true)
	//   }

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div>
				<h2 className="text-3xl font-bold tracking-tight">Achievements</h2>
				<p className="text-muted-foreground">
					Collect badges by reaching milestones in your learning journey
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Your Achievement Stats</CardTitle>
					<CardDescription>
						Track your progress and unlock more badges
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						<div className="bg-muted/50 flex flex-col items-center rounded-lg p-4">
							<div className="text-4xl font-bold">{earnedBadges.length}</div>
							<div className="text-muted-foreground text-sm">Badges Earned</div>
						</div>
						<div className="bg-muted/50 flex flex-col items-center rounded-lg p-4">
							<div className="text-4xl font-bold">
								{inProgressBadges.length}
							</div>
							<div className="text-muted-foreground text-sm">In Progress</div>
						</div>
						<div className="bg-muted/50 flex flex-col items-center rounded-lg p-4">
							<div className="text-4xl font-bold">
								{Math.round((earnedBadges.length / allBadges.length) * 100)}%
							</div>
							<div className="text-muted-foreground text-sm">Completion</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Tabs defaultValue="all">
				<TabsList className="mb-4 grid grid-cols-3 md:grid-cols-6">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="earned">Earned</TabsTrigger>
					<TabsTrigger value="in-progress">In Progress</TabsTrigger>
					<TabsTrigger value="locked">Locked</TabsTrigger>
					<TabsTrigger value="categories">Categories</TabsTrigger>
					<TabsTrigger value="rarity">Rarity</TabsTrigger>
				</TabsList>

				<TabsContent value="all" className="space-y-6">
					<BadgeCollection
						badges={[...userBadges, ...lockedBadges]}
						title="All Badges"
						showDetails={true}
						size="md"
						className="cursor-pointer"
						// onClick={handleBadgeClick}
					/>
				</TabsContent>

				<TabsContent value="earned" className="space-y-6">
					<BadgeCollection
						badges={earnedBadges}
						title="Earned Badges"
						showDetails={true}
						size="md"
						emptyMessage="You haven't earned any badges yet. Keep learning!"
						className="cursor-pointer"
						// onClick={handleBadgeClick}
					/>
				</TabsContent>

				<TabsContent value="in-progress" className="space-y-6">
					<BadgeCollection
						badges={inProgressBadges}
						title="In Progress Badges"
						showDetails={true}
						size="md"
						emptyMessage="You don't have any badges in progress."
						className="cursor-pointer"
						// onClick={handleBadgeClick}
					/>
				</TabsContent>

				<TabsContent value="locked" className="space-y-6">
					<BadgeCollection
						badges={lockedBadges}
						title="Locked Badges"
						showDetails={true}
						size="md"
						emptyMessage="You've unlocked all available badges!"
						className="cursor-pointer"
						// onClick={handleBadgeClick}
					/>
				</TabsContent>

				<TabsContent value="categories" className="space-y-8">
					<BadgeCollection
						badges={completionBadges.map(
							(badge) => userBadges.find((b) => b.id === badge.id) || badge,
						)}
						title="Course Completion"
						showDetails={true}
						size="md"
						className="cursor-pointer"
						// onClick={handleBadgeClick}
					/>

					<BadgeCollection
						badges={streakBadges.map(
							(badge) => userBadges.find((b) => b.id === badge.id) || badge,
						)}
						title="Learning Streaks"
						showDetails={true}
						size="md"
						className="cursor-pointer"
						// onClick={handleBadgeClick}
					/>

					<BadgeCollection
						badges={participationBadges.map(
							(badge) => userBadges.find((b) => b.id === badge.id) || badge,
						)}
						title="Participation"
						showDetails={true}
						size="md"
						className="cursor-pointer"
						// onClick={handleBadgeClick}
					/>

					<BadgeCollection
						badges={excellenceBadges.map(
							(badge) => userBadges.find((b) => b.id === badge.id) || badge,
						)}
						title="Excellence"
						showDetails={true}
						size="md"
						className="cursor-pointer"
						// onClick={handleBadgeClick}
					/>

					<BadgeCollection
						badges={milestoneBadges.map(
							(badge) => userBadges.find((b) => b.id === badge.id) || badge,
						)}
						title="Milestones"
						showDetails={true}
						size="md"
						className="cursor-pointer"
						// onClick={handleBadgeClick}
					/>

					<BadgeCollection
						badges={specialBadges.map(
							(badge) => userBadges.find((b) => b.id === badge.id) || badge,
						)}
						title="Special"
						showDetails={true}
						size="md"
						className="cursor-pointer"
						// onClick={handleBadgeClick}
					/>
				</TabsContent>

				<TabsContent value="rarity" className="space-y-8">
					<BadgeCollection
						badges={allBadges
							.filter((badge) => badge.rarity === 'legendary')
							.map(
								(badge) => userBadges.find((b) => b.id === badge.id) || badge,
							)}
						title="Legendary"
						showDetails={true}
						size="md"
						className="cursor-pointer"
						// onClick={handleBadgeClick}
					/>

					<BadgeCollection
						badges={allBadges
							.filter((badge) => badge.rarity === 'epic')
							.map(
								(badge) => userBadges.find((b) => b.id === badge.id) || badge,
							)}
						title="Epic"
						showDetails={true}
						size="md"
						className="cursor-pointer"
						// onClick={handleBadgeClick}
					/>

					<BadgeCollection
						badges={allBadges
							.filter((badge) => badge.rarity === 'rare')
							.map(
								(badge) => userBadges.find((b) => b.id === badge.id) || badge,
							)}
						title="Rare"
						showDetails={true}
						size="md"
						className="cursor-pointer"
						// onClick={handleBadgeClick}
					/>

					<BadgeCollection
						badges={allBadges
							.filter((badge) => badge.rarity === 'uncommon')
							.map(
								(badge) => userBadges.find((b) => b.id === badge.id) || badge,
							)}
						title="Uncommon"
						showDetails={true}
						size="md"
						className="cursor-pointer"
						// onClick={handleBadgeClick}
					/>

					<BadgeCollection
						badges={allBadges
							.filter((badge) => badge.rarity === 'common')
							.map(
								(badge) => userBadges.find((b) => b.id === badge.id) || badge,
							)}
						title="Common"
						showDetails={true}
						size="md"
						className="cursor-pointer"
						// onClick={handleBadgeClick}
					/>
				</TabsContent>
			</Tabs>

			<BadgeDetailsDialog
				badge={selectedBadge}
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
			/>
		</div>
	);
}
