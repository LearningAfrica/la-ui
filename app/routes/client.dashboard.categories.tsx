import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";

export default function ClientDashboardCategories() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Content Categories</h1>
        <p className="text-muted-foreground mt-1">
          Organize courses and materials into categories
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex items-center justify-center py-12 text-sm">
            Category management will be available once the API is integrated.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
