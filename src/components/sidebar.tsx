"use client";

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  userRole: "cashier" | "manager" | "admin";
  username: string;
  onLogout: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  path: string;
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
        path: "/",
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
        path: "/sales",
        icon: CreditCard,
        roles: ["cashier", "manager", "admin"],
      },
      {
        id: "transactions",
        label: "Transactions",
        path: "/transactions",
        icon: History,
        roles: ["cashier", "manager", "admin"],
      },
      {
        id: "daily-closure",
        label: "Daily Closure",
        path: "/daily-closure",
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
        path: "/products",
        icon: Package,
        roles: ["manager", "admin"],
      },
      {
        id: "stock-movements",
        label: "Stock Movements",
        path: "/stock-movements",
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
        path: "/suppliers",
        icon: Truck,
        roles: ["manager", "admin"],
      },
      {
        id: "supplier-products",
        label: "Supplier Products",
        path: "/supplier-products",
        icon: Package,
        roles: ["manager", "admin"],
      },
      {
        id: "staff",
        label: "Staff",
        path: "/staff",
        icon: Users,
        roles: ["manager", "admin"],
      },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: FileText,
    roles: ["manager", "admin"],
    items: [
      {
        id: "reports",
        label: "Reports",
        path: "/reports",
        icon: FileText,
        roles: ["manager", "admin"],
      },
    ],
  },
];

export const Sidebar = ({ userRole, username, onLogout }: SidebarProps) => {
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(menuGroups.map((g) => g.id))
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  // Close sidebar on mobile
  const handleCloseSidebar = () => {
    const event = new CustomEvent("closeSidebar");
    window.dispatchEvent(event);
  };

  // Filter groups and items based on user role
  const visibleGroups = menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(userRole)),
    }))
    .filter((group) => group.items.length > 0);

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
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

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className="w-72 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 flex flex-col h-full">
      {/* Close button for mobile */}
      <div className="lg:hidden p-4 flex justify-end border-b border-slate-200">
        <Button
          variant="ghost"
          size="sm"
          className="p-2 h-8 w-8"
          onClick={handleCloseSidebar}
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
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                  getRoleColor(userRole)
                )}
              >
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

          return (
            <div key={group.id} className="space-y-1">
              {/* Group Header */}
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between gap-2 h-10 px-3 text-sm font-medium transition-all",
                  "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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

                    return (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center justify-start gap-3 h-9 px-3 text-sm rounded-lg transition-all",
                            isActive
                              ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/20"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          )
                        }
                        onClick={handleCloseSidebar}
                      >
                        <ItemIcon className="h-4 w-4" />
                        <span className="truncate">{item.label}</span>
                      </NavLink>
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
          onClick={handleLogout}
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
