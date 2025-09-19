import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, CheckCircle, Clock, TrendingUp } from "lucide-react"

import { useAnalytics } from "../hooks"

export function AnalyticsDashboard() {
  const { data: analytics, isLoading } = useAnalytics()

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Inquiries</p>
                <p className="text-2xl font-bold">{analytics.totalInquiries}</p>
              </div>
              <Building className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{analytics.pendingInquiries}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{analytics.approvedInquiries}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{analytics.conversionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Industries</CardTitle>
            <CardDescription>Organizations by industry sector</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topIndustries.map((industry) => (
                <div key={industry.name} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{industry.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(industry.count / analytics.totalInquiries) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{industry.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization Sizes</CardTitle>
            <CardDescription>Distribution by company size</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.organizationSizes.map((size) => (
                <div key={size.size} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{size.size}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div
                        className="bg-secondary h-2 rounded-full"
                        style={{ width: `${(size.count / analytics.totalInquiries) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{size.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
