import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Award,
	Download,
	Eye,
	MoreHorizontal,
	Plus,
	Search,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock certificates data
const initialCertificates = [
	{
		id: '1',
		course: 'Complete JavaScript Course',
		courseId: 'c1',
		student: {
			id: 's1',
			name: 'John Smith',
			email: 'john.smith@example.com',
			image: '/student-1.jpg',
		},
		issueDate: '2024-01-15',
		completionDate: '2024-01-14',
		status: 'issued',
	},
	{
		id: '2',
		course: 'React Native for Beginners',
		courseId: 'c2',
		student: {
			id: 's2',
			name: 'Sarah Johnson',
			email: 'sarah.johnson@example.com',
			image: '/student-2.jpg',
		},
		issueDate: '2024-01-20',
		completionDate: '2024-01-18',
		status: 'issued',
	},
	{
		id: '3',
		course: 'Advanced TypeScript Patterns',
		courseId: 'c3',
		student: {
			id: 's3',
			name: 'Michael Brown',
			email: 'michael.brown@example.com',
			image: '/student-3.jpg',
		},
		issueDate: '2024-01-25',
		completionDate: '2024-01-23',
		status: 'issued',
	},
	{
		id: '4',
		course: 'Complete JavaScript Course',
		courseId: 'c1',
		student: {
			id: 's4',
			name: 'Emily Davis',
			email: 'emily.davis@example.com',
			image: '/student-4.jpg',
		},
		issueDate: '',
		completionDate: '2024-02-01',
		status: 'pending',
	},
	{
		id: '5',
		course: 'React Native for Beginners',
		courseId: 'c2',
		student: {
			id: 's5',
			name: 'David Wilson',
			email: 'david.wilson@example.com',
			image: '/student-5.jpg',
		},
		issueDate: '',
		completionDate: '2024-02-03',
		status: 'pending',
	},
];

// Mock certificate templates
const certificateTemplates = [
	{
		id: 't1',
		name: 'Standard Certificate',
		description:
			'Default certificate template with course name and completion date',
		preview: '/certificate-standard.jpg',
		isDefault: true,
	},
	{
		id: 't2',
		name: 'Premium Certificate',
		description:
			'Enhanced certificate with instructor signature and course details',
		preview: '/certificate-premium.jpg',
		isDefault: false,
	},
	{
		id: 't3',
		name: 'Minimalist Certificate',
		description: 'Clean, modern design with essential information only',
		preview: '/certificate-minimalist.jpg',
		isDefault: false,
	},
];

export default function InstructorCertificatesPage() {
	const [certificates, setCertificates] = useState(initialCertificates);
	const [searchQuery, setSearchQuery] = useState('');
	const [activeTab, setActiveTab] = useState('all');

	// Filter certificates based on search query and active tab
	const filteredCertificates = certificates.filter(
		(certificate) =>
			(certificate.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
				certificate.student.name
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				certificate.student.email
					.toLowerCase()
					.includes(searchQuery.toLowerCase())) &&
			(activeTab === 'all' || certificate.status === activeTab),
	);

	// Count certificates by status
	const issuedCount = certificates.filter(
		(certificate) => certificate.status === 'issued',
	).length;
	const pendingCount = certificates.filter(
		(certificate) => certificate.status === 'pending',
	).length;

	// Handle issuing a certificate
	const handleIssueCertificate = (id: string) => {
		setCertificates(
			certificates.map((cert) =>
				cert.id === id
					? {
							...cert,
							status: 'issued',
							issueDate: new Date().toISOString().split('T')[0],
						}
					: cert,
			),
		);
	};

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Certificates</h1>
					<p className="text-muted-foreground">
						Manage course completion certificates for your students
					</p>
				</div>
				<Button asChild>
					<Link to="/dashboard/instructor/certificates/templates">
						<Plus className="mr-2 h-4 w-4" /> Create Template
					</Link>
				</Button>
			</div>

			<Tabs
				defaultValue="all"
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-6"
			>
				<TabsList>
					<TabsTrigger value="all">All Certificates</TabsTrigger>
					<TabsTrigger value="issued">
						Issued{' '}
						<Badge className="ml-2 bg-green-100 text-green-800">
							{issuedCount}
						</Badge>
					</TabsTrigger>
					<TabsTrigger value="pending">
						Pending{' '}
						<Badge className="ml-2 bg-yellow-100 text-yellow-800">
							{pendingCount}
						</Badge>
					</TabsTrigger>
					<TabsTrigger value="templates">Templates</TabsTrigger>
				</TabsList>

				<TabsContent value="all" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Certificate Management</CardTitle>
							<CardDescription>
								View and manage certificates for your students
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="mb-6 flex items-center gap-4">
								<div className="relative flex-1">
									<Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
									<Input
										type="search"
										placeholder="Search certificates..."
										className="w-full pl-8 md:max-w-sm"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
								</div>
							</div>

							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Student</TableHead>
											<TableHead>Course</TableHead>
											<TableHead className="hidden md:table-cell">
												Completion Date
											</TableHead>
											<TableHead className="hidden md:table-cell">
												Issue Date
											</TableHead>
											<TableHead>Status</TableHead>
											<TableHead className="w-[100px]">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredCertificates.length === 0 ? (
											<TableRow>
												<TableCell colSpan={6} className="h-24 text-center">
													No certificates found.
												</TableCell>
											</TableRow>
										) : (
											filteredCertificates.map((certificate) => (
												<TableRow key={certificate.id}>
													<TableCell>
														<div className="flex items-center gap-3">
															<Avatar>
																<AvatarImage
																	src={
																		certificate.student.image ||
																		'/placeholder.svg'
																	}
																	alt={certificate.student.name}
																/>
																<AvatarFallback>
																	{certificate.student.name.charAt(0)}
																</AvatarFallback>
															</Avatar>
															<div>
																<div className="font-medium">
																	{certificate.student.name}
																</div>
																<div className="text-muted-foreground text-sm">
																	{certificate.student.email}
																</div>
															</div>
														</div>
													</TableCell>
													<TableCell>{certificate.course}</TableCell>
													<TableCell className="hidden md:table-cell">
														{certificate.completionDate}
													</TableCell>
													<TableCell className="hidden md:table-cell">
														{certificate.issueDate || '-'}
													</TableCell>
													<TableCell>
														<Badge
															className={
																certificate.status === 'issued'
																	? 'bg-green-100 text-green-800'
																	: 'bg-yellow-100 text-yellow-800'
															}
														>
															{certificate.status.charAt(0).toUpperCase() +
																certificate.status.slice(1)}
														</Badge>
													</TableCell>
													<TableCell>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button
																	variant="ghost"
																	size="sm"
																	className="h-8 w-8 p-0"
																>
																	<span className="sr-only">Open menu</span>
																	<MoreHorizontal className="h-4 w-4" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																<DropdownMenuLabel>Actions</DropdownMenuLabel>
																{certificate.status === 'pending' ? (
																	<DropdownMenuItem
																		onClick={() =>
																			handleIssueCertificate(certificate.id)
																		}
																	>
																		<Award className="mr-2 h-4 w-4" /> Issue
																		Certificate
																	</DropdownMenuItem>
																) : (
																	<>
																		<DropdownMenuItem asChild>
																			<Link
																				to={`/dashboard/instructor/certificates/${certificate.id}`}
																			>
																				<Eye className="mr-2 h-4 w-4" /> View
																				Certificate
																			</Link>
																		</DropdownMenuItem>
																		<DropdownMenuItem>
																			<Download className="mr-2 h-4 w-4" />{' '}
																			Download PDF
																		</DropdownMenuItem>
																	</>
																)}
															</DropdownMenuContent>
														</DropdownMenu>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="issued" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Issued Certificates</CardTitle>
							<CardDescription>
								Certificates that have been issued to students
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="mb-6 flex items-center gap-4">
								<div className="relative flex-1">
									<Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
									<Input
										type="search"
										placeholder="Search issued certificates..."
										className="w-full pl-8 md:max-w-sm"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
								</div>
							</div>

							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Student</TableHead>
											<TableHead>Course</TableHead>
											<TableHead className="hidden md:table-cell">
												Completion Date
											</TableHead>
											<TableHead className="hidden md:table-cell">
												Issue Date
											</TableHead>
											<TableHead className="w-[100px]">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredCertificates
											.filter((cert) => cert.status === 'issued')
											.map((certificate) => (
												<TableRow key={certificate.id}>
													<TableCell>
														<div className="flex items-center gap-3">
															<Avatar>
																<AvatarImage
																	src={
																		certificate.student.image ||
																		'/placeholder.svg'
																	}
																	alt={certificate.student.name}
																/>
																<AvatarFallback>
																	{certificate.student.name.charAt(0)}
																</AvatarFallback>
															</Avatar>
															<div>
																<div className="font-medium">
																	{certificate.student.name}
																</div>
																<div className="text-muted-foreground text-sm">
																	{certificate.student.email}
																</div>
															</div>
														</div>
													</TableCell>
													<TableCell>{certificate.course}</TableCell>
													<TableCell className="hidden md:table-cell">
														{certificate.completionDate}
													</TableCell>
													<TableCell className="hidden md:table-cell">
														{certificate.issueDate}
													</TableCell>
													<TableCell>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button
																	variant="ghost"
																	size="sm"
																	className="h-8 w-8 p-0"
																>
																	<span className="sr-only">Open menu</span>
																	<MoreHorizontal className="h-4 w-4" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																<DropdownMenuLabel>Actions</DropdownMenuLabel>
																<DropdownMenuItem asChild>
																	<Link
																		to={`/dashboard/instructor/certificates/${certificate.id}`}
																	>
																		<Eye className="mr-2 h-4 w-4" /> View
																		Certificate
																	</Link>
																</DropdownMenuItem>
																<DropdownMenuItem>
																	<Download className="mr-2 h-4 w-4" /> Download
																	PDF
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</TableCell>
												</TableRow>
											))}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="pending" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Pending Certificates</CardTitle>
							<CardDescription>
								Certificates waiting to be issued
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="mb-6 flex items-center gap-4">
								<div className="relative flex-1">
									<Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
									<Input
										type="search"
										placeholder="Search pending certificates..."
										className="w-full pl-8 md:max-w-sm"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
								</div>
								<Button>Issue All</Button>
							</div>

							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Student</TableHead>
											<TableHead>Course</TableHead>
											<TableHead className="hidden md:table-cell">
												Completion Date
											</TableHead>
											<TableHead className="w-[100px]">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredCertificates
											.filter((cert) => cert.status === 'pending')
											.map((certificate) => (
												<TableRow key={certificate.id}>
													<TableCell>
														<div className="flex items-center gap-3">
															<Avatar>
																<AvatarImage
																	src={
																		certificate.student.image ||
																		'/placeholder.svg'
																	}
																	alt={certificate.student.name}
																/>
																<AvatarFallback>
																	{certificate.student.name.charAt(0)}
																</AvatarFallback>
															</Avatar>
															<div>
																<div className="font-medium">
																	{certificate.student.name}
																</div>
																<div className="text-muted-foreground text-sm">
																	{certificate.student.email}
																</div>
															</div>
														</div>
													</TableCell>
													<TableCell>{certificate.course}</TableCell>
													<TableCell className="hidden md:table-cell">
														{certificate.completionDate}
													</TableCell>
													<TableCell>
														<Button
															size="sm"
															onClick={() =>
																handleIssueCertificate(certificate.id)
															}
														>
															Issue
														</Button>
													</TableCell>
												</TableRow>
											))}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="templates" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Certificate Templates</CardTitle>
							<CardDescription>
								Manage your certificate templates
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
								{certificateTemplates.map((template) => (
									<Card key={template.id} className="overflow-hidden">
										<div className="relative aspect-[4/3]">
											<img
												src={template.preview || '/placeholder.svg'}
												alt={template.name}
												className="h-full w-full object-cover"
											/>
											{template.isDefault && (
												<div className="absolute top-2 right-2">
													<Badge className="bg-primary">Default</Badge>
												</div>
											)}
										</div>
										<CardContent className="p-4">
											<h3 className="font-medium">{template.name}</h3>
											<p className="text-muted-foreground mt-1 text-sm">
												{template.description}
											</p>
											<div className="mt-4 flex items-center justify-between">
												<Button variant="outline" size="sm" asChild>
													<Link
														to={`/dashboard/instructor/certificates/templates/${template.id}`}
													>
														Edit
													</Link>
												</Button>
												{!template.isDefault && (
													<Button variant="ghost" size="sm">
														Set as Default
													</Button>
												)}
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
