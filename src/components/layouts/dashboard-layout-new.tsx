import { Outlet } from "react-router-dom";
import { DashboardSidebarNew } from "@/components/dashboard-sidebar-new2";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <DashboardSidebarNew />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
