"use client"

import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/custom-components"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Banknote, Smartphone, Building2, FileText, Loader2 } from "lucide-react"
import { useSales } from "@/hooks/useApi"
import { PAYMENT_METHODS } from "@/hooks/useApi"
import { CloseDayModal, type CloseDayFormData } from "./CloseDayModal"
import { type Sale } from "@/lib/api"

interface DailySummary {
  date: string
  totalSales: number
  totalCash: number
  totalMobileMoney: number
  totalBankTransfer: number
  transactions: number
}

export const DailyClosure = () => {
  const [showCloseDialog, setShowCloseDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form for closing the day
  const closeDayForm = useForm<CloseDayFormData>({
    defaultValues: {
      actualCash: "",
      actualMobileMoney: "",
      actualBankTransfer: "",
      notes: "",
    }
  })

  // API hooks
  const { data: salesData, isLoading } = useSales(1, 1000)

  const sales = Array.isArray(salesData?.sales) ? salesData.sales : []

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]

  // Calculate today's summary
  const todaySummary = useMemo((): DailySummary => {
    const todaySales = sales.filter((sale: Sale) => {
      const saleDate = new Date(sale.sale_date).toISOString().split('T')[0]
      return saleDate === today
    })

    const summary: DailySummary = {
      date: today,
      totalSales: 0,
      totalCash: 0,
      totalMobileMoney: 0,
      totalBankTransfer: 0,
      transactions: todaySales.length,
    }

    todaySales.forEach((sale: Sale) => {
      const amount = parseFloat(sale.total_amount)
      summary.totalSales += amount

      switch (sale.payment_method_id) {
        case 1: // Cash
          summary.totalCash += amount
          break
        case 2: // Mobile Money
          summary.totalMobileMoney += amount
          break
        case 3: // Bank Transfer
          summary.totalBankTransfer += amount
          break
      }
    })

    return summary
  }, [sales, today])

  // Get historical closures (mock data for now)
  const closureHistory = useMemo(() => {
    // In a real implementation, this would come from an API
    // For now, we'll return empty array
    return [] as Array<{
      id: number
      date: string
      expected: number
      actual: number
      variance: number
    }>
  }, [])

  const handleSubmitClosure = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Reset form
    closeDayForm.reset({
      actualCash: "",
      actualMobileMoney: "",
      actualBankTransfer: "",
      notes: "",
    })
    setShowCloseDialog(false)
    setIsSubmitting(false)

    alert("Daily closure submitted successfully!")
  }

  const formatCurrency = (amount: number) => {
    return `GH₵${amount.toFixed(2)}`
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Daily Closure</h1>
        <p className="text-sm sm:text-base text-slate-600">Review and close your daily sales</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600">Loading sales data...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Today's Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Calendar className="h-5 w-5" />
                Today's Summary - {new Date().toLocaleDateString('en-GB', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Total Sales</span>
                    <Banknote className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(todaySummary.totalSales)}</p>
                  <p className="text-xs text-slate-600 mt-1">{todaySummary.transactions} transactions</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Cash</span>
                    <Banknote className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(todaySummary.totalCash)}</p>
                  <p className="text-xs text-slate-600 mt-1">{PAYMENT_METHODS[1]}</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Mobile Money</span>
                    <Smartphone className="h-4 w-4 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(todaySummary.totalMobileMoney)}</p>
                  <p className="text-xs text-slate-600 mt-1">{PAYMENT_METHODS[2]}</p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Bank Transfer</span>
                    <Building2 className="h-4 w-4 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(todaySummary.totalBankTransfer)}</p>
                  <p className="text-xs text-slate-600 mt-1">{PAYMENT_METHODS[3]}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Close Day Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowCloseDialog(true)}
              className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base py-2 sm:py-3 px-4 rounded-md inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={todaySummary.transactions === 0}
            >
              <FileText className="h-4 w-4" />
              Close Day
            </button>
          </div>

          {/* Recent Closures History */}
          {closureHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Recent Closures</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Expected</TableHead>
                      <TableHead className="text-right">Actual</TableHead>
                      <TableHead className="text-right">Variance</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {closureHistory.map((closure) => (
                      <TableRow key={closure.id}>
                        <TableCell>{new Date(closure.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">{formatCurrency(closure.expected)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(closure.actual)}</TableCell>
                        <TableCell className={`text-right font-medium ${closure.variance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(closure.variance)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={closure.variance === 0 ? "default" : "destructive"}>
                            {closure.variance === 0 ? "Balanced" : "Discrepancy"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Close Day Modal */}
      <CloseDayModal
        isOpen={showCloseDialog}
        onClose={() => setShowCloseDialog(false)}
        form={closeDayForm}
        todaySummary={{
          totalSales: todaySummary.totalSales,
          totalCash: todaySummary.totalCash,
          totalMobileMoney: todaySummary.totalMobileMoney,
          totalBankTransfer: todaySummary.totalBankTransfer,
        }}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmitClosure}
      />
    </div>
  )
}
