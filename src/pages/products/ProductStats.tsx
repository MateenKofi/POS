import { Package, AlertTriangle, Clock } from "lucide-react"
import { Card } from "@/components/custom-components"

interface ProductStatsProps {
  totalProducts: number
  expiringCount: number
  expiredCount: number
}

export const ProductStats = ({ totalProducts, expiringCount, expiredCount }: ProductStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {/* Total Products */}
      <Card className="p-5 border-l-4 border-l-emerald-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Products</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{totalProducts}</p>
            <p className="text-xs text-slate-400 mt-1">In inventory</p>
          </div>
          <div className="p-3 bg-emerald-100 rounded-xl">
            <Package className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </Card>

      {/* Expiring Soon */}
      <Card className="p-5 border-l-4 border-l-amber-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Expiring Soon</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{expiringCount}</p>
            <p className="text-xs text-slate-400 mt-1">Within 30 days</p>
          </div>
          <div className="p-3 bg-amber-100 rounded-xl">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
        </div>
      </Card>

      {/* Expired */}
      <Card className="p-5 border-l-4 border-l-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Expired</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{expiredCount}</p>
            <p className="text-xs text-slate-400 mt-1">Need attention</p>
          </div>
          <div className="p-3 bg-red-100 rounded-xl">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </Card>
    </div>
  )
}
