import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface CategoryCardProps {
  category: {
    id: string
    name: string
    description: string
    image: string
    courseCount: number
  }
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/categories/${category.id}`}>
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={category.image || "/placeholder.svg"}
            alt={category.name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold">{category.name}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{category.description}</p>
        </CardContent>
        <CardFooter className="border-t p-4">
          <p className="text-sm text-muted-foreground">{category.courseCount} courses</p>
        </CardFooter>
      </Link>
    </Card>
  )
}
