import { type ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

import type { Inquiry } from "./types"
import { InquiryActions } from "./components/inquiry-actions"

export const inquiryColumns: ColumnDef<Inquiry>[] = [
  {
    accessorKey: "company_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold"
      >
        Company Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.company_name}</div>
        <div className="text-sm text-muted-foreground">{row.original.company_category}</div>
      </div>
    ),
  },
  {
    id: "contact_person",
    header: "Contact Person",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.first_name} {row.original.last_name}</div>
        <div className="text-sm text-muted-foreground">{row.original.contact_email}</div>
      </div>
    ),
  },
  {
    accessorKey: "company_category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.company_category}
      </Badge>
    ),
  },
  {
    accessorKey: "company_size",
    header: "Company Size",
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.original.company_size}
      </Badge>
    ),
  },
  {
    accessorKey: "company_description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-xs truncate" title={row.original.company_description}>
        {row.original.company_description}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <InquiryActions inquiry={row.original} />,
  },
]
