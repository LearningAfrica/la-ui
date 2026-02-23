import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export default function ClientDashboardMyLearning() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">My Learning</h1>
        <p className="text-muted-foreground mt-1">
          Track your enrolled courses and progress
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Enrolled Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex items-center justify-center py-12 text-sm">
            Your enrolled courses will appear here once the learning API is
            integrated.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
