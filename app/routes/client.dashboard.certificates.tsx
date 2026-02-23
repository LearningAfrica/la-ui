import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

export default function ClientDashboardCertificates() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">My Certificates</h1>
        <p className="text-muted-foreground mt-1">
          View and download your earned certificates
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex items-center justify-center py-12 text-sm">
            Your certificates will appear here once you complete courses.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
