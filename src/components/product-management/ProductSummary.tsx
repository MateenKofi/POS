import { Card, CardContent } from "@/components/custom-components"
import type { Product } from "@/lib/api"

interface ProductSummaryProps {
  products: Product[]
}

export function ProductSummary({ products }: ProductSummaryProps) {
  const totalProducts = products.length
  const productsWithSuppliers = products.filter(p => p.suppliers && p.suppliers.length > 0).length
  const uniqueSuppliers = new Set<number>()
  products.forEach(p => {
    if (p.suppliers) {
      p.suppliers.forEach(s => uniqueSuppliers.add(s.supplier_id))
    }
  })
  const totalSuppliers = uniqueSuppliers.size
  const totalStockValue = products.reduce((sum, p) => sum + (parseFloat(p.price) * p.stock_quantity), 0)

  const totalSupplyValue = products.reduce((sum, p) => {
    if (p.suppliers && p.suppliers.length > 0) {
      const avgSupplyPrice = p.suppliers.reduce((s, supplier) => s + parseFloat(supplier.supply_price), 0) / p.suppliers.length
      return sum + (avgSupplyPrice * p.stock_quantity)
    }
    return sum
  }, 0)

  const lowStockItems = products.filter(p => p.stock_quantity < 20).length

  const productsWithSuppliersData = products.filter(p => p.suppliers && p.suppliers.length > 0)
  let avgProfitMargin = 'N/A'
  if (productsWithSuppliersData.length > 0) {
    const totalMargin = productsWithSuppliersData.reduce((sum, p) => {
      const retailPrice = parseFloat(p.price)
      const avgSupplyPrice = p.suppliers!.reduce((s, supplier) => s + parseFloat(supplier.supply_price), 0) / p.suppliers!.length
      return sum + ((retailPrice - avgSupplyPrice) / retailPrice * 100)
    }, 0)
    avgProfitMargin = `${(totalMargin / productsWithSuppliersData.length).toFixed(1)}%`
  }

  const totalPotentialProfit = products.reduce((sum, p) => {
    if (p.suppliers && p.suppliers.length > 0) {
      const retailPrice = parseFloat(p.price)
      const avgSupplyPrice = p.suppliers.reduce((s, supplier) => s + parseFloat(supplier.supply_price), 0) / p.suppliers.length
      return sum + ((retailPrice - avgSupplyPrice) * p.stock_quantity)
    }
    return sum
  }, 0)

  let bestMargin = 'N/A'
  let worstMargin = 'N/A'
  if (productsWithSuppliersData.length > 0) {
    const margins = productsWithSuppliersData.map(p => {
      const retailPrice = parseFloat(p.price)
      const avgSupplyPrice = p.suppliers!.reduce((s, supplier) => s + parseFloat(supplier.supply_price), 0) / p.suppliers!.length
      return ((retailPrice - avgSupplyPrice) / retailPrice * 100)
    })
    bestMargin = `${Math.max(...margins).toFixed(1)}%`
    worstMargin = `${Math.min(...margins).toFixed(1)}%`
  }

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Total Products:</span>
            <span className="ml-2 text-gray-600">{totalProducts}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Products with Suppliers:</span>
            <span className="ml-2 text-gray-600">{productsWithSuppliers}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Total Suppliers:</span>
            <span className="ml-2 text-gray-600">{totalSuppliers}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Total Stock Value:</span>
            <span className="ml-2 text-gray-600">GH₵{totalStockValue.toFixed(2)}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Total Supply Value:</span>
            <span className="ml-2 text-gray-600">GH₵{totalSupplyValue.toFixed(2)}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Low Stock Items:</span>
            <span className="ml-2 text-red-600">{lowStockItems}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Avg. Profit Margin:</span>
            <span className="ml-2 text-green-600">{avgProfitMargin}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Total Potential Profit:</span>
            <span className="ml-2 text-green-600">GH₵{totalPotentialProfit.toFixed(2)}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Best Margin:</span>
            <span className="ml-2 text-green-600">{bestMargin}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Worst Margin:</span>
            <span className="ml-2 text-red-600">{worstMargin}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
