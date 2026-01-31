import { Card, CardContent, CardHeader, CardTitle, TextInput } from "@/components/custom-components"
import { Badge } from "@/components/ui/badge"
import { Search, PackageSearch, X } from "lucide-react"
import { type Product as ApiProduct } from "@/lib/api"
import { ProductCard } from "./ProductCard"

interface ProductGridProps {
  filteredProducts: ApiProduct[]
  searchTerm: string
  onSearchChange: (value: string) => void
  onProductClick: (product: ApiProduct) => void
}

export function ProductGrid({ filteredProducts, searchTerm, onSearchChange, onProductClick }: ProductGridProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg sm:text-xl text-slate-800 flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <PackageSearch className="h-4 w-4 text-white" />
            </div>
            Select Products
          </CardTitle>
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            {filteredProducts.length} items
          </Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <TextInput
            placeholder="Search products by name, description, or ID..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            className="pl-11 text-sm sm:text-base h-12 rounded-xl border-slate-200 focus:border-green-500 focus:ring-green-500/20"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 mb-4">
              <PackageSearch className="h-10 w-10 text-slate-400" />
            </div>
            <p className="text-slate-600 font-semibold text-lg mb-1">No products found</p>
            <p className="text-slate-400 text-sm">Try adjusting your search term or filters</p>
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="mt-4 px-4 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors font-medium text-sm"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.product_id}
                product={product}
                onClick={onProductClick}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
