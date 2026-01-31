import { useForm } from "react-hook-form"
import { Button, TextInput, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/custom-components"
import { Controller } from "react-hook-form"
import { useCreateTransaction, useUpdateTransaction } from "@/hooks/useApi"
import { toast } from "sonner"
import type { Transaction, TransactionType, TransactionStatus, CreateTransactionRequest } from "@/lib/api"

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

export const TransactionForm = ({ mode, transaction, onClose, onSuccess }: TransactionFormProps) => {
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()

  const form = useForm<CreateTransactionRequest & { status?: TransactionStatus }>({
    defaultValues: {
      transaction_type: transaction?.transaction_type || 'sale_payment',
      amount: transaction?.amount || '',
      payment_method: transaction?.payment_method || 'cash',
      description: transaction?.description || '',
      category: transaction?.category || '',
      reference_number: transaction?.reference_number || '',
      notes: transaction?.notes || '',
      status: transaction?.status || 'completed',
    },
  })

  const { register, control, formState: { errors }, handleSubmit } = form

  const onSubmit = (data: CreateTransactionRequest & { status?: TransactionStatus }) => {
    const payload = {
      transaction_type: data.transaction_type,
      amount: data.amount,
      payment_method: data.payment_method,
      description: data.description,
      ...(data.category && { category: data.category }),
      ...(data.reference_number && { reference_number: data.reference_number }),
      ...(data.notes && { notes: data.notes }),
      ...(mode === 'edit' && { status: data.status }),
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
            Transaction Type
          </label>
          <Controller
            control={control}
            name="transaction_type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TRANSACTION_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.transaction_type && (
            <p className="text-sm font-medium text-destructive mt-1">{errors.transaction_type.message}</p>
          )}
        </div>
        <TextInput
          type="number"
          step="0.01"
          label="Amount (GH₵)"
          required
          placeholder="0.00"
          error={errors.amount?.message}
          {...register('amount')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
            Payment Method
          </label>
          <Controller
            control={control}
            name="payment_method"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
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
            )}
          />
          {errors.payment_method && (
            <p className="text-sm font-medium text-destructive mt-1">{errors.payment_method.message}</p>
          )}
        </div>
        {mode === 'edit' && (
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
              Status
            </label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
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
              )}
            />
            {errors.status && (
              <p className="text-sm font-medium text-destructive mt-1">{errors.status.message}</p>
            )}
          </div>
        )}
      </div>

      <Textarea
        label="Description"
        required
        placeholder="Transaction description"
        rows={3}
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="grid grid-cols-2 gap-4">
        <TextInput
          label="Category (optional)"
          placeholder="e.g., utilities, rent"
          {...register('category')}
        />
        <TextInput
          label="Reference Number (optional)"
          placeholder="TXN-..."
          {...register('reference_number')}
        />
      </div>

      <Textarea
        label="Notes (optional)"
        placeholder="Additional notes"
        rows={3}
        {...register('notes')}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
          {createMutation.isPending || updateMutation.isPending ? 'Saving...' : mode === 'create' ? 'Create Transaction' : 'Update Transaction'}
        </Button>
      </div>
    </form>
  )
}
