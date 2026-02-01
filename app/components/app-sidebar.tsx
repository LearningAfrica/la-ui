import { Sidebar } from "@/components/ui/sidebar";
import ClientSidebarItems from "./sidebar/client-sidebar-items";
import SystemSidebarItems from "./sidebar/system-sidebar-items";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SystemSidebarItems />
      <ClientSidebarItems />
    </Sidebar>
  );
}
