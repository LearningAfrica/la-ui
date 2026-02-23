import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, CheckCircle, XCircle, Clock } from "lucide-react";

export default function SystemDashboardOrganizations() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Organizations</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all platform organizations
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Organizations
            </CardTitle>
            <div className="rounded-lg bg-blue-600/10 p-2">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">Coming soon</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <div className="rounded-lg bg-green-600/10 p-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">Coming soon</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Setup</CardTitle>
            <div className="rounded-lg bg-yellow-600/10 p-2">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">Coming soon</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deactivated</CardTitle>
            <div className="rounded-lg bg-red-600/10 p-2">
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">Coming soon</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex items-center justify-center py-12 text-sm">
            Organization management table will be implemented when the API
            endpoint is available.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
