import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useOrganizationStore } from "@/stores/organization/organization-store";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrganizationGuardProps {
  children: React.ReactNode;
}

export function OrganizationGuard({ children }: OrganizationGuardProps) {
  const { selectedOrganization } = useOrganizationStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedOrganization) {
      navigate("/dashboard", { replace: true });
    }
  }, [selectedOrganization, navigate]);

  if (!selectedOrganization) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="mb-4 h-12 w-12 text-orange-500" />
            <h3 className="mb-2 text-lg font-semibold">
              No Organization Selected
            </h3>
            <p className="text-muted-foreground mb-4 text-center">
              Please select an organization from your dashboard to continue.
            </p>
            <Button variant="gradient" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
