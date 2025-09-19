import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAdminRequisitions } from '@/domains/requisitions/admin-requisitions';

import { useInquiries } from './hooks';
import type { Inquiry } from './types';

export interface SuperAdminDashboardOutletContext {
  inquiries: Inquiry[];
  isLoading: boolean;
}

export default function SuperAdminDashboardLayout() {
  useAdminRequisitions();
  const { data: inquiries = [], isLoading, error } = useInquiries();

  if (error) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading admin dashboard</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2 text-3xl font-bold">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage organizations, analytics, and requisitions
          </p>
        </div>

        <DashboardTabs />

        <div className="mt-6">
          <Outlet context={{ inquiries, isLoading }} />
        </div>
      </div>
    </div>
  );
}

function DashboardTabs() {
  const location = useLocation();
  const navigate = useNavigate();

  const value = getTabValue(location.pathname);

  return (
    <Tabs
      value={value}
      className="space-y-6"
      onValueChange={(nextValue) => {
        if (nextValue === value) return;
        navigate(getPathForTab(nextValue));
      }}
    >
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <Building className="h-4 w-4" />
          Analytics
        </TabsTrigger>
        <TabsTrigger value="inquiries" className="flex items-center gap-2">
          <Building className="h-4 w-4" />
          Inquiries
        </TabsTrigger>
        <TabsTrigger value="organizations" className="flex items-center gap-2">
          <Building className="h-4 w-4" />
          Organizations
        </TabsTrigger>
        <TabsTrigger value="requisitions" className="flex items-center gap-2">
          <Building className="h-4 w-4" />
          Requisitions
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

function getTabValue(pathname: string) {
  if (pathname.includes('/inquiries')) return 'inquiries';
  if (pathname.includes('/organizations')) return 'organizations';
  if (pathname.includes('/requisitions')) return 'requisitions';
  return 'analytics';
}

function getPathForTab(value: string) {
  switch (value) {
    case 'inquiries':
      return '/dashboard/super-admin/inquiries';
    case 'organizations':
      return '/dashboard/super-admin/organizations';
    case 'requisitions':
      return '/dashboard/super-admin/requisitions';
    default:
      return '/dashboard/super-admin';
  }
}
