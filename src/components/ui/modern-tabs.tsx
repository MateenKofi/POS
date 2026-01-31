"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export interface TabItem {
    value: string
    label: string
    icon?: React.ComponentType<{ className?: string }>
    count?: number
    countClassName?: string // Class for the badge
    activeClassName?: string // Custom class when this tab is active (e.g. bg-red-600)
}

interface ModernTabsProps {
    tabs: TabItem[]
    activeTab: string
    onChange: (value: string) => void
    className?: string
}

export const ModernTabs = ({ tabs, activeTab, onChange, className }: ModernTabsProps) => {
    return (
        <div className={cn("inline-flex h-12 items-center justify-start rounded-xl bg-slate-100/80 p-1 text-slate-500 w-full sm:w-auto", className)}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.value
                const Icon = tab.icon

                return (
                    <button
                        key={tab.value}
                        onClick={() => onChange(tab.value)}
                        className={cn(
                            "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 sm:flex-none",
                            isActive
                                ? cn("bg-white text-slate-950 shadow-sm", tab.activeClassName)
                                : "hover:bg-slate-200/50 hover:text-slate-900"
                        )}
                        type="button"
                    >
                        {Icon && <Icon className={cn("mr-2 h-4 w-4", isActive ? "text-current" : "text-slate-500")} />}
                        {tab.label}
                        {tab.count !== undefined && tab.count > 0 && (
                            <Badge
                                variant="secondary"
                                className={cn(
                                    "ml-2 px-1.5 py-0 h-5 text-[10px] min-w-5 justify-center",
                                    isActive ? "bg-slate-100 text-slate-900" : "bg-slate-200 text-slate-600",
                                    tab.countClassName
                                )}
                            >
                                {tab.count}
                            </Badge>
                        )}
                    </button>
                )
            })}
        </div>
    )
}
