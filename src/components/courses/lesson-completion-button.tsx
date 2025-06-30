import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface LessonCompletionButtonProps {
  lessonId: string;
  isCompleted: boolean;
  onComplete: (lessonId: string) => void;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function LessonCompletionButton({
  lessonId,
  isCompleted,
  onComplete,
  variant = 'outline',
  size = 'sm',
}: LessonCompletionButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [completed, setCompleted] = useState(isCompleted);

  const handleMarkAsComplete = async () => {
    if (completed || isPending) return;

    setIsPending(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCompleted(true);
      onComplete(lessonId);

      // toast({
      // 	title: 'Progress updated',
      // 	description: 'Lesson marked as completed',
      // });'
      toast.success(
        <div>
          <p className="text-sm">Lesson marked as completed</p>
          <div className="mt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCompleted(false)}
            >
              Undo
            </Button>
          </div>
        </div>,
      );
    } catch (error) {
      // toast({
      // 	title: 'Error',
      // 	description: 'Failed to update progress. Please try again.',
      // 	variant: 'destructive',
      // });
      toast.error(
        <div>
          <p className="text-sm">
            Failed to update progress. Please try again.
          </p>
          <div className="mt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCompleted(false)}
            >
              Try Again
            </Button>
          </div>
        </div>,
      );
    } finally {
      setIsPending(false);
    }
  };

  if (completed) {
    return (
      <Button
        variant="outline"
        size={size}
        className="bg-primary/10 text-primary border-primary/20"
        disabled
      >
        <Check className="mr-1 h-4 w-4" />
        Completed
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleMarkAsComplete}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          Updating...
        </>
      ) : (
        'Mark as Complete'
      )}
    </Button>
  );
}
