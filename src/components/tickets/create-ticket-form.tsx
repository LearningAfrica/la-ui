"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Upload } from "lucide-react"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  category: z.enum(["technical", "content", "billing", "account", "certificate", "other"] as const),
  priority: z.enum(["low", "medium", "high", "urgent"] as const),
  courseId: z.string().optional(),
  lessonId: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface CreateTicketFormProps {
  courseId?: string
  courseName?: string
  lessonId?: string
  lessonName?: string
  onSuccess?: () => void
}

export function CreateTicketForm({ courseId, courseName, lessonId, lessonName, onSuccess }: CreateTicketFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "technical",
      priority: "medium",
      courseId: courseId || "",
      lessonId: lessonId || "",
    },
  })

  function onSubmit(values: FormValues) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log(values)
      console.log(files)

      toast({
        title: "Ticket submitted",
        description: "Your ticket has been submitted successfully.",
      })

      setIsSubmitting(false)
      form.reset()
      setFiles([])

      if (onSuccess) {
        onSuccess()
      }
    }, 1500)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const validFiles = newFiles.filter((file) => file.size <= MAX_FILE_SIZE)

      if (validFiles.length !== newFiles.length) {
        toast({
          title: "File too large",
          description: "Some files exceed the maximum size of 5MB.",
          variant: "destructive",
        })
      }

      setFiles((prev) => [...prev, ...validFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Brief description of the issue" {...field} />
              </FormControl>
              <FormDescription>Provide a clear and concise title for your issue.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="content">Course Content</SelectItem>
                  <SelectItem value="billing">Billing/Payment</SelectItem>
                  <SelectItem value="account">Account Access</SelectItem>
                  <SelectItem value="certificate">Certificate Issue</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Select the category that best describes your issue.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Select the priority level for your issue.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {courseName && (
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm font-medium">Course: {courseName}</p>
            {lessonName && <p className="text-sm text-muted-foreground">Lesson: {lessonName}</p>}
          </div>
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please provide detailed information about your issue"
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Include steps to reproduce, error messages, and any other relevant details.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div>
            <FormLabel htmlFor="file-upload">Attachments (Optional)</FormLabel>
            <div className="mt-1 flex items-center gap-4">
              <label
                htmlFor="file-upload"
                className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium hover:bg-accent hover:text-accent-foreground"
              >
                <Upload className="h-4 w-4" />
                <span>Upload files</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*, application/pdf, .doc, .docx, .txt"
                />
              </label>
              <p className="text-xs text-muted-foreground">Max 5MB per file. Images, PDFs, and documents.</p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="rounded-md border p-4">
              <h4 className="mb-2 text-sm font-medium">Attached Files</h4>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Ticket"
          )}
        </Button>
      </form>
    </Form>
  )
}
