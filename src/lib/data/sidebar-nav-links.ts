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
import type { OrgUserRole, UserRole } from '../validators/auth-schema';

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  orgRole: OrgUserRole[];
  systemRole: UserRole[];
  items?: NavLink[];
  section?: 'main' | 'bottom';
  isParent?: boolean;
  requiresOrg: boolean;
};

// Common links that appear for all roles
const COMMON_LINKS: NavLink[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    orgRole: ['learner', 'instructor', 'admin'],
    systemRole: ['super_admin', 'user'],
    requiresOrg: false,
  },
  {
    href: '/dashboard/invitations',
    label: 'Invitations',
    icon: MessageSquare,
    orgRole: ['learner', 'instructor', 'admin'],
    systemRole: ['user'],
    requiresOrg: false,
  },
];

// Student specific links with parent sections
const STUDENT_LINKS: NavLink[] = [
  {
    href: '#',
    label: 'Learning',
    icon: GraduationCap,
    orgRole: ['learner'],
    systemRole: ['user'],
    isParent: true,
    requiresOrg: true,
    items: [
      {
        href: '/dashboard/student/courses',
        label: 'My Courses',
        icon: BookOpen,
        orgRole: ['learner'],
        systemRole: ['user'],
        requiresOrg: true,
      },
      {
        href: '/dashboard/student/learning',
        label: 'My Learning',
        icon: GraduationCap,
        orgRole: ['learner'],
        systemRole: ['user'],
        requiresOrg: true,
      },
      {
        href: '/dashboard/student/achievements',
        label: 'Achievements',
        icon: Award,
        orgRole: ['learner'],
        systemRole: ['user'],
        requiresOrg: true,
      },
      {
        href: '/dashboard/student/certificates',
        label: 'Certificates',
        icon: FileCheck,
        orgRole: ['learner'],
        systemRole: ['user'],
        requiresOrg: true,
      },
    ],
  },
  {
    href: '#',
    label: 'Tools',
    icon: Settings,
    orgRole: ['learner'],
    systemRole: ['user'],
    isParent: true,
    requiresOrg: true,
    items: [
      {
        href: '/dashboard/student/calendar',
        label: 'Calendar',
        icon: Calendar,
        orgRole: ['learner'],
        systemRole: ['user'],
        requiresOrg: true,
      },
      {
        href: '/dashboard/student/live-sessions',
        label: 'Live Sessions',
        icon: Video,
        orgRole: ['learner'],
        systemRole: ['user'],
        requiresOrg: true,
      },
      {
        href: '/dashboard/student/support',
        label: 'Support',
        icon: HelpCircle,
        systemRole: ['user'],
        orgRole: ['learner'],
        requiresOrg: false,
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
    orgRole: ['instructor'],
    systemRole: ['user'],
    isParent: true,
    requiresOrg: true,
    items: [
      {
        href: '/dashboard/instructor/courses',
        label: 'Courses',
        icon: BookOpen,
        orgRole: ['instructor'],
        systemRole: ['user'],
        requiresOrg: true,
      },
      {
        href: '/dashboard/instructor/students',
        label: 'Students',
        icon: Users,
        orgRole: ['instructor'],
        systemRole: ['user'],
        requiresOrg: true,
      },
    ],
  },
  {
    href: '#',
    label: 'Communication',
    icon: MessageSquare,
    orgRole: ['instructor'],
    systemRole: ['user'],
    isParent: true,
    requiresOrg: true,
    items: [
      {
        href: '/dashboard/instructor/messages',
        label: 'Messages',
        icon: MessageSquare,
        orgRole: ['instructor'],
        systemRole: ['user'],
        requiresOrg: true,
      },
    ],
  },
  {
    href: '#',
    label: 'Business',
    icon: DollarSign,
    orgRole: ['instructor'],
    systemRole: ['user'],
    isParent: true,
    requiresOrg: true,
    items: [
      {
        href: '/dashboard/instructor/earnings',
        label: 'Earnings',
        icon: DollarSign,
        orgRole: ['instructor'],
        systemRole: ['user'],
        requiresOrg: true,
      },
    ],
  },
  {
    href: '#',
    label: 'Tools',
    icon: Settings,
    orgRole: ['instructor'],
    systemRole: ['user'],
    isParent: true,
    requiresOrg: true,
    items: [
      {
        href: '/dashboard/instructor/calendar',
        label: 'Calendar',
        icon: Calendar,
        orgRole: ['instructor'],
        systemRole: ['user'],
        requiresOrg: true,
      },
      {
        href: '/dashboard/instructor/live-sessions',
        label: 'Live Sessions',
        icon: Video,
        orgRole: ['instructor'],
        systemRole: ['user'],
        requiresOrg: true,
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
    orgRole: ['admin'],
    systemRole: ['user'],
    isParent: true,
    requiresOrg: false,
    items: [
       {
        href: '/dashboard/admin/organizations',
        label: 'Organizations',
        icon: Users,
        orgRole: ['admin'],
        systemRole: ['user'],
        requiresOrg: false,
      },
       {
        href: '/dashboard/admin/inquiries',
        label: 'My Inquiries',
        icon: MessageSquare,
        orgRole: ['admin'],
        systemRole: ['user'],
        requiresOrg: false,
      },
      {
        href: '/dashboard/admin/approvals',
        label: 'Approvals',
        icon: Users,
        orgRole: ['admin'],
        systemRole: ['user'],
        requiresOrg: true,
      },
    ],
  },
  {
    href: '#',
    label: 'Content',
    icon: FileCheck,
    orgRole: ['admin'],
    systemRole: ['user'],
    isParent: true,
    requiresOrg: true,
    items: [
      {
        href: '/dashboard/admin/categories',
        label: 'Categories',
        icon: BookOpen,
        orgRole: ['admin'],
        systemRole: ['user'],
        requiresOrg: true,
      },
      {
        href: '/dashboard/admin/certificates',
        label: 'Certificates',
        icon: FileCheck,
        orgRole: ['admin'],
        systemRole: ['user'],
        requiresOrg: true,
      },
      {
        href: '/dashboard/admin/reviews',
        label: 'Reviews',
        icon: MessageSquare,
        systemRole: ['user'],
        orgRole: ['admin'],
        requiresOrg: true,
      },
      {
        href: '/dashboard/admin/discussions',
        label: 'Discussions',
        icon: MessageSquare,
        orgRole: ['admin'],
        systemRole: ['user'],
        requiresOrg: true,
      },
      {
        href: '/dashboard/admin/courses',
        label: 'Courses',
        icon: BookOpen,
        orgRole: ['admin'],
        systemRole: ['user'],
        requiresOrg: true,
      },
    ],
  },
  {
    href: '#',
    label: 'Users',
    icon: Users,
    orgRole: ['admin'],
    systemRole: ['user'],
    isParent: true,
    requiresOrg: true,
    items: [
      {
        href: '/dashboard/admin/students',
        label: 'Students',
        icon: Users,
        orgRole: ['admin'],
        systemRole: ['user'],
        requiresOrg: true,
      },
      {
        href: '/dashboard/admin/learning',
        label: 'Learning',
        icon: Users,
        orgRole: ['admin'],
        systemRole: ['user'],
        requiresOrg: true,
      },
      {
        href: '/dashboard/admin/instructors',
        label: 'Instructors',
        icon: GraduationCap,
        systemRole: ['user'],
        orgRole: ['admin'],
        requiresOrg: true,
      },
      {
        href: '/dashboard/admin/instructors/invitations',
        label: 'Invitations',
        icon: Users,
        orgRole: ['admin'],
        systemRole: ['user'],
        requiresOrg: true,
      },
    ],
  },
  {
    href: '#',
    label: 'Analytics',
    icon: BarChart3,
    orgRole: ['admin'],
    systemRole: ['user'],
    isParent: true,
    requiresOrg: true,
    items: [
      {
        href: '/dashboard/admin/reports',
        label: 'Reports',
        icon: BarChart3,
        orgRole: ['admin'],
        systemRole: ['user'],
        requiresOrg: true,
      },
    ],
  },
  {
    href: '#',
    label: 'Tools',
    icon: Settings,
    orgRole: ['admin'],
    systemRole: ['user'],
    isParent: true,
    requiresOrg: true,
    items: [
      {
        href: '/dashboard/admin/support',
        label: 'Support',
        icon: HelpCircle,
        orgRole: ['admin'],
        systemRole: ['user'],
        requiresOrg: false,
      },
      {
        href: '/dashboard/admin/calendar',
        label: 'Calendar',
        icon: Calendar,
        orgRole: ['admin'],
        systemRole: ['user'],
        requiresOrg: true,
      },
      {
        href: '/dashboard/admin/live-sessions',
        label: 'Live Sessions',
        icon: Video,
        orgRole: ['admin'],
        systemRole: ['user'],
        requiresOrg: true,
      },
    ],
  },
];

const SUPER_ADMIN_LINKS: NavLink[] = [
  // {
  //   href: '/dashboard/super-admin',
  //   label: 'Dashboard',
  //   icon: LayoutDashboard,
  //   orgRole: ['admin'],
  //   systemRole: ['super_admin'],
  // },
  {
    href: '/dashboard/super-admin/inquiries',
    label: 'Inquiries',
    icon: Users,
    orgRole: ['admin'],
    systemRole: ['super_admin'],
    requiresOrg: false,
  },
  {
    href: '/dashboard/super-admin/organizations',
    label: 'Organizations',
    icon: Users,
    orgRole: [],
    systemRole: ['super_admin'],
    requiresOrg: false,
  },
];

// Profile links that will be shown at the bottom for all users
const PROFILE_LINKS: NavLink[] = [
  {
    href: '/dashboard/profile',
    label: 'Profile',
    icon: User,
    orgRole: ['learner', 'instructor', 'admin'],
    systemRole: ['super_admin', 'user'],
    section: 'bottom',
    requiresOrg: false,
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: Settings,
    orgRole: ['learner', 'instructor', 'admin'],
    systemRole: ['super_admin', 'user'],
    section: 'bottom',
    requiresOrg: false,
  },
];

// Combine all links
export const DASHBOARD_SIDEBAR_NAV_LINKS: NavLink[] = [
  ...COMMON_LINKS,
  ...STUDENT_LINKS,
  ...INSTRUCTOR_LINKS,
  ...ADMIN_LINKS,
  ...PROFILE_LINKS,
  ...SUPER_ADMIN_LINKS,
];
