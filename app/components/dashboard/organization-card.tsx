import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, ArrowRight } from "lucide-react";
import type { MyOrganization } from "@/features/organizations/organization-queries";
import { useOrganizationStore } from "@/stores/organization/organization-store";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

interface OrganizationCardProps {
  organization: MyOrganization;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  const { setSelectedOrganization } = useOrganizationStore();
  const navigate = useNavigate();

  const handleOpenOrganization = () => {
    setSelectedOrganization(organization);
    navigate("/client/dashboard");
  };

  return (
    <Card className="group transition-all hover:border-orange-300 hover:shadow-lg dark:hover:border-orange-700">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {organization.logo_url ? (
              <img
                src={organization.logo_url}
                alt={organization.name}
                className="h-12 w-12 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-orange-400 to-amber-500">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg group-hover:text-orange-600 dark:group-hover:text-orange-400">
                {organization.name}
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                {organization.role}
              </p>
            </div>
          </div>
          <Badge variant={organization.is_active ? "default" : "secondary"}>
            {organization.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {organization.description && (
          <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
            {organization.description}
          </p>
        )}
        {/* <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="text-muted-foreground h-4 w-4" />
            <span>{organization.member_count} Members</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="text-muted-foreground h-4 w-4" />
            <span>{organization.course_count} Courses</span>
          </div>
        </div> */}
        <div className="text-muted-foreground mt-4 flex items-center gap-2 text-xs">
          <Calendar className="h-3 w-3" />
          <span>
            Created {new Date(organization.created_at).toLocaleDateString()}
          </span>
        </div>
        <Button
          onClick={handleOpenOrganization}
          variant="gradient"
          className="mt-4 w-full"
          disabled={!organization.is_active}
        >
          Open Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
