"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Mail, UserPlus, X, Sparkles, Send, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { apiErrorMsg } from "@/lib/utils/axios-err"

const inviteSchema = z.object({
  emails: z.string().min(1, "At least one email is required"),
  role: z.enum(["instructor", "admin"], {
    required_error: "Please select a role",
  }),
  message: z.string().optional(),
})

type InviteFormData = z.infer<typeof inviteSchema>

interface InviteInstructorDialogProps {
  children?: React.ReactNode
}

export function InviteInstructorDialog({ children }: InviteInstructorDialogProps) {
  const [open, setOpen] = useState(false)
  const [emailList, setEmailList] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState("")

  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      emails: "",
      role: "instructor",
      message: "",
    },
  })

  const addEmail = () => {
    const email = currentEmail.trim()
    if (email && isValidEmail(email) && !emailList.includes(email)) {
      const newEmailList = [...emailList, email]
      setEmailList(newEmailList)
      form.setValue("emails", newEmailList.join(", "))
      setCurrentEmail("")
    }
  }

  const removeEmail = (emailToRemove: string) => {
    const newEmailList = emailList.filter(email => email !== emailToRemove)
    setEmailList(newEmailList)
    form.setValue("emails", newEmailList.join(", "))
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addEmail()
    }
  }

  const onSubmit = form.handleSubmit(async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const emailCount = emailList.length
      toast.success(`Invitation${emailCount > 1 ? 's' : ''} sent to ${emailCount} instructor${emailCount > 1 ? 's' : ''}`)

      // Reset form
      form.reset()
      setEmailList([])
      setCurrentEmail("")
      setOpen(false)
    } catch (error) {
      toast.error(apiErrorMsg(error, "Failed to send invitations"))
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Instructors
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden bg-gradient-to-br from-slate-50 to-white border-0 shadow-2xl">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Mail className="h-6 w-6" />
                </div>
                Invite Instructors
                <Sparkles className="h-5 w-5 text-yellow-300" />
              </DialogTitle>
              <DialogDescription className="text-violet-100 text-base mt-2">
                Send beautiful invitations to potential instructors and grow your educational platform
              </DialogDescription>
            </DialogHeader>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-yellow-300/20 rounded-full blur-lg"></div>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                {/* Email Input Section */}
                <FormField
                  control={form.control}
                  name="emails"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Users className="h-4 w-4 text-violet-600" />
                        Email Addresses
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <Input
                              placeholder="Enter email address..."
                              value={currentEmail}
                              onChange={(e) => setCurrentEmail(e.target.value)}
                              onKeyPress={handleKeyPress}
                              className="flex-1 border-2 border-gray-200 focus:border-violet-500 focus:ring-violet-500/20 transition-all duration-200 rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={addEmail}
                              disabled={!currentEmail.trim() || !isValidEmail(currentEmail.trim())}
                              className="px-6 border-2 border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 transition-all duration-200 disabled:opacity-50"
                            >
                              Add
                            </Button>
                          </div>

                          {emailList.length > 0 && (
                            <div className="p-4 border-2 border-dashed border-violet-200 rounded-xl bg-gradient-to-br from-violet-50/50 to-indigo-50/50 backdrop-blur-sm">
                              <div className="flex flex-wrap gap-2">
                                {emailList.map((email, index) => (
                                  <Badge
                                    key={email}
                                    variant="secondary"
                                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-800 border border-violet-200 hover:from-violet-200 hover:to-indigo-200 transition-all duration-200 animate-in slide-in-from-left-2"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                  >
                                    <Mail className="h-3 w-3" />
                                    {email}
                                    <button
                                      type="button"
                                      onClick={() => removeEmail(email)}
                                      className="ml-1 hover:bg-red-200 rounded-full p-1 transition-colors duration-200 group"
                                    >
                                      <X className="h-3 w-3 text-gray-500 group-hover:text-red-600" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                              <p className="text-sm text-violet-600 mt-2 font-medium">
                                {emailList.length} instructor{emailList.length !== 1 ? 's' : ''} ready to invite
                              </p>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription className="text-gray-600">
                        Add email addresses one by one. Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> or <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">,</kbd> to add each email.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Role Selection */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-800">Role Assignment</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-2 border-gray-200 focus:border-violet-500 focus:ring-violet-500/20 transition-all duration-200 rounded-lg h-12">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-2 border-gray-200 rounded-lg shadow-xl">
                          <SelectItem value="instructor" className="p-4 hover:bg-violet-50 transition-colors duration-200">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold text-gray-800">Instructor</span>
                                <span className="text-sm text-gray-600">Can create and manage courses</span>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="admin" className="p-4 hover:bg-violet-50 transition-colors duration-200">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <Sparkles className="h-4 w-4 text-purple-600" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold text-gray-800">Admin</span>
                                <span className="text-sm text-gray-600">Full administrative access</span>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-gray-600">
                        Choose the role that will be assigned to the invited instructors.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Personal Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-800">Personal Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add a warm, personal message to make your invitation more welcoming..."
                          className="resize-none border-2 border-gray-200 focus:border-violet-500 focus:ring-violet-500/20 transition-all duration-200 rounded-lg min-h-[100px]"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-600">
                        This personal touch will be included in the invitation email to make it more engaging.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Footer */}
              <DialogFooter className="gap-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="px-6 border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={emailList.length === 0 || form.formState.isSubmitting}
                  className="px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Send {emailList.length} Invitation{emailList.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
