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
  type LucideIcon,
} from 'lucide-react';
import type { UserRole } from '../types/auth';

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
};

// Common links that appear for all roles
const COMMON_LINKS: NavLink[] = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: LayoutDashboard,
    roles: ['student', 'instructor', 'admin', 'superAdmin'],
  },
];

// Student specific links
const STUDENT_LINKS: NavLink[] = [
  {
    href: '/dashboard/student/courses',
    label: 'My Courses',
    icon: BookOpen,
    roles: ['student'],
  },
  {
    href: '/dashboard/student/learning',
    label: 'My Learning',
    icon: GraduationCap,
    roles: ['student'],
  },
  {
    href: '/dashboard/student/achievements',
    label: 'Achievements',
    icon: Award,
    roles: ['student'],
  },
  {
    href: '/dashboard/student/certificates',
    label: 'Certificates',
    icon: FileCheck,
    roles: ['student'],
  },
  {
    href: '/dashboard/student/calendar',
    label: 'Calendar',
    icon: Calendar,
    roles: ['student'],
  },
  {
    href: '/dashboard/student/support',
    label: 'Support',
    icon: HelpCircle,
    roles: ['student'],
  },
];

// Instructor specific links
const INSTRUCTOR_LINKS: NavLink[] = [
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
  {
    href: '/dashboard/instructor/messages',
    label: 'Messages',
    icon: MessageSquare,
    roles: ['instructor'],
  },
  {
    href: '/dashboard/instructor/earnings',
    label: 'Earnings',
    icon: DollarSign,
    roles: ['instructor'],
  },
];

// Admin/SuperAdmin links (shared between both roles)
const ADMIN_LINKS: NavLink[] = [
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
    href: '/dashboard/admin/reports',
    label: 'Reports',
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
    href: '/dashboard/admin/courses',
    label: 'Courses',
    icon: BookOpen,
    roles: ['admin'],
  },
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
];

// Combine all links
export const DASHBOARD_SIDEBAR_NAV_LINKS: NavLink[] = [
  ...COMMON_LINKS,
  ...STUDENT_LINKS,
  ...INSTRUCTOR_LINKS,
  ...ADMIN_LINKS,
];
