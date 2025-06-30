export type BadgeCategory =
  | 'completion'
  | 'streak'
  | 'participation'
  | 'excellence'
  | 'milestone'
  | 'special';

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  icon: string;
  image: string;
  earnedAt?: string;
  progress?: {
    current: number;
    required: number;
  };
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  criteria: string;
}
