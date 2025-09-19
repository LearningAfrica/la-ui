import { AnalyticsDashboard } from "./components/analytics-dashboard"
import { InquiriesOverview } from "./components/inquiries-overview"
import { useInquiries } from "./hooks"

export default function SuperAdminAnalyticsPage() {
  // const { inquiries, isLoading } = useOutletContext<SuperAdminDashboardOutletContext>()
  const { data, isLoading } = useInquiries()

  return (
    <div className="space-y-8">
      <AnalyticsDashboard />
      <InquiriesOverview inquiries={data!} isLoading={isLoading} />
    </div>
  )
}
