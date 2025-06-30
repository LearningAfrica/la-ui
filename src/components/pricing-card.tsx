import { Check } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    price: number;
    interval: string;
    description: string;
    features: string[];
    popular?: boolean;
  };
}

export function PricingCard({ plan }: PricingCardProps) {
  const { name, price, interval, description, features, popular } = plan;

  return (
    <Card
      className={cn(
        'flex h-full flex-col',
        popular && 'border-primary shadow-lg',
      )}
    >
      <CardHeader className="pt-6 pb-8">
        {popular && <Badge className="mb-2 w-fit">Most Popular</Badge>}
        <h3 className="text-2xl font-bold">{name}</h3>
        <div className="mt-2">
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-muted-foreground">/{interval}</span>
        </div>
        <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="text-primary h-4 w-4" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-4">
        <Button className="w-full" variant={popular ? 'default' : 'outline'}>
          Choose {name}
        </Button>
      </CardFooter>
    </Card>
  );
}
