import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { ScrollArea } from './ui/scroll-area';
import { OrganizationSwitcher } from './organization-switcher';
import { DASHBOARD_SIDEBAR_NAV_LINKS } from '@/lib/data/sidebar-nav-links';
import { GraduationCap } from 'lucide-react';
import { Separator } from './ui/separator';
import { UserNav } from './user-nav';

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = useLocation().pathname;
  const { user } = useAuth();
  const userRole = user?.role || 'student';

  const filteredNavItems = DASHBOARD_SIDEBAR_NAV_LINKS.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <div className={cn('flex w-64 flex-col border-r', className)}>
      <div className="flex items-center justify-between p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="text-xl font-bold">Learning Africa</span>
        </Link>
        <UserNav />
      </div>

      <div className="px-6 pb-4">
        <OrganizationSwitcher />
      </div>

      <Separator />
      <ScrollArea className='className="flex-1 space-y-4"'>
        <nav className="flex-1 px-6 py-4">
          <ul className="space-y-0.5">
            {filteredNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    'group hover:bg-accent hover:text-accent-foreground flex rounded-md p-2 text-sm font-medium',
                    pathname === item.href
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground',
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
    </div>
  );
}
