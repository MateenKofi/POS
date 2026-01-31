"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  LogOut,
  X,
  History,
  RefreshCw,
  FileText,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: "cashier" | "manager" | "admin";
  username: string;
  onLogout: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  roles: string[];
}

interface MenuGroup {
  id: string;
  label: string;
  icon: any;
  items: MenuItem[];
  roles: string[];
}

const menuGroups: MenuGroup[] = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    roles: ["manager", "admin"],
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        roles: ["manager", "admin"],
      },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    icon: CreditCard,
    roles: ["cashier", "manager", "admin"],
    items: [
      {
        id: "sales",
        label: "Sales Terminal",
        icon: CreditCard,
        roles: ["cashier", "manager", "admin"],
      },
      {
        id: "transactions",
        label: "Transactions",
        icon: History,
        roles: ["cashier", "manager", "admin"],
      },
      {
        id: "daily-closure",
        label: "Daily Closure",
        icon: FileText,
        roles: ["manager", "admin"],
      },
    ],
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: Package,
    roles: ["manager", "admin"],
    items: [
      {
        id: "products",
        label: "Products",
        icon: Package,
        roles: ["manager", "admin"],
      },
      {
        id: "stock-movements",
        label: "Stock Movements",
        icon: RefreshCw,
        roles: ["manager", "admin"],
      },
    ],
  },
  {
    id: "management",
    label: "Management",
    icon: Users,
    roles: ["manager", "admin"],
    items: [
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
      {
        id: "staff",
        label: "Staff",
        icon: Users,
        roles: ["manager", "admin"],
      },
    ],
  },
];

export function Sidebar({
  activeTab,
  onTabChange,
  userRole,
  username,
  onLogout,
}: SidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(menuGroups.map(g => g.id))
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  // Filter groups and items based on user role
  const visibleGroups = menuGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.roles.includes(userRole)),
    }))
    .filter(group => group.items.length > 0);

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get role display name
  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: "Administrator",
      manager: "Manager",
      cashier: "Cashier",
    };
    return roleMap[role] || role;
  };

  // Get role color
  const getRoleColor = (role: string) => {
    const colorMap: Record<string, string> = {
      admin: "bg-red-100 text-red-700",
      manager: "bg-emerald-100 text-emerald-700",
      cashier: "bg-teal-100 text-teal-700",
    };
    return colorMap[role] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="w-72 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 flex flex-col h-full">
      {/* Close button for mobile */}
      <div className="lg:hidden p-4 flex justify-end border-b border-slate-200">
        <Button
          variant="ghost"
          size="sm"
          className="p-2 h-8 w-8"
          onClick={() => {
            const event = new CustomEvent('closeSidebar');
            window.dispatchEvent(event);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Logo/Brand */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg shadow-emerald-500/20">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Agri-Feeds POS</h1>
            <p className="text-xs text-slate-500">Point of Sale System</p>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="px-4 pb-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {getInitials(username)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 truncate">{username}</p>
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                getRoleColor(userRole)
              )}>
                {getRoleDisplay(userRole)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto overflow-x-hidden">
        {visibleGroups.map((group) => {
          const GroupIcon = group.icon;
          const isExpanded = expandedGroups.has(group.id);
          const hasActiveItem = group.items.some(item => item.id === activeTab);

          return (
            <div key={group.id} className="space-y-1">
              {/* Group Header */}
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between gap-2 h-10 px-3 text-sm font-medium transition-all",
                  hasActiveItem
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
                onClick={() => toggleGroup(group.id)}
              >
                <div className="flex items-center gap-2">
                  <GroupIcon className="h-4 w-4" />
                  <span>{group.label}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 transition-transform" />
                ) : (
                  <ChevronRight className="h-4 w-4 transition-transform" />
                )}
              </Button>

              {/* Group Items */}
              {isExpanded && (
                <div className="ml-4 space-y-0.5">
                  {group.items.map((item) => {
                    const ItemIcon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start gap-3 h-9 px-3 text-sm transition-all",
                          isActive
                            ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/20"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                        onClick={() => onTabChange(item.id)}
                      >
                        <ItemIcon className="h-4 w-4" />
                        <span className="truncate">{item.label}</span>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-slate-200 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 px-3 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
        <p className="text-[10px] text-slate-400 text-center">
          © 2025 Agri-Feeds POS
        </p>
      </div>
    </div>
  );
}
