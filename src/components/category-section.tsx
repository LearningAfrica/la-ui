import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	Code,
	Database,
	Palette,
	LineChart,
	BookOpen,
	Video,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function CategorySection() {
	// Mock data for categories
	const categories = [
		{
			id: '1',
			name: 'Programming',
			icon: <Code className="text-primary h-8 w-8" />,
			count: 450,
			image: '/programming-category.jpg',
		},
		{
			id: '2',
			name: 'Data Science',
			icon: <Database className="text-primary h-8 w-8" />,
			count: 320,
			image: '/data-science-category.jpg',
		},
		{
			id: '3',
			name: 'Design',
			icon: <Palette className="text-primary h-8 w-8" />,
			count: 280,
			image: '/design-category.jpg',
		},
		{
			id: '4',
			name: 'Business',
			icon: <LineChart className="text-primary h-8 w-8" />,
			count: 310,
			image: '/business-category.jpg',
		},
		{
			id: '5',
			name: 'Academics',
			icon: <BookOpen className="text-primary h-8 w-8" />,
			count: 215,
			image: '/programming-category.jpg',
		},
		{
			id: '6',
			name: 'Photography & Video',
			icon: <Video className="text-primary h-8 w-8" />,
			count: 175,
			image: '/design-category.jpg',
		},
	];

	return (
		<section className="py-16">
			<div className="container">
				<div className="mb-8 flex items-center justify-between">
					<div>
						<h2 className="text-3xl font-bold">Browse Categories</h2>
						<p className="text-muted-foreground">
							Explore our wide range of courses
						</p>
					</div>
					<Button variant="outline" asChild>
						<Link to="/categories">All Categories</Link>
					</Button>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
					{categories.map((category) => (
						<Card key={category.id} className="h-full overflow-hidden">
							<div className="relative h-32">
								<img
									src={category.image || '/placeholder.svg'}
									alt={category.name}
									className="h-full w-full object-cover"
								/>
								<div className="absolute inset-0 flex items-center justify-center bg-black/30">
									{category.icon}
								</div>
							</div>
							<CardContent className="p-4 text-center">
								<h3 className="font-medium">{category.name}</h3>
								<p className="text-muted-foreground text-sm">
									{category.count} courses
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
