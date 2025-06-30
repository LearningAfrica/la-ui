import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Play, Upload } from 'lucide-react';

interface PreviewCurriculumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  curriculum: any[];
}

export function PreviewCurriculumDialog({
  open,
  onOpenChange,
  curriculum,
}: PreviewCurriculumDialogProps) {
  const [activeTab, setActiveTab] = useState<string>('student');

  // Calculate total duration
  const totalDuration = curriculum.reduce((total, section) => {
    return (
      total +
      section.lessons.reduce((sectionTotal: number, lesson: any) => {
        const [minutes, seconds] = lesson.duration.split(':').map(Number);
        return sectionTotal + minutes * 60 + seconds;
      }, 0)
    );
  }, 0);

  // Format total duration
  const formatTotalDuration = () => {
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    const seconds = totalDuration % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  };

  // Get the icon based on lesson type
  const getLessonIcon = (type: string) => {
    switch (type) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Curriculum Preview</DialogTitle>
          <DialogDescription>
            Preview how your curriculum will appear to students.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="student"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="student">Student View</TabsTrigger>
            <TabsTrigger value="structure">Structure View</TabsTrigger>
          </TabsList>

          <TabsContent value="student" className="space-y-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Course Content</h3>
                <p className="text-muted-foreground text-sm">
                  {curriculum.length} sections •{' '}
                  {curriculum.reduce(
                    (total, section) => total + section.lessons.length,
                    0,
                  )}{' '}
                  lessons • {formatTotalDuration()} total length
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {curriculum.map((section, sectionIndex) => (
                <div
                  key={section.id}
                  className="overflow-hidden rounded-md border"
                >
                  <div className="bg-muted p-4">
                    <h4 className="font-medium">
                      Section {sectionIndex + 1}: {section.title}
                    </h4>
                  </div>
                  <div className="divide-y">
                    {section.lessons.map((lesson: any, lessonIndex: number) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-4"
                      >
                        <div className="flex items-center gap-2">
                          {getLessonIcon(lesson.type)}
                          <span>
                            {sectionIndex + 1}.{lessonIndex + 1} {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground text-sm">
                            {lesson.duration}
                          </span>
                        </div>
                      </div>
                    ))}
                    {section.lessons.length === 0 && (
                      <div className="text-muted-foreground p-4 text-center">
                        No lessons in this section.
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {curriculum.length === 0 && (
                <div className="text-muted-foreground py-8 text-center">
                  <p>No curriculum content yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="structure" className="space-y-4">
            <div className="rounded-md border p-4">
              <h3 className="mb-4 text-lg font-medium">Curriculum Structure</h3>
              <pre className="bg-muted overflow-x-auto rounded-md p-4">
                {JSON.stringify(curriculum, null, 2)}
              </pre>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close Preview</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
