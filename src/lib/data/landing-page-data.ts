// Mock data for featured courses
const featuredCourses = [
	{
		id: '1',
		title: 'Complete Web Development Bootcamp',
		description: 'Learn HTML, CSS, JavaScript, React, Node and more!',
		image: '/web-dev-course.jpg',
		instructor: 'Dr. Angela Yu',
		rating: 4.8,
		students: 15432,
		price: 89.99,
		category: 'Programming',
	},
	{
		id: '2',
		title: 'Data Science A-Z',
		description: 'Learn Data Science with Python, R, SQL, and Tableau',
		image: '/data-science-course.jpg',
		instructor: 'Kirill Eremenko',
		rating: 4.7,
		students: 12345,
		price: 94.99,
		category: 'Data Science',
	},
	{
		id: '3',
		title: 'Digital Marketing Masterclass',
		description: 'Complete guide to SEO, SEM, social media, and more',
		image: '/marketing-course.jpg',
		instructor: 'Sarah Johnson',
		rating: 4.9,
		students: 9876,
		price: 79.99,
		category: 'Marketing',
	},
];

// Mock data for testimonials
const testimonials = [
	{
		id: '1',
		name: 'Michael Chen',
		role: 'Software Developer',
		image: '/testimonial-1.jpg',
		content:
			'The courses on this platform helped me transition from a junior to senior developer in just 6 months. The instructors are knowledgeable and the content is always up-to-date.',
		rating: 5,
	},
	{
		id: '2',
		name: 'Sophia Rodriguez',
		role: 'UX Designer',
		image: '/testimonial-2.jpg',
		content:
			"I've taken design courses on many platforms, but the quality of instruction here is unmatched. The projects are practical and I was able to build a portfolio that landed me my dream job.",
		rating: 5,
	},
	{
		id: '3',
		name: 'James Wilson',
		role: 'Marketing Manager',
		image: '/testimonial-3.jpg',
		content:
			"The digital marketing courses provided me with actionable strategies that I could implement immediately. My company's online presence has grown significantly as a result.",
		rating: 4,
	},
];

// Mock data for pricing plans
const pricingPlans = [
	{
		id: '1',
		name: 'Basic',
		price: 9.99,
		interval: 'month',
		description: 'Perfect for individual learners',
		features: [
			'Access to 100+ courses',
			'New courses monthly',
			'Basic course completion certificates',
			'24/7 support',
		],
		popular: false,
	},
	{
		id: '2',
		name: 'Pro',
		price: 19.99,
		interval: 'month',
		description: 'Ideal for dedicated students',
		features: [
			'Access to all 1,000+ courses',
			'New courses weekly',
			'Premium certificates',
			'1-on-1 mentor sessions',
			'Offline downloads',
			'Priority support',
		],
		popular: true,
	},
	{
		id: '3',
		name: 'Enterprise',
		price: 49.99,
		interval: 'month',
		description: 'For teams and organizations',
		features: [
			'Everything in Pro',
			'Custom learning paths',
			'Analytics dashboard',
			'API access',
			'SSO integration',
			'Dedicated account manager',
		],
		popular: false,
	},
];

// Mock data for stats
const stats = [
	{
		id: '1',
		value: '1M+',
		label: 'Students',
		description: 'Learners worldwide',
	},
	{
		id: '2',
		value: '2,000+',
		label: 'Courses',
		description: 'Across all categories',
	},
	{
		id: '3',
		value: '500+',
		label: 'Instructors',
		description: 'Expert teachers',
	},
	{
		id: '4',
		value: '4.8',
		label: 'Rating',
		description: 'From student reviews',
	},
];

export const landingPageData = {
	featuredCourses,
	testimonials,
	pricingPlans,
	stats,
};
