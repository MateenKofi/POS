import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/custom-components"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag } from "lucide-react"
import { CartItemList, CartSummary, EmptyCart } from "./CartItem"
import { type CartItem } from "./types"
import { CreditCard, Loader2 } from "lucide-react"

interface CartSectionProps {
  cart: CartItem[]
  subtotal: number
  total: number
  orderDiscount: number
  userRole: string | undefined
  isPending: boolean
  onUpdateQuantity: (id: number, change: number) => void
  onRemove: (id: number) => void
  onCheckout: () => void
}

export function CartSection({
  cart,
  subtotal,
  total,
  orderDiscount,
  userRole,
  isPending,
  onUpdateQuantity,
  onRemove,
  onCheckout
}: CartSectionProps) {
  return (
    <Card className="border-slate-200/60 shadow-sm shadow-slate-200/50 sticky top-4 overflow-x-hidden">
      <CardHeader className="-mx-6 px-6 border-b border-slate-100">
        <CardTitle className="text-lg sm:text-xl text-slate-800 flex items-center gap-2 pl-4">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
            <ShoppingBag className="h-4 w-4 text-white" />
          </div>
          Current Sale
          {cart.length > 0 && (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-500 ml-2">
              {cart.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {cart.length === 0 ? (
          <EmptyCart icon={ShoppingBag} />
        ) : (
          <div className="space-y-2">
            <CartItemList
              cart={cart}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
            />
            <CartSummary
              cart={cart}
              subtotal={subtotal}
              total={total}
              orderDiscount={orderDiscount}
              userRole={userRole}
            />
            <Button
              onClick={onCheckout}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white gap-2 mt-4 text-sm sm:text-base py-3 h-12 rounded-xl font-medium shadow-lg shadow-green-500/25 transition-all hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 active:translate-y-0"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  Proceed to Payment
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
