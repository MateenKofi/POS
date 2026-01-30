import { Package, ShoppingBag, AlertTriangle, BarChart3 } from "lucide-react"
import { type Product as ApiProduct } from "@/lib/api"

interface QuickStatsProps {
  availableProducts: ApiProduct[]
  cartItemCount: number
}

export function QuickStats({ availableProducts, cartItemCount }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-green-700">Total Products</span>
          <div className="p-1.5 bg-green-100 rounded-lg">
            <Package className="h-4 w-4 text-green-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-green-900">{availableProducts.length}</p>
      </div>
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-emerald-700">In Stock</span>
          <div className="p-1.5 bg-emerald-100 rounded-lg">
            <ShoppingBag className="h-4 w-4 text-emerald-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-emerald-900">{availableProducts.filter(p => p.stock_quantity > 0).length}</p>
      </div>
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 border border-amber-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-amber-700">Low Stock</span>
          <div className="p-1.5 bg-amber-100 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-amber-900">{availableProducts.filter(p => p.reorder_level && p.stock_quantity <= p.reorder_level).length}</p>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-purple-700">Cart Items</span>
          <div className="p-1.5 bg-purple-100 rounded-lg">
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-purple-900">{cartItemCount}</p>
      </div>
    </div>
  )
}
