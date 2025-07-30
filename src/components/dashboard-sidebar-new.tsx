import { Link, useLocation } from 'react-router-dom';
import {
  ChevronRight,
  GraduationCap,
  LogOut,
  Plus,
  Settings,
  User,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar';

import { useAuth } from '@/hooks/use-auth';
import { DASHBOARD_SIDEBAR_NAV_LINKS } from '@/lib/data/sidebar-nav-links';
import { useOrganization } from '@/hooks/use-organizations';
import { Separator } from './ui/separator';

import type { Organization } from '@/lib/types/organization';

interface DashboardSidebarProps {
  className?: string;
  onNavigate?: (page: string) => void;
  onWorkspaceChange?: (workspace: Organization) => void;
}

export function DashboardSidebar({
  className,
  onNavigate,
  onWorkspaceChange,
}: DashboardSidebarProps) {
  const { user } = useAuth();
  const auth = useAuth();
  const pathname = useLocation().pathname;

  const userRole = user?.role || 'student';
  const currentOrganization = auth.getCurrentOrganization();

  // Function to get the organization logo or fallback to its first letter
  const getOrganizationIcon = (organization: any) => {
    return organization?.name?.charAt(0).toUpperCase() || 'O';
  };

  // Filter nav items based on user role
  const filteredNavItems = DASHBOARD_SIDEBAR_NAV_LINKS.filter((item) =>
    item.roles.includes(userRole)
  );

  // Handle organization change
  const handleOrganizationChange = (organization: any) => {
    auth.changeCurrentOrganization(organization.id);
    if (onWorkspaceChange) {
      onWorkspaceChange(organization);
    }
  };

  // Handle navigation click
  const handleNavigation = (title: string) => {
    setActiveItem(title);
    if (onNavigate) {
      onNavigate(title);
    }
  };

  if (!currentOrganization) {
    return null;
  }

  return (
    <Sidebar collapsible="icon" className={className}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/" className="flex items-center gap-2 p-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold">Learning Africa</span>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="text-base font-semibold">
                      {getOrganizationIcon(currentOrganization)}
                    </span>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{currentOrganization.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {currentOrganization.position || 'Switch organization'}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[280px] rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Current organization
                </DropdownMenuLabel>
                <div className="mt-2 flex items-center gap-3 rounded-md bg-muted/50 p-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-background shadow">
                    <span className="text-base font-semibold">{getOrganizationIcon(currentOrganization)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{currentOrganization.name}</span>
                    {currentOrganization.position && (
                      <span className="text-xs text-muted-foreground">{currentOrganization.position}</span>
                    )}
                  </div>
                  <div className="ml-auto">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      ✓
                    </span>
                  </div>
                </div>

                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuLabel className="text-xs text-muted-foreground">All organizations</DropdownMenuLabel>
                <div className="max-h-[230px] overflow-y-auto py-1">
                  {auth.user?.organizations.map((organization) => (
                    <DropdownMenuItem
                      key={organization.id}
                      onClick={() => handleOrganizationChange(organization)}
                      disabled={currentOrganization.id === organization.id}
                      className="flex items-center gap-3 p-2"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-background">
                        <span className="text-base font-semibold">{getOrganizationIcon(organization)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{organization.name}</span>
                        {organization.position && (
                          <span className="text-xs text-muted-foreground">{organization.position}</span>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>

                {userRole === 'super_admin' || userRole === 'admin' ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 p-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md border bg-background">
                        <Plus className="h-4 w-4" />
                      </div>
                      <div className="font-medium text-muted-foreground">Add organization</div>
                    </DropdownMenuItem>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Separator className="my-2" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {/* Dashboard Item */}
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Dashboard"
                isActive={pathname === '/dashboard'}
                onClick={() => handleNavigation('Dashboard')}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Dynamic Nav Items */}
            {filteredNavItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                {item.children?.length ? (
                  <Collapsible asChild className="group/collapsible">
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.label} isActive={pathname.startsWith(item.href)}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.href}
                              >
                                <Link to={subItem.href} onClick={() => handleNavigation(subItem.label)}>
                                  <span>{subItem.label}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                ) : (
                  <SidebarMenuButton
                    asChild
                    tooltip={item.label}
                    isActive={pathname === item.href}
                  >
                    <Link to={item.href} onClick={() => handleNavigation(item.label)}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/placeholder-user.jpg" alt={user?.username || "User"} />
                    <AvatarFallback className="rounded-lg">
                      {user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.username || "User"}</span>
                    <span className="truncate text-xs">{user?.email || ""}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="/placeholder-user.jpg" alt={user?.username || "User"} />
                      <AvatarFallback className="rounded-lg">
                        {user?.username?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.username || "User"}</span>
                      <span className="truncate text-xs">{user?.email || ""}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => auth.logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
