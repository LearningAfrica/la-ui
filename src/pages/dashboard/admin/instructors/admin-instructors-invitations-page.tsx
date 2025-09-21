import { useState } from "react"
import { ArrowLeft, ArrowUpDown, Calendar, CheckCircle, Clock, Download, Filter, Mail, MoreHorizontal, RefreshCw, Search, Trash2, UserPlus, XCircle } from 'lucide-react'
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Link, useNavigate } from "react-router-dom"
import { InviteInstructorDialog } from "@/components/instructors/invite-instructors-dialog"

// Sample data for invitations
const invitations = [
  {
    id: "inv1",
    email: "john.doe@example.com",
    role: "instructor",
    status: "pending",
    sentDate: "2024-01-15",
    sentBy: {
      name: "Admin User",
      image: "/abstract-geometric-sm.png",
    },
    expiresAt: "2024-01-22",
    message: "Welcome to our platform! We'd love to have you as an instructor.",
    resendCount: 0,
  },
  {
    id: "inv2",
    email: "sarah.wilson@example.com",
    role: "instructor",
    status: "accepted",
    sentDate: "2024-01-10",
    acceptedDate: "2024-01-12",
    sentBy: {
      name: "Admin User",
      image: "/abstract-geometric-sm.png",
    },
    expiresAt: "2024-01-17",
    message: "",
    resendCount: 1,
    acceptedBy: {
      name: "Sarah Wilson",
      image: "/stylized-ej-initials.png",
    },
  },
  {
    id: "inv3",
    email: "mike.johnson@example.com",
    role: "admin",
    status: "expired",
    sentDate: "2024-01-05",
    sentBy: {
      name: "Admin User",
      image: "/abstract-geometric-sm.png",
    },
    expiresAt: "2024-01-12",
    message: "Join our admin team!",
    resendCount: 2,
  },
  {
    id: "inv4",
    email: "lisa.chen@example.com",
    role: "instructor",
    status: "declined",
    sentDate: "2024-01-08",
    declinedDate: "2024-01-10",
    sentBy: {
      name: "Admin User",
      image: "/abstract-geometric-sm.png",
    },
    expiresAt: "2024-01-15",
    message: "We think you'd be a great fit for our platform.",
    resendCount: 0,
  },
  {
    id: "inv5",
    email: "david.brown@example.com",
    role: "instructor",
    status: "pending",
    sentDate: "2024-01-18",
    sentBy: {
      name: "Admin User",
      image: "/abstract-geometric-sm.png",
    },
    expiresAt: "2024-01-25",
    message: "",
    resendCount: 1,
  },
]

export default function AdminInstructorsInvitationsPage() {
  const router = useNavigate()
  const [selectedInvitations, setSelectedInvitations] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  // Filter invitations based on search query, status, and role
  const filteredInvitations = invitations.filter((invitation) => {
    const matchesSearch =
      invitation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invitation.sentBy.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || invitation.status === statusFilter
    const matchesRole = roleFilter === "all" || invitation.role === roleFilter

    return matchesSearch && matchesStatus && matchesRole
  })

  // Toggle selection of all invitations
  const toggleSelectAll = () => {
    if (selectedInvitations.length === filteredInvitations.length) {
      setSelectedInvitations([])
    } else {
      setSelectedInvitations(filteredInvitations.map((invitation) => invitation.id))
    }
  }

  // Toggle selection of a single invitation
  const toggleSelectInvitation = (id: string) => {
    if (selectedInvitations.includes(id)) {
      setSelectedInvitations(selectedInvitations.filter((invitationId) => invitationId !== id))
    } else {
      setSelectedInvitations([...selectedInvitations, id])
    }
  }

  // Resend invitation
  const resendInvitation = (id: string, email: string) => {
    console.warn(`Resending invitation ${id} to ${email}`);
    toast.success(`Invitation resent to ${email}`)
  }

  // Delete invitation
  const deleteInvitation = (id: string, email: string) => {
    console.warn(`Deleting invitation ${id} to ${email}`);
    toast.success(`Invitation to ${email} deleted`)
  }

  // Bulk actions
  const resendSelected = () => {
    toast.success(`${selectedInvitations.length} invitations resent`)
    setSelectedInvitations([])
  }

  const deleteSelected = () => {
    toast.success(`${selectedInvitations.length} invitations deleted`)
    setSelectedInvitations([])
  }

  const exportSelected = () => {
    toast.success(`Exported ${selectedInvitations.length} invitations`)
  }

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return { variant: "success" as const, icon: CheckCircle }
      case "pending":
        return { variant: "warning" as const, icon: Clock }
      case "expired":
        return { variant: "destructive" as const, icon: XCircle }
      case "declined":
        return { variant: "destructive" as const, icon: XCircle }
      default:
        return { variant: "secondary" as const, icon: Clock }
    }
  }

  // Calculate statistics
  const stats = {
    total: invitations.length,
    pending: invitations.filter((inv) => inv.status === "pending").length,
    accepted: invitations.filter((inv) => inv.status === "accepted").length,
    expired: invitations.filter((inv) => inv.status === "expired").length,
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/admin/instructors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Instructors
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Instructor Invitations</h2>
            <p className="text-muted-foreground">Manage and track instructor invitation status</p>
          </div>
        </div>
        <InviteInstructorDialog>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Send New Invitation
          </Button>
        </InviteInstructorDialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invitations</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time invitations sent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accepted}</div>
            <p className="text-xs text-muted-foreground">Successfully joined</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expired}</div>
            <p className="text-xs text-muted-foreground">Need to be resent</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invitation History</CardTitle>
          <CardDescription>
            Track the status of all instructor invitations and manage pending requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search invitations..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Role</SelectLabel>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              {selectedInvitations.length > 0 && (
                <>
                  <Button variant="outline" size="sm" onClick={exportSelected}>
                    <Download className="mr-2 h-4 w-4" />
                    Export ({selectedInvitations.length})
                  </Button>
                  <Button variant="outline" size="sm" onClick={resendSelected}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend ({selectedInvitations.length})
                  </Button>
                  <Button variant="destructive" size="sm" onClick={deleteSelected}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete ({selectedInvitations.length})
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        filteredInvitations.length > 0 && selectedInvitations.length === filteredInvitations.length
                      }
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Button variant="ghost" className="p-0 font-medium">
                      Sent Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Sent By</TableHead>
                  <TableHead className="hidden md:table-cell">Expires</TableHead>
                  <TableHead className="hidden md:table-cell">Resends</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvitations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No invitations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvitations.map((invitation) => {
                    const statusBadge = getStatusBadge(invitation.status)
                    const StatusIcon = statusBadge.icon

                    return (
                      <TableRow key={invitation.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedInvitations.includes(invitation.id)}
                            onCheckedChange={() => toggleSelectInvitation(invitation.id)}
                            aria-label={`Select ${invitation.email}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{invitation.email}</span>
                            {invitation.message && (
                              <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {invitation.message}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusBadge.variant} className="flex items-center gap-1 w-fit">
                            <StatusIcon className="h-3 w-3" />
                            {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(invitation.sentDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={invitation.sentBy.image || "/placeholder.svg"} alt={invitation.sentBy.name} />
                              <AvatarFallback>{invitation.sentBy.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{invitation.sentBy.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span
                            className={`text-sm ${
                              new Date(invitation.expiresAt) < new Date() ? "text-destructive" : "text-muted-foreground"
                            }`}
                          >
                            {new Date(invitation.expiresAt).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="secondary">{invitation.resendCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              {invitation.status === "pending" && (
                                <DropdownMenuItem
                                  onClick={() => resendInvitation(invitation.id, invitation.email)}
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Resend invitation
                                </DropdownMenuItem>
                              )}
                              {invitation.status === "expired" && (
                                <DropdownMenuItem
                                  onClick={() => resendInvitation(invitation.id, invitation.email)}
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Send new invitation
                                </DropdownMenuItem>
                              )}
                              {invitation.acceptedBy && (
                                <DropdownMenuItem
                                  onClick={() => router(`/dashboard/admin/instructors/${invitation.id}`)}
                                >
                                  View instructor profile
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => deleteInvitation(invitation.id, invitation.email)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete invitation
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
