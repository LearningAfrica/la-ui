import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Database, Palette, LineChart, BookOpen, Video } from "lucide-react"

export function CategorySection() {
  // Mock data for categories
  const categories = [
    {
      id: "1",
      name: "Programming",
      icon: <Code className="h-8 w-8 text-primary" />,
      count: 450,
      image: "/programming-category.jpg",
    },
    {
      id: "2",
      name: "Data Science",
      icon: <Database className="h-8 w-8 text-primary" />,
      count: 320,
      image: "/data-science-category.jpg",
    },
    {
      id: "3",
      name: "Design",
      icon: <Palette className="h-8 w-8 text-primary" />,
      count: 280,
      image: "/design-category.jpg",
    },
    {
      id: "4",
      name: "Business",
      icon: <LineChart className="h-8 w-8 text-primary" />,
      count: 310,
      image: "/business-category.jpg",
    },
    {
      id: "5",
      name: "Academics",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      count: 215,
      image: "/programming-category.jpg",
    },
    {
      id: "6",
      name: "Photography & Video",
      icon: <Video className="h-8 w-8 text-primary" />,
      count: 175,
      image: "/design-category.jpg",
    },
  ]

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Browse Categories</h2>
            <p className="text-muted-foreground">Explore our wide range of courses</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/categories">All Categories</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden h-full">
              <div className="h-32 relative">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">{category.icon}</div>
              </div>
              <CardContent className="p-4 text-center">
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count} courses</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
