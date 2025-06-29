"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  LayoutDashboard,
  Users,
  GraduationCap,
  MessageSquare,
  Calendar,
  HelpCircle,
  DollarSign,
  Award,
  FileCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

const navItems = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    roles: ["student", "instructor", "admin", "superAdmin"],
  },
  {
    href: "/dashboard/student/courses",
    label: "My Courses",
    icon: BookOpen,
    roles: ["student"],
  },
  {
    href: "/dashboard/student/learning",
    label: "My Learning",
    icon: GraduationCap,
    roles: ["student"],
  },
  {
    href: "/dashboard/student/achievements",
    label: "Achievements",
    icon: Award,
    roles: ["student"],
  },
  {
    href: "/dashboard/student/certificates",
    label: "Certificates",
    icon: FileCheck,
    roles: ["student"],
  },
  {
    href: "/dashboard/student/calendar",
    label: "Calendar",
    icon: Calendar,
    roles: ["student"],
  },
  {
    href: "/dashboard/student/support",
    label: "Support",
    icon: HelpCircle,
    roles: ["student"],
  },
  {
    href: "/dashboard/instructor/courses",
    label: "Courses",
    icon: BookOpen,
    roles: ["instructor", "admin", "superAdmin"],
  },
  {
    href: "/dashboard/instructor/students",
    label: "Students",
    icon: Users,
    roles: ["instructor", "admin", "superAdmin"],
  },
  {
    href: "/dashboard/instructor/messages",
    label: "Messages",
    icon: MessageSquare,
    roles: ["instructor"],
  },
  {
    href: "/dashboard/instructor/earnings",
    label: "Earnings",
    icon: DollarSign,
    roles: ["instructor"],
  },
  {
    href: "/dashboard/admin/students",
    label: "Students",
    icon: Users,
    roles: ["admin", "superAdmin"],
  },
  {
    href: "/dashboard/admin/instructors",
    label: "Instructors",
    icon: GraduationCap,
    roles: ["admin", "superAdmin"],
  },
  {
    href: "/dashboard/admin/courses",
    label: "Courses",
    icon: BookOpen,
    roles: ["admin", "superAdmin"],
  },
  {
    href: "/dashboard/admin/support",
    label: "Support",
    icon: HelpCircle,
    roles: ["admin", "superAdmin"],
  },
  {
    href: "/dashboard/admin/calendar",
    label: "Calendar",
    icon: Calendar,
    roles: ["admin", "superAdmin"],
  },
]

interface DashboardSidebarProps {
  className?: string
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const userRole = user?.role || "student"

  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole))

  return (
    <div className={cn("flex flex-col border-r w-64", className)}>
      <div className="px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">LearnHub</span>
        </Link>
      </div>
      <nav className="flex-1 px-6 py-4">
        <ul className="space-y-0.5">
          {filteredNavItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "group flex p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
