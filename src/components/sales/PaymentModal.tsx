import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Banknote, Smartphone, Building2, CreditCard, Loader2, CheckCircle2 } from "lucide-react"
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
  orderDiscount,
  customerPhone,
  userRole,
  isPending: _isPending,
  onPaymentMethodChange,
  onCashAmountChange: _onCashAmountChange,
  onReferenceChange,
  onPhoneChange,
  onDiscountChange,
  onCancel: _onCancel,
  onConfirm: _onConfirm
}: PaymentModalContentProps) {
  return (
    <div className="space-y-5">
      {/* Payment Method Selection */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-3 block">Select Payment Method</label>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(PAYMENT_METHODS).map(([id, label]) => {
            const Icon = id === "1" ? Banknote :
              id === "2" ? Smartphone : Building2
            const isSelected = paymentDetails.method === parseInt(id)
            return (
              <button
                key={id}
                onClick={() => onPaymentMethodChange(id)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2",
                  isSelected
                    ? id === "1"
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                      : id === "2"
                        ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                )}
              >
                <Icon className={cn("h-6 w-6", isSelected ? "text-white" : "text-slate-600")} />
                <span className={cn("text-xs font-medium text-center", isSelected ? "text-white" : "text-slate-600")}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

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
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={orderDiscount}
            onChange={(e) => onDiscountChange(parseFloat(e.target.value) || 0)}
            className="h-12 rounded-xl border-slate-200 focus:border-amber-500 focus:ring-amber-500/20"
          />
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
        {paymentDetails.method === 1 && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <p className="text-sm text-emerald-700 font-medium">Cash payment: Collect exact amount</p>
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

export function PaymentModalFooter({ paymentDetails, isPending, onCancel, onConfirm }: PaymentModalFooterProps) {
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
        disabled={isPending}
        className={cn(
          "flex-1 h-12 rounded-xl text-white font-medium shadow-lg transition-all",
          paymentDetails.method === 1
            ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-emerald-500/25'
            : paymentDetails.method === 2
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-green-500/25'
              : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-purple-500/25',
          isPending && 'opacity-50 shadow-none'
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
