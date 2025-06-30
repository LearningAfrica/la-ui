import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreateTicketForm } from '@/components/tickets/create-ticket-form';
import { HelpCircle } from 'lucide-react';

interface CreateCourseTicketDialogProps {
  courseId: string;
  courseName: string;
  lessonId?: string;
  lessonName?: string;
}

export function CreateCourseTicketDialog({
  courseId,
  courseName,
  lessonId,
  lessonName,
}: CreateCourseTicketDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <HelpCircle className="mr-2 h-4 w-4" />
          Get Help
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
          <DialogDescription>
            Submit a ticket for help with this {lessonId ? 'lesson' : 'course'}.
          </DialogDescription>
        </DialogHeader>
        <CreateTicketForm
          courseId={courseId}
          courseName={courseName}
          lessonId={lessonId}
          lessonName={lessonName}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
