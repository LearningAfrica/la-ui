import { AppSidebar } from "@/components/app-sidebar";
import { RouteGuard } from "@/components/auth/route-guard";
import { DashboardHeader } from "@/components/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export default function SystemDashboardLayout() {
  return (
    <RouteGuard allowedRoles={["super_admin"]} requireVerified>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader title="Admin Dashboard" />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </RouteGuard>
  );
}
