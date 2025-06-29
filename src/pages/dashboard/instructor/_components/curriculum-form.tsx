'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Plus, Trash } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';
import type { Course } from '@/lib/types/curriculum';
import { TiptapEditor } from '@/components/tiptap';

interface CourseCurriculumFormProps {
	courseData: Course;
	setCourseData: React.Dispatch<React.SetStateAction<Course | null>>;
}

export function CourseCurriculumForm({
	courseData,
	setCourseData,
}: CourseCurriculumFormProps) {
	const [newSectionTitle, setNewSectionTitle] = useState('');
	const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
	const [editingSectionTitle, setEditingSectionTitle] = useState('');
	const [_editingLessonId, setEditingLessonId] = useState<string | null>(null);

	const addSection = () => {
		if (!newSectionTitle.trim()) return;

		const newSection = {
			id: `section-${uuidv4()}`,
			title: newSectionTitle,
			lessons: [],
		};

		setCourseData({
			...courseData,
			sections: [...courseData.sections, newSection],
		});

		setNewSectionTitle('');
	};

	const updateSection = (sectionId: string) => {
		if (!editingSectionTitle.trim()) return;

		setCourseData({
			...courseData,
			sections: courseData.sections.map((section) =>
				section.id === sectionId
					? { ...section, title: editingSectionTitle }
					: section,
			),
		});

		setEditingSectionId(null);
		setEditingSectionTitle('');
	};

	const deleteSection = (sectionId: string) => {
		setCourseData({
			...courseData,
			sections: courseData.sections.filter(
				(section) => section.id !== sectionId,
			),
		});
	};

	const addLesson = (
		sectionId: string,
		lessonType: 'video' | 'text' | 'quiz' | 'assignment',
	) => {
		const newLesson = {
			id: `lesson-${uuidv4()}`,
			title: `New ${lessonType.charAt(0).toUpperCase() + lessonType.slice(1)} Lesson`,
			type: lessonType,
			duration: 5,
			content:
				lessonType === 'text' ? '<p>Enter your content here...</p>' : undefined,
			videoUrl: lessonType === 'video' ? '' : undefined,
			instructions:
				lessonType === 'assignment' || lessonType === 'quiz' ? '' : undefined,
		};

		setCourseData({
			...courseData,
			sections: courseData.sections.map((section) => {
				if (section.id === sectionId) {
					return {
						...section,
						lessons: [...section.lessons, newLesson],
					};
				}
				return section;
			}),
		});

		setEditingLessonId(newLesson.id);
	};

	const updateLesson = (
		sectionId: string,
		lessonId: string,
		updates: Partial<Course['sections'][0]['lessons'][0]>,
	) => {
		setCourseData({
			...courseData,
			sections: courseData.sections.map((section) => {
				if (section.id === sectionId) {
					return {
						...section,
						lessons: section.lessons.map((lesson) =>
							lesson.id === lessonId ? { ...lesson, ...updates } : lesson,
						),
					};
				}
				return section;
			}),
		});
	};

	const deleteLesson = (sectionId: string, lessonId: string) => {
		setCourseData({
			...courseData,
			sections: courseData.sections.map((section) => {
				if (section.id === sectionId) {
					return {
						...section,
						lessons: section.lessons.filter((lesson) => lesson.id !== lessonId),
					};
				}
				return section;
			}),
		});
	};

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<h3 className="text-lg font-medium">Course Sections</h3>
				<p className="text-muted-foreground text-sm">
					Organize your course content into sections and lessons. Add videos,
					text, quizzes, and assignments.
				</p>

				{courseData.sections.length > 0 ? (
					<div className="space-y-4">
						{courseData.sections.map((section) => (
							<Card key={section.id}>
								<CardHeader className="pb-2">
									{editingSectionId === section.id ? (
										<div className="flex items-center space-x-2">
											<Input
												value={editingSectionTitle}
												onChange={(e) => setEditingSectionTitle(e.target.value)}
												className="flex-1"
												placeholder="Section title"
											/>
											<Button
												size="sm"
												onClick={() => updateSection(section.id)}
											>
												Save
											</Button>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => setEditingSectionId(null)}
											>
												Cancel
											</Button>
										</div>
									) : (
										<div className="flex items-center justify-between">
											<CardTitle className="text-base">
												{section.title}
											</CardTitle>
											<div className="flex items-center space-x-2">
												<Button
													size="sm"
													variant="outline"
													onClick={() => {
														setEditingSectionId(section.id);
														setEditingSectionTitle(section.title);
													}}
												>
													Edit
												</Button>
												<Button
													size="sm"
													variant="destructive"
													onClick={() => deleteSection(section.id)}
												>
													<Trash className="h-4 w-4" />
												</Button>
											</div>
										</div>
									)}
								</CardHeader>
								<CardContent>
									{section.lessons.length > 0 && (
										<div className="mb-4 space-y-4">
											{section.lessons.map((lesson) => (
												<div key={lesson.id} className="rounded-md border p-4">
													<div className="mb-4 flex items-center justify-between">
														<div>
															<Input
																value={lesson.title}
																onChange={(e) =>
																	updateLesson(section.id, lesson.id, {
																		title: e.target.value,
																	})
																}
																className="mb-2"
																placeholder="Lesson title"
															/>
															<div className="flex items-center space-x-4">
																<div className="flex items-center space-x-2">
																	<span className="text-xs font-medium">
																		Type:
																	</span>
																	<span className="bg-muted rounded-md px-2 py-1 text-xs">
																		{lesson.type}
																	</span>
																</div>
																<div className="flex items-center space-x-2">
																	<span className="text-xs font-medium">
																		Duration:
																	</span>
																	<Input
																		type="number"
																		value={lesson.duration}
																		onChange={(e) =>
																			updateLesson(section.id, lesson.id, {
																				duration: Number(e.target.value),
																			})
																		}
																		className="h-6 w-16 text-xs"
																		min="1"
																	/>
																	<span className="text-xs">min</span>
																</div>
															</div>
														</div>
														<Button
															size="sm"
															variant="destructive"
															onClick={() =>
																deleteLesson(section.id, lesson.id)
															}
														>
															<Trash className="h-4 w-4" />
														</Button>
													</div>

													{lesson.type === 'text' && (
														<div className="mt-4">
															<label className="mb-1 block text-sm font-medium">
																Content
															</label>
															<TiptapEditor
																content={lesson.content || ''}
																onChange={(html) =>
																	updateLesson(section.id, lesson.id, {
																		content: html,
																	})
																}
															/>
														</div>
													)}

													{lesson.type === 'video' && (
														<div className="mt-4">
															<label className="mb-1 block text-sm font-medium">
																Video URL
															</label>
															<Input
																value={lesson.videoUrl || ''}
																onChange={(e) =>
																	updateLesson(section.id, lesson.id, {
																		videoUrl: e.target.value,
																	})
																}
																placeholder="https://example.com/videos/lesson.mp4"
															/>
														</div>
													)}

													{(lesson.type === 'quiz' ||
														lesson.type === 'assignment') && (
														<div className="mt-4">
															<label className="mb-1 block text-sm font-medium">
																Instructions
															</label>
															<Textarea
																value={lesson.instructions || ''}
																onChange={(e) =>
																	updateLesson(section.id, lesson.id, {
																		instructions: e.target.value,
																	})
																}
																placeholder="Enter instructions here..."
																rows={4}
															/>
														</div>
													)}
												</div>
											))}
										</div>
									)}
									<div className="pt-2">
										<Select
											onValueChange={(value) =>
												addLesson(section.id, value as any)
											}
											defaultValue=""
										>
											<SelectTrigger className="w-[180px]">
												<SelectValue placeholder="Add lesson..." />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="text">Text Lesson</SelectItem>
												<SelectItem value="video">Video Lesson</SelectItem>
												<SelectItem value="quiz">Quiz</SelectItem>
												<SelectItem value="assignment">Assignment</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				) : (
					<div className="bg-muted/50 rounded-md border-2 border-dashed p-8 text-center">
						<p className="text-muted-foreground mb-4">
							No sections yet. Add your first section to get started.
						</p>
					</div>
				)}

				<div className="flex items-center space-x-2 pt-4">
					<Input
						placeholder="New section title"
						value={newSectionTitle}
						onChange={(e) => setNewSectionTitle(e.target.value)}
						className="max-w-md"
					/>
					<Button onClick={addSection} disabled={!newSectionTitle.trim()}>
						<Plus className="mr-1 h-4 w-4" />
						Add Section
					</Button>
				</div>
			</div>
		</div>
	);
}
