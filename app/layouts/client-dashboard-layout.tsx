import { AppSidebar } from "@/components/app-sidebar";
import { RouteGuard } from "@/components/auth/route-guard";
import { DashboardHeader } from "@/components/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export default function ClientDashboardLayout() {
  return (
    <RouteGuard allowedRoles={["user"]} requireVerified>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader title="Client Dashboard" />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </RouteGuard>
  );
}
