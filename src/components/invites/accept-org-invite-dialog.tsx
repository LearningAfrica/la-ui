import { useState } from "react"
import { Check, Building2, User, Calendar } from 'lucide-react'
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

interface AcceptOrgInviteDialogProps {
  invitation: Invitation
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccept: (invitationId: string) => Promise<void>
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function AcceptOrgInviteDialog({
  invitation,
  open,
  onOpenChange,
  onAccept,
}: AcceptOrgInviteDialogProps) {
  const [isAccepting, setIsAccepting] = useState(false)

  const handleAccept = async () => {
    setIsAccepting(true)
    try {
      await onAccept(invitation.id)
    } finally {
      setIsAccepting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            Accept Invitation
          </DialogTitle>
          <DialogDescription>
            You're about to accept this invitation. This will grant you access to the organization.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Organization Info */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Avatar className="h-12 w-12">
              <AvatarImage src={invitation.organizationLogo || "/placeholder.svg"} alt={invitation.organizationName} />
              <AvatarFallback>
                <Building2 className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{invitation.organizationName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">Role:</span>
                {getRoleBadge(invitation.role)}
              </div>
            </div>
          </div>

          {/* Invitation Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Invited by:</span>
              <span className="font-medium">{invitation.invitedBy.name}</span>
            </div>
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

          {/* Message */}
          {invitation.message && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm font-medium mb-1">Personal Message:</p>
              <p className="text-sm text-muted-foreground">{invitation.message}</p>
            </div>
          )}

          {/* Role Permissions */}
          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <p className="text-sm font-medium mb-2">
              As an {invitation.role}, you will be able to:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {invitation.role === "instructor" ? (
                <>
                  <li>• Create and manage courses</li>
                  <li>• Interact with students</li>
                  <li>• Access instructor dashboard</li>
                  <li>• View course analytics</li>
                </>
              ) : (
                <>
                  <li>• Manage organization settings</li>
                  <li>• Oversee all courses and instructors</li>
                  <li>• Access admin dashboard</li>
                  <li>• View detailed analytics</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isAccepting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAccept}
            disabled={isAccepting}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-2" />
            {isAccepting ? "Accepting..." : "Accept Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
