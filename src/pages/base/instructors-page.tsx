import { Header } from '@/components/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function InstructorsPage() {
	// Mock data for instructors
	const instructors = [
		{
			id: '1',
			name: 'Dr. Sarah Johnson',
			image: '/instructor-1.jpg',
			title: 'Professor of Computer Science',
			courses: 12,
			students: 15432,
			rating: 4.9,
			bio: 'Dr. Johnson specializes in artificial intelligence and machine learning with over 15 years of teaching experience.',
		},
		{
			id: '2',
			name: 'Michael Chen',
			image: '/instructor-2.jpg',
			title: 'Senior Software Engineer',
			courses: 8,
			students: 12345,
			rating: 4.8,
			bio: 'Michael is a full-stack developer with expertise in React, Node.js, and cloud architecture.',
		},
		{
			id: '3',
			name: 'Emily Rodriguez',
			image: '/instructor-3.jpg',
			title: 'UX Design Lead',
			courses: 6,
			students: 9876,
			rating: 4.9,
			bio: 'Emily has worked with Fortune 500 companies to design intuitive and accessible user experiences.',
		},
		{
			id: '4',
			name: 'David Kim',
			image: '/instructor-4.jpg',
			title: 'Data Science Consultant',
			courses: 10,
			students: 14567,
			rating: 4.7,
			bio: 'David combines statistical analysis with business insights to solve complex data problems.',
		},
		{
			id: '5',
			name: 'Priya Patel',
			image: '/instructor-5.jpg',
			title: 'Marketing Strategist',
			courses: 7,
			students: 8765,
			rating: 4.8,
			bio: 'Priya has helped startups and established businesses develop effective digital marketing strategies.',
		},
		{
			id: '6',
			name: 'James Wilson',
			image: '/instructor-6.jpg',
			title: 'Financial Analyst',
			courses: 5,
			students: 7654,
			rating: 4.6,
			bio: 'James brings real-world experience from Wall Street to his courses on investment and financial planning.',
		},
		{
			id: '7',
			name: 'Sophia Lee',
			image: '/instructor-7.jpg',
			title: 'Mobile App Developer',
			courses: 9,
			students: 11234,
			rating: 4.8,
			bio: 'Sophia specializes in iOS and Android development with a focus on creating intuitive mobile experiences.',
		},
		{
			id: '8',
			name: 'Robert Taylor',
			image: '/instructor-8.jpg',
			title: 'Cybersecurity Expert',
			courses: 6,
			students: 9876,
			rating: 4.9,
			bio: 'Robert has worked in cybersecurity for over a decade, protecting organizations from emerging threats.',
		},
	];

	return (
		<div>
			<Header />
			<main className="container py-8">
				<h1 className="mb-8 text-3xl font-bold">Our Expert Instructors</h1>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					{instructors.map((instructor) => (
						<Card key={instructor.id}>
							<CardHeader className="pb-0">
								<div className="flex flex-col items-center">
									<Avatar className="h-24 w-24">
										<AvatarImage
											src={instructor.image || '/placeholder.svg'}
											alt={instructor.name}
										/>
										<AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
									</Avatar>
									<h3 className="mt-2 text-lg font-semibold">
										{instructor.name}
									</h3>
									<p className="text-muted-foreground text-sm">
										{instructor.title}
									</p>
								</div>
							</CardHeader>
							<CardContent className="pt-4 text-center">
								<div className="mb-4 flex justify-center gap-4">
									<div>
										<p className="font-semibold">{instructor.courses}</p>
										<p className="text-muted-foreground text-xs">Courses</p>
									</div>
									<div>
										<p className="font-semibold">
											{instructor.students.toLocaleString()}
										</p>
										<p className="text-muted-foreground text-xs">Students</p>
									</div>
									<div>
										<p className="font-semibold">{instructor.rating}</p>
										<p className="text-muted-foreground text-xs">Rating</p>
									</div>
								</div>
								<p className="mb-4 line-clamp-3 text-sm">{instructor.bio}</p>
								<Link to={`/instructors/${instructor.id}`} className="w-full">
									View Profile
								</Link>
							</CardContent>
						</Card>
					))}
				</div>
			</main>
		</div>
	);
}
