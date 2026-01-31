import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/custom-components"
import type { DashboardStat, QuickAction } from "./types"

interface StatsCardsProps {
  stats: DashboardStat[]
  onQuickAction: (action: string) => void
}

export function StatsCards({ stats, onQuickAction }: StatsCardsProps) {
  const quickActions: QuickAction[] = [
    { action: "sales", label: "View Sales" },
    { action: "products", label: "View Products" },
    { action: "sales", label: "View Sales" },
    { action: "reports", label: "View Reports" }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-slate-800">
                {stat.value}
              </div>
              <p
                className={`text-xs ${stat.changeType === "positive"
                  ? "text-green-600"
                  : "text-red-600"
                  }`}
              >
                {stat.change} from yesterday
              </p>
              {quickActions[index] && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-6 px-2 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => onQuickAction(quickActions[index].action)}
                >
                  {quickActions[index].label} →
                </Button>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
