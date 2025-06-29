"use client"

import { useState } from "react"
import { Search, Share2, User, Users, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

// Sample student data
const sampleStudents = [
  {
    id: "s1",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    image: "/abstract-aj.png",
    course: "Web Development Bootcamp",
  },
  {
    id: "s2",
    name: "Jamie Smith",
    email: "jamie.smith@example.com",
    image: "/javascript-code-abstract.png",
    course: "Advanced JavaScript",
  },
  {
    id: "s3",
    name: "Taylor Wilson",
    email: "t.wilson@example.com",
    image: "/Abstract Geometric Shapes.png",
    course: "React Masterclass",
  },
  {
    id: "s4",
    name: "Morgan Lee",
    email: "morgan.l@example.com",
    image: "/machine-learning-concept.png",
    course: "Database Systems",
  },
  {
    id: "s5",
    name: "Casey Brown",
    email: "c.brown@example.com",
    image: "/abstract-blue-curves.png",
    course: "Data Structures & Algorithms",
  },
  {
    id: "s6",
    name: "Jordan Rivera",
    email: "j.rivera@example.com",
    image: "/placeholder.svg?height=32&width=32&query=JR",
    course: "CSS Mastery",
  },
  {
    id: "s7",
    name: "Riley Cooper",
    email: "riley.c@example.com",
    image: "/placeholder.svg?height=32&width=32&query=RC",
    course: "TypeScript Fundamentals",
  },
  {
    id: "s8",
    name: "Quinn Martinez",
    email: "q.martinez@example.com",
    image: "/placeholder.svg?height=32&width=32&query=QM",
    course: "UI/UX Design Principles",
  },
]

// Sample groups
const sampleGroups = [
  {
    id: "g1",
    name: "Study Group A",
    members: ["s1", "s2", "s3"],
  },
  {
    id: "g2",
    name: "Project Team B",
    members: ["s4", "s5", "s6"],
  },
  {
    id: "g3",
    name: "Discussion Group C",
    members: ["s2", "s7", "s8"],
  },
]

// Form schema
const shareFormSchema = z.object({
  message: z.string().optional(),
  allowEdit: z.boolean().default(false),
  notifyRecipients: z.boolean().default(true),
})

type ShareFormValues = z.infer<typeof shareFormSchema>

interface ShareEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: any
  onShare: (recipients: string[], options: ShareFormValues) => void
}

export function ShareEventDialog({ open, onOpenChange, event, onShare }: ShareEventDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("students")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  // Initialize form
  const form = useForm<ShareFormValues>({
    resolver: zodResolver(shareFormSchema),
    defaultValues: {
      message: "",
      allowEdit: false,
      notifyRecipients: true,
    },
  })

  // Filter students based on search query
  const filteredStudents = sampleStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter groups based on search query
  const filteredGroups = sampleGroups.filter((group) => group.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Toggle student selection
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  // Toggle group selection
  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  // Get all selected student IDs (including those from selected groups)
  const getAllSelectedStudentIds = () => {
    const groupStudentIds = selectedGroups.flatMap(
      (groupId) => sampleGroups.find((g) => g.id === groupId)?.members || [],
    )
    return [...new Set([...selectedStudents, ...groupStudentIds])]
  }

  // Handle form submission
  const onSubmit = (data: ShareFormValues) => {
    const allSelectedStudentIds = getAllSelectedStudentIds()

    if (allSelectedStudentIds.length === 0) {
      toast.error("Please select at least one recipient")
      return
    }

    onShare(allSelectedStudentIds, data)
    onOpenChange(false)

    // Reset selections
    setSelectedStudents([])
    setSelectedGroups([])
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Event
          </DialogTitle>
          <DialogDescription>Share "{event?.title}" with other students or groups</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students or groups..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="students" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="students">
                <User className="mr-2 h-4 w-4" />
                Students
              </TabsTrigger>
              <TabsTrigger value="groups">
                <Users className="mr-2 h-4 w-4" />
                Groups
              </TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="mt-4">
              <ScrollArea className="h-[200px] pr-4">
                {filteredStudents.length > 0 ? (
                  <div className="space-y-2">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between rounded-md border p-2 hover:bg-muted/50 cursor-pointer"
                        onClick={() => toggleStudentSelection(student.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.image || "/placeholder.svg"} alt={student.name} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                        <Checkbox checked={selectedStudents.includes(student.id)} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-muted-foreground">No students found</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="groups" className="mt-4">
              <ScrollArea className="h-[200px] pr-4">
                {filteredGroups.length > 0 ? (
                  <div className="space-y-2">
                    {filteredGroups.map((group) => (
                      <div
                        key={group.id}
                        className="flex items-center justify-between rounded-md border p-2 hover:bg-muted/50 cursor-pointer"
                        onClick={() => toggleGroupSelection(group.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            {group.members.slice(0, 3).map((memberId) => {
                              const member = sampleStudents.find((s) => s.id === memberId)
                              return (
                                <Avatar key={memberId} className="h-7 w-7 border-2 border-background">
                                  <AvatarImage src={member?.image || "/placeholder.svg"} alt={member?.name} />
                                  <AvatarFallback>{member?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              )
                            })}
                            {group.members.length > 3 && (
                              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                                +{group.members.length - 3}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{group.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {group.members.length} member{group.members.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <Checkbox checked={selectedGroups.includes(group.id)} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-muted-foreground">No groups found</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {(selectedStudents.length > 0 || selectedGroups.length > 0) && (
            <div className="pt-2 border-t">
              <h4 className="text-sm font-medium mb-2">Selected Recipients</h4>
              <div className="flex flex-wrap gap-2">
                {selectedStudents.map((studentId) => {
                  const student = sampleStudents.find((s) => s.id === studentId)
                  return (
                    <Badge key={studentId} variant="secondary" className="flex items-center gap-1">
                      {student?.name}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleStudentSelection(studentId)
                        }}
                      />
                    </Badge>
                  )
                })}
                {selectedGroups.map((groupId) => {
                  const group = sampleGroups.find((g) => g.id === groupId)
                  return (
                    <Badge key={groupId} variant="secondary" className="flex items-center gap-1">
                      {group?.name}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleGroupSelection(groupId)
                        }}
                      />
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="grid gap-2">
              <label htmlFor="message" className="text-sm font-medium">
                Add a message (optional)
              </label>
              <Input id="message" placeholder="Enter a message to send with this event" {...form.register("message")} />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowEdit"
                checked={form.watch("allowEdit")}
                onCheckedChange={(checked) => form.setValue("allowEdit", !!checked)}
              />
              <label
                htmlFor="allowEdit"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Allow recipients to edit this event
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notifyRecipients"
                checked={form.watch("notifyRecipients")}
                onCheckedChange={(checked) => form.setValue("notifyRecipients", !!checked)}
              />
              <label
                htmlFor="notifyRecipients"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Send notification to recipients
              </label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Share2 className="mr-2 h-4 w-4" />
                Share Event
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
