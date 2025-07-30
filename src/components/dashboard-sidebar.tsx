import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { DASHBOARD_SIDEBAR_NAV_LINKS } from '@/lib/data/sidebar-nav-links';
import { GraduationCap, ChevronDown, ChevronRight, User, X } from 'lucide-react';
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
import { useEffect } from 'react';

interface DashboardSidebarProps {
  className?: string;
  collapsed?: boolean;
  onClose?: () => void;
}

// Recursive component for rendering nested children
function RecursiveChildrenPanel({
  items,
  level = 0,
  onNavigate
}: {
  items: any[], // eslint-disable-line @typescript-eslint/no-explicit-any
  level?: number,
  onNavigate: () => void
}) {
  const pathname = useLocation().pathname;

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="bg-popover border border-border rounded-md shadow-lg min-w-48 max-w-64">
      {items.map((item) => {
        const hasChildren = item.items && item.items.length > 0;
        const isActive = isActiveLink(item.href);

        return (
          <div key={item.href} className="relative group">
            <Link
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-accent whitespace-nowrap',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground'
              )}
              onClick={onNavigate}
            >
              <item.icon className="h-3 w-3 flex-shrink-0" />
              <span className="truncate flex-1">{item.label}</span>
              {hasChildren && (
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              )}
            </Link>

            {/* Recursive children panel */}
            {hasChildren && (
              <div className="absolute left-full top-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50">
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

export function DashboardSidebar({ className, collapsed = false, onClose }: DashboardSidebarProps) {
  const pathname = useLocation().pathname;
  const { user } = useAuth();
  const userRole = user?.role || 'student';

  // Zustand store for sidebar state
  const {
    expandedSections,
    toggleSection,
    autoExpandActiveSections,
  } = useSidebarStore();

  const filteredNavItems = DASHBOARD_SIDEBAR_NAV_LINKS.filter((item) =>
    item.roles.includes(userRole),
  );

  // Get main navigation items (excluding bottom section items)
  const mainNavItems = filteredNavItems.filter(item => item.section !== 'bottom');
  const bottomNavItems = filteredNavItems.filter(item => item.section === 'bottom');

  const isSectionExpanded = (sectionLabel: string) => {
    return expandedSections.includes(sectionLabel);
  };

  const isActiveLink = (href: string) => {
    return pathname === href;
  };

  const isAnyChildActive = (items?: { href: string }[]) => {
    if (!items) return false;
    return items.some(item => isActiveLink(item.href));
  };

  // Auto-expand sections that have active children
  useEffect(() => {
    const parentSections = mainNavItems.filter(item => item.isParent && item.items);
    if (parentSections.length > 0) {
      autoExpandActiveSections(parentSections, pathname);
    }
  }, [pathname]);

  // Only show collapsed version on desktop when collapsed is true
  if (collapsed) {
    return (
      <div className={cn('flex h-full flex-col relative', className)}>
        {/* Header - collapsed */}
        <div className="p-2 border-b border-border">
          <div className="flex items-center justify-center">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Organization switcher - collapsed */}
        <div className="p-2 border-b border-border">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-medium">P</span>
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
                  <div key={item.label} className="relative group">
                    <button
                      className={cn(
                        'flex items-center justify-center w-full p-2 rounded-md text-sm transition-colors relative',
                        hasActiveChild
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-primary'
                      )}
                    >
                      <item.icon className="h-4 w-4" />

                      {/* Floating indicator for parent items */}
                      <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full opacity-60"></div>
                    </button>

                    {/* Tooltip for collapsed state */}
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-border">
                      {item.label}
                    </div>

                    {/* Recursive right panel for children */}
                    {item.items && item.items.length > 0 && (
                      <div className="absolute left-full top-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50">
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
                  <div key={item.href} className="relative group">
                    <Link
                      to={item.href}
                      className={cn(
                        'flex items-center justify-center w-full p-2 rounded-md text-sm transition-colors',
                        isActiveLink(item.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-primary'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </Link>

                    {/* Tooltip for collapsed state */}
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-border">
                      {item.label}
                    </div>
                  </div>
                );
              }
            })}
          </nav>
        </div>

        {/* User info - collapsed */}
        <div className="p-2 border-t border-border">
          <div className="flex items-center justify-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {user?.username?.[0]?.toUpperCase()}
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
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Learning Africa</h1>
              <p className="text-xs text-muted-foreground">Education Platform</p>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Organization switcher */}
      <div className="p-4 border-b border-border flex-shrink-0">
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
                      'flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      hasActiveChild
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-primary'
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
                    <div className="ml-6 mt-1 space-y-1">
                      {item.items.map((childItem) => (
                        <Link
                          key={childItem.href}
                          to={childItem.href}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                            isActiveLink(childItem.href)
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:bg-accent hover:text-primary'
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
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActiveLink(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-primary'
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
      <div className="p-4 border-t border-border flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer w-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.role}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.username}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.role}
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
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
