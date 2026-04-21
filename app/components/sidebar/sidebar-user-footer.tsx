import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Link, href } from "react-router";
import { LogOut, Settings, User } from "lucide-react";
import { useAuthStore } from "@/stores/auth/auth-hooks";

export default function SidebarUserFooter() {
  const { user, logout, role } = useAuthStore();
  const profileHref =
    role === "super_admin" ? href("/system/profile") : href("/client/profile");

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            asChild
            tooltip={
              user
                ? `${user.first_name} ${user.last_name}`.trim() ||
                  (user.email ?? "")
                : undefined
            }
          >
            <Link to={profileHref}>
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                <User className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">
                  {user?.first_name} {user?.last_name}
                </span>
                <span className="text-sidebar-foreground/70 truncate text-xs">
                  {user?.email}
                </span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Settings">
            <Link to={profileHref}>
              <Settings />
              <span>Settings</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            tooltip="Logout"
            className="text-red-600 hover:bg-red-50 hover:text-red-700 focus-visible:ring-red-200 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
          >
            <button type="button" onClick={logout}>
              <LogOut />
              <span>Logout</span>
            </button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
