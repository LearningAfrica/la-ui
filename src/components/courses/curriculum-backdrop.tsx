"use client"

import { cn } from "@/lib/utils"

interface CurriculumBackdropProps {
  isOpen: boolean
  onClose: () => void
}

export function CurriculumBackdrop({ isOpen, onClose }: CurriculumBackdropProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity lg:hidden",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      onClick={onClose}
      aria-hidden="true"
    />
  )
}
