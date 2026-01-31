export interface DashboardStat {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  change: string
  changeType: "positive" | "negative"
}

export interface QuickAction {
  action: string
  label: string
}

export interface SaleData {
  sale_id: number
  total_amount: string
  payment_method_id: number
  method_name?: string
  first_name?: string
  last_name?: string
  cashier_id: number
  sale_date: string
  items?: Array<unknown>
  profit_amount?: string
}
