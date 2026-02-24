import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FolderOpen, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useCategories } from "@/features/categories/category-queries";
import { AdminCategoriesTable } from "@/components/dashboard/admin-categories-table";
import { CreateCategoryDialog } from "@/components/dashboard/create-category-dialog";

export default function ClientDashboardCategories() {
  const [page, setPage] = useState(1);
  const {
    data: categoriesData,
    isLoading,
    isFetching,
    refetch,
  } = useCategories(page);

  const categories = useMemo(
    () => categoriesData?.data ?? [],
    [categoriesData?.data]
  );

  const totalPages = categoriesData?.meta?.total_pages || 1;
  const hasNext = categoriesData?.meta?.has_next_page || false;
  const hasPrev = categoriesData?.meta?.has_prev_page || false;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Categories</h1>
          <p className="text-muted-foreground mt-1">
            Organize courses and materials into categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateCategoryDialog />
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`mr-1 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <div className="rounded-lg bg-blue-600/10 p-2">
              <FolderOpen className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {categoriesData?.meta?.total_docs ?? 0}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <AdminCategoriesTable categories={categories} />

              {/* Pagination */}
              {categories.length > 0 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-muted-foreground text-sm">
                    Page {page} of {totalPages} •{" "}
                    {categoriesData?.meta?.total_docs} total categories
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!hasPrev}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!hasNext}
                    >
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
