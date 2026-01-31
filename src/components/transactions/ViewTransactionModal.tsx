// This component exports a helper to convert Transaction to InvoiceData
// and re-exports InvoiceModal types for convenience
import type { InvoiceData } from "@/components/sales/InvoiceModal"
import type { Transaction } from "@/lib/api"

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'Cash',
  mobile_money: 'Mobile Money',
  bank_transfer: 'Bank Transfer',
  card: 'Card',
}

export function transactionToInvoiceData(transaction: Transaction): InvoiceData {
  const amount = parseFloat(transaction.amount || '0')

  return {
    saleId: transaction.transaction_id,
    items: [{
      name: transaction.description,
      quantity: 1,
      unit: '',
      price: amount
    }],
    subtotal: amount,
    totalDiscount: 0,
    total: amount,
    paymentMethod: PAYMENT_METHOD_LABELS[transaction.payment_method] || transaction.payment_method,
    amountPaid: amount,
    change: 0,
    timestamp: transaction.transaction_date,
    cashierName: transaction.cashier_name,
    description: transaction.description,
    transactionType: transaction.transaction_type,
    status: transaction.status,
    category: transaction.category,
    notes: transaction.notes,
  }
}

// Re-export InvoiceModal
export { InvoiceModal } from "@/components/sales/InvoiceModal"
export type { InvoiceData, InvoiceItem } from "@/components/sales/InvoiceModal"
