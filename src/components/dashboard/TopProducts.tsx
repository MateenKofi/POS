import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"

interface TopProduct {
  product_id: number
  name: string
  total_sold?: number
  total_revenue?: number
}

interface TopProductsProps {
  topProducts: TopProduct[]
  formatCurrency: (amount: number) => string
  onQuickAction: (action: string) => void
}

export function TopProducts({ topProducts, formatCurrency, onQuickAction }: TopProductsProps) {
  return (
    <Card className="border-slate-200 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-slate-800">Top Products</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={() => onQuickAction("products")}
        >
          View All →
        </Button>
      </CardHeader>
      <CardContent>
        {topProducts && topProducts.length > 0 ? (
          <div className="space-y-4">
            {topProducts.slice(0, 5).map((product, index: number) => (
              <div
                key={product.product_id}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-slate-800">{product.name}</p>
                    <p className="text-sm text-slate-600">
                      {product.total_sold || 0} sold
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-slate-800">
                  {formatCurrency(product.total_revenue || 0)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-slate-300" />
            <p>No product data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
