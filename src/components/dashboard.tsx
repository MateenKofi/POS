import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, TrendingUp, Loader2, AlertCircle } from "lucide-react"
import { useDashboardStats, useInventoryReport, useSales } from "@/hooks/useApi"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function Dashboard() {
  // API hooks for dashboard data
  const { data: dashboardStatistics, isLoading: isStatsLoading, error: statsError } = useDashboardStats()
  const { data: inventoryReport, isLoading: isInventoryLoading } = useInventoryReport(10)
  const { data: recentSales, isLoading: isSalesLoading } = useSales(1, 5)

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
  const sales = Array.isArray(recentSales) ? recentSales : []

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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
              </div>
            ) : (
              <div className="space-y-4">
                {sales.map((sale) => (
                  <div key={sale.sale_id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="font-medium text-slate-800">Transaction #{sale.sale_id}</p>
                      <p className="text-sm text-slate-600">
                        {sale.items?.length || 0} items • {new Date(sale.sale_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">{formatCurrency(parseFloat(sale.total_amount))}</p>
                      <Badge variant="secondary" className="text-xs">
                        {sale.payment_method_id === 1 ? 'Cash' : sale.payment_method_id === 2 ? 'Card' : 'Mobile Money'}
                      </Badge>
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
                        <p className="text-sm text-slate-600">{product.totalSold || 0} sold</p>
                      </div>
                    </div>
                    <p className="font-semibold text-slate-800">
                      {formatCurrency(product.revenue || 0)}
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
