import {
  Award,
  BookOpen,
  Calendar,
  DollarSign,
  FileCheck,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  Users,
  BarChart3,
  Settings,
  User,
  Video,
  type LucideIcon,
} from 'lucide-react';
import type { UserRole } from '../validators/auth-schema';

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
  items?: NavLink[];
  section?: 'main' | 'bottom';
  isParent?: boolean;
};

// Common links that appear for all roles
const COMMON_LINKS: NavLink[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['learner', 'instructor', 'admin', 'super_admin'],
  },
  {
    href: '/dashboard/invitations',
    label: 'Invitations',
    icon: MessageSquare,
    roles: ['learner', 'instructor', 'admin', 'super_admin'],
  },
];

// Student specific links with parent sections
const STUDENT_LINKS: NavLink[] = [
  {
    href: '#',
    label: 'Learning',
    icon: GraduationCap,
    roles: ['learner'],
    isParent: true,
    items: [
      {
        href: '/dashboard/student/courses',
        label: 'My Courses',
        icon: BookOpen,
        roles: ['learner'],
      },
      {
        href: '/dashboard/student/learning',
        label: 'My Learning',
        icon: GraduationCap,
        roles: ['learner'],
      },
      {
        href: '/dashboard/student/achievements',
        label: 'Achievements',
        icon: Award,
        roles: ['learner'],
      },
      {
        href: '/dashboard/student/certificates',
        label: 'Certificates',
        icon: FileCheck,
        roles: ['learner'],
      },
    ],
  },
  {
    href: '#',
    label: 'Tools',
    icon: Settings,
    roles: ['learner'],
    isParent: true,
    items: [
      {
        href: '/dashboard/student/calendar',
        label: 'Calendar',
        icon: Calendar,
        roles: ['learner'],
      },
      {
        href: '/dashboard/student/live-sessions',
        label: 'Live Sessions',
        icon: Video,
        roles: ['learner'],
      },
      {
        href: '/dashboard/student/support',
        label: 'Support',
        icon: HelpCircle,
        roles: ['learner'],
      },
    ],
  },
];

// Instructor specific links with parent sections
const INSTRUCTOR_LINKS: NavLink[] = [
  {
    href: '#',
    label: 'Teaching',
    icon: BookOpen,
    roles: ['instructor'],
    isParent: true,
    items: [
      {
        href: '/dashboard/instructor/courses',
        label: 'Courses',
        icon: BookOpen,
        roles: ['instructor'],
      },
      {
        href: '/dashboard/instructor/students',
        label: 'Students',
        icon: Users,
        roles: ['instructor'],
      },
    ],
  },
  {
    href: '#',
    label: 'Communication',
    icon: MessageSquare,
    roles: ['instructor'],
    isParent: true,
    items: [
      {
        href: '/dashboard/instructor/messages',
        label: 'Messages',
        icon: MessageSquare,
        roles: ['instructor'],
      },
    ],
  },
  {
    href: '#',
    label: 'Business',
    icon: DollarSign,
    roles: ['instructor'],
    isParent: true,
    items: [
      {
        href: '/dashboard/instructor/earnings',
        label: 'Earnings',
        icon: DollarSign,
        roles: ['instructor'],
      },
    ],
  },
  {
    href: '#',
    label: 'Tools',
    icon: Settings,
    roles: ['instructor'],
    isParent: true,
    items: [
      {
        href: '/dashboard/instructor/calendar',
        label: 'Calendar',
        icon: Calendar,
        roles: ['instructor'],
      },
      {
        href: '/dashboard/instructor/live-sessions',
        label: 'Live Sessions',
        icon: Video,
        roles: ['instructor'],
      },
    ],
  },
];

// Admin/SuperAdmin links with parent sections
const ADMIN_LINKS: NavLink[] = [
  {
    href: '#',
    label: 'Management',
    icon: Users,
    roles: ['admin'],
    isParent: true,
    items: [
      {
        href: '/dashboard/admin/organizations',
        label: 'Organizations',
        icon: Users,
        roles: ['admin'],
      },
      {
        href: '/dashboard/admin/approvals',
        label: 'Approvals',
        icon: Users,
        roles: ['admin'],
      },
    ],
  },
  {
    href: '#',
    label: 'Content',
    icon: FileCheck,
    roles: ['admin'],
    isParent: true,
    items: [
      {
        href: '/dashboard/admin/categories',
        label: 'Categories',
        icon: BookOpen,
        roles: ['admin'],
      },
      {
        href: '/dashboard/admin/certificates',
        label: 'Certificates',
        icon: FileCheck,
        roles: ['admin'],
      },
      {
        href: '/dashboard/admin/reviews',
        label: 'Reviews',
        icon: MessageSquare,
        roles: ['admin'],
      },
      {
        href: '/dashboard/admin/discussions',
        label: 'Discussions',
        icon: MessageSquare,
        roles: ['admin'],
      },
      {
        href: '/dashboard/admin/courses',
        label: 'Courses',
        icon: BookOpen,
        roles: ['admin'],
      },
    ],
  },
  {
    href: '#',
    label: 'Users',
    icon: Users,
    roles: ['admin'],
    isParent: true,
    items: [
      {
        href: '/dashboard/admin/students',
        label: 'Students',
        icon: Users,
        roles: ['admin'],
      },
      {
        href: '/dashboard/admin/learning',
        label: 'Learning',
        icon: Users,
        roles: ['admin'],
      },
      {
        href: '/dashboard/admin/instructors',
        label: 'Instructors',
        icon: GraduationCap,
        roles: ['admin'],
      },
      {
        href: '/dashboard/admin/instructors/invitations',
        label: 'Invitations',
        icon: Users,
        roles: ['admin'],
      },
    ],
  },
  {
    href: '#',
    label: 'Analytics',
    icon: BarChart3,
    roles: ['admin'],
    isParent: true,
    items: [
      {
        href: '/dashboard/admin/reports',
        label: 'Reports',
        icon: BarChart3,
        roles: ['admin'],
      },
    ],
  },
  {
    href: '#',
    label: 'Tools',
    icon: Settings,
    roles: ['admin'],
    isParent: true,
    items: [
      {
        href: '/dashboard/admin/support',
        label: 'Support',
        icon: HelpCircle,
        roles: ['admin'],
      },
      {
        href: '/dashboard/admin/calendar',
        label: 'Calendar',
        icon: Calendar,
        roles: ['admin'],
      },
      {
        href: '/dashboard/admin/live-sessions',
        label: 'Live Sessions',
        icon: Video,
        roles: ['admin'],
      },
    ],
  },
];

// Profile links that will be shown at the bottom for all users
const PROFILE_LINKS: NavLink[] = [
  {
    href: '/dashboard/profile',
    label: 'Profile',
    icon: User,
    roles: ['learner', 'instructor', 'admin', 'super_admin'],
    section: 'bottom',
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: Settings,
    roles: ['learner', 'instructor', 'admin', 'super_admin'],
    section: 'bottom',
  },
];

// Combine all links
export const DASHBOARD_SIDEBAR_NAV_LINKS: NavLink[] = [
  ...COMMON_LINKS,
  ...STUDENT_LINKS,
  ...INSTRUCTOR_LINKS,
  ...ADMIN_LINKS,
  ...PROFILE_LINKS,
];
