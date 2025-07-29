import { Header } from '@/components/header';
import { CategoryCard } from '@/components/category-card';

export default function CourseCategoriesPage() {
  // Mock data for categories
  const categories = [
    {
      id: '1',
      name: 'Programming',
      description: 'Learn coding and software development',
      image: 'https://cdni.iconscout.com/illustration/premium/thumb/programming-2245536-1889499.png?f=webp',
      courseCount: 243,
    },
    {
      id: '2',
      name: 'Data Science',
      description: 'Master data analysis and machine learning',
      image: 'https://cdni.iconscout.com/illustration/premium/thumb/data-science-5769298-4830074.png?f=webp',
      courseCount: 187,
    },
    {
      id: '3',
      name: 'Design',
      description: 'Explore graphic, UX, and UI design',
      image: 'https://cdni.iconscout.com/illustration/premium/thumb/boy-and-girl-talking-about-ui-ux-design-8158256-6756045.png?f=webp',
      courseCount: 156,
    },
    {
      id: '4',
      name: 'Business',
      description: 'Develop business and entrepreneurship skills',
      image: 'https://cdni.iconscout.com/illustration/premium/thumb/present-the-dashboard-9184021-7482545.png?f=webp',
      courseCount: 201,
    },
  ];

  return (
    <div>
      <Header />
      <main className="container py-8 mx-auto">
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
