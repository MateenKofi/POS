import { Badge } from "@/components/ui/badge"
import { Package, AlertTriangle, Plus } from "lucide-react"
import { type Product as ApiProduct } from "@/lib/api"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: ApiProduct
  onClick: (product: ApiProduct) => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const isExpired = product.expiry_date ? new Date(product.expiry_date) < new Date() : false
  const isLowStock = product.reorder_level && product.stock_quantity <= product.reorder_level
  const isOutOfStock = product.stock_quantity <= 0

  const getStockColor = () => {
    if (isOutOfStock || isExpired) return 'from-red-500 to-red-600'
    if (isLowStock) return 'from-amber-500 to-amber-600'
    return 'from-green-500 to-emerald-600'
  }

  return (
    <div
      className={cn(
        "group relative p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden",
        isExpired || isOutOfStock
          ? 'border-red-200 bg-red-50/30 opacity-70 cursor-not-allowed'
          : 'border-slate-200 hover:border-green-300 hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1 bg-white',
        !isExpired && !isOutOfStock && 'active:scale-[0.98]'
      )}
      onClick={() => !isExpired && !isOutOfStock && onClick(product)}
    >
      {/* Background gradient on hover */}
      {!isExpired && !isOutOfStock && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      )}

      {/* Animated border shine on hover */}
      {!isExpired && !isOutOfStock && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-green-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}

      {/* Stock Status Badge */}
      <div className="absolute top-3 right-3 z-10">
        {isOutOfStock ? (
          <Badge className="bg-red-500 text-white border-red-500 text-xs font-medium shadow-sm shadow-red-500/20">
            Out of Stock
          </Badge>
        ) : isExpired ? (
          <Badge className="bg-red-500 text-white border-red-500 text-xs font-medium shadow-sm shadow-red-500/20">
            Expired
          </Badge>
        ) : isLowStock ? (
          <Badge className="bg-amber-500 text-white border-amber-500 text-xs font-medium flex items-center gap-1 shadow-sm shadow-amber-500/20">
            <AlertTriangle className="h-3 w-3" />
            Low Stock
          </Badge>
        ) : (
          <Badge className="bg-emerald-500 text-white border-emerald-500 text-xs font-medium shadow-sm shadow-emerald-500/20">
            In Stock
          </Badge>
        )}
      </div>

      <div className="relative">
        {/* Product Icon with gradient */}
        <div className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center mb-3 shadow-lg transition-all duration-300",
          isExpired || isOutOfStock
            ? 'bg-red-100 shadow-red-500/10'
            : cn('bg-gradient-to-br', getStockColor(), 'group-hover:scale-110 group-hover:rotate-3', isLowStock ? 'shadow-amber-500/20' : 'shadow-green-500/20')
        )}>
          <Package className={cn(
            "h-7 w-7",
            isExpired || isOutOfStock ? 'text-red-500' : 'text-white'
          )} />
        </div>

        <h3 className="font-bold text-slate-800 text-base line-clamp-2 mb-1 pr-16">
          {product.name}
        </h3>
        <p className="text-sm text-slate-500 mb-3 line-clamp-2 h-10">
          {product.description}
        </p>

        {/* Price and stock info */}
        <div className="bg-slate-50/50 rounded-xl p-3 mt-2">
          <div className="flex items-end justify-between">
            <div>
              <p className={cn(
                "text-2xl font-bold",
                isExpired || isOutOfStock ? 'text-slate-400' : 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'
              )}>
                GH₵{parseFloat(product.price).toFixed(2)}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {product.unit_type === 'bag'
                  ? `${product.weight_per_bag || 0}kg/bag`
                  : 'per kg'}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isOutOfStock || isExpired ? 'bg-red-400' : isLowStock ? 'bg-amber-400' : 'bg-emerald-400'
                )} />
                <p className="text-sm font-medium text-slate-700">
                  {product.stock_quantity} {product.unit_type === 'bag' ? 'kg' : product.unit_type}
                </p>
              </div>
              {isLowStock && !isExpired && !isOutOfStock && (
                <p className="text-xs text-amber-600 font-medium mt-0.5">
                  Reorder at {product.reorder_level}
                </p>
              )}
            </div>
          </div>
        </div>

        {isExpired && (
          <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-red-600 font-medium flex items-center justify-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Expired: {new Date(product.expiry_date!).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Quick add button on hover */}
      {!isExpired && !isOutOfStock && (
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-2 shadow-lg shadow-green-500/30">
            <Plus className="h-5 w-5" />
          </div>
        </div>
      )}
    </div>
  )
}
