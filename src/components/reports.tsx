"use client"

import { useState, useMemo } from "react"
import { Loader2 } from "lucide-react"
import { useSales, useProducts, useStaff } from "@/hooks/useApi"
import type { Sale, Product, Staff } from "@/lib/api"

// Reports sub-components
import { ReportHeader } from "./reports/ReportHeader"
import { ProfitReport } from "./reports/ProfitReport"
import { ExpiryReport } from "./reports/ExpiryReport"
import { StaffReport } from "./reports/StaffReport"

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
        case "week": {
          const weekAgo = new Date(today)
          weekAgo.setDate(weekAgo.getDate() - 7)
          return saleDate >= weekAgo
        }
        case "month": {
          const monthAgo = new Date(today)
          monthAgo.setMonth(monthAgo.getMonth() - 1)
          return saleDate >= monthAgo
        }
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
      <ReportHeader
        activeTab={activeTab}
        period={period}
        onTabChange={setActiveTab}
        onPeriodChange={setPeriod}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600">Loading reports...</span>
        </div>
      ) : (
        <>
          {activeTab === "profit" && (
            <ProfitReport
              totalRevenue={profitReport.totalRevenue}
              grossProfit={profitReport.grossProfit}
              profitMargin={profitReport.profitMargin}
              topProducts={profitReport.topProducts}
              transactions={profitReport.transactions}
              formatCurrency={(amt) => `GH₵${amt.toFixed(2)}`}
            />
          )}

          {activeTab === "expiry" && (
            <ExpiryReport expiringProducts={expiryReport} />
          )}

          {activeTab === "staff" && (
            <StaffReport
              staffPerformance={staffPerformance}
              formatCurrency={(amt) => `GH₵${amt.toFixed(2)}`}
            />
          )}
        </>
      )}
    </div>
  )
}
