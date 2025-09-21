import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Grip,
  MoreHorizontal,
  Plus,
  Trash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Lesson } from './lesson';
import { EditSectionDialog } from './edit-section-dialog';

interface SectionProps {
  section: any;
  index: number;
  onMoveSection: (dragIndex: number, hoverIndex: number) => void;
  onMoveLesson: (
    sectionId: string,
    dragIndex: number,
    hoverIndex: number,
    targetSectionId?: string,
  ) => void;
  onDeleteSection: (sectionId: string) => void;
  onDeleteLesson: (sectionId: string, lessonId: string) => void;
  onUpdateSection: (sectionId: string, data: { title: string }) => void;
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
  onAddLesson: (sectionId: string) => void;
  allSections: any[];
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export function Section({
  section,
  index,
  onMoveSection,
  onMoveLesson,
  onDeleteSection,
  onDeleteLesson,
  onUpdateSection,
  onUpdateLesson,
  onAddLesson,
  allSections,
}: SectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Set up drag and drop for sections
  const [{ isDragging }, drag] = useDrag({
    type: 'section',
    item: { type: 'section', id: section.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<DragItem>({
    accept: 'section',
    hover(item, _monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Move the section
      onMoveSection(dragIndex, hoverIndex);

      // Update the index for the dragged item
      item.index = hoverIndex;
    },
  });

  // Set up drop for lessons from other sections
  const [{ isOver }, dropLesson] = useDrop({
    accept: 'lesson',
    drop: (_item) => {
      // Handle dropping a lesson into this section
      return { sectionId: section.id };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Combine the refs
  drag(drop(ref));
  dropLesson(dropRef);

  // Handle section deletion
  const handleDeleteSection = () => {
    onDeleteSection(section.id);
  };

  // Handle section update
  const handleUpdateSection = (data: { title: string }) => {
    onUpdateSection(section.id, data);
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <Card
        ref={ref}
        className={`${isDragging ? 'opacity-50' : ''} ${isOver ? 'border-primary' : ''}`}
        data-section-id={section.id}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
          <div className="flex items-center gap-2">
            <div className="cursor-move" ref={dropRef}>
              <Grip className="text-muted-foreground h-5 w-5" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 font-medium"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="mr-1 h-4 w-4" />
              ) : (
                <ChevronUp className="mr-1 h-4 w-4" />
              )}
              <span>
                Section {index + 1}: {section.title}
              </span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAddLesson(section.id)}
            >
              <Plus className="mr-1 h-4 w-4" /> Add Lesson
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Section
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={handleDeleteSection}
                >
                  <Trash className="mr-2 h-4 w-4" /> Delete Section
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent className="p-4 pt-0">
            <div className="space-y-2 pl-6">
              {section.lessons.map((lesson: any, lessonIndex: number) => (
                <Lesson
                  key={lesson.id}
                  lesson={lesson}
                  index={lessonIndex}
                  sectionId={section.id}
                  onMoveLesson={onMoveLesson}
                  onDeleteLesson={onDeleteLesson}
                  onUpdateLesson={onUpdateLesson}
                  allSections={allSections}
                />
              ))}
              {section.lessons.length === 0 && (
                <div className="text-muted-foreground py-4 text-center">
                  <p>No lessons in this section.</p>
                  <Button
                    variant="link"
                    onClick={() => onAddLesson(section.id)}
                  >
                    Add your first lesson
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      <EditSectionDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        section={section}
        onUpdate={handleUpdateSection}
      />
    </>
  );
}
