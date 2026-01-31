import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export default function SystemDashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader
          title="Admin Dashboard"
          userName="Admin User"
          userEmail="admin@example.com"
          notificationCount={5}
        />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
