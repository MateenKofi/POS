import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/custom-components"
import { Package } from "lucide-react"
import type { Product } from "@/lib/api"

interface LowStockAlertsProps {
  lowStockProducts: Product[]
  onQuickAction: (action: string) => void
}

export const LowStockAlerts = ({ lowStockProducts, onQuickAction }: LowStockAlertsProps) => {
  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-slate-800">Low Stock Alerts</CardTitle>
        {lowStockProducts.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={() => onQuickAction("products")}
          >
            Manage Stock →
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {lowStockProducts.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Package className="h-8 w-8 mx-auto mb-2 text-slate-300" />
            <p>All products are well stocked</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lowStockProducts.map((product: Product) => (
              <div
                key={product.product_id}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50 rounded px-2 transition-colors cursor-pointer"
                onClick={() => onQuickAction("products")}
              >
                <div>
                  <p className="font-medium text-slate-800">
                    {product.name}
                  </p>
                  <p className="text-sm text-red-600">
                    Only {product.stock_quantity} {product.unit_type === 'bag' ? 'bags' : 'kg'} left
                  </p>
                </div>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
