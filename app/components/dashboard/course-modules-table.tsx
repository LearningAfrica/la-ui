import { useMemo } from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CourseModuleDetail } from "@/features/modules/module-queries";
import { MoreHorizontal, Pencil, Trash2, FileText } from "lucide-react";
import { useDeleteModule } from "@/features/modules/module-mutations";
import { useAppModal } from "@/stores/filters/modal-hooks";
import { DataTable } from "@/components/ui/data-table";

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
  const editModal = useAppModal("create-or-update-module");

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
          cell: ({ row }) => {
            const mod = row.original;

            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onViewContents && (
                    <DropdownMenuItem onClick={() => onViewContents(mod)}>
                      <FileText className="mr-2 h-4 w-4" />
                      View Contents
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() =>
                      editModal.open({
                        id: mod.id,
                        title: mod.title,
                        description: mod.description,
                      })
                    }
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() =>
                      deleteModule.mutate({
                        coursePk,
                        id: mod.id,
                        title: mod.title,
                      })
                    }
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        }),
      ] as ColumnDef<CourseModuleDetail, unknown>[],
    [coursePk, onViewContents, deleteModule, editModal]
  );

  return (
    <DataTable
      columns={columns}
      data={modules}
      searchPlaceholder="Search modules..."
      emptyMessage="No modules found."
      onRefresh={onRefresh}
      isFetching={isFetching}
      toolbarActions={toolbarActions}
    />
  );
}
