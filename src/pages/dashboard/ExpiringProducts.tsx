import { Card, CardContent, CardHeader, CardTitle } from "@/components/custom-components"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"
import type { Product } from "@/lib/api"

interface ExpiringProductsProps {
  expiringProducts: Product[]
  expiredProducts: Product[]
}

export function ExpiringProducts({ expiringProducts, expiredProducts }: ExpiringProductsProps) {
  return (
    <>
      {/* Expiring Soon Alert */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-800">Expiring Soon</CardTitle>
        </CardHeader>
        <CardContent>
          {expiringProducts.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Package className="h-8 w-8 mx-auto mb-2 text-slate-300" />
              <p>No products expiring soon</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expiringProducts.map((product) => {
                const daysUntilExpiry = Math.ceil((new Date(product.expiry_date!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                return (
                  <div
                    key={product.product_id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-orange-50 border-orange-200"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{product.name}</p>
                      <p className="text-sm text-slate-600">
                        {product.batch_number && <span>Batch: {product.batch_number}</span>}
                        <span className="mx-2">•</span>
                        {product.stock_quantity} {product.unit_type === 'bag' ? 'bags' : 'kg'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-600">
                        {daysUntilExpiry} days
                      </p>
                      <p className="text-xs text-slate-600">
                        {new Date(product.expiry_date!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expired Products Alert */}
      <Card className="border-red-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-red-800">⚠️ Expired Products</CardTitle>
          {expiredProducts.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              {expiredProducts.length} product{expiredProducts.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {expiredProducts.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Package className="h-8 w-8 mx-auto mb-2 text-green-300" />
              <p className="text-green-600">No expired products ✓</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expiredProducts.map((product) => {
                const daysSinceExpiry = Math.abs(Math.ceil((new Date(product.expiry_date!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                return (
                  <div
                    key={product.product_id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-red-50 border-red-200"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{product.name}</p>
                      <p className="text-sm text-slate-600">
                        {product.batch_number && <span>Batch: {product.batch_number}</span>}
                        <span className="mx-2">•</span>
                        {product.stock_quantity} {product.unit_type === 'bag' ? 'bags' : 'kg'} in stock
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">
                        Expired {daysSinceExpiry} day{daysSinceExpiry !== 1 ? 's' : ''} ago
                      </p>
                      <p className="text-xs text-slate-600">
                        {new Date(product.expiry_date!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )
              })}
              <p className="text-xs text-red-600 mt-2 text-center">
                ⚠️ These products are hidden from the sales terminal
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
