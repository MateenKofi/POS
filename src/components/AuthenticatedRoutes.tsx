import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Layout } from "@/components/layout"
import { Dashboard } from "@/pages/dashboard/dashboard"
import { ProductManagement } from "@/pages/products/product-management"
import { SalesInterface } from "@/pages/sales/sales-interface"
import { SupplierManagement } from "@/pages/suppliers/supplier-management"
import { SupplierProductManagement } from "@/pages/suppliers/supplier-product-management"
import { StaffManagement } from "@/pages/staff/staff-management"
import { Reports } from "@/pages/reports/reports"
import { Invoices } from "@/pages/invoices/invoices"
import { Transactions } from "@/pages/transactions/transactions"
import { StockMovements } from "@/pages/stock-movements"
import { DailyClosure } from "@/pages/daily-closure/daily-closure"

/**
 * Contains all authenticated routes wrapped in Layout.
 * Handles logout logic and passes user info to Layout.
 */
export const AuthenticatedRoutes = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Redirect to login on logout
  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <Layout
      userRole={user!.role}
      username={user!.username}
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sales" element={<SalesInterface />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/suppliers" element={<SupplierManagement />} />
        <Route path="/supplier-products" element={<SupplierProductManagement />} />
        <Route path="/staff" element={<StaffManagement />} />
        <Route path="/stock-movements" element={<StockMovements />} />
        <Route path="/daily-closure" element={<DailyClosure />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
