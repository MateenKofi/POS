"use client";

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  // History,
  Truck,
  Users,
  // BarChart3,
  LogOut,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: "salesperson" | "manager" | "admin";
  username: string;
  onLogout: () => void;
}

export function Sidebar({
  activeTab,
  onTabChange,
  userRole,
  onLogout,
}: SidebarProps) {
  const allMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["manager", "admin"],
    },
    {
      id: "sales",
      label: "Sales",
      icon: ShoppingCart,
      roles: ["salesperson", "manager", "admin"],
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      roles: ["manager", "admin"],
    },
    // { id: "reports", label: "Reports", icon: BarChart3, roles: ["manager", "admin"] },
    {
      id: "suppliers",
      label: "Suppliers",
      icon: Truck,
      roles: ["manager", "admin"],
    },
    {
      id: "supplier-products",
      label: "Supplier Products",
      icon: Package,
      roles: ["manager", "admin"],
    },
    { id: "staff", label: "Staff", icon: Users, roles: ["manager", "admin"] },
  ];

  const menuItems = allMenuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Header with close button for mobile */}
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h1 className="text-xl text-slate-800 capitalize font-bold">
            POS System
          </h1>
          <p className="text-sm text-slate-600 font-bold">Role: {userRole}</p>
        </div>
        {/* Close button for mobile */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden p-2 h-8 w-8"
          onClick={() => {
            // This will be handled by the parent component
            const event = new CustomEvent('closeSidebar')
            window.dispatchEvent(event)
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11 text-sm",
                activeTab === item.id
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-slate-700 hover:bg-slate-100"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5" />
          <span className="truncate">Logout</span>
        </Button>
      </div>
    </div>
  );
}
