import { z } from 'zod';

// Course schema validation
export const courseSchema = z.object({
	id: z.string(),
	title: z.string().min(3, 'Title must be at least 3 characters'),
	subtitle: z.string().optional(),
	description: z.string().min(10, 'Description must be at least 10 characters'),
	category: z.string().min(1, 'Category is required'),
	subcategory: z.string().optional(),
	level: z.enum(['beginner', 'intermediate', 'advanced', 'all-levels']),
	language: z.string().default('english'),
	thumbnail: z.string().optional(),
	sections: z.array(
		z.object({
			id: z.string(),
			title: z.string().min(3, 'Section title must be at least 3 characters'),
			lessons: z.array(
				z.object({
					id: z.string(),
					title: z
						.string()
						.min(3, 'Lesson title must be at least 3 characters'),
					type: z.enum(['video', 'text', 'quiz', 'assignment']),
					duration: z.number().min(1, 'Duration must be at least 1 minute'),
					content: z.string().optional(),
					videoUrl: z.string().optional(),
					instructions: z.string().optional(),
				}),
			),
		}),
	),
	price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
	pricingModel: z.enum(['one-time', 'subscription']),
	isPublic: z.boolean(),
	allowComments: z.boolean(),
	allowRatings: z.boolean(),
	certificateEnabled: z.boolean(),
	status: z.enum(['draft', 'published', 'archived']),
});

export type Course = z.infer<typeof courseSchema>;

// Function to create an empty course
export function createEmptyCourse(id: string): Course {
	return {
		id,
		title: '',
		subtitle: '',
		description: '',
		category: '',
		subcategory: '',
		level: 'beginner',
		language: 'english',
		thumbnail: '',
		sections: [],
		price: '0',
		pricingModel: 'one-time',
		isPublic: false,
		allowComments: true,
		allowRatings: true,
		certificateEnabled: false,
		status: 'draft',
	};
}
