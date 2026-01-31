import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/custom-components"
import { Download, Banknote, AlertTriangle, Users } from "lucide-react"

type ReportTab = "profit" | "expiry" | "staff"
type PeriodType = "today" | "week" | "month"

interface ReportHeaderProps {
  activeTab: ReportTab
  period: PeriodType
  onTabChange: (tab: ReportTab) => void
  onPeriodChange: (period: PeriodType) => void
}

export function ReportHeader({ activeTab, period, onTabChange, onPeriodChange }: ReportHeaderProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Reports</h1>
          <p className="text-sm sm:text-base text-slate-600">Analyze your business performance and trends</p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={(value: PeriodType) => onPeriodChange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 border-b border-slate-200">
          <button
            onClick={() => onTabChange('profit')}
            className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'profit'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            <Banknote className="h-4 w-4" />
            Profit & Revenue
          </button>
          <button
            onClick={() => onTabChange('expiry')}
            className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'expiry'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            Expiring Stock
          </button>
          <button
            onClick={() => onTabChange('staff')}
            className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'staff'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            <Users className="h-4 w-4" />
            Staff Performance
          </button>
        </div>
      </div>
    </>
  )
}
