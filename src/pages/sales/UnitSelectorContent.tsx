import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Package, AlertTriangle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { type Product as ApiProduct } from "@/lib/api"

interface UnitSelectorContentProps {
  product: ApiProduct
  onConfirm: (unit: 'bag' | 'kg', quantity: number) => void
  onCancel: () => void
}

export function UnitSelectorContent({ product, onConfirm, onCancel }: UnitSelectorContentProps) {
  const [selectedUnit, setSelectedUnit] = useState<'bag' | 'kg'>(
    product.unit_type === 'bag' ? 'bag' : 'kg'
  )
  const [quantity, setQuantity] = useState(1)

  const getPricePerUnit = () => {
    const basePrice = parseFloat(product.price)
    if (selectedUnit === 'kg' && product.unit_type === 'bag' && product.weight_per_bag) {
      return basePrice / product.weight_per_bag
    }
    if (selectedUnit === 'bag' && product.unit_type === 'loose') {
      return basePrice * (product.weight_per_bag || 50)
    }
    return basePrice
  }

  const totalPrice = getPricePerUnit() * quantity

  const getStockUsed = () => {
    if (selectedUnit === 'bag' && product.weight_per_bag) {
      return quantity * product.weight_per_bag
    }
    return quantity
  }

  const stockUsed = getStockUsed()
  const canAfford = stockUsed <= product.stock_quantity
  const quickQuantities = selectedUnit === 'bag' ? [1, 2, 3, 5, 10] : [0.5, 1, 2, 5, 10, 25, 50]

  return (
    <div className="space-y-5">
      {/* Unit Selection */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Package className="h-4 w-4" />
          Select Unit
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedUnit('bag')}
            className={cn(
              "p-4 rounded-xl text-center transition-all duration-200 border-2 relative overflow-hidden group",
              selectedUnit === 'bag'
                ? 'bg-gradient-to-br from-green-500 to-green-600 border-green-500 text-white shadow-lg shadow-green-500/25'
                : 'bg-white border-slate-200 hover:border-green-300 hover:bg-green-50/50'
            )}
          >
            <div className="font-semibold text-base">Sell by Bag</div>
            {product.unit_type === 'bag' && product.weight_per_bag && (
              <div className={cn("text-xs mt-1", selectedUnit === 'bag' ? 'text-green-100' : 'text-slate-500')}>
                {product.weight_per_bag}kg per bag
              </div>
            )}
            {product.unit_type === 'loose' && (
              <div className={cn("text-xs mt-1", selectedUnit === 'bag' ? 'text-green-100' : 'text-slate-500')}>
                ~{product.weight_per_bag || 50}kg per bag
              </div>
            )}
            {selectedUnit === 'bag' && (
              <div className="absolute inset-0 bg-white/10 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setSelectedUnit('kg')}
            className={cn(
              "p-4 rounded-xl text-center transition-all duration-200 border-2 relative overflow-hidden group",
              selectedUnit === 'kg'
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
            )}
          >
            <div className="font-semibold text-base">Sell by Kg</div>
            <div className={cn("text-xs mt-1", selectedUnit === 'kg' ? 'text-emerald-100' : 'text-slate-500')}>
              Loose quantity
            </div>
            {selectedUnit === 'kg' && (
              <div className="absolute inset-0 bg-white/10 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Quantity Selection */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-3 block">
          Quantity ({selectedUnit === 'bag' ? 'bags' : 'kg'})
        </label>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setQuantity(Math.max(0.5, quantity - (selectedUnit === 'bag' ? 1 : 0.5)))}
            disabled={quantity <= 0.5}
            className="h-12 w-12 rounded-xl border-slate-200 hover:bg-slate-100 hover:border-slate-300"
          >
            <Minus className="h-5 w-5" />
          </Button>
          <div className="relative">
            <Input
              type="number"
              step={selectedUnit === 'bag' ? 1 : 0.5}
              min={0.5}
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0.5)}
              className="text-center text-xl font-semibold h-14 w-28 rounded-xl border-slate-200 focus:border-green-500 focus:ring-green-500/20"
            />
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setQuantity(quantity + (selectedUnit === 'bag' ? 1 : 0.5))}
            disabled={!canAfford}
            className="h-12 w-12 rounded-xl border-slate-200 hover:bg-slate-100 hover:border-slate-300"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Quick quantity buttons */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {quickQuantities.map((qty) => (
            <Button
              key={qty}
              variant="outline"
              size="sm"
              onClick={() => setQuantity(qty)}
              disabled={stockUsed >= product.stock_quantity && qty > quantity}
              className={cn(
                "h-9 px-4 rounded-lg text-sm font-medium transition-all",
                quantity === qty
                  ? 'bg-green-500 text-white border-green-500'
                  : 'border-slate-200 hover:border-green-300 hover:bg-green-50',
                stockUsed >= product.stock_quantity && qty > quantity && 'opacity-40 cursor-not-allowed'
              )}
            >
              {qty}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-5 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Price per {selectedUnit === 'bag' ? 'bag' : 'kg'}:</span>
          <span className="font-semibold text-slate-800">GH₵{getPricePerUnit().toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Quantity:</span>
          <span className="font-medium text-slate-800">{quantity} {selectedUnit === 'bag' ? 'bags' : 'kg'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Stock to use:</span>
          <span className={cn(
            "font-medium",
            stockUsed > product.stock_quantity ? 'text-red-500' : 'text-emerald-600'
          )}>
            {stockUsed} kg / {product.stock_quantity} kg
          </span>
        </div>
        <Separator className="bg-slate-200" />
        <div className="flex justify-between text-lg font-bold">
          <span className="text-slate-800">Total:</span>
          <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            GH₵{totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {!canAfford && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          Insufficient stock! Available: {product.stock_quantity} kg
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-12 rounded-xl border-slate-200 hover:bg-slate-100 font-medium"
        >
          Cancel
        </Button>
        <Button
          onClick={() => onConfirm(selectedUnit, quantity)}
          disabled={!canAfford || quantity < 0.5}
          className="flex-1 h-12 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:shadow-none transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
