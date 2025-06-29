"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { CommentItem, type CommentProps } from "./comment-item"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment is too long (max 1000 characters)"),
})

type CommentFormValues = z.infer<typeof commentSchema>

interface CommentSectionProps {
  contentId: string
  contentType: "lesson" | "quiz" | "assignment"
  comments: CommentProps[]
  currentUser: {
    id: string
    name: string
    image?: string
    role: "student" | "instructor" | "admin"
  }
  onAddComment: (contentId: string, contentType: string, content: string) => void
  onReplyComment: (commentId: string, content: string) => void
  onEditComment: (commentId: string, content: string) => void
  onDeleteComment: (commentId: string) => void
  onLikeComment: (commentId: string) => void
  onReportComment: (commentId: string) => void
}

export function CommentSection({
  contentId,
  contentType,
  comments,
  currentUser,
  onAddComment,
  onReplyComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  onReportComment,
}: CommentSectionProps) {
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent")

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  })

  const handleSubmit = (values: CommentFormValues) => {
    onAddComment(contentId, contentType, values.content)
    form.reset()
    toast({
      title: "Comment posted",
      description: "Your comment has been posted successfully.",
    })
  }

  // Sort comments based on the selected sort option
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else {
      return b.likes - a.likes
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Discussion ({comments.length})</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Button variant={sortBy === "recent" ? "secondary" : "ghost"} size="sm" onClick={() => setSortBy("recent")}>
            Recent
          </Button>
          <Button variant={sortBy === "popular" ? "secondary" : "ghost"} size="sm" onClick={() => setSortBy("popular")}>
            Popular
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Add a comment or ask a question..." className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">Post Comment</Button>
          </div>
        </form>
      </Form>

      {sortedComments.length > 0 ? (
        <div className="space-y-6 pt-4">
          {sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              {...comment}
              currentUserId={currentUser.id}
              onReply={onReplyComment}
              onEdit={onEditComment}
              onDelete={onDeleteComment}
              onLike={onLikeComment}
              onReport={onReportComment}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md bg-muted py-10 text-center">
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  )
}
