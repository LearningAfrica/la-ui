import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Course } from '@/lib/types/curriculum';

interface CourseSettingsFormProps {
  courseData: Course;
  setCourseData: React.Dispatch<React.SetStateAction<Course | null>>;
}

export function CourseSettingsForm({
  courseData,
  setCourseData,
}: CourseSettingsFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="isPublic">Make course public</Label>
          <Switch
            id="isPublic"
            checked={courseData.isPublic}
            onCheckedChange={(checked) =>
              setCourseData({ ...courseData, isPublic: checked })
            }
          />
        </div>
        <p className="text-muted-foreground text-xs">
          When disabled, only enrolled students can access this course
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="allowComments">Allow comments</Label>
          <Switch
            id="allowComments"
            checked={courseData.allowComments}
            onCheckedChange={(checked) =>
              setCourseData({ ...courseData, allowComments: checked })
            }
          />
        </div>
        <p className="text-muted-foreground text-xs">
          Allow students to comment on lessons
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="allowRatings">Allow ratings</Label>
          <Switch
            id="allowRatings"
            checked={courseData.allowRatings}
            onCheckedChange={(checked) =>
              setCourseData({ ...courseData, allowRatings: checked })
            }
          />
        </div>
        <p className="text-muted-foreground text-xs">
          Allow students to rate your course
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="certificateEnabled">Enable certificates</Label>
          <Switch
            id="certificateEnabled"
            checked={courseData.certificateEnabled}
            onCheckedChange={(checked) =>
              setCourseData({ ...courseData, certificateEnabled: checked })
            }
          />
        </div>
        <p className="text-muted-foreground text-xs">
          Issue certificates to students who complete this course
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Course Status</Label>
        <Select
          value={courseData.status}
          onValueChange={(value) =>
            setCourseData({ ...courseData, status: value as Course['status'] })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-xs">
          Control the visibility and availability of your course
        </p>
      </div>
    </div>
  );
}
