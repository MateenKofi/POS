import { Card, CardContent, CardHeader, CardTitle, TextInput, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/custom-components"
import { Search, Loader2, Package } from "lucide-react"
import { ModernTabs } from "@/components/ui/modern-tabs"
import type { ProductTab } from "./types"
import type { Product } from "@/lib/api"
import { ProductRow } from "./ProductRow"

interface ProductTableProps {
  filteredProducts: Product[]
  baseFilteredProducts: Product[]
  isLoading: boolean
  searchTerm: string
  onSearchChange: (value: string) => void
  activeTab: ProductTab
  onTabChange: (tab: ProductTab) => void
  expiredCount: number
  expiringCount: number
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
  deleteProduct: { mutate: (id: string, options?: any) => void; isPending: boolean }
  isAdmin: boolean
}

export function ProductTable({
  filteredProducts,
  baseFilteredProducts,
  isLoading,
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  expiredCount,
  expiringCount,
  onEdit,
  onDelete,
  deleteProduct,
  isAdmin
}: ProductTableProps) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'expiring':
        return '⏰ Expiring Soon'
      case 'expired':
        return '⚠️ Expired Products'
      default:
        return 'All Products'
    }
  }

  const getEmptyMessage = () => {
    if (searchTerm) {
      return "No products found matching your search."
    }
    if (activeTab === 'expired') {
      return "✓ No expired products! All products are within their expiry dates."
    }
    if (activeTab === 'expiring') {
      return "✓ No products expiring soon. Great job managing inventory!"
    }
    return "No products available."
  }

  return (
    <>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <TextInput
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="mb-4 overflow-x-auto">
        <ModernTabs
          activeTab={activeTab}
          onChange={(val) => onTabChange(val as ProductTab)}
          tabs={[
            {
              value: "all",
              label: "All Products",
              icon: Package,
              count: baseFilteredProducts.length,
              activeClassName: "text-green-700 bg-white ring-green-600/20"
            },
            {
              value: "expiring",
              label: "Expiring Soon",
              count: expiringCount,
              activeClassName: "text-amber-700 bg-white ring-amber-600/20",
              countClassName: "bg-amber-100 text-amber-700 hover:bg-amber-200"
            },
            {
              value: "expired",
              label: "Expired",
              count: expiredCount,
              activeClassName: "text-red-700 bg-white ring-red-600/20",
              countClassName: "bg-red-100 text-red-700 hover:bg-red-200"
            },
          ]}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            {getTabTitle()}
            {isLoading ? (
              <span className="text-sm font-normal text-gray-500 ml-2">Loading...</span>
            ) : (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredProducts?.length || 0} products)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <span className="ml-2 text-gray-600">Loading products...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Product Name</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">Category</TableHead>
                    <TableHead className="text-xs sm:text-sm">Unit</TableHead>
                    <TableHead className="text-xs sm:text-sm">Price</TableHead>
                    <TableHead className="text-xs sm:text-sm">Stock</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Expiry</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts?.map((product) => (
                    <ProductRow
                      key={product.product_id}
                      product={product}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      deleteProduct={deleteProduct}
                      isAdmin={isAdmin}
                    />
                  ))}
                  {filteredProducts?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500 text-sm sm:text-base">
                        {getEmptyMessage()}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
