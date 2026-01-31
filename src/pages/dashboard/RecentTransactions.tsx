import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/custom-components"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import type { SaleData } from "./types"

interface RecentTransactionsProps {
  sales: SaleData[]
  formatCurrency: (amount: number) => string
  onQuickAction: (action: string) => void
}

export function RecentTransactions({ sales, formatCurrency, onQuickAction }: RecentTransactionsProps) {
  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-slate-800">
          Recent Transactions
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={() => onQuickAction("sales")}
        >
          View All →
        </Button>
      </CardHeader>
      <CardContent>
        {sales.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-slate-300" />
            <p>No recent transactions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sales.map((sale) => (
              <div
                key={sale.sale_id}
                className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-slate-800">
                      Transaction #{sale.sale_id}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {sale.method_name ||
                        (sale.payment_method_id === 1
                          ? "Cash"
                          : sale.payment_method_id === 2
                            ? "Card"
                            : "Mobile Money")}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-600">
                      {sale.first_name && sale.last_name ? (
                        <span>
                          By {sale.first_name} {sale.last_name}
                        </span>
                      ) : (
                        <span>Salesperson #{sale.cashier_id}</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(sale.sale_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold text-slate-800 text-lg">
                    {formatCurrency(parseFloat(sale.total_amount))}
                  </p>
                  {sale.items && sale.items.length > 0 && (
                    <p className="text-xs text-slate-500">
                      {sale.items.length} item
                      {sale.items.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
