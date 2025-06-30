import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  duration: string;
  level: string;
  url: string;
}

interface LearningRecommendationsProps {
  recommendations: Recommendation[];
}

export function LearningRecommendations({
  recommendations,
}: LearningRecommendationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
        <CardDescription>
          Based on your learning history and goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <div key={recommendation.id} className="flex gap-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                <img
                  src={recommendation.image || '/placeholder.svg'}
                  alt={recommendation.title}
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{recommendation.title}</h4>
                <p className="text-muted-foreground line-clamp-1 text-sm">
                  {recommendation.description}
                </p>
                <div className="mt-1 flex flex-wrap gap-2">
                  <span className="bg-muted inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium">
                    {recommendation.category}
                  </span>
                  <span className="bg-muted inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium">
                    {recommendation.level}
                  </span>
                  <span className="bg-muted inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium">
                    {recommendation.duration}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <Button asChild size="sm" variant="outline">
                  <Link to={recommendation.url}>View</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
