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
import { Loader2, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Invoices } from "@/components/invoices"
import { Transactions } from "@/components/transactions"

const App = () => {
  const [activeTab, setActiveTab] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { user, isLoading, logout } = useAuth()

  // Set initial tab based on user role
  useEffect(() => {
    if (user) {
      setActiveTab(user.role === "manager" || user.role === "admin" ? "dashboard" : "sales")
    }
  }, [user])

  // Close sidebar when tab changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [activeTab])

  // Listen for sidebar close event from sidebar component
  useEffect(() => {
    const handleCloseSidebar = () => setIsSidebarOpen(false)
    window.addEventListener('closeSidebar', handleCloseSidebar)
    return () => window.removeEventListener('closeSidebar', handleCloseSidebar)
  }, [])

  // Listen for navigation events from anywhere in the app
  useEffect(() => {
    const handleNavigateToTab = (event: CustomEvent) => {
      setActiveTab(event.detail)
    }
    window.addEventListener('navigateToTab', handleNavigateToTab as EventListener)
    return () => window.removeEventListener('navigateToTab', handleNavigateToTab as EventListener)
  }, [])

  // Logout user
  const handleLogout = () => {
    logout()
    setActiveTab("")
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveTab} />
      case "sales":
        return <SalesInterface />
      case "invoices":
        return <Invoices />
      case "transactions":
        return <Transactions />
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
        return user?.role === "manager" || user?.role === "admin" ? <Dashboard onNavigate={setActiveTab} /> : <SalesInterface />
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
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userRole={user.role}
          username={user.username}
          onLogout={handleLogout}
        />
      </div>



      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(true)}
            className="p-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-slate-800 capitalize">
              {activeTab === 'dashboard' ? 'Dashboard' :
               activeTab === 'sales' ? 'Sales' :
               activeTab === 'invoices' ? 'Invoices' :
               activeTab === 'transactions' ? 'Transactions' :
               activeTab === 'products' ? 'Products' :
               activeTab === 'suppliers' ? 'Suppliers' :
               activeTab === 'supplier-products' ? 'Supplier Products' :
               activeTab === 'staff' ? 'Staff' :
               activeTab === 'reports' ? 'Reports' : 'POS System'}
            </h1>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="lg:pt-0">
          {renderContent()}
        </div>
      </main>

      <Toaster position="top-right" richColors />
    </div>
  )
}

export default App
