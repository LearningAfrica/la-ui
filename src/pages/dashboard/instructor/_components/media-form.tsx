'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Course } from '@/types/curriculum';

interface CourseMediaFormProps {
	courseData: Course;
	setCourseData: React.Dispatch<React.SetStateAction<Course | null>>;
}

export function CourseMediaForm({
	courseData,
	setCourseData,
}: CourseMediaFormProps) {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="thumbnail">Course Thumbnail</Label>
				<div className="flex items-start gap-4">
					<div className="relative h-36 w-64 overflow-hidden rounded-md border">
						{courseData.thumbnail ? (
							<img
								src={courseData.thumbnail}
								alt="Course thumbnail"
								className="h-full w-full object-cover"
							/>
						) : (
							<div className="bg-muted flex h-full w-full items-center justify-center">
								<p className="text-muted-foreground text-sm">No thumbnail</p>
							</div>
						)}
					</div>
					<div className="space-y-2">
						<Input
							id="thumbnail"
							type="text"
							placeholder="Enter image URL or upload"
							value={courseData.thumbnail || ''}
							onChange={(e) =>
								setCourseData({ ...courseData, thumbnail: e.target.value })
							}
						/>
						<p className="text-muted-foreground text-xs">
							Recommended size: 1280x720px (16:9 ratio)
						</p>
						<Button variant="outline" size="sm">
							Upload Image
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
