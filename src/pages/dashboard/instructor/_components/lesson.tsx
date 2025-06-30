import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {
  Edit,
  FileText,
  Grip,
  MoreHorizontal,
  Play,
  Trash,
  Upload,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditLessonDialog } from './edit-lesson-dialog';

interface LessonProps {
  lesson: any;
  index: number;
  sectionId: string;
  onMoveLesson: (
    sectionId: string,
    dragIndex: number,
    hoverIndex: number,
    targetSectionId?: string,
  ) => void;
  onDeleteLesson: (sectionId: string, lessonId: string) => void;
  onUpdateLesson: (
    sectionId: string,
    lessonId: string,
    data: {
      title: string;
      type: string;
      duration: string;
      isPublished: boolean;
    },
  ) => void;
  allSections: any[];
}

interface DragItem {
  index: number;
  id: string;
  sectionId: string;
  type: string;
}

export function Lesson({
  lesson,
  index,
  sectionId,
  onMoveLesson,
  onDeleteLesson,
  onUpdateLesson,
  allSections,
}: LessonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Set up drag and drop for lessons
  const [{ isDragging }, drag] = useDrag({
    type: 'lesson',
    item: { type: 'lesson', id: lesson.id, index, sectionId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ sectionId: string }>();
      if (item && dropResult && dropResult.sectionId !== item.sectionId) {
        // Find the target section
        const targetSection = allSections.find(
          (section) => section.id === dropResult.sectionId,
        );
        if (targetSection) {
          // Move the lesson to the end of the target section
          onMoveLesson(
            item.sectionId,
            item.index,
            targetSection.lessons.length,
            dropResult.sectionId,
          );
        }
      }
    },
  });

  const [, drop] = useDrop<DragItem>({
    accept: 'lesson',
    hover(item, _monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;
      const dragSectionId = item.sectionId;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex && dragSectionId === sectionId) {
        return;
      }

      // Move the lesson within the same section
      if (dragSectionId === sectionId) {
        onMoveLesson(sectionId, dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    },
  });

  // Combine the refs
  drag(drop(ref));

  // Handle lesson deletion
  const handleDeleteLesson = () => {
    onDeleteLesson(sectionId, lesson.id);
  };

  // Handle lesson update
  const handleUpdateLesson = (data: {
    title: string;
    type: string;
    duration: string;
    isPublished: boolean;
  }) => {
    onUpdateLesson(sectionId, lesson.id, data);
    setIsEditDialogOpen(false);
  };

  // Get the icon based on lesson type
  const getLessonIcon = () => {
    switch (lesson.type) {
      case 'video':
        return <Play className="text-muted-foreground h-4 w-4" />;
      case 'quiz':
        return <FileText className="text-muted-foreground h-4 w-4" />;
      case 'assignment':
        return <Upload className="text-muted-foreground h-4 w-4" />;
      default:
        return <FileText className="text-muted-foreground h-4 w-4" />;
    }
  };

  return (
    <>
      <div
        ref={ref}
        className={`bg-background flex items-center justify-between rounded-md border p-3 ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="cursor-move">
            <Grip className="text-muted-foreground h-4 w-4" />
          </div>
          <div className="flex items-center gap-2">
            {getLessonIcon()}
            <span>{lesson.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">
            {lesson.duration}
          </span>
          {!lesson.isPublished && (
            <Badge
              variant="outline"
              className="border-yellow-300 bg-yellow-50 text-yellow-600"
            >
              Draft
            </Badge>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Lesson
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleDeleteLesson}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete Lesson
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <EditLessonDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        lesson={lesson}
        onUpdate={handleUpdateLesson}
      />
    </>
  );
}
