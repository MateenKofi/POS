"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Modal } from "@/components/modal"
import { Calendar, DollarSign, Smartphone, Building2, CheckCircle2, AlertCircle, TrendingUp, TrendingDown, FileText, Loader2 } from "lucide-react"
import { useSales } from "@/hooks/useApi"
import { PAYMENT_METHODS } from "@/hooks/useApi"
import { type Sale } from "@/lib/api"

interface DailySummary {
  date: string
  totalSales: number
  totalCash: number
  totalMobileMoney: number
  totalBankTransfer: number
  transactions: number
}

export function DailyClosure() {
  const [showCloseDialog, setShowCloseDialog] = useState(false)
  const [actualCash, setActualCash] = useState("")
  const [actualMobileMoney, setActualMobileMoney] = useState("")
  const [actualBankTransfer, setActualBankTransfer] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  // Calculate variance
  const cashVariance = parseFloat(actualCash) || 0 - todaySummary.totalCash
  const mobileMoneyVariance = parseFloat(actualMobileMoney) || 0 - todaySummary.totalMobileMoney
  const bankTransferVariance = parseFloat(actualBankTransfer) || 0 - todaySummary.totalBankTransfer
  const totalVariance = cashVariance + mobileMoneyVariance + bankTransferVariance

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
    setActualCash("")
    setActualMobileMoney("")
    setActualBankTransfer("")
    setNotes("")
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
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Total Sales</span>
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(todaySummary.totalSales)}</p>
                  <p className="text-xs text-slate-600 mt-1">{todaySummary.transactions} transactions</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Cash</span>
                    <DollarSign className="h-4 w-4 text-green-600" />
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
            <Button
              onClick={() => setShowCloseDialog(true)}
              className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base py-2 sm:py-3"
              disabled={todaySummary.transactions === 0}
            >
              <FileText className="h-4 w-4 mr-2" />
              Close Day
            </Button>
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
      {showCloseDialog && (
        <Modal
          isOpen={showCloseDialog}
          onClose={() => setShowCloseDialog(false)}
          title={`Close Day - ${new Date().toLocaleDateString()}`}
          size="lg"
        >
          <div className="space-y-4">
            {/* Expected Amounts */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-medium text-sm text-slate-700 mb-3">Expected Amounts</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Cash:</span>
                  <span className="font-medium">{formatCurrency(todaySummary.totalCash)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mobile Money:</span>
                  <span className="font-medium">{formatCurrency(todaySummary.totalMobileMoney)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bank Transfer:</span>
                  <span className="font-medium">{formatCurrency(todaySummary.totalBankTransfer)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-slate-300 pt-2">
                  <span>Total Expected:</span>
                  <span className="text-blue-600">{formatCurrency(todaySummary.totalSales)}</span>
                </div>
              </div>
            </div>

            {/* Actual Amounts */}
            <div>
              <h3 className="font-medium text-sm text-slate-700 mb-3">Actual Amounts on Hand</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="actual-cash">Actual Cash (GH₵)</Label>
                  <Input
                    id="actual-cash"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={actualCash}
                    onChange={(e) => setActualCash(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="actual-mm">Actual Mobile Money (GH₵)</Label>
                  <Input
                    id="actual-mm"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={actualMobileMoney}
                    onChange={(e) => setActualMobileMoney(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="actual-bt">Actual Bank Transfer (GH₵)</Label>
                  <Input
                    id="actual-bt"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={actualBankTransfer}
                    onChange={(e) => setActualBankTransfer(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Variance */}
            {(actualCash || actualMobileMoney || actualBankTransfer) && (
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-medium text-sm text-slate-700 mb-3">Variance</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Cash Variance:</span>
                    <span className={`font-medium flex items-center gap-1 ${cashVariance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {cashVariance === 0 ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      {cashVariance > 0 ? '+' : ''}{formatCurrency(cashVariance)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Mobile Money Variance:</span>
                    <span className={`font-medium flex items-center gap-1 ${mobileMoneyVariance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {mobileMoneyVariance === 0 ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      {mobileMoneyVariance > 0 ? '+' : ''}{formatCurrency(mobileMoneyVariance)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bank Transfer Variance:</span>
                    <span className={`font-medium flex items-center gap-1 ${bankTransferVariance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {bankTransferVariance === 0 ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      {bankTransferVariance > 0 ? '+' : ''}{formatCurrency(bankTransferVariance)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-slate-300 pt-2">
                    <span>Total Variance:</span>
                    <span className={`flex items-center gap-1 ${totalVariance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalVariance === 0 ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        totalVariance > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )
                      )}
                      {totalVariance > 0 ? '+' : ''}{formatCurrency(totalVariance)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Add any notes about discrepancies..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCloseDialog(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitClosure}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting || (!actualCash && !actualMobileMoney && !actualBankTransfer)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Submit Closure
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
