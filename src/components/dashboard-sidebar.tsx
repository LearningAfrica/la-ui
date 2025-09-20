import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { DASHBOARD_SIDEBAR_NAV_LINKS } from '@/lib/data/sidebar-nav-links';
import {
  GraduationCap,
  ChevronDown,
  ChevronRight,
  X,
  LogOut as LogoutIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { OrganizationSwitcher } from './organization-switcher';
import { Button } from './ui/button';
import { useSidebarStore } from '@/store/sidebar-store';
import { useEffect, useMemo } from 'react';

interface DashboardSidebarProps {
  className?: string;
  collapsed?: boolean;
  onClose?: () => void;
}

// Recursive component for rendering nested children
function RecursiveChildrenPanel({
  items,
  level = 0,
  onNavigate,
}: {
  items: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  level?: number;
  onNavigate: () => void;
}) {
  const pathname = useLocation().pathname;

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="bg-popover border-border max-w-64 min-w-48 rounded-md border shadow-lg">
      {items.map((item) => {
        const hasChildren = item.items && item.items.length > 0;
        const isActive = isActiveLink(item.href);

        return (
          <div key={item.href} className="group relative">
            <Link
              to={item.href}
              className={cn(
                'hover:bg-accent flex items-center gap-3 px-3 py-2 text-sm whitespace-nowrap transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground',
              )}
              onClick={onNavigate}
            >
              <item.icon className="h-3 w-3 flex-shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {hasChildren && (
                <ChevronRight className="text-muted-foreground h-3 w-3" />
              )}
            </Link>

            {/* Recursive children panel */}
            {hasChildren && (
              <div className="pointer-events-none absolute top-0 left-full z-50 ml-1 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
                <RecursiveChildrenPanel
                  items={item.items}
                  level={level + 1}
                  onNavigate={onNavigate}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function DashboardSidebar({
  className,
  collapsed = false,
  onClose,
}: DashboardSidebarProps) {
  const pathname = useLocation().pathname;
  const { user, current_org_id, getCurrentOrganization, logout } = useAuth();
  const userRole = user?.user_role || 'user';

  // Zustand store for sidebar state
  const { expandedSections, toggleSection, autoExpandActiveSections } =
    useSidebarStore();

  const currentOrgRole = useMemo(() => {
    if (user && Array.isArray(user.organizations)) {
      if (current_org_id) {
        return getCurrentOrganization()!.role!;
      }
      return null;
    }
    return null;
  }, [user, current_org_id, getCurrentOrganization]);
  const filteredNavItems = DASHBOARD_SIDEBAR_NAV_LINKS.filter((item) => {
    // return currentOrgRole
    //   ? item.orgRole.includes(currentOrgRole) &&
    //     item.systemRole.includes(userRole!)
    //   : item.systemRole.includes(userRole!)
    if (currentOrgRole) {
      console.log(
        `[DashboardSidebar-Org] currentOrgRole: ${currentOrgRole}, userRole: ${userRole}, href: ${item.href}`,
      );

      return (
        item.orgRole.includes(currentOrgRole) &&
        item.systemRole.includes(userRole!) &&
        item.orgRole.length > 0
      );
    } else {
      console.log(
        `[DashboardSidebar-Sys] currentOrgRole: ${currentOrgRole}, userRole: ${userRole}, href: ${item.href}`,
      );
      return item.systemRole.includes(userRole!) && !item.requiresOrg;
    }
  });

  // Get main navigation items (excluding bottom section items)
  const mainNavItems = filteredNavItems.filter(
    (item) => item.section !== 'bottom',
  );
  const bottomNavItems = filteredNavItems.filter(
    (item) => item.section === 'bottom',
  );

  const isSectionExpanded = (sectionLabel: string) => {
    return expandedSections.includes(sectionLabel);
  };

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  const isAnyChildActive = (items?: { href: string }[]) => {
    if (!items) return false;
    return items.some((item) => isActiveLink(item.href));
  };

  // Auto-expand sections that have active children
  useEffect(() => {
    const parentSections = mainNavItems.filter(
      (item) => item.isParent && item.items,
    );
    if (parentSections.length > 0) {
      autoExpandActiveSections(parentSections, pathname);
    }
  }, [pathname, autoExpandActiveSections, mainNavItems]);

  // Only show collapsed version on desktop when collapsed is true
  if (collapsed) {
    return (
      <div className={cn('relative flex h-full flex-col', className)}>
        {/* Header - collapsed */}
        <div className="border-border border-b p-2">
          <div className="flex items-center justify-center">
            <div className="bg-primary text-primary-foreground rounded-lg p-2">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Organization switcher - collapsed */}
        <div className="border-border border-b p-2">
          <div className="flex items-center justify-center">
            <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-full">
              <span className="text-primary-foreground text-xs font-medium">
                P
              </span>
            </div>
          </div>
        </div>

        {/* Navigation menu - collapsed */}
        <div className="flex-1 p-2">
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              if (item.isParent && item.items) {
                const hasActiveChild = isAnyChildActive(item.items);

                return (
                  <div key={item.label} className="group relative">
                    <button
                      className={cn(
                        'relative flex w-full items-center justify-center rounded-md p-2 text-sm transition-colors',
                        hasActiveChild
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-primary',
                      )}
                    >
                      <item.icon className="h-4 w-4" />

                      {/* Floating indicator for parent items */}
                      <div className="bg-primary absolute top-1/2 -right-1 h-2 w-2 -translate-y-1/2 rounded-full opacity-60"></div>
                    </button>

                    {/* Tooltip for collapsed state */}
                    <div className="bg-popover text-popover-foreground border-border pointer-events-none absolute left-full z-50 ml-2 rounded border px-2 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100">
                      {item.label}
                    </div>

                    {/* Recursive right panel for children */}
                    {item.items && item.items.length > 0 && (
                      <div className="pointer-events-none absolute top-0 left-full z-50 ml-1 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
                        <RecursiveChildrenPanel
                          items={item.items}
                          onNavigate={() => {}}
                        />
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div key={item.href} className="group relative">
                    <Link
                      to={item.href}
                      className={cn(
                        'flex w-full items-center justify-center rounded-md p-2 text-sm transition-colors',
                        isActiveLink(item.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-primary',
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </Link>

                    {/* Tooltip for collapsed state */}
                    <div className="bg-popover text-popover-foreground border-border pointer-events-none absolute left-full z-50 ml-2 rounded border px-2 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100">
                      {item.label}
                    </div>
                  </div>
                );
              }
            })}
          </nav>
        </div>

        {/* User info - collapsed */}
        <div className="border-border border-t p-2">
          <div className="flex items-center justify-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {user?.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Header */}
      <div className="border-border flex-shrink-0 border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground rounded-lg p-2">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-foreground text-lg font-semibold">
                Learning Africa
              </h1>
              <p className="text-muted-foreground text-xs">
                Education Platform
              </p>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Organization switcher */}
      <div className="border-border flex-shrink-0 border-b p-4">
        <OrganizationSwitcher />
      </div>

      {/* Scrollable Navigation menu */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            if (item.isParent && item.items) {
              const isExpanded = isSectionExpanded(item.label);
              const hasActiveChild = isAnyChildActive(item.items);

              return (
                <div key={item.label} className="relative">
                  <button
                    onClick={() => toggleSection(item.label)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      hasActiveChild
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-primary',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-1 ml-6 space-y-1">
                      {item.items.map((childItem) => (
                        <Link
                          key={childItem.href}
                          to={childItem.href}
                          className={cn(
                            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                            isActiveLink(childItem.href)
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:bg-accent hover:text-primary',
                          )}
                        >
                          <childItem.icon className="h-4 w-4" />
                          {childItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            } else {
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActiveLink(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-primary',
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            }
          })}
        </nav>
      </div>

      {/* Fixed User info at bottom with dropdown */}
      <div className="border-border flex-shrink-0 border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hover:bg-accent flex w-full cursor-pointer items-center gap-3 rounded-md p-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user?.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-foreground truncate text-sm font-medium">
                  {user?.email}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {user?.user_role}
                </p>
              </div>
              <ChevronDown className="text-muted-foreground h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm leading-none font-medium">
                  {user?.email}
                </p>
                <p className="text-muted-foreground text-xs leading-none">
                  {user?.user_role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {bottomNavItems.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link to={item.href} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                logout();
              }}
              className="text-destructive"
            >
              <LogoutIcon className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
