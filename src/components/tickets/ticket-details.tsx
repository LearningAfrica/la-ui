"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { TicketStatusBadge } from "@/components/tickets/ticket-status-badge"
import { TicketPriorityBadge } from "@/components/tickets/ticket-priority-badge"
import { TicketCategoryBadge } from "@/components/tickets/ticket-category-badge"
import type { Ticket, TicketComment } from "@/types/ticket"
import { AlertCircle, Clock, FileText, Loader2, Paperclip, Send } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

interface TicketDetailsProps {
  ticket: Ticket
}

export function TicketDetails({ ticket }: TicketDetailsProps) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState<TicketComment[]>(ticket.comments)

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const newTicketComment: TicketComment = {
        id: `comment-${Date.now()}`,
        content: newComment,
        createdAt: new Date().toISOString(),
        author: {
          id: "current-user",
          name: "John Doe",
          role: "student",
          avatar: "/abstract-aj.png",
        },
        attachments: [],
      }

      setComments([...comments, newTicketComment])
      setNewComment("")
      setIsSubmitting(false)

      toast({
        title: "Comment added",
        description: "Your comment has been added to the ticket.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{ticket.title}</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Ticket #{ticket.id.substring(0, 8)}</span>
            <span>•</span>
            <span>Created {format(new Date(ticket.createdAt), "MMM d, yyyy")}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <TicketStatusBadge status={ticket.status} />
          <TicketPriorityBadge priority={ticket.priority} />
          <TicketCategoryBadge category={ticket.category} />
        </div>
      </div>

      {(ticket.courseId || ticket.courseName) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Related Course</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {ticket.courseName && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {ticket.courseId ? (
                      <Link
                        href={`/dashboard/student/courses/${ticket.courseId}`}
                        className="hover:underline text-primary"
                      >
                        {ticket.courseName}
                      </Link>
                    ) : (
                      ticket.courseName
                    )}
                  </span>
                </div>
              )}
              {ticket.lessonName && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Lesson: {ticket.lessonName}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Description</CardTitle>
          <CardDescription>
            Submitted by {ticket.student.name} on {format(new Date(ticket.createdAt), "MMM d, yyyy 'at' h:mm a")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p>{ticket.description}</p>
          </div>

          {ticket.attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Attachments</h4>
              <div className="flex flex-wrap gap-2">
                {ticket.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs hover:bg-accent"
                  >
                    <Paperclip className="h-3 w-3" />
                    <span className="max-w-[150px] truncate">{attachment.filename}</span>
                    <span className="text-muted-foreground">({Math.round(attachment.fileSize / 1024)}KB)</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Comments</h2>

        {comments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No comments yet</h3>
              <p className="text-sm text-muted-foreground">Be the first to add a comment to this ticket.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{comment.author.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className="rounded-full bg-muted px-2 py-1 text-xs">{comment.author.role}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p>{comment.content}</p>
                  </div>

                  {comment.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-xs font-medium">Attachments</h4>
                      <div className="flex flex-wrap gap-2">
                        {comment.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs hover:bg-accent"
                          >
                            <Paperclip className="h-3 w-3" />
                            <span className="max-w-[150px] truncate">{attachment.filename}</span>
                            <span className="text-muted-foreground">({Math.round(attachment.fileSize / 1024)}KB)</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add a comment</CardTitle>
            <CardDescription>Provide additional information or ask questions about this ticket.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Type your comment here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button">
              <Paperclip className="mr-2 h-4 w-4" />
              Attach Files
            </Button>
            <Button onClick={handleSubmitComment} disabled={!newComment.trim() || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Comment
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
