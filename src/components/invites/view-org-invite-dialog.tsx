import { Building2, Calendar, Mail, MessageSquare } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Invitation {
  id: string
  organizationName: string
  organizationLogo: string
  role: "instructor" | "admin"
  invitedBy: {
    name: string
    email: string
    avatar: string
  }
  message: string
  sentDate: string
  expiresDate: string
  status: "pending" | "accepted" | "declined" | "expired"
}

interface ViewOrgInviteDialogProps {
  invitation: Invitation
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getRoleBadge = (role: string) => {
  switch (role) {
    case "instructor":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">Instructor</Badge>
    case "admin":
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800">Admin</Badge>
    default:
      return <Badge variant="outline">{role}</Badge>
  }
}

const getStatusBadge = (status: string, expiresDate: string) => {
  const isExpired = new Date(expiresDate) < new Date()
  const finalStatus = isExpired ? "expired" : status

  switch (finalStatus) {
    case "pending":
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>
    case "accepted":
      return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Accepted</Badge>
    case "declined":
      return <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Declined</Badge>
    case "expired":
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Expired</Badge>
    default:
      return <Badge variant="secondary">{finalStatus}</Badge>
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function ViewOrgInviteDialog({
  invitation,
  open,
  onOpenChange,
}: ViewOrgInviteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Invitation Details
          </DialogTitle>
          <DialogDescription>
            Complete information about this organization invitation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Organization Header */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Avatar className="h-16 w-16">
              <AvatarImage src={invitation.organizationLogo || "/placeholder.svg"} alt={invitation.organizationName} />
              <AvatarFallback>
                <Building2 className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-xl">{invitation.organizationName}</h3>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Role:</span>
                  {getRoleBadge(invitation.role)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  {getStatusBadge(invitation.status, invitation.expiresDate)}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Invitation Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="font-medium">Invitation Information</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Sent:</span>
                  <span>{formatDate(invitation.sentDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Expires:</span>
                  <span>{formatDate(invitation.expiresDate)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Invited By</h4>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={invitation.invitedBy.avatar || "/placeholder.svg"} alt={invitation.invitedBy.name} />
                  <AvatarFallback>
                    {invitation.invitedBy.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{invitation.invitedBy.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {invitation.invitedBy.email}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Message */}
          {invitation.message && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium">Personal Message</h4>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm leading-relaxed">{invitation.message}</p>
                </div>
              </div>
            </>
          )}

          {/* Role Permissions */}
          <Separator />
          <div className="space-y-3">
            <h4 className="font-medium">Role Permissions</h4>
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <p className="text-sm font-medium mb-2">
                As an {invitation.role}, you would be able to:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {invitation.role === "instructor" ? (
                  <>
                    <li>• Create and manage courses</li>
                    <li>• Interact with students through discussions</li>
                    <li>• Access instructor dashboard and analytics</li>
                    <li>• Upload course materials and resources</li>
                    <li>• Grade assignments and provide feedback</li>
                  </>
                ) : (
                  <>
                    <li>• Manage organization settings and policies</li>
                    <li>• Oversee all courses and instructors</li>
                    <li>• Access comprehensive admin dashboard</li>
                    <li>• View detailed analytics and reports</li>
                    <li>• Manage user accounts and permissions</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
