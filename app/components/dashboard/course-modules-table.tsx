import { useMemo } from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CourseModuleDetail } from "@/features/modules/module-queries";
import { Trash2, FileText, Pencil } from "lucide-react";
import { useDeleteModule } from "@/features/modules/module-mutations";
import { useAppModal } from "@/stores/filters/modal-hooks";
import { DataTable } from "@/components/ui/data-table";
import { EditModuleDialog } from "@/components/dashboard/edit-module-dialog";

interface CourseModulesTableProps {
  modules: CourseModuleDetail[];
  coursePk: string;
  onViewContents?: (module: CourseModuleDetail) => void;
  onRefresh?: () => void;
  isFetching?: boolean;
  toolbarActions?: React.ReactNode;
}

const columnHelper = createColumnHelper<CourseModuleDetail>();

export function CourseModulesTable({
  modules,
  coursePk,
  onViewContents,
  onRefresh,
  isFetching,
  toolbarActions,
}: CourseModulesTableProps) {
  const deleteModule = useDeleteModule();
  const editModal = useAppModal("edit-module");

  const columns = useMemo(
    () =>
      [
        columnHelper.display({
          id: "index",
          header: "#",
          cell: ({ row }) => <span>{row.index + 1}</span>,
        }),
        columnHelper.accessor("title", {
          header: "Title",
          cell: ({ row }) => (
            <div>
              <p className="font-medium">{row.original.title}</p>
              {row.original.description && (
                <p className="text-muted-foreground max-w-xs truncate text-xs">
                  {row.original.description}
                </p>
              )}
            </div>
          ),
        }),
        columnHelper.display({
          id: "contents_count",
          header: "Contents",
          cell: ({ row }) => (
            <Badge variant="secondary">{row.original.contents.length}</Badge>
          ),
        }),
        columnHelper.display({
          id: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <div className="flex items-center gap-1">
              {onViewContents && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewContents(row.original)}
                >
                  <FileText className="mr-1 h-4 w-4" />
                  Contents
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  editModal.open({
                    id: row.original.id,
                    title: row.original.title,
                    description: row.original.description,
                  })
                }
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  deleteModule.mutate({
                    coursePk,
                    id: row.original.id,
                    title: row.original.title,
                  })
                }
                disabled={deleteModule.isPending}
              >
                <Trash2 className="text-destructive h-4 w-4" />
              </Button>
            </div>
          ),
        }),
      ] as ColumnDef<CourseModuleDetail, unknown>[],
    [coursePk, onViewContents, deleteModule, editModal]
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={modules}
        searchPlaceholder="Search modules..."
        emptyMessage="No modules found."
        onRefresh={onRefresh}
        isFetching={isFetching}
        toolbarActions={toolbarActions}
      />
      <EditModuleDialog coursePk={coursePk} />
    </>
  );
}
