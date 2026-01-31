import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DollarSign, Smartphone, Building2, CreditCard, AlertTriangle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { PAYMENT_METHODS, type PaymentMethodId } from "@/hooks/useApi"

interface PaymentModalContentProps {
  paymentDetails: {
    method: PaymentMethodId
    amount: number
    change: number
    reference?: string
  }
  total: number
  orderDiscount: number
  customerPhone: string
  userRole: string | undefined
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isPending: boolean
  onPaymentMethodChange: (method: string) => void
  onCashAmountChange: (amount: string) => void
  onReferenceChange: (reference: string) => void
  onPhoneChange: (phone: string) => void
  onDiscountChange: (discount: number) => void
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCancel: () => void
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onConfirm: () => void
}

export function PaymentModalContent({
  paymentDetails,
  total,
  customerPhone,
  userRole,
  isPending: _isPending,
  onPaymentMethodChange,
  onCashAmountChange,
  onReferenceChange,
  onPhoneChange,
  onDiscountChange,
  onCancel: _onCancel,
  onConfirm: _onConfirm
}: PaymentModalContentProps) {
  const [localDiscount, setLocalDiscount] = useState(0)

  return (
    <div className="space-y-5">
      {/* Payment Method Selection */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-3 block">Select Payment Method</label>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(PAYMENT_METHODS).map(([id, label]) => {
            const Icon = id === "1" ? DollarSign :
              id === "2" ? Smartphone : Building2
            const isSelected = paymentDetails.method === parseInt(id)
            return (
              <button
                key={id}
                onClick={() => onPaymentMethodChange(id)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 relative overflow-hidden",
                  isSelected
                    ? id === "1"
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                      : id === "2"
                        ? 'bg-gradient-to-br from-blue-500 to-green-600 border-green-500 text-white shadow-lg shadow-green-500/25'
                        : 'bg-gradient-to-br from-purple-500 to-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                )}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-white/10 animate-pulse" />
                )}
                <Icon className={cn("h-6 w-6", isSelected ? "text-white" : "text-slate-600")} />
                <span className={cn("text-xs font-medium text-center", isSelected ? "text-white" : "text-slate-600")}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {paymentDetails.method === 1 && (
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            Cash Amount <span className="text-slate-400 font-normal text-xs">(Auto-filled, editable if needed)</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">GH₵</span>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={paymentDetails.amount || ""}
              onChange={(e) => onCashAmountChange(e.target.value)}
              className="pl-12 h-12 rounded-xl text-lg font-semibold border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
            />
          </div>
          {paymentDetails.change > 0 && (
            <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-emerald-600">Change due</p>
                <p className="text-lg font-bold text-emerald-700">GH₵{paymentDetails.change.toFixed(2)}</p>
              </div>
            </div>
          )}
          {paymentDetails.amount > 0 && paymentDetails.change === 0 && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-green-600">Exact payment</p>
                <p className="text-sm font-medium text-green-700">No change due</p>
              </div>
            </div>
          )}
          {paymentDetails.amount > 0 && paymentDetails.amount < total && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-700 font-medium">Insufficient amount. Need GH₵{(total - paymentDetails.amount).toFixed(2)} more</p>
            </div>
          )}
        </div>
      )}

      {paymentDetails.method !== 1 && (
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-green-500" />
            Reference / Transaction ID
          </label>
          <Input
            placeholder="Enter reference number"
            value={paymentDetails.reference || ""}
            onChange={(e) => onReferenceChange(e.target.value)}
            className="h-12 rounded-xl border-slate-200 focus:border-green-500 focus:ring-green-500/20"
          />
        </div>
      )}

      {/* Order Discount */}
      {(userRole === 'admin' || userRole === 'manager') && (
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <span className="text-amber-500">%</span>
            Order Discount (GH₵)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">GH₵</span>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={localDiscount}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0
                setLocalDiscount(val)
                onDiscountChange(val)
              }}
              className="pl-12 h-12 rounded-xl border-slate-200 focus:border-amber-500 focus:ring-amber-500/20"
            />
          </div>
        </div>
      )}

      {/* Customer Phone */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-green-500" />
          Customer Phone <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <Input
          type="tel"
          placeholder="+233 XX XXX XXXX"
          value={customerPhone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="h-12 rounded-xl border-slate-200 focus:border-green-500 focus:ring-green-500/20"
        />
        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
          <Smartphone className="h-3 w-3" />
          For SMS/WhatsApp receipts
        </p>
      </div>

      {/* Total Summary */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-5 rounded-2xl border border-slate-200">
        <div className="flex justify-between items-center">
          <span className="text-slate-600 font-medium">Total Amount</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            GH₵{total.toFixed(2)}
          </span>
        </div>
        {paymentDetails.method === 1 && paymentDetails.amount > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Cash Received:</span>
              <span className="font-medium text-slate-800">GH₵{paymentDetails.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Change:</span>
              <span className={paymentDetails.change > 0 ? "font-semibold text-emerald-600" : "font-medium text-slate-500"}>
                {paymentDetails.change > 0 ? `GH₵${paymentDetails.change.toFixed(2)}` : "GH₵0.00 (Exact)"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface PaymentModalFooterProps {
  paymentDetails: {
    method: PaymentMethodId
  }
  total: number
  isPending: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function PaymentModalFooter({ paymentDetails, total, isPending, onCancel, onConfirm }: PaymentModalFooterProps) {
  return (
    <footer className="flex gap-3 pt-4">
      <Button
        variant="outline"
        onClick={onCancel}
        className="flex-1 h-12 rounded-xl border-slate-200 hover:bg-slate-100 font-medium"
        disabled={isPending}
      >
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        disabled={
          isPending ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (paymentDetails.method === 1 && (paymentDetails as any).amount < total)
        }
        className={cn(
          "flex-1 h-12 rounded-xl text-white font-medium shadow-lg transition-all",
          paymentDetails.method === 1
            ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-emerald-500/25'
            : paymentDetails.method === 2
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-green-500/25'
              : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-purple-500/25',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (isPending || (paymentDetails.method === 1 && (paymentDetails as any).amount < total)) && 'opacity-50 shadow-none'
        )}
      >
        {isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Complete Sale
          </>
        )}
      </Button>
    </footer>
  )
}
