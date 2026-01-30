import { useState } from "react"
import { Button, TextInput } from "@/components/custom-components"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateTransaction, useUpdateTransaction } from "@/hooks/useApi"
import { toast } from "sonner"
import type { Transaction, TransactionType, TransactionStatus } from "@/lib/api"

const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  sale_payment: 'Sale Payment',
  refund: 'Refund',
  expense: 'Expense',
  supplier_payment: 'Supplier Payment',
  cash_deposit: 'Cash Deposit',
  cash_withdrawal: 'Cash Withdrawal',
}

interface TransactionFormProps {
  mode: 'create' | 'edit'
  transaction?: Transaction
  onClose: () => void
  onSuccess: () => void
}

export function TransactionForm({ mode, transaction, onClose, onSuccess }: TransactionFormProps) {
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()

  const [formData, setFormData] = useState({
    transaction_type: transaction?.transaction_type || 'sale_payment' as TransactionType,
    amount: transaction?.amount || '',
    payment_method: transaction?.payment_method || 'cash' as const,
    description: transaction?.description || '',
    category: transaction?.category || '',
    reference_number: transaction?.reference_number || '',
    notes: transaction?.notes || '',
    status: transaction?.status || 'completed' as TransactionStatus,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      transaction_type: formData.transaction_type,
      amount: formData.amount,
      payment_method: formData.payment_method,
      description: formData.description,
      ...(formData.category && { category: formData.category }),
      ...(formData.reference_number && { reference_number: formData.reference_number }),
      ...(formData.notes && { notes: formData.notes }),
      ...(mode === 'edit' && { status: formData.status }),
    }

    if (mode === 'create') {
      createMutation.mutate(payload as any, {
        onSuccess: () => {
          toast.success('Transaction created successfully')
          onSuccess()
          onClose()
        },
        onError: () => {
          toast.error('Failed to create transaction')
        },
      })
    } else {
      updateMutation.mutate({ id: String(transaction!.transaction_id), data: payload as any }, {
        onSuccess: () => {
          toast.success('Transaction updated successfully')
          onSuccess()
          onClose()
        },
        onError: () => {
          toast.error('Failed to update transaction')
        },
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-600">Transaction Type</label>
          <Select value={formData.transaction_type} onValueChange={(v) => setFormData({ ...formData, transaction_type: v as TransactionType })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TRANSACTION_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm text-slate-600">Amount (GH₵)</label>
          <TextInput type="number" step="0.01" required value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="0.00" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-600">Payment Method</label>
          <Select value={formData.payment_method} onValueChange={(v) => setFormData({ ...formData, payment_method: v as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="mobile_money">Mobile Money</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="card">Card</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {mode === 'edit' && (
          <div>
            <label className="text-sm text-slate-600">Status</label>
            <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as TransactionStatus })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div>
        <label className="text-sm text-slate-600">Description</label>
        <TextInput required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Transaction description" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-600">Category (optional)</label>
          <TextInput value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="e.g., utilities, rent" />
        </div>
        <div>
          <label className="text-sm text-slate-600">Reference Number (optional)</label>
          <TextInput value={formData.reference_number} onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })} placeholder="TXN-..." />
        </div>
      </div>

      <div>
        <label className="text-sm text-slate-600">Notes (optional)</label>
        <TextInput value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Additional notes" />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
          {createMutation.isPending || updateMutation.isPending ? 'Saving...' : mode === 'create' ? 'Create Transaction' : 'Update Transaction'}
        </Button>
      </div>
    </form>
  )
}
