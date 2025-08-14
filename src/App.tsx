
import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import  Login  from "@/components/login"
import { Sidebar } from "@/components/sidebar"
import { ProductManagement } from "@/components/product-management"
import { SalesInterface } from "@/components/sales-interface"
import { SalesHistory } from "@/components/sales-history"
import { SupplierManagement } from "@/components/supplier-management"
import { StaffManagement } from "@/components/staff-management"
import { Dashboard } from "@/components/dashboard"
import { Reports } from "@/components/reports"

const queryClient = new QueryClient()

interface User {
  username: string
  role: "manager" | "cashier"
}

const App = () => {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("")

  const handleLogin = (userData: User) => {
    setUser(userData)
    // Set default tab based on role
    setActiveTab(userData.role === "manager" ? "dashboard" : "sales")
  }

  const handleLogout = () => {
    setUser(null)
    setActiveTab("")
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "sales":
        return <SalesInterface />
      case "products":
        return <ProductManagement />
      case "history":
        return <SalesHistory />
      case "reports":
        return <Reports />
      case "suppliers":
        return <SupplierManagement />
      case "staff":
        return <StaffManagement />
      default:
        return user.role === "manager" ? <Dashboard /> : <SalesInterface />
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-slate-50">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userRole={user.role}
          username={user.username}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-auto">{renderContent()}</main>
      </div>
    </QueryClientProvider>
  )
}

export default App