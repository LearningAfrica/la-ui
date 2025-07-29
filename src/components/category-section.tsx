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
      image: "https://cdni.iconscout.com/illustration/premium/thumb/programming-3728250-3123323.png?f=webp",
    },
    {
      id: '2',
      name: 'Data Science',
      icon: <Database className="text-primary h-8 w-8" />,
      count: 320,
      image: 'https://cdni.iconscout.com/illustration/premium/thumb/boy-and-girl-are-showing-sql-database-on-laptop-10717598-8732834.png?f=webp',
    },
    {
      id: '3',
      name: 'Design',
      icon: <Palette className="text-primary h-8 w-8" />,
      count: 280,
      image: 'https://cdni.iconscout.com/illustration/premium/thumb/female-graphic-designer-doing-design-4393762-3649083.png?f=webp',
    },
    {
      id: '4',
      name: 'Business',
      icon: <LineChart className="text-primary h-8 w-8" />,
      count: 310,
      image: 'https://cdni.iconscout.com/illustration/premium/thumb/work-on-different-tasks-9184022-7482546.png?f=webp',
    },
    {
      id: '5',
      name: 'Academics',
      icon: <BookOpen className="text-primary h-8 w-8" />,
      count: 215,
      image: 'https://cdni.iconscout.com/illustration/premium/thumb/online-academics-12091882-9860409.png?f=webp',
    },
    {
      id: '6',
      name: 'Photography & Video',
      icon: <Video className="text-primary h-8 w-8" />,
      count: 175,
      image: 'https://cdni.iconscout.com/illustration/premium/thumb/photography-enthusiasts-9959590-8103025.png?f=webp',
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto">
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
