import { Header } from '@/components/header';
import { CategoryCard } from '@/components/category-card';

export default function CourseCategoriesPage() {
	// Mock data for categories
	const categories = [
		{
			id: '1',
			name: 'Programming',
			description: 'Learn coding and software development',
			image: '/programming-category.jpg',
			courseCount: 243,
		},
		{
			id: '2',
			name: 'Data Science',
			description: 'Master data analysis and machine learning',
			image: '/data-science-category.jpg',
			courseCount: 187,
		},
		{
			id: '3',
			name: 'Design',
			description: 'Explore graphic, UX, and UI design',
			image: '/design-category.jpg',
			courseCount: 156,
		},
		{
			id: '4',
			name: 'Business',
			description: 'Develop business and entrepreneurship skills',
			image: '/business-category.jpg',
			courseCount: 201,
		},
	];

	return (
		<div>
			<Header />
			<main className="container py-8">
				<h1 className="mb-8 text-3xl font-bold">Categories</h1>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					{categories.map((category) => (
						<CategoryCard key={category.id} category={category} />
					))}
				</div>
			</main>
		</div>
	);
}
