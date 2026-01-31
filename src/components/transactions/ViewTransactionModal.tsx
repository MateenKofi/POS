import { Card, CardContent, Button } from "@/components/custom-components"
import { Badge } from "@/components/ui/badge"
import { Receipt, Printer, Send, X } from "lucide-react"
import { Modal } from "@/components/modal"
import { toast } from "sonner"
import type { Transaction } from "@/lib/api"

interface ViewTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction | null
}

const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  sale_payment: 'Sale Payment',
  refund: 'Refund',
  expense: 'Expense',
  supplier_payment: 'Supplier Payment',
  cash_deposit: 'Cash Deposit',
  cash_withdrawal: 'Cash Withdrawal',
}

const TRANSACTION_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  completed: 'bg-green-100 text-green-800 hover:bg-green-100',
  failed: 'bg-red-100 text-red-800 hover:bg-red-100',
  cancelled: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'Cash',
  mobile_money: 'Mobile Money',
  bank_transfer: 'Bank Transfer',
  card: 'Card',
}

export function ViewTransactionModal({ isOpen, onClose, transaction }: ViewTransactionModalProps) {
  const handlePrint = () => {
    toast.success("Receipt sent to printer")
  }

  const handleSendReceipt = () => {
    toast.success("Receipt sent via SMS")
  }

  if (!transaction) return null

  const amount = parseFloat(transaction.amount || '0')

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="md">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg shadow-emerald-500/25">
              <Receipt className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Transaction Details</h2>
              <p className="text-sm text-slate-500 font-mono">
                {transaction.reference_number || `TXN-${transaction.transaction_id}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Amount Display */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 text-center">
          <p className="text-sm text-slate-600 mb-1">Transaction Amount</p>
          <p className={`text-3xl font-bold ${amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            GH₵{amount.toFixed(2)}
          </p>
        </div>

        {/* Transaction Details Card */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Date & Time</span>
              <span className="text-sm font-medium text-slate-800">
                {new Date(transaction.transaction_date).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Type</span>
              <Badge variant="outline" className={TRANSACTION_STATUS_COLORS[transaction.status]}>
                {TRANSACTION_TYPE_LABELS[transaction.transaction_type]}
              </Badge>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Status</span>
              <Badge className={TRANSACTION_STATUS_COLORS[transaction.status]}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </Badge>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Payment Method</span>
              <span className="text-sm font-medium text-slate-800">
                {PAYMENT_METHOD_LABELS[transaction.payment_method] || transaction.payment_method}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Cashier</span>
              <span className="text-sm font-medium text-slate-800">
                {transaction.cashier_name || `#${transaction.cashier_id}`}
              </span>
            </div>

            <div className="py-2">
              <span className="text-sm text-slate-600 block mb-1">Description</span>
              <p className="text-sm text-slate-800">{transaction.description}</p>
            </div>

            {transaction.category && (
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">Category</span>
                <span className="text-sm font-medium text-slate-800">{transaction.category}</span>
              </div>
            )}

            {transaction.notes && (
              <div className="py-2">
                <span className="text-sm text-slate-600 block mb-1">Notes</span>
                <p className="text-sm text-slate-600 italic">{transaction.notes}</p>
              </div>
            )}

            {transaction.related_entity_id && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">Related Entity</span>
                <span className="text-sm font-medium text-slate-800">
                  {transaction.related_entity_type} #{transaction.related_entity_id}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handlePrint}
            className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white rounded-xl h-11"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Receipt
          </Button>
          <Button
            onClick={handleSendReceipt}
            variant="outline"
            className="flex-1 border-green-600 text-green-600 hover:bg-green-50 rounded-xl h-11"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Receipt
          </Button>
        </div>
      </div>
    </Modal>
  )
}
