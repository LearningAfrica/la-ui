import { Card, CardContent } from '@/components/ui/card';
import { Star, StarHalf } from 'lucide-react';

interface TestimonialProps {
  testimonial: {
    id: string;
    name: string;
    role: string;
    image: string;
    content: string;
    rating: number;
  };
}

export function TestimonialCard({ testimonial }: TestimonialProps) {
  const { name, role, image, content, rating } = testimonial;

  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="fill-primary text-primary h-4 w-4"
        />,
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half-star"
          className="fill-primary text-primary h-4 w-4"
        />,
      );
    }

    // Add empty stars to make total of 5
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-star-${i}`}
          className="text-muted-foreground h-4 w-4"
        />,
      );
    }

    return stars;
  };

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col p-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="h-12 w-12 overflow-hidden rounded-full">
            <img
              src={image || '/placeholder.svg'}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-muted-foreground text-sm">{role}</p>
          </div>
        </div>
        <blockquote className="text-muted-foreground mb-4 flex-1 italic">
          "{content}"
        </blockquote>
        <div className="mt-auto flex items-center gap-1">{renderStars()}</div>
      </CardContent>
    </Card>
  );
}
