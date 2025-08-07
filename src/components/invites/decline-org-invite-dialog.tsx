import { useState } from 'react';
import { X, Building2, User, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Invitation {
  id: string;
  organizationName: string;
  organizationLogo: string;
  role: 'instructor' | 'admin';
  invitedBy: {
    name: string;
    email: string;
    avatar: string;
  };
  message: string;
  sentDate: string;
  expiresDate: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

interface DeclineOrgInviteDialogProps {
  invitation: Invitation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDecline: (invitationId: string) => Promise<void>;
}

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'instructor':
      return (
        <Badge
          variant="outline"
          className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
        >
          Instructor
        </Badge>
      );
    case 'admin':
      return (
        <Badge
          variant="outline"
          className="border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300"
        >
          Admin
        </Badge>
      );
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export function DeclineOrgInviteDialog({
  invitation,
  open,
  onOpenChange,
  onDecline,
}: DeclineOrgInviteDialogProps) {
  const [isDeclining, setIsDeclining] = useState(false);
  const [reason, setReason] = useState('');

  const handleDecline = async () => {
    setIsDeclining(true);
    try {
      await onDecline(invitation.id);
      setReason('');
    } finally {
      setIsDeclining(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <X className="h-5 w-5 text-red-600" />
            Decline Invitation
          </DialogTitle>
          <DialogDescription>
            You're about to decline this invitation. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Organization Info */}
          <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={invitation.organizationLogo || '/placeholder.svg'}
                alt={invitation.organizationName}
              />
              <AvatarFallback>
                <Building2 className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                {invitation.organizationName}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-muted-foreground text-sm">Role:</span>
                {getRoleBadge(invitation.role)}
              </div>
            </div>
          </div>

          {/* Invitation Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground">Invited by:</span>
              <span className="font-medium">{invitation.invitedBy.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground">Sent:</span>
              <span>{formatDate(invitation.sentDate)}</span>
            </div>
          </div>

          {/* Warning */}
          <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-3 dark:bg-red-950/20">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Important Notice
              </p>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300">
              Once you decline this invitation, you won't be able to accept it
              later. The organization would need to send you a new invitation.
            </p>
          </div>

          {/* Optional Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for declining (optional)</Label>
            <Textarea
              id="reason"
              placeholder="Let the organization know why you're declining..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px]"
            />
            <p className="text-muted-foreground text-xs">
              This message will be sent to the person who invited you.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeclining}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDecline}
            disabled={isDeclining}
            variant="destructive"
          >
            <X className="mr-2 h-4 w-4" />
            {isDeclining ? 'Declining...' : 'Decline Invitation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
