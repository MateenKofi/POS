import {
  Banknote,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import {
  useDashboardStats,
  useInventoryReport,
  useSales,
  useProducts,
} from "@/hooks/useApi";

// Dashboard sub-components
import { DashboardHeader } from "./DashboardHeader"
import { StatsCards } from "./StatsCards"
import { LowStockAlerts } from "./LowStockAlerts"
import { ExpiringProducts } from "./ExpiringProducts"
import { TopProducts } from "./TopProducts"
import { QuickActions } from "./QuickActions"
import { RevenueChart } from "./RevenueChart"
import { SalesByCategory } from "./SalesByCategory"
import { DailySalesChart } from "./DailySalesChart"
import type { DashboardStat, SaleData } from "./types"

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  // API hooks for dashboard data
  const {
    data: dashboardStatistics,
    isLoading: isStatsLoading,
    error: statsError,
  } = useDashboardStats();
  const { data: inventoryReport, isLoading: isInventoryLoading } =
    useInventoryReport(10);
  const {
    data: recentSales,
    isLoading: isSalesLoading,
    error: salesError,
  } = useSales(1, 5);
  const { data: productsData } = useProducts(1, 1000);

  const isLoading = isStatsLoading || isInventoryLoading || isSalesLoading;
  const error = statsError || salesError;

  // Format currency to Ghanaian Cedi
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS", // Using GHS for Intl.NumberFormat, display uses GH₵,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate percentage change (mock for now)
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  // Extract data from API responses
  const stats = dashboardStatistics?.overview || {
    todayRevenue: 0,
    totalProducts: 0,
    todaySales: 0
  };
  const lowStockProducts = inventoryReport?.lowStockProducts || [];
  const sales: SaleData[] = recentSales?.sales || [];

  // Calculate today's profit from sales
  const todayProfit = sales.reduce((sum, sale) => {
    const profit = parseFloat(sale.profit_amount || '0')
    return sum + profit
  }, 0)

  // Get all products for expiry check
  const allProductsForExpiry = productsData && Array.isArray(productsData) && productsData.length > 0
    ? [...productsData]
    : []

  // Calculate expired products (past expiry date)
  const expiredProducts = allProductsForExpiry.filter(p => {
    if (!p.expiry_date) return false
    const daysUntilExpiry = Math.ceil((new Date(p.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry < 0
  })

  // Calculate expiring soon products (within 30 days, NOT already expired)
  const expiringProducts = allProductsForExpiry.filter(p => {
    if (!p.expiry_date) return false
    const daysUntilExpiry = Math.ceil((new Date(p.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0
  })

  // Dashboard stats
  const dashboardStats: DashboardStat[] = [
    {
      title: "Today's Revenue",
      value: formatCurrency(stats.todayRevenue || 0),
      icon: Banknote,
      change: calculateChange(
        stats.todayRevenue || 0,
        (stats.todayRevenue || 0) * 0.9
      ),
      changeType: "positive",
    },
    {
      title: "Today's Profit",
      value: formatCurrency(todayProfit),
      icon: TrendingUp,
      change: calculateChange(
        todayProfit,
        todayProfit * 0.95
      ),
      changeType: "positive",
    },
    {
      title: "Products in Stock",
      value: stats.totalProducts?.toString() || "0",
      icon: Package,
      change: calculateChange(
        stats.totalProducts || 0,
        (stats.totalProducts || 0) * 1.03
      ),
      changeType: "positive",
    },
    {
      title: "Today's Transactions",
      value: stats.todaySales?.toString() || "0",
      icon: ShoppingCart,
      change: calculateChange(
        stats.todaySales || 0,
        (stats.todaySales || 0) * 0.92
      ),
      changeType: "positive",
    },
  ];

  // Quick action handlers
  const handleQuickAction = (action: string) => {
    if (onNavigate) {
      onNavigate(action);
    } else {
      // Fallback: try to dispatch a custom event
      const event = new CustomEvent('navigateToTab', { detail: action });
      window.dispatchEvent(event);
    }
  };

  // Loading and error states
  if (isLoading || error) {
    return (
      <DashboardHeader
        isLoading={isLoading}
        error={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Generate mock chart data (in real app, this would come from API)
  const revenueData = [
    { name: 'Mon', revenue: 1250, profit: 350 },
    { name: 'Tue', revenue: 1580, profit: 420 },
    { name: 'Wed', revenue: 1890, profit: 510 },
    { name: 'Thu', revenue: 1420, profit: 380 },
    { name: 'Fri', revenue: 2150, profit: 580 },
    { name: 'Sat', revenue: 2890, profit: 780 },
    { name: 'Sun', revenue: 1650, profit: 440 },
  ]

  const categoryData = [
    { name: 'Animal Feed', value: 4500, color: '#10b981' },
    { name: 'Seeds', value: 2100, color: '#3b82f6' },
    { name: 'Fertilizers', value: 1850, color: '#f59e0b' },
    { name: 'Tools', value: 1200, color: '#8b5cf6' },
    { name: 'Other', value: 890, color: '#64748b' },
  ]

  const weeklySalesData = [
    { name: 'Mon', sales: 12, revenue: 1250 },
    { name: 'Tue', sales: 15, revenue: 1580 },
    { name: 'Wed', sales: 18, revenue: 1890 },
    { name: 'Thu', sales: 14, revenue: 1420 },
    { name: 'Fri', sales: 22, revenue: 2150 },
    { name: 'Sat', sales: 28, revenue: 2890 },
    { name: 'Sun', sales: 16, revenue: 1650 },
  ]

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
          Your Sales at a Glance
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Monitor your business performance in real-time
        </p>
      </div>

      <StatsCards stats={dashboardStats} onQuickAction={handleQuickAction} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} formatCurrency={(v) => formatCurrency(v)} />
        </div>
        <SalesByCategory data={categoryData} formatCurrency={(v) => formatCurrency(v)} />
      </div>

      {/* Daily Sales Chart */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <DailySalesChart data={weeklySalesData} formatCurrency={(v) => formatCurrency(v)} />
      </div>

      {/* Alerts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <LowStockAlerts
          lowStockProducts={lowStockProducts}
          onQuickAction={handleQuickAction}
        />
        <ExpiringProducts
          expiringProducts={expiringProducts}
          expiredProducts={expiredProducts}
        />
      </div>

      {/* Additional Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TopProducts
          topProducts={dashboardStatistics?.topProducts || []}
          formatCurrency={formatCurrency}
          onQuickAction={handleQuickAction}
        />
        <QuickActions onQuickAction={handleQuickAction} />
      </div>
    </div>
  );
}
