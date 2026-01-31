import { AppSidebar } from '@/components/app-sidebar';
import { Button } from '@/components/ui/button';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useTheme } from '@/providers/theme-provider';
import { Monitor, Moon, Sun } from 'lucide-react';
import React from 'react'
import { Outlet } from 'react-router';
export default function ClientDashboardLayout() {
  const {setTheme,theme} = useTheme();
  const getThemeIcon = () => {
    if (theme === "light") return <Sun className="size-4" />;

    if (theme === "dark") return <Moon className="size-4" />;

    return <Monitor className="size-4" />;
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  return (
      <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Current theme: ${theme}`}
          >
            {getThemeIcon()}
          </Button>
        </header>
       <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
