import { Button } from "@/components/custom-components"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, Minus, Plus, Trash2 } from "lucide-react"
import { type CartItem } from "./types"

interface CartItemListProps {
  cart: CartItem[]
  onUpdateQuantity: (id: number, change: number) => void
  onRemove: (id: number) => void
}

export const CartItemList = ({ cart, onUpdateQuantity, onRemove }: CartItemListProps) => {
  return (
    <div className="space-y-2">
      {cart.map((item) => {
        const itemTotal = parseFloat(item.price) * item.quantity
        return (
          <div key={`${item.product_id}-${item.unit}`} className="group p-3 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:border-green-200 hover:shadow-md hover:shadow-green-500/5 transition-all">
            <div className="flex items-start gap-3">
              {/* Product Icon */}
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20">
                <Package className="h-5 w-5 text-white" />
              </div>

              {/* Item Details */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{item.name}</h4>
                <div className="flex flex-col items-start gap-2 mt-1">
                  <p className="text-slate-600 text-xs font-medium">
                    GH₵{parseFloat(item.price).toFixed(2)}/{item.unit}
                  </p>
                  <Badge variant="outline" className="text-xs border-slate-200 px-2 py-0">
                    {item.unit === 'bag'
                      ? `${item.weight_per_bag || 50}kg/bag`
                      : 'per kg'}
                  </Badge>
                </div>
                <p className="text-xs font-semibold text-green-600 mt-1.5">
                  GH₵{itemTotal.toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-md hover:bg-slate-100 text-slate-600"
                    onClick={() => onUpdateQuantity(item.product_id, -1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-bold text-slate-800 w-6 text-center">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-md hover:bg-slate-100 text-slate-600"
                    onClick={() => onUpdateQuantity(item.product_id, 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md text-xs font-medium"
                  onClick={() => onRemove(item.product_id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface CartSummaryProps {
  cart: CartItem[]
  subtotal: number
  total: number
  orderDiscount: number
  userRole: string | undefined
}

export const CartSummary = ({ cart, subtotal, total, orderDiscount, userRole }: CartSummaryProps) => {
  return (
    <>
      <Separator className="bg-slate-200" />
      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-4 space-y-3 mt-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Subtotal</span>
          <span className="font-semibold text-slate-800">GH₵{subtotal.toFixed(2)}</span>
        </div>
        {orderDiscount > 0 && (
          <div className="flex justify-between text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
            <span className="font-medium">Discount</span>
            <span className="font-bold">-GH₵{orderDiscount.toFixed(2)}</span>
          </div>
        )}
        <Separator className="bg-slate-200" />
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-slate-700">Total</span>
          <div className="text-right">
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              GH₵{total.toFixed(2)}
            </span>
          </div>
        </div>
        {(userRole === 'admin' || userRole === 'manager') && (
          <div className="flex justify-between text-xs text-emerald-600 bg-emerald-50/50 px-3 py-2 rounded-xl mt-1">
            <span className="font-medium">💰 Est. Profit:</span>
            <span className="font-bold">
              GH₵{(subtotal - cart.reduce((sum, item) => sum + (parseFloat(item.cost_price) * item.quantity), 0) - orderDiscount).toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </>
  )
}

interface EmptyCartProps {
  icon: React.ComponentType<{ className?: string }>
}

export const EmptyCart = ({ icon: Icon }: EmptyCartProps) => {
  return (
    <div className="text-center py-12 px-4">
      <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full animate-pulse" />
        <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full">
          <Icon className="h-10 w-10 text-slate-400" />
        </div>
      </div>
      <p className="text-slate-600 font-semibold text-base mb-1">Your cart is empty</p>
      <p className="text-slate-400 text-sm">Click on products to add them to your sale</p>
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center">
            <Package className="h-3 w-3 text-green-600" />
          </div>
          <span>Select</span>
        </div>
        <span>→</span>
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center">
            <Plus className="h-3 w-3 text-emerald-600" />
          </div>
          <span>Add</span>
        </div>
        <span>→</span>
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center">
            {/* CreditCard icon handled outside */}
            <span className="text-purple-600 text-xs">💳</span>
          </div>
          <span>Pay</span>
        </div>
      </div>
    </div>
  )
}
