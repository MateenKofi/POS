"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/custom-components"
import { Loader2, Receipt, Search } from "lucide-react"
import { useTransactions } from "@/hooks/useApi"
import type { Transaction } from "@/lib/api"
import { ViewTransactionModal } from "./transactions/ViewTransactionModal"
import { TransactionList } from "./transactions/TransactionList"

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

export function Transactions() {
  const [page] = useState<number>(1)
  const [limit] = useState<number>(50)
  const [query, setQuery] = useState<string>("")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const transactionsQuery = useTransactions(page, limit)

  const list = useMemo(() => {
    const base = transactionsQuery.data?.transactions || []
    if (!query) return base
    const q = query.toLowerCase()
    return base.filter((t: Transaction) => {
      return (
        t.reference_number?.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.cashier_name?.toLowerCase().includes(q) ||
        String(t.transaction_id).includes(q)
      )
    })
  }, [transactionsQuery.data, query])

  const handleView = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsViewModalOpen(true)
  }

  const totalAmount = useMemo(() => {
    return list.reduce((acc, t) => {
      const amount = parseFloat(t.amount || '0')
      if (t.status === 'completed') {
        if (t.transaction_type === 'refund' || t.transaction_type === 'expense' || t.transaction_type === 'cash_withdrawal' || t.transaction_type === 'supplier_payment') {
          return acc - amount
        }
        return acc + amount
      }
      return acc
    }, 0)
  }, [list])

  if (transactionsQuery.isLoading && !transactionsQuery.data) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading transactions...</span>
        </div>
      </div>
    )
  }

  if (transactionsQuery.error) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load transactions.</p>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg shadow-emerald-500/25 hidden sm:block">
            <Receipt className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Transactions
            </h1>
            <p className="text-sm sm:text-base text-slate-500">View and manage transactions</p>
          </div>
        </div>
      </div>

      {/* Search Card */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by reference, description, or cashier..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-10 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-800">All Transactions</CardTitle>
            <div className="text-sm">
              <span className="text-slate-600">Net: </span>
              <span className={`font-semibold ${totalAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                GH₵{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {list.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              {query ? "No transactions found matching your search." : "No transactions found."}
            </p>
          ) : (
            <TransactionList
              transactions={list}
              transactionTypeLabels={TRANSACTION_TYPE_LABELS}
              transactionStatusColors={TRANSACTION_STATUS_COLORS}
              onView={handleView}
            />
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-slate-500 mt-4 text-center">Showing {list.length} transactions</p>

      {/* View Transaction Modal */}
      <ViewTransactionModal
        isOpen={isViewModalOpen}
        onClose={() => { setIsViewModalOpen(false); setSelectedTransaction(null); }}
        transaction={selectedTransaction}
      />
    </div>
  )
}
