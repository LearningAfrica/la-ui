import { Badge } from "@/components/ui/badge"
import type { TicketPriority } from "@/types/ticket"
import { AlertCircle, ArrowDown, ArrowUp } from "lucide-react"

interface TicketPriorityBadgeProps {
  priority: TicketPriority
}

export function TicketPriorityBadge({ priority }: TicketPriorityBadgeProps) {
  const priorityConfig = {
    low: {
      label: "Low",
      icon: ArrowDown,
      variant: "outline" as const,
    },
    medium: {
      label: "Medium",
      icon: null,
      variant: "secondary" as const,
    },
    high: {
      label: "High",
      icon: ArrowUp,
      variant: "warning" as const,
    },
    urgent: {
      label: "Urgent",
      icon: AlertCircle,
      variant: "destructive" as const,
    },
  }

  const config = priorityConfig[priority]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      {Icon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  )
}
