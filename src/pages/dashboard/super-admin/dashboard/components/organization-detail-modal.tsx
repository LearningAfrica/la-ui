import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Activity,
  Building,
  Briefcase,
  Calendar,
  DollarSign,
  Eye,
  Globe,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react"

import type { Organization } from "../types"

interface OrganizationDetailModalProps {
  organization: Organization
}

export function OrganizationDetailModal({ organization }: OrganizationDetailModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {organization.name}
          </DialogTitle>
          <DialogDescription>
            {organization.type} • {organization.industry}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-center gap-4">
            <Badge
              className={
                organization.status === "active"
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : organization.status === "inactive"
                    ? "bg-red-100 text-red-800 hover:bg-red-100"
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
              }
            >
              {organization.status.charAt(0).toUpperCase() + organization.status.slice(1)}
            </Badge>
            <Badge variant="outline">{organization.size}</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                    <p className="text-2xl font-bold">{organization.activeProjects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Annual Revenue</p>
                    <p className="text-2xl font-bold">${organization.revenue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Partnership Since</p>
                    <p className="text-2xl font-bold">{new Date(organization.partnershipDate).getFullYear()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Organization Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Type:</span>
                  <span>{organization.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Industry:</span>
                  <span>{organization.industry}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Size:</span>
                  <span>{organization.size}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Location:</span>
                  <span>{organization.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Website:</span>
                  <a
                    to={organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {organization.website}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Partnership Date:</span>
                  <span>{new Date(organization.partnershipDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Primary Contact</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Name:</span>
                  <span>{organization.contactName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Title:</span>
                  <span>{organization.contactTitle}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                  <a to={`mailto:${organization.contactEmail}`} className="text-primary hover:underline">
                    {organization.contactEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Phone:</span>
                  <span>{organization.contactPhone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Services & Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Active Services:</h4>
                <div className="flex flex-wrap gap-2">
                  {organization.services.map((service) => (
                    <Badge key={service} variant="outline">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Description:</h4>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{organization.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
