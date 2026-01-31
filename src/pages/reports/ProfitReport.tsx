import { Card, CardContent } from "@/components/custom-components"
import { Banknote, TrendingUp, Package } from "lucide-react"

interface ProductProfit {
  name: string
  profit: number
  revenue: number
  margin: number
}

interface ProfitReportProps {
  totalRevenue: number
  grossProfit: number
  profitMargin: number
  topProducts: ProductProfit[]
  transactions: number
  formatCurrency: (amount: number) => string
}

export const ProfitReport = ({ totalRevenue, grossProfit, profitMargin, topProducts, transactions, formatCurrency }: ProfitReportProps) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Total Revenue</span>
              <Banknote className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-slate-500 mt-1">{transactions} transactions</p>
          </CardContent>
        </Card>

        <Card className="">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Gross Profit</span>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(grossProfit)}</p>
            <p className="text-xs text-slate-500 mt-1">{profitMargin.toFixed(1)}% margin</p>
          </CardContent>
        </Card>

        <Card className=" col-span-1 sm:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Profit Margin</span>
              <Package className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{profitMargin.toFixed(1)}%</p>
            <p className="text-xs text-slate-500 mt-1">Overall profit margin</p>
          </CardContent>
        </Card>
      </div>

      <Card className="">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Products by Profit</h3>
          {topProducts.length === 0 ? (
            <p className="text-center text-slate-500 py-4">No product data available</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium text-slate-800">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">{formatCurrency(product.profit)}</p>
                    <p className="text-xs text-slate-500">{product.margin.toFixed(1)}% margin</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
