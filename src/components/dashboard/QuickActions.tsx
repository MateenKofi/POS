import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Package, Truck, Users } from "lucide-react"

interface QuickActionsProps {
  onQuickAction: (action: string) => void
}

export function QuickActions({ onQuickAction }: QuickActionsProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-800">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button
            className="w-full justify-start"
            variant="outline"
            onClick={() => onQuickAction("sales")}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            New Sale
          </Button>
          <Button
            className="w-full justify-start"
            variant="outline"
            onClick={() => onQuickAction("products")}
          >
            <Package className="h-4 w-4 mr-2" />
            Manage Products
          </Button>
          <Button
            className="w-full justify-start"
            variant="outline"
            onClick={() => onQuickAction("suppliers")}
          >
            <Truck className="h-4 w-4 mr-2" />
            Manage Suppliers
          </Button>
          <Button
            className="w-full justify-start"
            variant="outline"
            onClick={() => onQuickAction("staff")}
          >
            <Users className="h-4 w-4 mr-2" />
            Manage Staff
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
