import { useOrganizationStore } from "@/stores/organization/organization-store";
import { useMyOrganizations } from "@/features/organizations/organization-queries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Building2, ChevronsUpDown } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function OrganizationSelector() {
  const { selectedOrganization, setSelectedOrganization } =
    useOrganizationStore();
  const { data: organizations, isLoading } = useMyOrganizations();
  const navigate = useNavigate();
  const { isMobile } = useSidebar();

  // Clear selected organization if it's no longer in the list
  useEffect(() => {
    if (
      organizations &&
      selectedOrganization &&
      !organizations.find((org) => org.id === selectedOrganization.id)
    ) {
      setSelectedOrganization(null);
    }
  }, [organizations, selectedOrganization, setSelectedOrganization]);

  if (isLoading || !organizations || organizations.length === 0) {
    return null;
  }

  const handleSelectOrganization = (orgId: string) => {
    const org = organizations.find((o) => o.id === orgId);

    if (org) {
      setSelectedOrganization(org);
      navigate("/client/dashboard");
    }
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {/* <activeTeam.logo className="size-4" /> */}
                  <Avatar>
                    <AvatarImage
                      src={selectedOrganization!.logo_url!}
                      alt={selectedOrganization?.name}
                    />
                    <AvatarFallback>
                      <Building2 className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {selectedOrganization?.name}
                  </span>
                  <span className="truncate text-xs">
                    {selectedOrganization?.role}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Organizations
              </DropdownMenuLabel>
              {organizations.map((organization, index) => (
                <DropdownMenuItem
                  key={organization.name}
                  onClick={() => handleSelectOrganization(organization.id)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    {/* <organization.logo className="size-3.5 shrink-0" /> */}
                    {organization.logo_url ? (
                      <Avatar className="h-6 w-6 rounded-md">
                        <AvatarImage
                          src={organization.logo_url}
                          alt={organization.name}
                        />
                        <AvatarFallback>
                          {organization.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Building2 className="text-muted-foreground size-4" />
                    )}
                  </div>
                  {organization.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              {/* <DropdownMenuSeparator /> */}
              {/* <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Add Organization
                </div>
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
