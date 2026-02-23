import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function ClientDashboardCourses() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="text-muted-foreground mt-1">
          Browse and manage courses in your workspace
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            All Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex items-center justify-center py-12 text-sm">
            Course management will be available once the course API is
            integrated.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
