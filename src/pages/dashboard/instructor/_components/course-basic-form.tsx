'use client';

import React from 'react';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

// Define the form schema with Zod
export const courseBasicSchema = z.object({
	title: z
		.string()
		.min(5, { message: 'Title must be at least 5 characters' })
		.max(100),
	subtitle: z.string().max(150).optional(),
	description: z
		.string()
		.min(20, { message: 'Description must be at least 20 characters' })
		.max(5000),
	category: z.string().min(1, { message: 'Please select a category' }),
	level: z.string().min(1, { message: 'Please select a level' }),
	language: z.string().min(1, { message: 'Please select a language' }),
});

export type CourseBasicFormValues = z.infer<typeof courseBasicSchema>;

// Mock data
export const categories = [
	{ value: 'programming', label: 'Programming' },
	{ value: 'design', label: 'Design' },
	{ value: 'business', label: 'Business' },
	{ value: 'marketing', label: 'Marketing' },
	{ value: 'photography', label: 'Photography' },
	{ value: 'music', label: 'Music' },
	{ value: 'health', label: 'Health & Fitness' },
	{ value: 'language', label: 'Language Learning' },
];

export const levels = [
	{ value: 'beginner', label: 'Beginner' },
	{ value: 'intermediate', label: 'Intermediate' },
	{ value: 'advanced', label: 'Advanced' },
	{ value: 'all-levels', label: 'All Levels' },
];

export const languages = [
	{ value: 'english', label: 'English' },
	{ value: 'spanish', label: 'Spanish' },
	{ value: 'french', label: 'French' },
	{ value: 'german', label: 'German' },
	{ value: 'chinese', label: 'Chinese' },
	{ value: 'japanese', label: 'Japanese' },
	{ value: 'korean', label: 'Korean' },
	{ value: 'arabic', label: 'Arabic' },
];

interface CourseBasicFormProps {
	form: UseFormReturn<CourseBasicFormValues>;
}

export function CourseBasicForm({ form }: CourseBasicFormProps) {
	return (
		<div>
			<FormField
				control={form.control}
				name="title"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Course Title*</FormLabel>
						<FormControl>
							<Input
								placeholder="e.g. Complete JavaScript Course 2024"
								{...field}
							/>
						</FormControl>
						<FormDescription>
							A catchy title will grab attention. Keep it clear and concise.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="subtitle"
				render={({ field }) => (
					<FormItem className="mt-4">
						<FormLabel>Subtitle</FormLabel>
						<FormControl>
							<Input
								placeholder="e.g. Master JavaScript from zero to hero"
								{...field}
							/>
						</FormControl>
						<FormDescription>
							A brief subtitle that appears below your course title.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="description"
				render={({ field }) => (
					<FormItem className="mt-4">
						<FormLabel>Description*</FormLabel>
						<FormControl>
							<Textarea
								placeholder="Describe what students will learn in this course..."
								className="min-h-32"
								{...field}
							/>
						</FormControl>
						<FormDescription>
							Provide a detailed description of what your course covers. This
							helps students decide if your course is right for them.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>

			<div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
				<FormField
					control={form.control}
					name="category"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category*</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a category" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{categories.map((category) => (
										<SelectItem key={category.value} value={category.value}>
											{category.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormDescription>
								Choose the main category for your course.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="level"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Level*</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a level" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{levels.map((level) => (
										<SelectItem key={level.value} value={level.value}>
											{level.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormDescription>
								Select the difficulty level of your course.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="language"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Language*</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a language" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{languages.map((language) => (
										<SelectItem key={language.value} value={language.value}>
											{language.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormDescription>
								Select the language in which the course will be taught.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
}
