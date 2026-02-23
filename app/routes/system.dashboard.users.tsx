import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShieldCheck, UserCheck, UserX } from "lucide-react";

export default function SystemDashboardUsers() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all platform users
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="rounded-lg bg-blue-600/10 p-2">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">Coming soon</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <div className="rounded-lg bg-purple-600/10 p-2">
              <ShieldCheck className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">Coming soon</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <div className="rounded-lg bg-green-600/10 p-2">
              <UserCheck className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">Coming soon</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unverified</CardTitle>
            <div className="rounded-lg bg-red-600/10 p-2">
              <UserX className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm">Coming soon</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex items-center justify-center py-12 text-sm">
            User management table will be implemented when the API endpoint is
            available.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
