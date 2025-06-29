"use client"

import { useState } from "react"
import { Check, Copy, ExternalLink, QrCode, Search } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface CertificateVerificationProps {
  credentialId: string
  verificationUrl: string
  qrCodeUrl: string
}

export function CertificateVerification({ credentialId, verificationUrl, qrCodeUrl }: CertificateVerificationProps) {
  const [copied, setCopied] = useState(false)

  const copyCredentialId = () => {
    navigator.clipboard.writeText(credentialId)
    setCopied(true)
    toast.success("Credential ID copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const copyVerificationUrl = () => {
    navigator.clipboard.writeText(verificationUrl)
    toast.success("Verification URL copied to clipboard")
  }

  const handleVerify = () => {
    // In a real app, this would verify the certificate
    toast.success("Certificate is valid")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification</CardTitle>
        <CardDescription>Verify the authenticity of this certificate</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">Credential ID</div>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">{credentialId}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyCredentialId}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="sr-only">Copy credential ID</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="text-sm font-medium">Verification Link</div>
          <div className="flex items-center justify-between p-2 rounded-md bg-muted text-sm">
            <span className="truncate mr-2">{verificationUrl}</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyVerificationUrl}>
                <Copy className="h-3.5 w-3.5" />
                <span className="sr-only">Copy verification URL</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                <a href={verificationUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="sr-only">Open verification URL</span>
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <QrCode className="mr-2 h-4 w-4" />
                View QR Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Certificate QR Code</DialogTitle>
                <DialogDescription>Scan this QR code to verify the certificate</DialogDescription>
              </DialogHeader>
              <div className="flex justify-center p-4">
                <img src={qrCodeUrl || "/placeholder.svg"} alt="Certificate QR Code" className="w-48 h-48" />
              </div>
              <div className="text-center text-sm text-muted-foreground">Credential ID: {credentialId}</div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <div className="flex items-center space-x-2 mb-4">
            <Input placeholder="Enter credential ID to verify" />
            <Button size="icon">
              <Search className="h-4 w-4" />
              <span className="sr-only">Verify</span>
            </Button>
          </div>
          <Button className="w-full" onClick={handleVerify}>
            Verify Certificate
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
