import { Card, CardContent, CardHeader, CardTitle } from "@/components/custom-components"
import { Button } from "@/components/ui/button"
import type { SaleData } from "./types"

interface SalesSummaryProps {
  sales: SaleData[]
  formatCurrency: (amount: number) => string
  onQuickAction: (action: string) => void
}

export function SalesSummary({ sales, formatCurrency, onQuickAction }: SalesSummaryProps) {
  const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0)
  const totalSales = sales.length
  const averageSale = totalRevenue / totalSales
  const uniqueSalespeople = new Set(sales.map((sale) => sale.cashier_id)).size

  const paymentMethods = sales.reduce((acc, sale) => {
    const method =
      sale.method_name ||
      (sale.payment_method_id === 1
        ? "Cash"
        : sale.payment_method_id === 2
          ? "Card"
          : "Mobile Money")
    acc[method] = (acc[method] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-slate-800">Sales Summary</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={() => onQuickAction("reports")}
        >
          View Reports →
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {totalSales}
            </p>
            <p className="text-sm text-green-800">Total Sales</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </p>
            <p className="text-sm text-green-800">Total Revenue</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(averageSale)}
            </p>
            <p className="text-sm text-purple-800">Average Sale</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              {uniqueSalespeople}
            </p>
            <p className="text-sm text-orange-800">Salespeople</p>
          </div>
        </div>

        {/* Payment Method Breakdown */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-slate-700 mb-3">
            Payment Method Breakdown
          </h4>
          <div className="space-y-2">
            {Object.entries(paymentMethods).map(([method, count]) => (
              <div
                key={method}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-slate-600">{method}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(count / totalSales) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-slate-800">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
