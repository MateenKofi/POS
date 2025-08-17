import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, TrendingUp, Loader2, AlertCircle } from "lucide-react"
import { useDashboardStats, useInventoryReport, useSales } from "@/hooks/useApi"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function Dashboard() {
  // API hooks for dashboard data
  const { data: dashboardStatistics, isLoading: isStatsLoading, error: statsError } = useDashboardStats()
  const { data: inventoryReport, isLoading: isInventoryLoading } = useInventoryReport(10)
  const { data: recentSales, isLoading: isSalesLoading, error: salesError } = useSales(1, 5)

  // Debug logging
  console.log('Dashboard Component Rendered')
  console.log('useSales hook result:', { recentSales, isSalesLoading, salesError })

  // Loading state
  if (isStatsLoading || isInventoryLoading || isSalesLoading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Your Sales at a Glance</h1>
          <p className="text-slate-600">Loading dashboard data...</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  // Debug information
  console.log('Dashboard Loading States:', { isStatsLoading, isInventoryLoading, isSalesLoading })
  console.log('Dashboard Data:', { dashboardStatistics, inventoryReport, recentSales })

  // Error state
  if (statsError) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p className="text-slate-600">Error loading dashboard data</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">Failed to load dashboard data</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    )
  }

  // Extract data from API responses
  const stats = dashboardStatistics?.overview || {}
  const lowStockProducts = inventoryReport?.lowStockProducts || []
  const sales = recentSales?.sales || []
  console.log('Recent Sales Data:', recentSales)
  console.log('Extracted Sales:', sales)

  // Format currency to Ghanaian Cedi
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  // Calculate percentage change (mock for now - you can implement real calculation)
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%'
    const change = ((current - previous) / previous) * 100
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
  }

  const dashboardStats = [
    {
      title: "Today's Sales",
      value: formatCurrency(stats.todayRevenue || 0),
      icon: DollarSign,
      change: calculateChange(stats.todayRevenue || 0, (stats.todayRevenue || 0) * 0.9),
      changeType: "positive" as const,
    },
    {
      title: "Products in Stock",
      value: stats.totalProducts?.toString() || "0",
      icon: Package,
      change: calculateChange(stats.totalProducts || 0, (stats.totalProducts || 0) * 1.03),
      changeType: "positive" as const,
    },
    {
      title: "Today's Transactions",
      value: stats.todaySales?.toString() || "0",
      icon: ShoppingCart,
      change: calculateChange(stats.todaySales || 0, (stats.todaySales || 0) * 0.92),
      changeType: "positive" as const,
    },
    {
      title: "Average Sale",
      value: stats.todaySales && stats.todayRevenue ? 
        formatCurrency(stats.todayRevenue / stats.todaySales) : 
        formatCurrency(0),
      icon: TrendingUp,
      change: "+5.4%",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Your Sales at a Glance</h1>
        <p className="text-slate-600">Monitor your business performance in real-time</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                <p className={`text-xs ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                  {stat.change} from yesterday
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {sales.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p>No recent transactions</p>
                {/* Debug information */}
                <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-left">
                  <p className="font-medium mb-2">Debug Info:</p>
                  <p>recentSales: {JSON.stringify(recentSales, null, 2)}</p>
                  <p>sales array length: {sales.length}</p>
                  <p>isSalesLoading: {isSalesLoading.toString()}</p>
                  <p>salesError: {salesError ? JSON.stringify(salesError) : 'None'}</p>
                  <p>API URL: {`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3007'}/api/sales?page=1&limit=5`}</p>
                  
                  {/* Test API Call Button */}
                  <div className="mt-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={async () => {
                        try {
                          const response = await fetch('http://localhost:3007/api/sales?page=1&limit=5')
                          const data = await response.json()
                          console.log('Manual API Test Result:', data)
                          alert(`API Test Result: ${JSON.stringify(data, null, 2)}`)
                        } catch (error) {
                          console.error('Manual API Test Error:', error)
                          alert(`API Test Error: ${error}`)
                        }
                      }}
                    >
                      Test API Call
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {sales.map((sale) => (
                  <div key={sale.sale_id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-slate-800">Transaction #{sale.sale_id}</p>
                        <Badge variant="outline" className="text-xs">
                          {sale.method_name || (sale.payment_method_id === 1 ? 'Cash' : sale.payment_method_id === 2 ? 'Card' : 'Mobile Money')}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-slate-600">
                          {sale.first_name && sale.last_name ? (
                            <span>By {sale.first_name} {sale.last_name}</span>
                          ) : (
                            <span>Salesperson #{sale.salesperson_id}</span>
                          )}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(sale.sale_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold text-slate-800 text-lg">
                        {formatCurrency(parseFloat(sale.total_amount))}
                      </p>
                      {sale.items && sale.items.length > 0 && (
                        <p className="text-xs text-slate-500">
                          {sale.items.length} item{sale.items.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Package className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p>All products are well stocked</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map((product: any) => (
                  <div
                    key={product.product_id}
                    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{product.name}</p>
                      <p className="text-sm text-red-600">
                        Only {product.stock_quantity} left
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sales Summary Section */}
      {sales.length > 0 && (
        <div className="mt-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Sales Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {sales.length}
                  </p>
                  <p className="text-sm text-blue-800">Total Sales</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(sales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0))}
                  </p>
                  <p className="text-sm text-green-800">Total Revenue</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(sales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0) / sales.length)}
                  </p>
                  <p className="text-sm text-purple-800">Average Sale</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {(() => {
                      const uniqueSalespeople = new Set(sales.map(sale => sale.salesperson_id))
                      return uniqueSalespeople.size
                    })()}
                  </p>
                  <p className="text-sm text-orange-800">Salespeople</p>
                </div>
              </div>
              
              {/* Payment Method Breakdown */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Payment Method Breakdown</h4>
                <div className="space-y-2">
                  {(() => {
                    const paymentMethods = sales.reduce((acc, sale) => {
                      const method = sale.method_name || (sale.payment_method_id === 1 ? 'Cash' : sale.payment_method_id === 2 ? 'Card' : 'Mobile Money')
                      acc[method] = (acc[method] || 0) + 1
                      return acc
                    }, {} as Record<string, number>)
                    
                    return Object.entries(paymentMethods).map(([method, count]) => (
                      <div key={method} className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">{method}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(count / sales.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-slate-800">{count}</span>
                        </div>
                      </div>
                    ))
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Additional Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Top Products */}
        <Card className="border-slate-200 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-slate-800">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardStatistics.topProducts && dashboardStatistics.topProducts.length > 0 ? (
              <div className="space-y-4">
                {dashboardStatistics.topProducts.slice(0, 5).map((product: any, index: number) => (
                  <div key={product.product_id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-slate-800">{product.name}</p>
                        <p className="text-sm text-slate-600">{product.total_sold
 || 0} sold</p>
                      </div>
                    </div>
                    <p className="font-semibold text-slate-800">
                      {formatCurrency(product.total_revenue
 || 0)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p>No product data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Package className="h-4 w-4 mr-2" />
                Add Product
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ShoppingCart className="h-4 w-4 mr-2" />
                New Sale
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
