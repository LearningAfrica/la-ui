export type CourseStatus = "draft" | "submitted" | "in-review" | "approved" | "rejected" | "published"

export interface CourseReview {
  id: string
  reviewerId: string
  reviewerName: string
  date: string
  status: "approved" | "rejected"
  comments: string
  checklist: {
    contentQuality: boolean
    technicalAccuracy: boolean
    appropriateLength: boolean
    clearExplanations: boolean
    engagingDelivery: boolean
  }
}

export interface Course {
  id: string
  title: string
  description: string
  instructorId: string
  instructorName: string
  category: string
  subcategory?: string
  level: string
  price: number
  status: CourseStatus
  thumbnail?: string
  createdAt: string
  updatedAt: string
  submittedAt?: string
  publishedAt?: string
  reviews?: CourseReview[]
  rejectionReason?: string
  reviewNotes?: string
  isComplete: boolean
  completionChecklist: {
    basicInfo: boolean
    curriculum: boolean
    media: boolean
    pricing: boolean
    settings: boolean
  }
}
