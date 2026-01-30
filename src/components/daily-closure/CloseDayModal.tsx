import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface CloseDayModalProps {
  isOpen: boolean
  onClose: () => void
  todaySummary: {
    totalSales: number
    totalCash: number
    totalMobileMoney: number
    totalBankTransfer: number
  }
  actualCash: string
  actualMobileMoney: string
  actualBankTransfer: string
  notes: string
  isSubmitting: boolean
  onActualCashChange: (value: string) => void
  onActualMobileMoneyChange: (value: string) => void
  onActualBankTransferChange: (value: string) => void
  onNotesChange: (value: string) => void
  onSubmit: () => void
}

export function CloseDayModal({
  isOpen,
  onClose,
  todaySummary,
  actualCash,
  actualMobileMoney,
  actualBankTransfer,
  notes,
  isSubmitting,
  onActualCashChange,
  onActualMobileMoneyChange,
  onActualBankTransferChange,
  onNotesChange,
  onSubmit,
}: CloseDayModalProps) {
  const formatCurrency = (amount: number) => `GH₵${amount.toFixed(2)}`

  const cashVariance = parseFloat(actualCash) || 0 - todaySummary.totalCash
  const mobileMoneyVariance = parseFloat(actualMobileMoney) || 0 - todaySummary.totalMobileMoney
  const bankTransferVariance = parseFloat(actualBankTransfer) || 0 - todaySummary.totalBankTransfer
  const totalVariance = cashVariance + mobileMoneyVariance + bankTransferVariance

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Close Day</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expected-cash">Expected Cash</Label>
                <p className="text-lg font-semibold">{formatCurrency(todaySummary.totalCash)}</p>
              </div>
              <div>
                <Label htmlFor="actual-cash">Actual Cash</Label>
                <Input
                  id="actual-cash"
                  type="number"
                  step="0.01"
                  value={actualCash}
                  onChange={(e) => onActualCashChange(e.target.value)}
                  placeholder="0.00"
                  className={`border ${cashVariance !== 0 ? 'border-red-300' : ''}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expected-mm">Expected Mobile Money</Label>
                <p className="text-lg font-semibold">{formatCurrency(todaySummary.totalMobileMoney)}</p>
              </div>
              <div>
                <Label htmlFor="actual-mm">Actual Mobile Money</Label>
                <Input
                  id="actual-mm"
                  type="number"
                  step="0.01"
                  value={actualMobileMoney}
                  onChange={(e) => onActualMobileMoneyChange(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expected-bank">Expected Bank Transfer</Label>
                <p className="text-lg font-semibold">{formatCurrency(todaySummary.totalBankTransfer)}</p>
              </div>
              <div>
                <Label htmlFor="actual-bank">Actual Bank Transfer</Label>
                <Input
                  id="actual-bank"
                  type="number"
                  step="0.01"
                  value={actualBankTransfer}
                  onChange={(e) => onActualBankTransferChange(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="Add notes about today's closure..."
              />
            </div>

            {/* Variance Summary */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-slate-800 mb-3">Variance Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Cash Variance:</span>
                  <span className={cashVariance !== 0 ? (cashVariance > 0 ? 'text-green-600' : 'text-red-600') : ''}>
                    {formatCurrency(cashVariance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Mobile Money Variance:</span>
                  <span className={mobileMoneyVariance !== 0 ? (mobileMoneyVariance > 0 ? 'text-green-600' : 'text-red-600') : ''}>
                    {formatCurrency(mobileMoneyVariance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Bank Transfer Variance:</span>
                  <span className={bankTransferVariance !== 0 ? (bankTransferVariance > 0 ? 'text-green-600' : 'text-red-600') : ''}>
                    {formatCurrency(bankTransferVariance)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t">
                  <span>Total Variance:</span>
                  <span className={totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(totalVariance)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={onSubmit}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Closure"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  )
}
