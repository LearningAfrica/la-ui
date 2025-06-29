import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    image: string
    instructor: string
    rating: number
    students: number
    price: number
    category: string
  }
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/courses/${course.id}`}>
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={course.image || `https://source.unsplash.com/random/800x600?${encodeURIComponent(course.category)}`}
            alt={course.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold line-clamp-2">{course.title}</h3>
              <p className="text-sm text-muted-foreground">{course.instructor}</p>
            </div>
            <Badge variant="secondary">{course.category}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{course.rating}</span>
            <span className="text-xs text-muted-foreground">({course.students.toLocaleString()})</span>
          </div>
          <div className="font-semibold">${course.price.toFixed(2)}</div>
        </CardFooter>
      </Link>
    </Card>
  )
}
