"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart3, TrendingUp, DollarSign, Package, Users, Download, AlertTriangle, Calendar } from "lucide-react"
import { useSales, useProducts, useStaff } from "@/hooks/useApi"
import { Loader2 } from "lucide-react"
import { type Sale, type Staff } from "@/lib/api"

type ReportTab = "profit" | "expiry" | "staff"
type PeriodType = "today" | "week" | "month"

export function Reports() {
  const [activeTab, setActiveTab] = useState<ReportTab>("profit")
  const [period, setPeriod] = useState<PeriodType>("today")

  // API hooks
  const { data: salesData, isLoading: salesLoading } = useSales(1, 1000)
  const { data: productsData, isLoading: productsLoading } = useProducts(1, 1000)
  const { data: staffData, isLoading: staffLoading } = useStaff()

  const sales = Array.isArray(salesData?.sales) ? salesData.sales : []
  const products = Array.isArray(productsData) ? productsData : []
  const staff = Array.isArray(staffData?.salespersons) ? staffData.salespersons : []

  // Filter sales by period
  const filteredSales = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    return sales.filter((sale: Sale) => {
      const saleDate = new Date(sale.sale_date)

      switch (period) {
        case "today":
          return saleDate >= today
        case "week":
          const weekAgo = new Date(today)
          weekAgo.setDate(weekAgo.getDate() - 7)
          return saleDate >= weekAgo
        case "month":
          const monthAgo = new Date(today)
          monthAgo.setMonth(monthAgo.getMonth() - 1)
          return saleDate >= monthAgo
        default:
          return true
      }
    })
  }, [sales, period])

  // Profit & Revenue calculations
  const profitReport = useMemo(() => {
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0)
    const totalCost = filteredSales.reduce((sum, sale) => {
      const saleCost = sale.items.reduce((itemSum, item) => itemSum + (item.cost_price_at_sale * item.quantity), 0)
      return sum + saleCost
    }, 0)
    const grossProfit = totalRevenue - totalCost
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0

    // Calculate top products by profit
    const productProfits = new Map<number, { name: string; profit: number; revenue: number; margin: number }>()

    filteredSales.forEach((sale) => {
      sale.items.forEach((item) => {
        const product = products.find(p => p.product_id === item.product_id)
        const productName = product?.name || `Product #${item.product_id}`
        const revenue = item.price_at_sale * item.quantity
        const cost = item.cost_price_at_sale * item.quantity
        const profit = revenue - cost
        const margin = revenue > 0 ? (profit / revenue) * 100 : 0

        const existing = productProfits.get(item.product_id)
        if (existing) {
          existing.profit += profit
          existing.revenue += revenue
          existing.margin = margin
        } else {
          productProfits.set(item.product_id, { name: productName, profit, revenue, margin })
        }
      })
    })

    const topProducts = Array.from(productProfits.values())
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 10)

    return {
      totalRevenue,
      totalCost,
      grossProfit,
      profitMargin,
      topProducts,
      transactions: filteredSales.length,
    }
  }, [filteredSales, products])

  // Expiring Stock Report
  const expiryReport = useMemo(() => {
    const now = new Date()

    const expiringProducts = products
      .filter((p) => p.expiry_date)
      .map((p) => {
        const expiryDate = new Date(p.expiry_date!)
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        let status: 'expired' | 'expiring_soon' | 'ok'
        if (daysUntilExpiry < 0) {
          status = 'expired'
        } else if (daysUntilExpiry <= 30) {
          status = 'expiring_soon'
        } else {
          status = 'ok'
        }

        return {
          ...p,
          daysUntilExpiry,
          status,
        }
      })
      .filter((p) => p.status !== 'ok')
      .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)

    return expiringProducts
  }, [products])

  // Staff Performance Report
  const staffPerformance = useMemo(() => {
    const performance = staff.map((staffMember: Staff) => {
      const staffSales = filteredSales.filter((s) => s.cashier_id === staffMember.salesperson_id)

      const totalSalesAmount = staffSales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0)
      const transactions = staffSales.length
      const avgTransaction = transactions > 0 ? totalSalesAmount / transactions : 0
      const totalProfit = staffSales.reduce((sum, sale) => sum + parseFloat(sale.profit_amount || '0'), 0)

      return {
        id: staffMember.salesperson_id,
        name: `${staffMember.first_name} ${staffMember.last_name}`,
        role: staffMember.role,
        totalSalesAmount,
        transactions,
        avgTransaction,
        totalProfit,
      }
    })

    return performance.sort((a: typeof performance[0], b: typeof performance[0]) => b.totalSalesAmount - a.totalSalesAmount)
  }, [staff, filteredSales])

  const isLoading = salesLoading || productsLoading || staffLoading

  return (
    <div className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Reports</h1>
          <p className="text-sm sm:text-base text-slate-600">Analyze your business performance and trends</p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={(value: PeriodType) => setPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === "profit" ? "default" : "outline"}
          onClick={() => setActiveTab("profit")}
          className={activeTab === "profit" ? "bg-blue-600 hover:bg-blue-700" : ""}
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Profit & Revenue
        </Button>
        <Button
          variant={activeTab === "expiry" ? "default" : "outline"}
          onClick={() => setActiveTab("expiry")}
          className={activeTab === "expiry" ? "bg-blue-600 hover:bg-blue-700" : ""}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Expiring Stock
        </Button>
        <Button
          variant={activeTab === "staff" ? "default" : "outline"}
          onClick={() => setActiveTab("staff")}
          className={activeTab === "staff" ? "bg-blue-600 hover:bg-blue-700" : ""}
        >
          <Users className="h-4 w-4 mr-2" />
          Staff Performance
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading reports...</span>
        </div>
      ) : (
        <>
          {activeTab === "profit" && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">GH₵{profitReport.totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      <TrendingUp className="inline h-3 w-3 mr-1" />
                      {profitReport.transactions} transactions
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">GH₵{profitReport.totalCost.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Cost of goods sold</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">GH₵{profitReport.grossProfit.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      {profitReport.profitMargin.toFixed(1)}% profit margin
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{profitReport.transactions}</div>
                    <p className="text-xs text-muted-foreground">
                      Avg: GH₵{(profitReport.totalRevenue / profitReport.transactions || 0).toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Top Products by Profit */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Top 10 Products by Profit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                        <TableHead className="text-right">Profit</TableHead>
                        <TableHead className="text-right">Margin</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profitReport.topProducts.map((product, index) => (
                        <TableRow key={product.name + index}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                                {index + 1}
                              </Badge>
                              {product.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">GH₵{product.revenue.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            GH₵{product.profit.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className={product.margin >= 20 ? "text-green-600 border-green-300" : "text-orange-600 border-orange-300"}>
                              {product.margin.toFixed(1)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {profitReport.topProducts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                            No sales data for this period
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "expiry" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Expiring Stock Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Batch Number</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expiryReport.map((product) => {
                      const isExpired = product.status === 'expired'
                      const isExpiringSoon = product.status === 'expiring_soon'

                      return (
                        <TableRow key={product.product_id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="text-sm text-slate-600">{product.batch_number || 'N/A'}</TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              {new Date(product.expiry_date!).toLocaleDateString('en-GB')}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {product.stock_quantity} {product.unit_type === 'bag' ? 'bags' : 'kg'}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                isExpired
                                  ? "bg-red-100 text-red-800 border-red-300"
                                  : isExpiringSoon
                                    ? "bg-orange-100 text-orange-800 border-orange-300"
                                    : "bg-green-100 text-green-800 border-green-300"
                              }
                            >
                              {isExpired
                                ? `Expired ${Math.abs(product.daysUntilExpiry)} days ago`
                                : isExpiringSoon
                                  ? `Expires in ${product.daysUntilExpiry} days`
                                  : "OK"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {expiryReport.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No products expiring soon. All stock is in good condition!</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeTab === "staff" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Staff Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cashier</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Transactions</TableHead>
                        <TableHead className="text-right">Total Sales</TableHead>
                        <TableHead className="text-right">Avg Transaction</TableHead>
                        <TableHead className="text-right">Total Profit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staffPerformance.map((staff: typeof staffPerformance[0]) => (
                        <TableRow key={staff.id}>
                          <TableCell className="font-medium">{staff.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{staff.role}</Badge>
                          </TableCell>
                          <TableCell className="text-right">{staff.transactions}</TableCell>
                          <TableCell className="text-right font-medium">GH₵{staff.totalSalesAmount.toFixed(2)}</TableCell>
                          <TableCell className="text-right text-sm text-slate-600">
                            GH₵{staff.avgTransaction.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            GH₵{staff.totalProfit.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      {staffPerformance.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No staff performance data for this period
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  )
}
