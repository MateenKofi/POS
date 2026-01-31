import { Button } from "@/components/custom-components"
import { Loader2, AlertCircle } from "lucide-react"

interface DashboardHeaderProps {
  isLoading: boolean
  error: unknown
  onRetry: () => void
}

export const DashboardHeader = ({ isLoading, error, onRetry }: DashboardHeaderProps) => {
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Your Sales at a Glance
          </h1>
          <p className="text-slate-600">Loading dashboard data...</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p className="text-slate-600">Error loading dashboard data</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">Failed to load dashboard data</p>
            <Button onClick={onRetry}>Retry</Button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
