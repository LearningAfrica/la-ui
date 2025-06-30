import type { AchievementBadge, BadgeCategory } from '../types/badge';

// Mock badge data
export const achievementBadges: AchievementBadge[] = [
  // Completion badges
  {
    id: 'first-course',
    name: 'First Steps',
    description: 'Complete your first course',
    category: 'completion',
    icon: 'graduation-cap',
    image: '/badges/first-course-complete.png',
    rarity: 'common',
    criteria: 'Complete your first course',
  },
  {
    id: 'five-courses',
    name: 'Knowledge Seeker',
    description: 'Complete 5 courses',
    category: 'completion',
    icon: 'books',
    image: '/badges/five-courses-complete.png',
    rarity: 'uncommon',
    criteria: 'Complete 5 courses',
  },
  {
    id: 'ten-courses',
    name: 'Master Student',
    description: 'Complete 10 courses',
    category: 'completion',
    icon: 'trophy',
    image: '/badges/ten-courses-complete.png',
    rarity: 'rare',
    criteria: 'Complete 10 courses',
  },

  // Streak badges
  {
    id: 'three-day-streak',
    name: 'Consistent Learner',
    description: 'Learn for 3 days in a row',
    category: 'streak',
    icon: 'calendar',
    image: '/badges/three-day-streak.png',
    rarity: 'common',
    criteria: 'Log in and complete at least one lesson for 3 consecutive days',
  },
  {
    id: 'seven-day-streak',
    name: 'Weekly Warrior',
    description: 'Learn for 7 days in a row',
    category: 'streak',
    icon: 'calendar',
    image: '/badges/seven-day-streak.png',
    rarity: 'uncommon',
    criteria: 'Log in and complete at least one lesson for 7 consecutive days',
  },
  {
    id: 'thirty-day-streak',
    name: 'Dedication Master',
    description: 'Learn for 30 days in a row',
    category: 'streak',
    icon: 'calendar',
    image: '/badges/thirty-day-streak.png',
    rarity: 'epic',
    criteria: 'Log in and complete at least one lesson for 30 consecutive days',
  },

  // Participation badges
  {
    id: 'first-discussion',
    name: 'Conversation Starter',
    description: 'Participate in your first discussion',
    category: 'participation',
    icon: 'message-circle',
    image: '/badges/first-discussion.png',
    rarity: 'common',
    criteria: 'Post your first message in a course discussion',
  },
  {
    id: 'helpful-response',
    name: 'Helpful Hand',
    description: 'Have one of your responses marked as helpful',
    category: 'participation',
    icon: 'helping-hand',
    image: '/badges/helpful-response.png',
    rarity: 'uncommon',
    criteria: 'Have another student mark one of your responses as helpful',
  },

  // Excellence badges
  {
    id: 'perfect-quiz',
    name: 'Perfect Score',
    description: 'Get 100% on a quiz',
    category: 'excellence',
    icon: 'check-circle',
    image: '/badges/perfect-quiz.png',
    rarity: 'uncommon',
    criteria: 'Score 100% on any quiz',
  },
  {
    id: 'five-perfect-quizzes',
    name: 'Quiz Master',
    description: 'Get 100% on 5 different quizzes',
    category: 'excellence',
    icon: 'award',
    image: '/badges/quiz-master.png',
    rarity: 'rare',
    criteria: 'Score 100% on 5 different quizzes',
  },

  // Milestone badges
  {
    id: 'first-certificate',
    name: 'Certified Learner',
    description: 'Earn your first certificate',
    category: 'milestone',
    icon: 'certificate',
    image: '/badges/first-certificate.png',
    rarity: 'uncommon',
    criteria: 'Complete a course and earn your first certificate',
  },
  {
    id: 'complete-path',
    name: 'Path Completer',
    description: 'Complete an entire learning path',
    category: 'milestone',
    icon: 'route',
    image: '/badges/complete-path.png',
    rarity: 'epic',
    criteria: 'Complete all courses in a learning path',
  },

  // Special badges
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: 'One of the first users on the platform',
    category: 'special',
    icon: 'star',
    image: '/badges/early-adopter.png',
    rarity: 'legendary',
    criteria: 'Join the platform during its first month',
  },
];

// Mock user badges (some earned, some in progress)
export const mockUserBadges: AchievementBadge[] = [
  {
    ...achievementBadges[0], // First course
    earnedAt: '2023-10-15T14:30:00Z',
  },
  {
    ...achievementBadges[3], // 3-day streak
    earnedAt: '2023-10-18T09:15:00Z',
  },
  {
    ...achievementBadges[4], // 7-day streak
    progress: {
      current: 5,
      required: 7,
    },
  },
  {
    ...achievementBadges[7], // Helpful response
    earnedAt: '2023-11-02T16:45:00Z',
  },
  {
    ...achievementBadges[8], // Perfect quiz
    earnedAt: '2023-10-25T11:20:00Z',
  },
  {
    ...achievementBadges[1], // 5 courses
    progress: {
      current: 2,
      required: 5,
    },
  },
];

// Helper function to get badges by category
export function getBadgesByCategory(
  badges: AchievementBadge[],
  category: BadgeCategory,
): AchievementBadge[] {
  return badges.filter((badge) => badge.category === category);
}

// Helper function to get earned badges
export function getEarnedBadges(
  badges: AchievementBadge[],
): AchievementBadge[] {
  return badges.filter((badge) => !!badge.earnedAt);
}

// Helper function to get in-progress badges
export function getInProgressBadges(
  badges: AchievementBadge[],
): AchievementBadge[] {
  return badges.filter(
    (badge) => !badge.earnedAt && badge.progress && badge.progress.current > 0,
  );
}

// Helper function to get locked badges
export function getLockedBadges(
  badges: AchievementBadge[],
): AchievementBadge[] {
  return badges.filter(
    (badge) =>
      !badge.earnedAt && (!badge.progress || badge.progress.current === 0),
  );
}

// Helper function to check if a badge is earned
export function isBadgeEarned(
  badges: AchievementBadge[],
  badgeId: string,
): boolean {
  const badge = badges.find((b) => b.id === badgeId);
  return !!badge?.earnedAt;
}

// Helper function to get badge progress
export function getBadgeProgress(
  badges: AchievementBadge[],
  badgeId: string,
): { current: number; required: number } | null {
  const badge = badges.find((b) => b.id === badgeId);
  return badge?.progress || null;
}
