import { useState } from 'react';
import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface DeleteNoteDialogProps {
  noteId: string;
  studentName: string;
  onNoteDeleted: (noteId: string) => void;
}

export function DeleteNoteDialog({
  noteId,
  studentName,
  onNoteDeleted,
}: DeleteNoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      // In a real app, this would be an API call
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the onNoteDeleted callback to update the parent component
      onNoteDeleted(noteId);

      // Show success message
      // toast({
      // 	title: 'Note deleted',
      // 	description: `Note has been removed from ${studentName}'s profile.`,
      // });
      toast.success(`Note has been removed from ${studentName}'s profile.`, {
        duration: 3000,
      });

      // Close the dialog
      setOpen(false);
    } catch (error) {
      // toast({
      // 	title: 'Error',
      // 	description: 'There was an error deleting the note. Please try again.',
      // 	variant: 'destructive',
      // });
      toast.error('There was an error deleting the note. Please try again.', {
        duration: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash className="h-4 w-4" />
          <span className="sr-only">Delete Note</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Note</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this note? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Note'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
