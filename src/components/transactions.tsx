"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/custom-components"
import { Separator } from "@/components/ui/separator"
import { Loader2, Plus, Receipt, FileText } from "lucide-react"
import {
  useTransactions,
  useTransactionsByDateRange,
  useTransactionsByType,
  useDeleteTransaction,
} from "@/hooks/useApi"
import type { Transaction } from "@/lib/api"
import { Modal } from "@/components/modal"
import { toast } from "sonner"
import { Invoices } from "@/components/invoices"
import { ModernTabs } from "@/components/ui/modern-tabs"

// Transactions sub-components
import { TransactionForm } from "./transactions/TransactionForm"
import { TransactionList } from "./transactions/TransactionList"
import { TransactionFilters } from "./transactions/TransactionFilters"

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
  const [activeTab, setActiveTab] = useState<'transactions' | 'invoices'>('transactions')
  const [page] = useState<number>(1)
  const [limit] = useState<number>(50)
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [query, setQuery] = useState<string>("")
  const [typeFilter, setTypeFilter] = useState<string>("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [, setRefetchKey] = useState(0)

  const transactionsQuery = useTransactions(page, limit)
  const rangeQuery = useTransactionsByDateRange(startDate, endDate)
  const typeQuery = useTransactionsByType(typeFilter)
  const deleteMutation = useDeleteTransaction()

  const loading = transactionsQuery.isLoading || (startDate && endDate ? rangeQuery.isLoading : false) || (typeFilter ? typeQuery.isLoading : false)
  const error = transactionsQuery.error || (startDate && endDate ? rangeQuery.error : null) || (typeFilter ? typeQuery.error : null)

  const list = useMemo(() => {
    let base: Transaction[] = []

    if (typeFilter) {
      base = typeQuery.data || []
    } else if (startDate && endDate) {
      base = rangeQuery.data || []
    } else {
      base = transactionsQuery.data?.transactions || []
    }

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
  }, [startDate, endDate, typeFilter, rangeQuery.data, transactionsQuery.data, typeQuery.data, query])

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteMutation.mutate(String(id), {
        onSuccess: () => {
          toast.success('Transaction deleted')
          setRefetchKey(prev => prev + 1)
        },
        onError: () => {
          toast.error('Failed to delete transaction')
        },
      })
    }
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

  if (loading && !transactionsQuery.data) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading transactions...</span>
        </div>
      </div>
    )
  }

  if (error) {
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
              Financial Records
            </h1>
            <p className="text-sm sm:text-base text-slate-500">Manage transactions and invoices</p>
          </div>
        </div>
        {activeTab === 'transactions' && (
          <Button
            onClick={() => { setEditingTransaction(null); setIsFormOpen(true); }}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-500/20 rounded-xl h-11"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Transaction
          </Button>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="mb-4">
        <ModernTabs
          activeTab={activeTab}
          onChange={(val) => setActiveTab(val as 'transactions' | 'invoices')}
          tabs={[
            { value: "transactions", label: "Transactions", icon: Receipt },
            { value: "invoices", label: "Invoices", icon: FileText },
          ]}
        />
      </div>

      {/* Invoices Tab Content */}
      {activeTab === 'invoices' ? (
        <div className="-m-3 sm:-m-6">
          <Invoices />
        </div>
      ) : (
        <>
          {/* Transactions Tab Content */}
          <Card className="border-slate-200 mb-4">
            <CardHeader>
              <CardTitle className="text-slate-800">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionFilters
                startDate={startDate}
                endDate={endDate}
                typeFilter={typeFilter}
                query={query}
                transactionTypeLabels={TRANSACTION_TYPE_LABELS}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onTypeFilterChange={setTypeFilter}
                onQueryChange={setQuery}
              />
            </CardContent>
          </Card>

          <Card className="border-slate-200">
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
                <p className="text-slate-500">No transactions found.</p>
              ) : (
                <TransactionList
                  transactions={list}
                  transactionTypeLabels={TRANSACTION_TYPE_LABELS}
                  transactionStatusColors={TRANSACTION_STATUS_COLORS}
                  onEdit={(t) => { setEditingTransaction(t); setIsFormOpen(true); }}
                  onDelete={handleDelete}
                />
              )}
            </CardContent>
          </Card>

          <Separator className="my-4" />
          <p className="text-xs text-slate-500">Showing {list.length} transactions</p>

          {isFormOpen && (
            <Modal
              isOpen={isFormOpen}
              onClose={() => { setIsFormOpen(false); setEditingTransaction(null); }}
              title={editingTransaction ? 'Edit Transaction' : 'New Transaction'}
              size="md"
            >
              <TransactionForm
                mode={editingTransaction ? 'edit' : 'create'}
                transaction={editingTransaction || undefined}
                onClose={() => { setIsFormOpen(false); setEditingTransaction(null); }}
                onSuccess={() => { setRefetchKey(prev => prev + 1); }}
              />
            </Modal>
          )}
        </>
      )}
    </div>
  )
}
