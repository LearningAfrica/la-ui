'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Course } from '@/types/curriculum';

interface CourseBasicInfoFormProps {
	courseData: Course;
	setCourseData: React.Dispatch<React.SetStateAction<Course | null>>;
}

export function CourseBasicInfoForm({
	courseData,
	setCourseData,
}: CourseBasicInfoFormProps) {
	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="title">Course Title*</Label>
					<Input
						id="title"
						value={courseData.title}
						onChange={(e) =>
							setCourseData({ ...courseData, title: e.target.value })
						}
						placeholder="Enter course title"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="subtitle">Subtitle</Label>
					<Input
						id="subtitle"
						value={courseData.subtitle || ''}
						onChange={(e) =>
							setCourseData({ ...courseData, subtitle: e.target.value })
						}
						placeholder="Enter course subtitle"
					/>
				</div>
			</div>
			<div className="space-y-2">
				<Label htmlFor="description">Description*</Label>
				<Textarea
					id="description"
					value={courseData.description}
					onChange={(e) =>
						setCourseData({ ...courseData, description: e.target.value })
					}
					placeholder="Describe your course"
					rows={5}
				/>
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div className="space-y-2">
					<Label htmlFor="category">Category*</Label>
					<Input
						id="category"
						value={courseData.category}
						onChange={(e) =>
							setCourseData({ ...courseData, category: e.target.value })
						}
						placeholder="Enter category"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="subcategory">Subcategory</Label>
					<Input
						id="subcategory"
						value={courseData.subcategory || ''}
						onChange={(e) =>
							setCourseData({ ...courseData, subcategory: e.target.value })
						}
						placeholder="Enter subcategory"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="level">Level*</Label>
					<Select
						value={courseData.level}
						onValueChange={(value) =>
							setCourseData({ ...courseData, level: value as Course['level'] })
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select level" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="beginner">Beginner</SelectItem>
							<SelectItem value="intermediate">Intermediate</SelectItem>
							<SelectItem value="advanced">Advanced</SelectItem>
							<SelectItem value="all-levels">All Levels</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
}
