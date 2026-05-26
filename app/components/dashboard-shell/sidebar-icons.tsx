import BarChart3 from "~icons/lucide/bar-chart-3";
import BookOpen from "~icons/lucide/book-open";
import Building2 from "~icons/lucide/building-2";
import Compass from "~icons/lucide/compass";
import FolderTree from "~icons/lucide/folder-tree";
import GraduationCap from "~icons/lucide/graduation-cap";
import HeartPulse from "~icons/lucide/heart-pulse";
import Home from "~icons/lucide/home";
import Inbox from "~icons/lucide/inbox";
import Mail from "~icons/lucide/mail";
import Network from "~icons/lucide/network";
import ShieldCheck from "~icons/lucide/shield-check";
import Sparkles from "~icons/lucide/sparkles";
import UserCircle2 from "~icons/lucide/user-circle-2";
import Users from "~icons/lucide/users";
import Video from "~icons/lucide/video";

export const NAV_ICON = {
  home: Home,
  invitations: Mail,
  inbox: Inbox,
  activity: Sparkles,
  myOrgs: Building2,
  joinedOrgs: Network,
  browse: Compass,
  platform: ShieldCheck,
  platformOrgs: Building2,
  platformUsers: Users,
  platformHealth: HeartPulse,
  members: Users,
  courses: BookOpen,
  categories: FolderTree,
  reports: BarChart3,
  liveSessions: Video,
  myCourses: GraduationCap,
  certificates: ShieldCheck,
  profile: UserCircle2,
} as const;

export type NavIconKey = keyof typeof NAV_ICON;
