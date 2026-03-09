import { useMemo } from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ModuleContent } from "@/features/module-contents/module-content-queries";
import { Trash2, ExternalLink } from "lucide-react";
import { useDeleteModuleContent } from "@/features/module-contents/module-content-mutations";
import { DataTable } from "@/components/ui/data-table";

interface ModuleContentsTableProps {
  contents: ModuleContent[];
  coursePk: string;
  modulePk: string;
  onRefresh?: () => void;
  isFetching?: boolean;
  toolbarActions?: React.ReactNode;
}

const columnHelper = createColumnHelper<ModuleContent>();

export function ModuleContentsTable({
  contents,
  coursePk,
  modulePk,
  onRefresh,
  isFetching,
  toolbarActions,
}: ModuleContentsTableProps) {
  const deleteContent = useDeleteModuleContent();

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
          cell: ({ getValue }) => <p className="font-medium">{getValue()}</p>,
        }),
        columnHelper.accessor("content_type", {
          header: "Type",
          cell: ({ getValue }) => (
            <Badge variant="secondary">{getValue()}</Badge>
          ),
        }),
        columnHelper.accessor("order", {
          header: "Order",
          cell: ({ getValue }) => <Badge variant="outline">{getValue()}</Badge>,
        }),
        columnHelper.accessor("content_url", {
          header: "URL",
          cell: ({ getValue }) => {
            const url = getValue();

            return url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                Open
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span className="text-muted-foreground text-sm">--</span>
            );
          },
        }),
        columnHelper.accessor("created", {
          header: "Created",
          cell: ({ getValue }) => (
            <span className="text-sm">
              {new Date(getValue()).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          ),
        }),
        columnHelper.display({
          id: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                deleteContent.mutate({
                  coursePk,
                  modulePk,
                  id: row.original.id,
                  title: row.original.title,
                })
              }
              disabled={deleteContent.isPending}
            >
              <Trash2 className="text-destructive h-4 w-4" />
            </Button>
          ),
        }),
      ] as ColumnDef<ModuleContent, unknown>[],
    [coursePk, modulePk, deleteContent]
  );

  return (
    <DataTable
      columns={columns}
      data={contents}
      searchPlaceholder="Search contents..."
      emptyMessage="No contents found."
      onRefresh={onRefresh}
      isFetching={isFetching}
      toolbarActions={toolbarActions}
    />
  );
}
