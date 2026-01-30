import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, DollarSign, Smartphone, Building2, FileText, Loader2 } from "lucide-react"

interface TodaySummaryProps {
  todaySummary: {
    date: string
    totalSales: number
    totalCash: number
    totalMobileMoney: number
    totalBankTransfer: number
    transactions: number
  }
  isLoading: boolean
  formatCurrency: (amount: number) => string
  onCloseDay: () => void
}

export function TodaySummary({ todaySummary, isLoading, formatCurrency, onCloseDay }: TodaySummaryProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Calendar className="h-5 w-5" />
            Today's Summary - {new Date().toLocaleDateString('en-GB', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
              <span className="ml-2 text-gray-600">Loading sales data...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Total Sales</span>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(todaySummary.totalSales)}</p>
                <p className="text-xs text-slate-600 mt-1">{todaySummary.transactions} transactions</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Cash</span>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(todaySummary.totalCash)}</p>
                <p className="text-xs text-slate-600 mt-1">Cash</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Mobile Money</span>
                  <Smartphone className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(todaySummary.totalMobileMoney)}</p>
                <p className="text-xs text-slate-600 mt-1">Mobile Money</p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Bank Transfer</span>
                  <Building2 className="h-4 w-4 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(todaySummary.totalBankTransfer)}</p>
                <p className="text-xs text-slate-600 mt-1">Bank Transfer</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Close Day Button */}
      <div className="flex justify-end">
        <Button
          onClick={onCloseDay}
          className="bg-green-600 hover:bg-green-700 text-sm sm:text-base py-2 sm:py-3"
          disabled={todaySummary.transactions === 0}
        >
          <FileText className="h-4 w-4 mr-2" />
          Close Day
        </Button>
      </div>
    </>
  )
}
