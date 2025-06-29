"use client"

import { useState } from "react"
import { Bell, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { EventReminder } from "@/components/notifications/event-reminder"
import { NotificationPreferences } from "@/components/notifications/notification-preferences"

// Event types and their corresponding colors
const EVENT_TYPES = {
  assignment: { label: "Assignment", color: "#3b82f6" }, // blue-500
  deadline: { label: "Deadline", color: "#ef4444" }, // red-500
  liveSession: { label: "Live Session", color: "#22c55e" }, // green-500
  exam: { label: "Exam", color: "#f59e0b" }, // amber-500
  studyGroup: { label: "Study Group", color: "#8b5cf6" }, // purple-500
  reminder: { label: "Reminder", color: "#64748b" }, // slate-500
}

// Mock notifications data
const generateNotifications = () => {
  const now = new Date()

  return [
    {
      id: "1",
      title: "JavaScript Quiz Due Soon",
      date: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
      type: "assignment",
      course: "Advanced JavaScript",
      read: false,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      id: "2",
      title: "Final Project Deadline",
      date: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 1 day from now
      type: "deadline",
      course: "Web Development Bootcamp",
      read: false,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      id: "3",
      title: "React Hooks Workshop",
      date: new Date(now.getTime() + 45 * 60 * 1000), // 45 minutes from now
      type: "liveSession",
      course: "React Masterclass",
      read: true,
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
    {
      id: "4",
      title: "Database Design Midterm",
      date: new Date(now.getTime() + 48 * 60 * 60 * 1000), // 2 days from now
      type: "exam",
      course: "Database Systems",
      read: true,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
  ]
}

interface NotificationsPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationsPanel({ open, onOpenChange }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState(generateNotifications())
  const [activeTab, setActiveTab] = useState("upcoming")
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)

  // Filter notifications based on active tab
  const upcomingNotifications = notifications.filter((note) => !note.read)
  const pastNotifications = notifications.filter((note) => note.read)

  // Handle dismissing a notification
  const handleDismiss = (id: string) => {
    setNotifications(notifications.filter((note) => note.id !== id))
    toast.success("Notification dismissed")
  }

  // Handle snoozing a notification
  const handleSnooze = (id: string) => {
    // In a real app, we would update the notification time
    toast.success("Snoozed for 1 hour")
  }

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((note) => ({ ...note, read: true })))
    toast.success("Marked all as read")
  }

  return (
    <>
      <Card className={`fixed right-6 top-20 w-full max-w-md z-50 shadow-lg ${open ? "block" : "hidden"}`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl">Notifications</CardTitle>
            <CardDescription>Stay updated with your events</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setIsPreferencesOpen(true)}>
              <Settings className="h-4 w-4" />
              <span className="sr-only">Notification Settings</span>
            </Button>
            <Button variant="outline" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="upcoming" className="flex-1">
                Upcoming
                {upcomingNotifications.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {upcomingNotifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="past" className="flex-1">
                Past
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="pt-4">
              {upcomingNotifications.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-sm text-muted-foreground">
                      {upcomingNotifications.length} upcoming event{upcomingNotifications.length !== 1 ? "s" : ""}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                      Mark all as read
                    </Button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto pr-1">
                    {upcomingNotifications.map((note) => (
                      <EventReminder
                        key={note.id}
                        id={note.id}
                        title={note.title}
                        date={note.date}
                        type={note.type}
                        course={note.course}
                        color={EVENT_TYPES[note.type as keyof typeof EVENT_TYPES]?.color}
                        onDismiss={handleDismiss}
                        onSnooze={handleSnooze}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <Bell className="h-10 w-10 text-muted-foreground mx-auto" />
                  <p className="mt-2 text-muted-foreground">No upcoming notifications</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="pt-4">
              {pastNotifications.length > 0 ? (
                <>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">
                    {pastNotifications.length} past notification{pastNotifications.length !== 1 ? "s" : ""}
                  </h3>
                  <div className="max-h-[400px] overflow-y-auto pr-1 space-y-2">
                    {pastNotifications.map((note) => (
                      <div key={note.id} className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg">
                        <Bell className="h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <h4 className="font-medium text-muted-foreground">{note.title}</h4>
                          <p className="text-sm text-muted-foreground/70">{note.course}</p>
                          <p className="text-xs text-muted-foreground/70 mt-1">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDismiss(note.id)}>
                          Dismiss
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <Bell className="h-10 w-10 text-muted-foreground mx-auto" />
                  <p className="mt-2 text-muted-foreground">No past notifications</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <Separator className="my-4" />

          <div className="text-center">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>

      <NotificationPreferences open={isPreferencesOpen} onOpenChange={setIsPreferencesOpen} />
    </>
  )
}
