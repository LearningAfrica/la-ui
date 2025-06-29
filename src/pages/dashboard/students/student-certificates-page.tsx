import { useState } from 'react';
import {
	Award,
	Calendar,
	ChevronDown,
	Download,
	Filter,
	Search,
	Share2,
	SortAsc,
	SortDesc,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

// Mock certificate data
const certificates = [
	{
		id: 'cert-1',
		title: 'JavaScript Fundamentals',
		courseId: 'course-1',
		courseName: 'JavaScript Fundamentals',
		issueDate: '2023-10-15',
		expiryDate: '2026-10-15',
		instructor: 'Jane Doe',
		grade: 'A',
		score: 95,
		imageUrl: '/elegant-achievement-certificate.png',
		status: 'valid',
		credentialId: 'JS-FUND-2023-001',
	},
	{
		id: 'cert-2',
		title: 'React Development',
		courseId: 'course-2',
		courseName: 'React Development Masterclass',
		issueDate: '2023-11-20',
		expiryDate: '2026-11-20',
		instructor: 'John Smith',
		grade: 'A-',
		score: 92,
		imageUrl: '/abstract-geometric-certificate.png',
		status: 'valid',
		credentialId: 'REACT-DEV-2023-042',
	},
	{
		id: 'cert-3',
		title: 'UX Design Principles',
		courseId: 'course-3',
		courseName: 'UX Design Principles',
		issueDate: '2023-09-05',
		expiryDate: '2026-09-05',
		instructor: 'Sarah Johnson',
		grade: 'B+',
		score: 88,
		imageUrl: '/clean-achievement-award.png',
		status: 'valid',
		credentialId: 'UX-DESIGN-2023-103',
	},
	{
		id: 'cert-4',
		title: 'Data Science Fundamentals',
		courseId: 'course-4',
		courseName: 'Introduction to Data Science',
		issueDate: '2023-08-12',
		expiryDate: '2026-08-12',
		instructor: 'Michael Brown',
		grade: 'A+',
		score: 98,
		imageUrl: '/personal-authentication.png',
		status: 'valid',
		credentialId: 'DATA-SCI-2023-027',
	},
];

export default function StudentCertificatesPage() {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState('');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [filterStatus, setFilterStatus] = useState<string>('all');

	// Filter and sort certificates
	const filteredCertificates = certificates
		.filter((cert) => {
			// Filter by search query
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				return (
					cert.title.toLowerCase().includes(query) ||
					cert.courseName.toLowerCase().includes(query) ||
					cert.instructor.toLowerCase().includes(query) ||
					cert.credentialId.toLowerCase().includes(query)
				);
			}

			// Filter by status
			if (filterStatus !== 'all') {
				return cert.status === filterStatus;
			}

			return true;
		})
		.sort((a, b) => {
			// Sort by issue date
			const dateA = new Date(a.issueDate).getTime();
			const dateB = new Date(b.issueDate).getTime();
			return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
		});

	const handleDownload = (_certId: string) => {
		// In a real app, this would trigger a download of the certificate
		toast.success('Certificate download started');
	};

	const handleShare = (_certId: string) => {
		// In a real app, this would open a share dialog
		toast.success('Share dialog opened');
	};

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">My Certificates</h1>
					<p className="text-muted-foreground">
						View and manage your earned certificates
					</p>
				</div>
			</div>

			<div className="flex flex-col gap-4 md:flex-row">
				<div className="relative flex-1">
					<Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
					<Input
						type="search"
						placeholder="Search certificates..."
						className="pl-8"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className="flex gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-10">
								<Filter className="mr-2 h-4 w-4" />
								Filter
								<ChevronDown className="ml-2 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setFilterStatus('all')}>
								All Certificates
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setFilterStatus('valid')}>
								Valid Certificates
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setFilterStatus('expired')}>
								Expired Certificates
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Button
						variant="outline"
						size="sm"
						className="h-10"
						onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
					>
						{sortOrder === 'asc' ? (
							<SortAsc className="mr-2 h-4 w-4" />
						) : (
							<SortDesc className="mr-2 h-4 w-4" />
						)}
						Sort by Date
					</Button>
				</div>
			</div>

			{filteredCertificates.length === 0 ? (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<Award className="text-muted-foreground mb-4 h-12 w-12" />
						<h3 className="mb-2 text-xl font-semibold">
							No certificates found
						</h3>
						<p className="text-muted-foreground mb-6 max-w-md text-center">
							{searchQuery || filterStatus !== 'all'
								? 'No certificates match your search criteria. Try adjusting your filters.'
								: "You haven't earned any certificates yet. Complete courses to earn certificates."}
						</p>
						<Button asChild>
							<Link to="/dashboard/student/courses">Browse Courses</Link>
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{filteredCertificates.map((certificate) => (
						<Card key={certificate.id} className="overflow-hidden">
							<CardHeader className="p-0">
								<div className="relative aspect-[1.4/1] w-full overflow-hidden">
									<img
										src={certificate.imageUrl || '/placeholder.svg'}
										alt={certificate.title}
										className="h-full w-full object-cover transition-transform hover:scale-105"
									/>
									<div className="absolute top-2 right-2">
										<Badge
											variant="secondary"
											className="bg-background/80 backdrop-blur-sm"
										>
											{certificate.grade}
										</Badge>
									</div>
								</div>
							</CardHeader>
							<CardContent className="p-4">
								<div className="mb-2 flex items-start justify-between">
									<CardTitle className="text-lg">{certificate.title}</CardTitle>
								</div>
								<CardDescription className="mb-2">
									{certificate.courseName}
								</CardDescription>
								<div className="text-muted-foreground mb-1 flex items-center text-sm">
									<Calendar className="mr-1 h-3.5 w-3.5" />
									<span>
										Issued:{' '}
										{new Date(certificate.issueDate).toLocaleDateString()}
									</span>
								</div>
								<div className="text-muted-foreground text-sm">
									<span>Credential ID: {certificate.credentialId}</span>
								</div>
							</CardContent>
							<CardFooter className="flex justify-between p-4 pt-0">
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										navigate(
											`/dashboard/student/certificates/${certificate.id}`,
										)
									}
								>
									View
								</Button>
								<div className="flex gap-2">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleDownload(certificate.id)}
									>
										<Download className="h-4 w-4" />
										<span className="sr-only">Download</span>
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleShare(certificate.id)}
									>
										<Share2 className="h-4 w-4" />
										<span className="sr-only">Share</span>
									</Button>
								</div>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
