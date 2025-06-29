import { Card, CardContent } from "@/components/ui/card"
import { Star, StarHalf } from "lucide-react"

interface TestimonialProps {
  testimonial: {
    id: string
    name: string
    role: string
    image: string
    content: string
    rating: number
  }
}

export function TestimonialCard({ testimonial }: TestimonialProps) {
  const { name, role, image, content, rating } = testimonial

  // Generate stars based on rating
  const renderStars = () => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-primary text-primary" />)
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-4 w-4 fill-primary text-primary" />)
    }

    // Add empty stars to make total of 5
    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="h-4 w-4 text-muted-foreground" />)
    }

    return stars
  }

  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-full overflow-hidden">
            <img src={image || "/placeholder.svg"} alt={name} className="h-full w-full object-cover" />
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
        <blockquote className="flex-1 italic text-muted-foreground mb-4">"{content}"</blockquote>
        <div className="flex items-center gap-1 mt-auto">{renderStars()}</div>
      </CardContent>
    </Card>
  )
}
