import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreVertical,
  Pencil,
  Trash2,
  ClipboardCheck,
  RefreshCw,
} from "lucide-react";
import type { Quiz } from "@/features/quizzes/quiz-queries";
import { useDeleteQuiz } from "@/features/quizzes/quiz-mutations";

interface QuizzesTableProps {
  quizzes: Quiz[];
  coursePk: string;
  modulePk: string;
  onRefresh?: () => void;
  isFetching?: boolean;
  toolbarActions?: React.ReactNode;
}

export function QuizzesTable({
  quizzes,
  coursePk,
  modulePk,
  onRefresh,
  isFetching = false,
  toolbarActions,
}: QuizzesTableProps) {
  const deleteQuiz = useDeleteQuiz();
  const [pendingDelete, setPendingDelete] = useState<Quiz | null>(null);

  const columns = useMemo<ColumnDef<Quiz>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <ClipboardCheck className="text-muted-foreground h-4 w-4" />
            <span className="font-medium">{row.original.title}</span>
          </div>
        ),
      },
      {
        accessorKey: "questions",
        header: "Questions",
        cell: ({ row }) => (
          <Badge variant="secondary">
            {row.original.questions?.length ?? 0}
          </Badge>
        ),
      },
      {
        accessorKey: "passing_score",
        header: "Pass Mark",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.passing_score}%</span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const quiz = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to={`/client/dashboard/courses/${coursePk}/modules/${modulePk}/quizzes/${quiz.id}/edit`}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Quiz
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setPendingDelete(quiz)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Quiz
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [coursePk, modulePk]
  );

  const table = useReactTable({
    data: quizzes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;

    deleteQuiz.mutate(
      {
        coursePk,
        modulePk,
        id: pendingDelete.id,
        title: pendingDelete.title,
      },
      { onSettled: () => setPendingDelete(null) }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">{toolbarActions}</div>
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        )}
      </div>

      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {table.getHeaderGroups()[0]?.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-muted-foreground px-4 py-8 text-center text-sm"
                  >
                    No quizzes yet. Add one manually or generate with AI.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-muted/50 border-t transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `"${pendingDelete.title}" and all its questions will be permanently removed.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteQuiz.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteQuiz.isPending}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
