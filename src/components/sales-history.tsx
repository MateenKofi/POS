"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Download, Loader2, AlertCircle, Calendar, TrendingUp, TrendingDown, RefreshCw, X } from "lucide-react"
import { useSales, useSalesByDateRange } from "@/hooks/useApi"
import type { Sale } from "@/lib/api"
import { toast } from "sonner"

export function SalesHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [isSaleDetailsOpen, setIsSaleDetailsOpen] = useState(false)

  // Get current date for default end date
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    setEndDate(today)
    setStartDate(lastMonth)
  }, [])

  // API hooks
  const { data: allSales, isLoading: isAllSalesLoading, error: allSalesError, refetch: refetchAllSales } = useSales(currentPage, pageSize)
  const { data: dateRangeSales, isLoading: isDateRangeLoading, error: dateRangeError, refetch: refetchDateRangeSales } = useSalesByDateRange(startDate, endDate)

  // Validate date range
  const isDateRangeValid = startDate && endDate && startDate <= endDate
  
  // Use date range sales if valid dates are selected, otherwise use all sales
  const salesData = isDateRangeValid ? (dateRangeSales || []) : (allSales?.sales || [])
  const isLoading = isDateRangeValid ? isDateRangeLoading : isAllSalesLoading
  const error = isDateRangeValid ? dateRangeError : allSalesError

  // Filter sales based on search term
  const filteredSales = salesData.filter((sale: Sale) => {
    const matchesSearch = searchTerm === "" || 
      sale.sale_id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sale.first_name && sale.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sale.last_name && sale.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  // Calculate totals
  const totalSales = filteredSales.reduce((sum: number, sale: Sale) => sum + parseFloat(sale.total_amount), 0)
  const totalTransactions = filteredSales.length
  const averageSale = totalTransactions > 0 ? totalSales / totalTransactions : 0

  // Format currency to Ghanaian Cedi
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get payment method name
  const getPaymentMethodName = (paymentMethodId: number) => {
    const methods: Record<number, string> = {
      1: 'Cash',
      2: 'Card',
      3: 'Mobile Money'
    }
    return methods[paymentMethodId] || `Method ${paymentMethodId}`
  }

  // Handle export
  const handleExport = () => {
    if (filteredSales.length === 0) {
      toast.error("No data to export")
      return
    }
    
    // Create CSV content
    const csvContent = [
      ['Transaction ID', 'Date', 'Cashier', 'Payment Method', 'Total Amount (GH₵)', 'Items'],
      ...filteredSales.map(sale => [
        sale.sale_id.toString(),
        formatDate(sale.sale_date),
        `${sale.first_name || ''} ${sale.last_name || ''}`.trim() || `Salesperson ${sale.salesperson_id}`,
        getPaymentMethodName(sale.payment_method_id),
        `GH₵${sale.total_amount}`,
        sale.items?.length || 0
      ])
    ].map(row => row.join(',')).join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    
    // Create a better filename
    let filename = 'sales-history'
    if (startDate && endDate && isDateRangeValid) {
      const startFormatted = new Date(startDate).toLocaleDateString('en-GH').replace(/\//g, '-')
      const endFormatted = new Date(endDate).toLocaleDateString('en-GH').replace(/\//g, '-')
      filename += `-${startFormatted}-to-${endFormatted}`
    } else {
      filename += `-all-time`
    }
    filename += '.csv'
    
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success("Sales data exported successfully!")
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Quick Access to Sales Data</h1>
        <p className="text-slate-600">View and analyze your transaction history</p>
        
        {/* Help Message */}
        {!startDate && !endDate && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">💡 Tip: Select a date range to view specific sales data</p>
                <p className="text-xs">Use the quick date presets below or manually select start and end dates</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{formatCurrency(totalSales)}</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {totalTransactions > 0 ? `${((totalSales / totalTransactions) / 100).toFixed(1)}% avg` : 'No transactions'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{totalTransactions}</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {isDateRangeValid ? (
                `${new Date(startDate).toLocaleDateString('en-GH')} - ${new Date(endDate).toLocaleDateString('en-GH')}`
              ) : (
                'All time'
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Average Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {formatCurrency(averageSale)}
            </div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {totalTransactions > 0 ? 'Per transaction' : 'No transactions'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search by transaction ID or cashier name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Date Selection */}
        <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full sm:w-auto"
          placeholder="Start Date"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full sm:w-auto"
          placeholder="End Date"
        />
        </div>
        
        {/* Quick Date Presets */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date().toISOString().split('T')[0]
              setStartDate(today)
              setEndDate(today)
            }}
            className="text-xs"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date()
              const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              setStartDate(yesterday)
              setEndDate(yesterday)
            }}
            className="text-xs"
          >
            Yesterday
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date()
              const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              setStartDate(lastWeek)
              setEndDate(today.toISOString().split('T')[0])
            }}
            className="text-xs"
          >
            Last 7 Days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date()
              const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              setStartDate(lastMonth)
              setEndDate(today.toISOString().split('T')[0])
            }}
            className="text-xs"
          >
            Last 30 Days
          </Button>
        </div>
        {/* Date Range Validation Message */}
        {startDate && endDate && !isDateRangeValid && (
          <div className="col-span-full text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
            ⚠️ Start date must be before or equal to end date
          </div>
        )}
        
        <Button 
          variant="outline" 
          className="gap-2 bg-transparent"
          onClick={() => {
            // Refresh the data
            if (isDateRangeValid) {
              refetchDateRangeSales()
            } else {
              refetchAllSales()
            }
            toast.success("Data refreshed!")
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
        <Button 
          variant="outline" 
          className="gap-2 bg-transparent"
          onClick={() => {
            setSearchTerm("")
            setStartDate("")
            setEndDate("")
            setCurrentPage(1)
          }}
        >
          <X className="h-4 w-4" />
          Clear Filters
        </Button>
        <Button 
          variant="outline" 
          className="gap-2 bg-transparent"
          onClick={handleExport}
          disabled={filteredSales.length === 0}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Sales Table */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Transaction ID</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Date & Time</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Items</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Payment</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Cashier</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!isDateRangeValid && startDate && endDate ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-amber-600">
                        <AlertCircle className="h-8 w-8 text-amber-400" />
                        <p className="font-medium">Invalid Date Range</p>
                        <p className="text-sm text-amber-500">Please select a valid start and end date</p>
                      </div>
                    </td>
                  </tr>
                ) : isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading sales data...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-3 text-red-600">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5" />
                          <span className="font-medium">Error loading sales data</span>
                        </div>
                        <p className="text-sm text-red-500 max-w-md text-center">
                          {error?.message === "Sale not found" 
                            ? "No sales data available for the selected criteria. Please try a different date range or search term."
                            : error?.message || "Failed to load sales data. Please check your connection and try again."
                          }
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (startDate && endDate) {
                              refetchDateRangeSales()
                            } else {
                              refetchAllSales()
                            }
                          }}
                          className="mt-2"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Retry
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500">
                      <div className="flex flex-col items-center gap-3">
                        <TrendingDown className="h-8 w-8 text-slate-300" />
                        <p className="font-medium">No sales found for the selected criteria</p>
                        <div className="text-sm text-slate-400 max-w-md text-center">
                          {startDate && endDate ? (
                            <p>No sales found between {new Date(startDate).toLocaleDateString('en-GH')} and {new Date(endDate).toLocaleDateString('en-GH')}</p>
                          ) : (
                            <div className="space-y-2">
                              <p>No sales data available</p>
                              <p className="text-xs">Try selecting a date range or adjusting your search terms</p>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchTerm("")
                            setStartDate("")
                            setEndDate("")
                            setCurrentPage(1)
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Clear Filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale) => (
                    <tr key={sale.sale_id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-800">#{sale.sale_id}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {formatDate(sale.sale_date)}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {sale.items?.length || 0} item{(sale.items?.length || 0) !== 1 ? 's' : ''}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {formatCurrency(parseFloat(sale.total_amount))}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={sale.method_name === "Cash" ? "default" : "secondary"}>
                          {sale.method_name || getPaymentMethodName(sale.payment_method_id)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {sale.first_name && sale.last_name ? (
                          `${sale.first_name} ${sale.last_name}`
                        ) : (
                          `Salesperson #${sale.salesperson_id}`
                        )}
                      </td>
                    <td className="py-3 px-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setSelectedSale(sale)
                            setIsSaleDetailsOpen(true)
                          }}
                        >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {allSales?.pagination && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-slate-600">
                Showing {((allSales.pagination.page - 1) * pageSize) + 1} to {Math.min(allSales.pagination.page * pageSize, allSales.pagination.total)} of {allSales.pagination.total} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || isLoading}
                >
                  Previous
                </Button>
                <span className="text-sm text-slate-600">
                  Page {currentPage} of {allSales.pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(allSales.pagination.pages, prev + 1))}
                  disabled={currentPage === allSales.pagination.pages || isLoading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sale Details Dialog */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">
                Sale Details - #{selectedSale.sale_id}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSaleDetailsOpen(false)}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Sale Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-slate-700">Transaction ID:</span>
                  <p className="text-sm text-slate-900">#{selectedSale.sale_id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-700">Date & Time:</span>
                  <p className="text-sm text-slate-900">{formatDate(selectedSale.sale_date)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-700">Total Amount:</span>
                  <p className="text-sm text-slate-900 font-semibold">
                    {formatCurrency(parseFloat(selectedSale.total_amount))}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-700">Payment Method:</span>
                  <p className="text-sm text-slate-900">
                    {selectedSale.method_name || getPaymentMethodName(selectedSale.payment_method_id)}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-700">Cashier:</span>
                  <p className="text-sm text-slate-900">
                    {selectedSale.first_name && selectedSale.last_name ? (
                      `${selectedSale.first_name} ${selectedSale.last_name}`
                    ) : (
                      `Salesperson #${selectedSale.salesperson_id}`
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-700">Items Count:</span>
                  <p className="text-sm text-slate-900">
                    {selectedSale.items?.length || 0} item{(selectedSale.items?.length || 0) !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Sale Items */}
              {selectedSale.items && selectedSale.items.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Sale Items</h3>
                  <div className="space-y-2">
                    {selectedSale.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <div>
                          <span className="text-sm font-medium text-slate-800">
                            Product #{item.product_id}
                          </span>
                          <p className="text-xs text-slate-600">
                            Qty: {item.quantity} × {formatCurrency(item.price_at_sale)}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-slate-800">
                          {formatCurrency(item.quantity * item.price_at_sale)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsSaleDetailsOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    // TODO: Implement reprint receipt functionality
                    toast.info("Reprint functionality coming soon!")
                  }}
                >
                  Reprint Receipt
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
