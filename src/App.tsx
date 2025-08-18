import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Toaster } from "sonner"
import Login from "@/components/login"
import { Sidebar } from "@/components/sidebar"
import { ProductManagement } from "@/components/product-management"
import { SalesInterface } from "@/components/sales-interface"
// import { SalesHistory } from "@/components/sales-history"
import { SupplierManagement } from "@/components/supplier-management"
import { SupplierProductManagement } from "@/components/supplier-product-management"
import { StaffManagement } from "@/components/staff-management"
import { Dashboard } from "@/components/dashboard"
import { Reports } from "@/components/reports"
import { Loader2 } from "lucide-react"

const App = () => {
  const [activeTab, setActiveTab] = useState("")
  const { user, isLoading, logout } = useAuth()

  // Set initial tab based on user role
  useEffect(() => {
    if (user) {
      setActiveTab(user.role === "manager" || user.role === "admin" ? "dashboard" : "sales")
    }
  }, [user])

  // Logout user
  const handleLogout = () => {
    logout()
    setActiveTab("")
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "sales":
        return <SalesInterface />
      case "products":
        return <ProductManagement />
      case "reports":
        return <Reports />
      case "suppliers":
        return <SupplierManagement />
      case "supplier-products":
        return <SupplierProductManagement />
      case "staff":
        return <StaffManagement />
      default:
        return user?.role === "manager" || user?.role === "admin" ? <Dashboard /> : <SalesInterface />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userRole={user.role}
        username={user.username}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
      <Toaster position="top-right" richColors />
    </div>
  )
}

export default App
