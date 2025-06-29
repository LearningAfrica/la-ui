"use client"

import type React from "react"

import { useState } from "react"
import { Copy, Facebook, Linkedin, Mail, Twitter } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ShareCertificateDialogProps {
  certificateId: string
  certificateTitle: string
  children: React.ReactNode
}

export function ShareCertificateDialog({ certificateId, certificateTitle, children }: ShareCertificateDialogProps) {
  const [open, setOpen] = useState(false)

  // In a real app, this would be a real URL
  const shareUrl = `https://example.com/certificates/${certificateId}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    toast.success("Link copied to clipboard")
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Check out my ${certificateTitle} certificate`)
    const body = encodeURIComponent(`I've earned a certificate in ${certificateTitle}. Check it out here: ${shareUrl}`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
    setOpen(false)
  }

  const handleSocialShare = (platform: string) => {
    let url = ""
    const text = encodeURIComponent(`I've earned a certificate in ${certificateTitle}!`)

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`
        break
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
    }

    if (url) {
      window.open(url, "_blank")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Certificate</DialogTitle>
          <DialogDescription>Share your achievement with others</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="link">Copy Link</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4 pt-4">
            <div className="flex space-x-2">
              <Input value={shareUrl} readOnly />
              <Button size="icon" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy link</span>
              </Button>
            </div>
            <Button className="w-full" onClick={handleEmailShare}>
              <Mail className="mr-2 h-4 w-4" />
              Share via Email
            </Button>
          </TabsContent>

          <TabsContent value="social" className="pt-4">
            <div className="grid grid-cols-3 gap-4">
              <Button variant="outline" onClick={() => handleSocialShare("twitter")}>
                <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                <span className="sr-only">Share on Twitter</span>
              </Button>
              <Button variant="outline" onClick={() => handleSocialShare("facebook")}>
                <Facebook className="h-5 w-5 text-[#4267B2]" />
                <span className="sr-only">Share on Facebook</span>
              </Button>
              <Button variant="outline" onClick={() => handleSocialShare("linkedin")}>
                <Linkedin className="h-5 w-5 text-[#0077B5]" />
                <span className="sr-only">Share on LinkedIn</span>
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Share your achievement on your favorite social platform
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
