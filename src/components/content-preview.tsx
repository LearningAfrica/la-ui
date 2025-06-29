"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface ContentPreviewProps {
  title: string
  type: "video" | "rich-text" | "image"
  content?: string
  videoUrl?: string
  imageUrl?: string
  imageAlt?: string
}

export function ContentPreview({ title, type, content, videoUrl, imageUrl, imageAlt }: ContentPreviewProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {type === "video" && videoUrl && (
            <div className="aspect-video">
              {videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be") ? (
                <iframe
                  src={videoUrl.replace("watch?v=", "embed/")}
                  className="w-full h-full"
                  allowFullScreen
                  title={title}
                ></iframe>
              ) : (
                <video src={videoUrl} controls className="w-full h-full">
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          {type === "rich-text" && content && (
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          {type === "image" && imageUrl && (
            <div className="flex justify-center">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={imageAlt || title}
                className="max-h-[60vh] object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg"
                }}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
