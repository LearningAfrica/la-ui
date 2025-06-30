import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description: string;
    image: string;
    courseCount: number;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/categories/${category.id}`}>
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={category.image || '/placeholder.svg'}
            alt={category.name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold">{category.name}</h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {category.description}
          </p>
        </CardContent>
        <CardFooter className="border-t p-4">
          <p className="text-muted-foreground text-sm">
            {category.courseCount} courses
          </p>
        </CardFooter>
      </Link>
    </Card>
  );
}
