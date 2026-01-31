import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Menu } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"

export interface LayoutProps {
  children: React.ReactNode
  userRole: "cashier" | "manager" | "admin"
  username: string
  onLogout: () => void
}

export const Layout = ({ children, userRole, username, onLogout }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  // Listen for sidebar close event from sidebar component
  useEffect(() => {
    const handleCloseSidebar = () => setIsSidebarOpen(false)
    window.addEventListener('closeSidebar', handleCloseSidebar)
    return () => window.removeEventListener('closeSidebar', handleCloseSidebar)
  }, [])

  // Get page title for mobile header
  const getPageTitle = () => {
    const titles: Record<string, string> = {
      '/': 'Dashboard',
      '/dashboard': 'Dashboard',
      '/sales': 'Sales',
      '/invoices': 'Invoices',
      '/transactions': 'Transactions',
      '/products': 'Products',
      '/suppliers': 'Suppliers',
      '/supplier-products': 'Supplier Products',
      '/staff': 'Staff',
      '/stock-movements': 'Stock Movements',
      '/daily-closure': 'Daily Closure',
      '/reports': 'Reports'
    }
    return titles[location.pathname] || 'POS System'
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
          userRole={userRole}
          username={username}
          onLogout={onLogout}
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
            <h1 className="text-lg font-semibold text-slate-800">
              {getPageTitle()}
            </h1>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Content Outlet */}
        <div className="lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  )
}
