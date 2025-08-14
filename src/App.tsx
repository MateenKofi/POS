import { useState, useEffect } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Login from "@/components/login"
import { Sidebar } from "@/components/sidebar"
import { ProductManagement } from "@/components/product-management"
import { SalesInterface } from "@/components/sales-interface"
import { SalesHistory } from "@/components/sales-history"
import { SupplierManagement } from "@/components/supplier-management"
import { StaffManagement } from "@/components/staff-management"
import { Dashboard } from "@/components/dashboard"
import { Reports } from "@/components/reports"

export interface User {
  username: string
  role: "manager" | "cashier"
}

const queryClient = new QueryClient()

const App = () => {
  const [activeTab, setActiveTab] = useState("")
  const [user, setUser] = useState<User | null>(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser)
      setUser(parsedUser)
      setActiveTab(parsedUser.role === "manager" ? "dashboard" : "sales")
    }
  }, [])

  // Save logged-in user
  const handleLogin = (loggedInUser: User) => {
    localStorage.setItem("user", JSON.stringify(loggedInUser))
    setUser(loggedInUser)
    setActiveTab(loggedInUser.role === "manager" ? "dashboard" : "sales")
  }

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
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
      case "history":
        return <SalesHistory />
      case "reports":
        return <Reports />
      case "suppliers":
        return <SupplierManagement />
      case "staff":
        return <StaffManagement />
      default:
        return user?.role === "manager" ? <Dashboard /> : <SalesInterface />
    }
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
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
