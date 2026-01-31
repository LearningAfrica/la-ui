import { AppSidebar } from '@/components/app-sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import React from 'react'
import { Outlet } from 'react-router';

export default function ClientDashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader
          title="Client Dashboard"
          notificationCount={3}
        />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
