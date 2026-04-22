import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Layers,
  Plus,
} from "lucide-react";
import { useCategories } from "@/features/categories/category-queries";
import { AdminCategoriesGrid } from "@/components/dashboard/admin-categories-grid";
import { useTableFilters } from "@/stores/filters/use-table-filters";
import { useAppModal } from "@/stores/filters/modal-hooks";

export default function ClientDashboardCategories() {
  const createCategoryModal = useAppModal("create-category");
  const { params, state, setPage } = useTableFilters("categoriesFilter");
  const {
    data: categoriesData,
    isLoading,
    isFetching,
    refetch,
  } = useCategories(params);

  const categories = useMemo(
    () => categoriesData?.data ?? [],
    [categoriesData?.data]
  );

  const totalPages = categoriesData?.meta?.total_pages || 1;
  const hasNext = categoriesData?.meta?.has_next_page || false;
  const hasPrev = categoriesData?.meta?.has_prev_page || false;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Content Categories</h1>
        <p className="text-muted-foreground mt-1">
          Organize courses and materials into categories
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
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
            <p className="text-muted-foreground text-xs">Active categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Courses Organized
            </CardTitle>
            <div className="rounded-lg bg-green-600/10 p-2">
              <BookOpen className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground text-xs">
              Across all categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Page</CardTitle>
            <div className="rounded-lg bg-purple-600/10 p-2">
              <Layers className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{categories.length}</div>
            )}
            <p className="text-muted-foreground text-xs">
              Page {state.page} of {totalPages}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Grid */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-52 w-full" />
            ))}
          </div>
        ) : (
          <>
            <AdminCategoriesGrid
              categories={categories}
              onRefresh={() => refetch()}
              isFetching={isFetching}
              toolbarActions={
                <Button size="sm" onClick={() => createCategoryModal.open()}>
                  <Plus className="mr-1 h-4 w-4" />
                  Create Category
                </Button>
              }
            />

            {categories.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                  Page {state.page} of {totalPages} •{" "}
                  {categoriesData?.meta?.total_docs} total categories
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, state.page - 1))}
                    disabled={!hasPrev}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(state.page + 1)}
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
      </div>
    </div>
  );
}
