import { useMemo } from "react";
import { Link } from "react-router";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ModuleContent } from "@/features/module-contents/module-content-queries";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  ExternalLink,
} from "lucide-react";
import { useAppModal } from "@/stores/filters/modal-hooks";
import { DataTable } from "@/components/ui/data-table";
import { DeleteContentDialog } from "./delete-content-dialog";

interface ModuleContentsTableProps {
  contents: ModuleContent[];
  coursePk: string;
  modulePk: string;
  onRefresh?: () => void;
  isFetching?: boolean;
  toolbarActions?: React.ReactNode;
}

const columnHelper = createColumnHelper<ModuleContent>();

const contentTypeBadgeVariant = (type: string) => {
  switch (type) {
    case "text":
      return "default";
    case "video":
      return "secondary";
    case "file":
      return "outline";
    default:
      return "secondary";
  }
};

export function ModuleContentsTable({
  contents,
  coursePk,
  modulePk,
  onRefresh,
  isFetching,
  toolbarActions,
}: ModuleContentsTableProps) {
  const viewModal = useAppModal("view-content");
  const deleteModal = useAppModal("delete-content");

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
          cell: ({ getValue }) => (
            <p className="max-w-50 truncate font-medium">{getValue()}</p>
          ),
        }),
        columnHelper.accessor("content_type", {
          header: "Type",
          cell: ({ getValue }) => (
            <Badge variant={contentTypeBadgeVariant(getValue())}>
              {getValue()}
            </Badge>
          ),
        }),
        columnHelper.accessor("order", {
          header: "Order",
          cell: ({ getValue }) => <Badge variant="outline">{getValue()}</Badge>,
        }),
        columnHelper.display({
          id: "preview",
          header: "Preview",
          cell: ({ row }) => {
            const content = row.original;

            if (content.content_type === "video" && content.data.video_url) {
              return (
                <a
                  href={content.data.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  Open
                  <ExternalLink className="h-3 w-3" />
                </a>
              );
            }

            if (content.content_type === "text") {
              return (
                <span className="text-muted-foreground max-w-37.5 truncate text-sm">
                  {content.data.body?.replace(/<[^>]*>/g, "").slice(0, 50) ??
                    "—"}
                </span>
              );
            }

            if (content.content_type === "file" && content.data.file_name) {
              return (
                <span className="text-muted-foreground text-sm">
                  {content.data.file_name}
                </span>
              );
            }

            return <span className="text-muted-foreground text-sm">—</span>;
          },
        }),
        columnHelper.display({
          id: "created_at",
          header: "Created",
          cell: ({ row }) => (
            <span className="text-sm">
              {new Date(row.original.data.created_at).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </span>
          ),
        }),
        columnHelper.display({
          id: "actions",
          header: "Actions",
          cell: ({ row }) => {
            const content = row.original;

            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => viewModal.open(content)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/client/dashboard/courses/${coursePk}/modules/${modulePk}/contents/${content.id}/edit`}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() =>
                      deleteModal.open({
                        coursePk,
                        modulePk,
                        id: content.id,
                        title: content.title,
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
      ] as ColumnDef<ModuleContent, unknown>[],
    [coursePk, modulePk, viewModal, deleteModal]
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={contents}
        searchPlaceholder="Search contents..."
        emptyMessage="No contents found."
        onRefresh={onRefresh}
        isFetching={isFetching}
        toolbarActions={toolbarActions}
      />
      <DeleteContentDialog />
    </>
  );
}
