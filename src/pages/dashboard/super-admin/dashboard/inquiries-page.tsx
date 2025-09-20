
import { InquiriesOverview } from "./components/inquiries-overview"
import { useInquiries } from "./hooks"

export default function SuperAdminInquiriesPage() {
  // const { inquiries, isLoading } = useOutletContext<SuperAdminDashboardOutletContext>()
  const { data, isLoading } = useInquiries()

  return <InquiriesOverview inquiries={data!} isLoading={isLoading}  />
}
